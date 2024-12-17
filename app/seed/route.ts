// import bcrypt from "bcrypt";
import { db } from "@vercel/postgres";
// import { users, weeklyMenu, mealBookings } from "../lib/placeholder-data";

const client = await db.connect();

// async function seedUsers() {
//   try {
//     await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
//     const createTable = await client.sql`
//       CREATE TABLE IF NOT EXISTS users (
//         id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
//         name VARCHAR(255) NOT NULL,
//         email TEXT NOT NULL UNIQUE,
//         password TEXT NOT NULL,
//         is_admin BOOLEAN DEFAULT false,
//         is_vegetarian BOOLEAN DEFAULT true
//       );
//     `;

//     const insertedUsers = await Promise.all(
//       users.map(async (user) => {
//         const hashedPassword = await bcrypt.hash(user.password, 10);
//         return client.sql`
//         INSERT INTO users (id, name, email, password, is_admin, is_vegetarian)
//         VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword}, ${user.is_admin}, ${user.is_vegetarian})
//         ON CONFLICT (id) DO NOTHING;
//       `;
//       })
//     );

//     return {
//       createTable,
//       users: insertedUsers,
//     };
//   } catch (error) {
//     console.error("Error seeding users:", error);
//     throw error;
//   }
// }

// async function seedWeeklyMenu() {
//   try {
//     await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

//     const createTable = await client.sql`
//     CREATE TABLE IF NOT EXISTS weekly_menu (
//       id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
//       day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 4),
//       veg_items TEXT NOT NULL,
//       non_veg_items TEXT,
//       is_non_veg_available BOOLEAN DEFAULT false,
//       UNIQUE (day_of_week)
//     );
//   `;

//     const insertedMenu = await Promise.all(
//       weeklyMenu.map(
//         (menu) => client.sql`
//         INSERT INTO weekly_menu (id, day_of_week, veg_items, non_veg_items, is_non_veg_available)
//         VALUES (
//           ${menu.id},
//           ${menu.day_of_week},
//           ${menu.veg_items},
//           ${menu.non_veg_items},
//           ${menu.is_non_veg_available}
//         )
//         ON CONFLICT (id) DO NOTHING;
//       `
//       )
//     );

//     return {
//       createTable,
//       weeklyMenu: insertedMenu,
//     };
//   } catch (error) {
//     console.error("Error seeding weekly menu:", error);
//     throw error;
//   }
// }

// async function seedMealBookings() {
//   try {
//     await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

//     const createTable = await client.sql`
//     CREATE TABLE IF NOT EXISTS meal_bookings (
//       id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
//       user_id UUID NOT NULL,
//       booking_date DATE NOT NULL,
//       is_vegetarian BOOLEAN NOT NULL,
//       pickup_date DATE,
//       FOREIGN KEY (user_id) REFERENCES users(id),
//       UNIQUE (user_id, booking_date)
//     );
//   `;

//     const insertedBookings = await Promise.all(
//       mealBookings.map(
//         (booking) => client.sql`
//         INSERT INTO meal_bookings (id, user_id, booking_date, is_vegetarian, pickup_date)
//         VALUES (${booking.id}, ${booking.user_id}, ${booking.booking_date}, ${booking.is_vegetarian}, ${booking.pickup_date})
//         ON CONFLICT (user_id, booking_date) DO NOTHING;
//       `
//       )
//     );

//     return {
//       createTable,
//       mealBookings: insertedBookings,
//     };
//   } catch (error) {
//     console.error("Error seeding meal bookings:", error);
//     throw error;
//   }
// }

export async function GET() {
  try {
    // await client.sql`BEGIN`;
    // await seedUsers();
    // await seedWeeklyMenu();
    // await seedMealBookings();
    // await client.sql`COMMIT`;

    return Response.json({ message: "Database seeded successfully" });
  } catch (error) {
    await client.sql`ROLLBACK`;
    return Response.json({ error }, { status: 500 });
  }
}
