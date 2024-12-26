import { sql } from "@vercel/postgres";
import {
  User,
  WeeklyMenu,
  MealBooking,
  UserSchema,
  WeeklyMenuSchema,
  MealBookingSchema,
} from "./definitions";
import { z } from "zod";

export async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User>`SELECT * FROM users WHERE email = ${email}`;
    return user.rows[0] ? UserSchema.parse(user.rows[0]) : undefined;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

export async function getUserByID(id: string): Promise<User | undefined> {
  try {
    const user = await sql<User>`SELECT * FROM users WHERE user_id = ${id}`;
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

export async function getUsers(): Promise<User[]> {
  try {
    const users = await sql<User>`SELECT * FROM users ORDER BY name`;
    return users.rows.map((user) => UserSchema.parse(user));
  } catch (error) {
    console.error("Failed to fetch users:", error);
    throw new Error("Failed to fetch users.");
  }
}

// export async function getBookings(): Promise<MealBooking[]> {
//   try {
//     const bookings =
//       await sql<MealBooking>`SELECT * FROM meal_bookings ORDER BY booking_date DESC`;

//     return bookings.rows.map((booking) => {
//       return MealBookingSchema.parse({
//         ...booking,
//         booking_date: booking.booking_date.toString(),
//         pickup_date: booking.pickup_date
//           ? booking.pickup_date.toString()
//           : null,
//       });
//     });
//   } catch (error) {
//     console.error("Failed to fetch bookings:", error);
//     throw new Error("Failed to fetch bookings.");
//   }
// }

export async function getBookings(
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

const DisabledDateSchema = z.object({
  date: z.string(),
});

export async function getDisabledDates(): Promise<string[]> {
  try {
    const result = await sql`SELECT date FROM disabled_dates ORDER BY date`;
    const disabledDates = result.rows.map(
      (row) => DisabledDateSchema.parse(row).date
    );
    return disabledDates;
  } catch (error) {
    console.error("Failed to fetch disabled dates:", error);
    throw new Error("Failed to fetch disabled dates.");
  }
}
