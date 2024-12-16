import { z } from "zod";

// User
export const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  is_admin: z.boolean(),
  is_vegetarian: z.boolean(),
});

export type User = z.infer<typeof UserSchema>;

// Weekly Menu
export const WeeklyMenuSchema = z.object({
  id: z.string().uuid(),
  day_of_week: z.number().min(0).max(6),
  veg_items: z.string(),
  non_veg_items: z.string(),
  is_non_veg_available: z.boolean(),
});

export type WeeklyMenu = z.infer<typeof WeeklyMenuSchema>;

// Meal Booking
export const MealBookingSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  booking_date: z.date(),
  is_vegetarian: z.boolean(),
});

export type MealBooking = z.infer<typeof MealBookingSchema>;

// Meal Pickup
export const MealPickupSchema = z.object({
  id: z.string().uuid(),
  booking_id: z.string().uuid(),
  pickup_time: z.date(),
});

export type MealPickup = z.infer<typeof MealPickupSchema>;
