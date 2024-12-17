import { db } from "@vercel/postgres";

const client = await db.connect();

// async function seedMealBookings() {
//   try {
//     const updatedBookings = await client.sql`
//         UPDATE meal_bookings AS mb
//         SET is_vegetarian = CASE
//             WHEN RANDOM() < 0.75 THEN TRUE
//             ELSE FALSE
//         END
//         FROM users AS u
//         WHERE mb.user_id = u.id
//           AND u.is_vegetarian = FALSE;
//       `;
//     return {
//       mealBookings: updatedBookings,
//     };
//   } catch (error) {
//     console.error("Error seeding meal bookings:", error);
//     throw error;
//   }
// }

// async function seedUsers() {
//   try {
//     const updatedUsers = await client.sql`
//         UPDATE users
//         SET is_vegetarian = CASE
//             WHEN RANDOM() < 0.75 THEN TRUE
//             ELSE FALSE
//         END;
//       `;
//     return {
//       users: updatedUsers,
//     };
//   } catch (error) {
//     console.error("Error seeding users:", error);
//     throw error;
//   }
// }

export async function GET() {
  try {
    // await client.sql`BEGIN`;
    // await seedUsers();
    // await seedMealBookings();
    // await client.sql`COMMIT`;

    return Response.json({ message: "Database seeded successfully" });
  } catch (error) {
    await client.sql`ROLLBACK`;
    return Response.json({ error }, { status: 500 });
  }
}
