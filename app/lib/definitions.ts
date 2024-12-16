import { z } from "zod";

export const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  is_admin: z.boolean(),
  is_vegetarian: z.boolean(),
});

export type User = z.infer<typeof UserSchema>;

export const WeeklyMenuSchema = z.object({
  id: z.string().uuid(),
  day_of_week: z.number().min(0).max(4),
  veg_items: z.string(),
  non_veg_items: z.string(),
  is_non_veg_available: z.boolean(),
});

export type WeeklyMenu = z.infer<typeof WeeklyMenuSchema>;

export const MealBookingSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  booking_date: z.string(),
  is_vegetarian: z.boolean(),
  pickup_date: z.string().nullable(),
});

export type MealBooking = z.infer<typeof MealBookingSchema>;
