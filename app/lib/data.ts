import { sql } from "@vercel/postgres";
import { User, WeeklyMenu, MealBooking, MealPickup } from "./definitions";

export async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User>`SELECT * FROM users WHERE email = ${email}`;
    return user.rows[0];
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

export async function getWeeklyMenu(): Promise<WeeklyMenu[]> {
  try {
    const menu =
      await sql<WeeklyMenu>`SELECT * FROM weekly_menu ORDER BY day_of_week`;
    return menu.rows;
  } catch (error) {
    console.error("Failed to fetch weekly menu:", error);
    throw new Error("Failed to fetch weekly menu.");
  }
}

export async function getMealBookingsForDate(
  date: string
): Promise<MealBooking[]> {
  try {
    const bookings = await sql<MealBooking>`
      SELECT * FROM meal_bookings 
      WHERE booking_date = ${date}
    `;
    return bookings.rows;
  } catch (error) {
    console.error("Failed to fetch meal bookings:", error);
    throw new Error("Failed to fetch meal bookings.");
  }
}

export async function getMealPickupsForDate(
  date: string
): Promise<MealPickup[]> {
  try {
    const pickups = await sql<MealPickup>`
      SELECT mp.* FROM meal_pickups mp
      JOIN meal_bookings mb ON mp.booking_id = mb.id
      WHERE mb.booking_date = ${date}
    `;
    return pickups.rows;
  } catch (error) {
    console.error("Failed to fetch meal pickups:", error);
    throw new Error("Failed to fetch meal pickups.");
  }
}
