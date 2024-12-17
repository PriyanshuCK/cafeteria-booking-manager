"use client";

import { MealBooking } from "../lib/definitions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  // CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export function PickupTrends({ bookings }: { bookings: MealBooking[] }) {
  const pickupTrends = bookings.reduce((acc, booking) => {
    const date = new Date(booking.booking_date).toISOString().split("T")[0];
    if (!acc[date]) {
      acc[date] = { date, booked: 0, pickedUp: 0 };
    }
    acc[date].booked++;
    if (booking.pickup_date) {
      acc[date].pickedUp++;
    }
    return acc;
  }, {} as Record<string, { date: string; booked: number; pickedUp: number }>);

  const pickupTrendsData = Object.values(pickupTrends);

  const unclaimedMealsPercentage = pickupTrendsData.map((day) => ({
    date: day.date,
    unclaimedPercentage: (
      ((day.booked - day.pickedUp) / day.booked) *
      100
    ).toFixed(2),
  }));

  const userPickupRates = bookings.reduce((acc, booking) => {
    if (!acc[booking.user_id]) {
      acc[booking.user_id] = { booked: 0, pickedUp: 0 };
    }
    acc[booking.user_id].booked++;
    if (booking.pickup_date) {
      acc[booking.user_id].pickedUp++;
    }
    return acc;
  }, {} as Record<string, { booked: number; pickedUp: number }>);

  const usersWithHighUnclaimedRates = Object.entries(userPickupRates)
    .map(([userId, stats]) => ({
      userId,
      unclaimedRate: (stats.booked - stats.pickedUp) / stats.booked,
    }))
    .filter((user) => user.unclaimedRate > 0.2)
    .sort((a, b) => b.unclaimedRate - a.unclaimedRate)
    .slice(0, 5);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Meals Booked vs. Picked Up</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={pickupTrendsData}>
              {/* <CartesianGrid strokeDasharray="3 3" /> */}
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="booked" fill="#0ea5e9" name="Booked" />
              <Bar dataKey="pickedUp" fill="#22c55e" name="Picked Up" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Unclaimed Meals Percentage</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={unclaimedMealsPercentage}>
              {/* <CartesianGrid strokeDasharray="3 3" /> */}
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="unclaimedPercentage"
                fill="#f59e0b"
                name="Unclaimed %"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Users with High Unclaimed Rates</CardTitle>
        </CardHeader>
        <CardContent>
          <ul>
            {usersWithHighUnclaimedRates.map((user) => (
              <li key={user.userId}>
                User: {user.userId} - Unclaimed Rate:{" "}
                {(user.unclaimedRate * 100).toFixed(2)}%
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
