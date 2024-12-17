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
  PieChart,
  Pie,
  Cell,
} from "recharts";

export function BookingOverview({ bookings }: { bookings: MealBooking[] }) {
  const dailyBookings = bookings.reduce((acc, booking) => {
    const date = new Date(booking.booking_date).toISOString().split("T")[0];
    if (!acc[date]) {
      acc[date] = { date, veg: 0, nonVeg: 0 };
    }
    if (booking.is_vegetarian) {
      acc[date].veg++;
    } else {
      acc[date].nonVeg++;
    }
    return acc;
  }, {} as Record<string, { date: string; veg: number; nonVeg: number }>);

  const weeklyTrends = bookings.reduce((acc, booking) => {
    const day = new Date(booking.booking_date).getDay() - 1;
    if (!acc[day]) {
      acc[day] = 0;
    }
    acc[day]++;
    return acc;
  }, {} as Record<number, number>);

  const vegNonVegSplit = bookings.reduce(
    (acc, booking) => {
      if (booking.is_vegetarian) {
        acc.veg++;
      } else {
        acc.nonVeg++;
      }
      return acc;
    },
    { veg: 0, nonVeg: 0 }
  );

  const dailyBookingsData = Object.values(dailyBookings);

  const weeklyTrendsData = [
    { day: "Mon", bookings: weeklyTrends[0] || 0 },
    { day: "Tue", bookings: weeklyTrends[1] || 0 },
    { day: "Wed", bookings: weeklyTrends[2] || 0 },
    { day: "Thu", bookings: weeklyTrends[3] || 0 },
    { day: "Fri", bookings: weeklyTrends[4] || 0 },
  ];
  const vegNonVegData = [
    { name: "Vegetarian", value: vegNonVegSplit.veg },
    { name: "Non-Vegetarian", value: vegNonVegSplit.nonVeg },
  ];

  const COLORS = ["#22c55e", "#eab308"];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Daily Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyBookingsData}>
              {/* <CartesianGrid strokeDasharray="1 3" /> */}
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="veg" fill="#22c55e" name="Vegetarian" />
              <Bar dataKey="nonVeg" fill="#eab308" name="Non-Vegetarian" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyTrendsData}>
              {/* <CartesianGrid strokeDasharray="1 3" /> */}
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="bookings" fill="#14b8a6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Veg vs. Non-Veg Split</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={vegNonVegData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#22c55e"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {vegNonVegData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
