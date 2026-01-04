"use server";

import { signIn } from "@/auth";
import { sql } from "@vercel/postgres";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { csvToJson } from "@/lib/utils";
import {
  MealBooking,
  MealBookingSchema,
  User,
  UserSchema,
  WeeklyMenu,
  WeeklyMenuSchema,
} from "./definitions";

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

    const email = formData.get("email") as string;
    const { getUser } = await import("./data");
    const user = await getUser(email);

    if (user?.is_admin) {
      redirect("/admin");
    } else {
      redirect("/dashboard");
    }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid email or password.";
        default:
          return "Something went wrong. Please try again.";
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

export async function deleteUsers(userIds: string[]) {
  try {
    const deletePromises = userIds.map(
      (userId) => sql`DELETE FROM users WHERE id = ${userId}::uuid`
    );

    await Promise.all(deletePromises);
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error deleting users:", error);
    return { success: false, error: "Failed to delete users" };
  }
}

export async function resetUserPasswords(userIds: string[]) {
  try {
    const hashedPassword = await bcrypt.hash("Ch@ngeTh1s", 10);

    const updatePromises = userIds.map(
      (userId) =>
        sql`UPDATE users SET password = ${hashedPassword} WHERE id = ${userId}::uuid`
    );

    await Promise.all(updatePromises);

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error resetting user passwords:", error);
    return { success: false, error: "Failed to reset user passwords" };
  }
}

export async function editUser(userData: z.infer<typeof UserSchema>) {
  try {
    await sql`
      UPDATE users
      SET name = ${userData.name}, email = ${userData.email}, is_admin = ${userData.is_admin}, is_vegetarian = ${userData.is_vegetarian}
      WHERE id = ${userData.id}
    `;
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error editing user:", error);
    return { success: false, error: "Failed to edit user" };
  }
}

const AddMenuSchema = z.object({
  day_of_week: z.number().min(0).max(4),
  veg_items: z.string(),
  non_veg_items: z.string(),
  is_non_veg_available: z.boolean(),
});

export async function addMenuItem(menuItem: z.infer<typeof AddMenuSchema>) {
  const { day_of_week, veg_items, non_veg_items, is_non_veg_available } =
    AddMenuSchema.parse(menuItem);
  try {
    const result = await sql`
      INSERT INTO weekly_menu (day_of_week, veg_items, non_veg_items, is_non_veg_available)
      VALUES (${day_of_week}, ${veg_items}, ${non_veg_items}, ${is_non_veg_available})
      RETURNING *
    `;
    revalidatePath("/admin");
    return { success: true, item: result.rows[0] };
  } catch (error) {
    console.error("Error adding menu item:", error);
    return { success: false, error: "Failed to add menu item" };
  }
}

export async function editMenuItem(menuItem: z.infer<typeof WeeklyMenuSchema>) {
  try {
    await sql`
      UPDATE weekly_menu
      SET veg_items = ${menuItem.veg_items}, non_veg_items = ${menuItem.non_veg_items}, is_non_veg_available = ${menuItem.is_non_veg_available}
      WHERE id = ${menuItem.id}
    `;
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error editing menu item:", error);
    return { success: false, error: "Failed to edit menu item" };
  }
}

export async function deleteMenuItem(id: string) {
  try {
    await sql`DELETE FROM weekly_menu WHERE id = ${id}`;
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error deleting menu item:", error);
    return { success: false, error: "Failed to delete menu item" };
  }
}

export async function deleteBookings(bookingIds: string[]) {
  try {
    const deletePromises = bookingIds.map(
      (bookingId) =>
        sql`DELETE FROM meal_bookings WHERE id = ${bookingId}::uuid`
    );

    await Promise.all(deletePromises);
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error deleting bookings:", error);
    return { success: false, error: "Failed to delete bookings" };
  }
}

const CreateBookingSchema = z.object({
  user_id: z.string().uuid(),
  booking_date: z.string(),
  is_vegetarian: z.boolean(),
});

export async function createBooking(
  bookingData: z.infer<typeof CreateBookingSchema>
) {
  try {
    const { user_id, booking_date, is_vegetarian } =
      CreateBookingSchema.parse(bookingData);
    const result = await sql<MealBooking>`
      INSERT INTO meal_bookings (user_id, booking_date, is_vegetarian)
      VALUES (${user_id}, ${booking_date}, ${is_vegetarian})
      RETURNING *
    `;
    revalidatePath("/admin");

    return {
      success: true,
      booking: {
        ...result.rows[0],
        booking_date: result.rows[0].booking_date.toString(),
        pickup_date: result.rows[0].pickup_date
          ? result.rows[0].pickup_date.toString()
          : null,
      },
    };
  } catch (error) {
    console.error("Error creating booking:", error);
    return { success: false, error: "Failed to create booking" };
  }
}

export async function toggleDisabledDate(date: string) {
  try {
    const existingDate =
      await sql`SELECT * FROM disabled_dates WHERE date = ${date}`;
    if (existingDate.rows.length > 0) {
      await sql`DELETE FROM disabled_dates WHERE date = ${date}`;
      return { success: true, disabled: false };
    } else {
      await sql`INSERT INTO disabled_dates (date) VALUES (${date})`;
      return { success: true, disabled: true };
    }
  } catch (error) {
    console.error("Error toggling disabled date:", error);
    return { success: false, error: "Failed to toggle disabled date" };
  }
}

export async function fetchBookings(
  fromDate: Date,
  toDate: Date
): Promise<MealBooking[]> {
  try {
    const bookings = await sql<MealBooking>`
      SELECT * FROM meal_bookings 
      WHERE booking_date BETWEEN ${fromDate.toISOString()} AND ${toDate.toISOString()}
      ORDER BY booking_date DESC
    `;
    return bookings.rows.map((booking) =>
      MealBookingSchema.parse({
        ...booking,
        booking_date: booking.booking_date.toString(),
        pickup_date: booking.pickup_date
          ? booking.pickup_date.toString()
          : null,
      })
    );
  } catch (error) {
    console.error("Failed to fetch bookings:", error);
    throw new Error("Failed to fetch bookings.");
  }
}

export async function fetchUsers(): Promise<User[]> {
  try {
    const users = await sql<User>`SELECT * FROM users ORDER BY name`;
    return users.rows.map((user) => UserSchema.parse(user));
  } catch (error) {
    console.error("Failed to fetch users:", error);
    throw new Error("Failed to fetch users.");
  }
}

export async function fetchWeeklyMenu(): Promise<WeeklyMenu[]> {
  try {
    const menu =
      await sql<WeeklyMenu>`SELECT * FROM weekly_menu ORDER BY day_of_week`;
    return menu.rows.map((row) => WeeklyMenuSchema.parse(row));
  } catch (error) {
    console.error("Failed to fetch weekly menu:", error);
    throw new Error("Failed to fetch weekly menu.");
  }
}

export async function fetchDisabledDates(): Promise<string[]> {
  try {
    const result = await sql`SELECT date FROM disabled_dates ORDER BY date`;
    return result.rows.map((row) => row.date);
  } catch (error) {
    console.error("Failed to fetch disabled dates:", error);
    throw new Error("Failed to fetch disabled dates.");
  }
}
