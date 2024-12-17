"use server";

import { signIn } from "@/auth";
import { sql } from "@vercel/postgres";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";
import { z } from "zod";
import { csvToJson } from "@/lib/utils";

const BookMealSchema = z.object({
  userId: z.string().uuid(),
  bookingDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  isVegetarian: z.boolean(),
});

export async function bookMeal(formData: FormData) {
  const { userId, bookingDate, isVegetarian } = BookMealSchema.parse({
    userId: formData.get("userId"),
    bookingDate: formData.get("bookingDate"),
    isVegetarian: formData.get("isVegetarian") === "true",
  });

  try {
    await sql`
      INSERT INTO meal_bookings (user_id, booking_date, is_vegetarian)
      VALUES (${userId}, ${bookingDate}, ${isVegetarian})
      ON CONFLICT (user_id, booking_date) DO NOTHING;
    `;
  } catch (error) {
    return { message: "Failed to book meal " + error };
  }
  revalidatePath("/dashboard");
  redirect("/dashboard");
}

const RecordPickupSchema = z.object({
  userId: z.string().uuid(),
  bookingDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export async function recordMealPickup(formData: FormData) {
  const { userId, bookingDate } = RecordPickupSchema.parse({
    userId: formData.get("userId"),
    bookingDate: formData.get("bookingDate"),
  });

  try {
    await sql`
      UPDATE meal_bookings
      SET pickup_date = CURRENT_DATE
      WHERE user_id = ${userId} AND booking_date = ${bookingDate} AND pickup_date IS NULL;
    `;
  } catch (error) {
    return { message: "Failed to record meal pickup " + error };
  }
  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function getTodayBookingStatus(userId: string) {
  const today = new Date().toISOString().split("T")[0];
  try {
    const result = await sql`
      SELECT * FROM meal_bookings
      WHERE user_id = ${userId} AND booking_date = ${today};
    `;
    if (result.rows.length === 0) {
      return { status: "no_booking" };
    }
    const booking = result.rows[0];
    if (booking.pickup_date === null) {
      return { status: "not_picked_up", bookingId: booking.id };
    }
    return { status: "picked_up" };
  } catch (error) {
    console.error("Failed to get today's booking status:", error);
    throw new Error("Failed to get today's booking status");
  }
}

export async function checkTomorrowBooking(userId: string) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowDate = tomorrow.toISOString().split("T")[0];
  try {
    const result = await sql`
      SELECT * FROM meal_bookings
      WHERE user_id = ${userId} AND booking_date = ${tomorrowDate};
    `;
    return result.rows.length > 0;
  } catch (error) {
    console.error("Failed to check tomorrow's booking:", error);
    throw new Error("Failed to check tomorrow's booking");
  }
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}

const ImportUsersSchema = z.array(
  z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
    is_admin: z.boolean(),
    is_vegetarian: z.boolean(),
  })
);

export async function importUsers(formData: FormData) {
  const file = formData.get("file") as File;
  if (!file) {
    return { success: false, error: "No file provided" };
  }

  try {
    const content = await file.text();

    const contentJson = csvToJson(content);

    const transformedData = contentJson.map((user) => ({
      ...user,
      // Always returning false
      is_admin: user.is_admin === "true",
      is_vegetarian: user.is_vegetarian === "true",
    }));

    const users = ImportUsersSchema.parse(transformedData);

    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await sql`
        INSERT INTO users (name, email, password, is_admin, is_vegetarian)
        VALUES (${user.name}, ${user.email}, ${hashedPassword}, ${user.is_admin}, ${user.is_vegetarian})
        ON CONFLICT (email) DO NOTHING;
      `;
    }

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error importing users:", error);
    return { success: false, error: "Failed to import users" };
  }
}

// const ImportMealBookingSchema = z.array(
//   z.object({
//     id: z.string().uuid(),
//     user_id: z.string().uuid(),
//     booking_date: z.string(),
//     is_vegetarian: z.boolean(),
//     pickup_date: z.string().nullable(),
//   })
// );

// export async function importBookings(formData: FormData) {
//   const file = formData.get("file") as File;
//   if (!file) {
//     return { success: false, error: "No file provided" };
//   }

//   try {
//     const content = await file.text();

//     const contentJson = csvToJson(content);

//     const transformedData = contentJson.map((booking) => ({
//       ...booking,
//       is_vegetarian: booking.is_vegetarian === "true",
//       pickup_date: booking.pickup_date || null,
//     }));

//     const bookings = ImportMealBookingSchema.parse(transformedData);

//     for (const booking of bookings) {
//       await sql`
//         INSERT INTO meal_bookings (id, user_id, booking_date, is_vegetarian, pickup_date)
//         VALUES (${booking.id}, ${booking.user_id}, ${booking.booking_date}, ${booking.is_vegetarian}, ${booking.pickup_date})
//         ON CONFLICT (user_id, booking_date) DO NOTHING;
//       `;
//     }

//     revalidatePath("/admin");
//     return { success: true };
//   } catch (error) {
//     console.error("Error importing bookings:", error);
//     return { success: false, error: "Failed to import bookings" };
//   }
// }

const AddUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  isAdmin: z.boolean(),
  isVegetarian: z.boolean(),
});

export async function addUser(userData: z.infer<typeof AddUserSchema>) {
  try {
    const { name, email, password, isAdmin, isVegetarian } =
      AddUserSchema.parse(userData);
    const hashedPassword = await bcrypt.hash(password, 10);

    await sql`
      INSERT INTO users (name, email, password, is_admin, is_vegetarian)
      VALUES (${name}, ${email}, ${hashedPassword}, ${isAdmin}, ${isVegetarian});
    `;

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error adding user:", error);
    return { success: false, error: "Failed to add user" };
  }
}
