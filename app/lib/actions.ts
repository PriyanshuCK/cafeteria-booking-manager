"use server";

import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
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
    `;
    revalidatePath("/dashboard");
    return { message: "Meal booked successfully" };
  } catch (error) {
    return { message: "Failed to book meal " + error };
  }
}

const RecordPickupSchema = z.object({
  bookingId: z.string().uuid(),
});

export async function recordMealPickup(formData: FormData) {
  const { bookingId } = RecordPickupSchema.parse({
    bookingId: formData.get("bookingId"),
  });

  try {
    await sql`
      INSERT INTO meal_pickups (booking_id)
      VALUES (${bookingId})
    `;
    revalidatePath("/dashboard");
    return { message: "Meal pickup recorded successfully" };
  } catch (error) {
    return { message: "Failed to record meal pickup " + error };
  }
}
