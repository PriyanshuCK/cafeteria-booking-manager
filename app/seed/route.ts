import bcrypt from "bcrypt";
import { db } from "@vercel/postgres";
import {
  users,
  weeklyMenu,
  mealBookings,
  mealPickups,
} from "../lib/placeholder-data";

const client = await db.connect();

async function seedUsers() {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        is_admin BOOLEAN DEFAULT false,
        is_vegetarian BOOLEAN DEFAULT true
      );
    `;

    console.log(`Created "users" table`);

    const insertedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return client.sql`
        INSERT INTO users (id, name, email, password, is_admin, is_vegetarian)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword}, ${user.is_admin}, ${user.is_vegetarian})
        ON CONFLICT (id) DO NOTHING;
      `;
      })
    );

    console.log(`Seeded ${insertedUsers.length} users`);

    return {
      createTable,
      users: insertedUsers,
    };
  } catch (error) {
    console.error("Error seeding users:", error);
    throw error;
  }
}

async function seedWeeklyMenu() {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create the "weekly_menu" table if it doesn't exist
    const createTable = await client.sql`
    CREATE TABLE IF NOT EXISTS weekly_menu (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
      veg_items TEXT NOT NULL,
      non_veg_items TEXT,
      is_non_veg_available BOOLEAN DEFAULT false,
      UNIQUE (day_of_week)
    );
  `;

    console.log(`Created "weekly_menu" table`);

    // Insert data into the "weekly_menu" table
    const insertedMenu = await Promise.all(
      weeklyMenu.map(
        (menu) => client.sql`
        INSERT INTO weekly_menu (id, day_of_week, veg_items, non_veg_items, is_non_veg_available)
        VALUES (
          ${menu.id}, 
          ${menu.day_of_week}, 
          ${menu.veg_items}, 
          ${menu.non_veg_items}, 
          ${menu.is_non_veg_available}
        )
        ON CONFLICT (id) DO NOTHING;
      `
      )
    );

    return {
      createTable,
      weeklyMenu: insertedMenu,
    };
  } catch (error) {
    console.error("Error seeding weekly menu:", error);
    throw error;
  }
}

async function seedMealBookings() {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    const createTable = await client.sql`
    CREATE TABLE IF NOT EXISTS meal_bookings (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      user_id UUID NOT NULL,
      booking_date DATE NOT NULL,
      is_vegetarian BOOLEAN NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id),
      UNIQUE (user_id, booking_date)
    );
  `;

    console.log(`Created "meal_bookings" table`);

    const insertedBookings = await Promise.all(
      mealBookings.map(
        (booking) => client.sql`
        INSERT INTO meal_bookings (id, user_id, booking_date, is_vegetarian)
        VALUES (${booking.id}, ${booking.user_id}, ${booking.booking_date}, ${booking.is_vegetarian})
        ON CONFLICT (id) DO NOTHING;
      `
      )
    );

    console.log(`Seeded ${insertedBookings.length} meal bookings`);

    return {
      createTable,
      mealBookings: insertedBookings,
    };
  } catch (error) {
    console.error("Error seeding meal bookings:", error);
    throw error;
  }
}

async function seedMealPickups() {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    const createTable = await client.sql`
    CREATE TABLE IF NOT EXISTS meal_pickups (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      booking_id UUID NOT NULL,
      pickup_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (booking_id) REFERENCES meal_bookings(id),
      UNIQUE (booking_id)
    );
  `;

    console.log(`Created "meal_pickups" table`);

    const insertedPickups = await Promise.all(
      mealPickups.map(
        (pickup) => client.sql`
        INSERT INTO meal_pickups (id, booking_id, pickup_time)
        VALUES (${pickup.id}, ${pickup.booking_id}, ${pickup.pickup_time})
        ON CONFLICT (id) DO NOTHING;
      `
      )
    );

    console.log(`Seeded ${insertedPickups.length} meal pickups`);

    return {
      createTable,
      mealPickups: insertedPickups,
    };
  } catch (error) {
    console.error("Error seeding meal pickups:", error);
    throw error;
  }
}

export async function GET() {
  try {
    await client.sql`BEGIN`;
    await seedUsers();
    await seedWeeklyMenu();
    await seedMealBookings();
    await seedMealPickups();
    await client.sql`COMMIT`;

    return Response.json({ message: "Database seeded successfully" });
  } catch (error) {
    await client.sql`ROLLBACK`;
    return Response.json({ error }, { status: 500 });
  }
}
