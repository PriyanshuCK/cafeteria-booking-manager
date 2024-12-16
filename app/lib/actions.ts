"use server";

import { signIn } from "@/auth";
import { sql } from "@vercel/postgres";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

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
