import { sql } from "@vercel/postgres";
import {
  User,
  WeeklyMenu,
  MealBooking,
  UserSchema,
  WeeklyMenuSchema,
  MealBookingSchema,
} from "./definitions";

export async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User>`SELECT * FROM users WHERE email = ${email}`;
    return user.rows[0] ? UserSchema.parse(user.rows[0]) : undefined;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

export async function getWeeklyMenu(): Promise<WeeklyMenu[]> {
  try {
    const menu =
      await sql<WeeklyMenu>`SELECT * FROM weekly_menu ORDER BY day_of_week`;
    return menu.rows.map((row) => WeeklyMenuSchema.parse(row));
  } catch (error) {
    console.error("Failed to fetch weekly menu:", error);
    throw new Error("Failed to fetch weekly menu.");
  }
}

export async function getMealBookingForDate(
  userId: string,
  date: string
): Promise<MealBooking | undefined> {
  try {
    const booking = await sql<MealBooking>`
      SELECT * FROM meal_bookings 
      WHERE user_id = ${userId} AND booking_date = ${date}
    `;
    return booking.rows[0]
      ? MealBookingSchema.parse(booking.rows[0])
      : undefined;
  } catch (error) {
    console.error("Failed to fetch meal booking:", error);
    throw new Error("Failed to fetch meal booking.");
  }
}

export async function getTomorrowsDate(): Promise<string> {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split("T")[0];
}
