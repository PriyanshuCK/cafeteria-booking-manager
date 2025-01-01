"use client";

import { MealBooking } from "../lib/definitions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
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

  const chartConfig = {
    veg: {
      label: "Veg",
    },
    nonVeg: {
      label: "NonVeg",
    },
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle className={"text-lg font-semibold"}>
              Daily Bookings
            </CardTitle>
            <CardDescription>Veg. vs Non-Veg. Bookings by Date</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <BarChart accessibilityLayer data={dailyBookingsData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={true}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 10)}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      className="w-[180px]"
                      formatter={(value, name, item, index) => {
                        return (
                          <>
                            <div className="flex flex-col gap-2 w-full">
                              <div className="flex items-center gap-1.5">
                                <div
                                  className={`h-2.5 w-2.5 shrink-0 rounded-[2px] ${
                                    name === "Veg"
                                      ? "bg-primary-300"
                                      : "bg-primary-700"
                                  }`}
                                />
                                <span className="grow">
                                  {chartConfig[name as keyof typeof chartConfig]
                                    ?.label || name}
                                </span>
                                <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                                  {value}
                                </div>
                              </div>
                              {index === 1 && (
                                <>
                                  <div className="flex items-center border-t pt-1.5 text-xs font-medium text-foreground justify-between w-full">
                                    Total
                                    <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                                      {item.payload.veg + item.payload.nonVeg}
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          </>
                        );
                      }}
                    />
                  }
                  cursor={true}
                  defaultIndex={2}
                />
                <Bar
                  dataKey="veg"
                  className="fill-primary-300"
                  name="Veg"
                  radius={4}
                />
                <Bar
                  dataKey="nonVeg"
                  className="fill-primary-700"
                  name="Non-Veg"
                  radius={4}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle className={"text-lg font-semibold"}>
              Weekly Trends
            </CardTitle>
            <CardDescription>Bookings by Day of the Week</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <BarChart accessibilityLayer data={weeklyTrendsData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      hideLabel
                      className="w-16"
                      formatter={(value, name) => {
                        return (
                          <>
                            <div className="flex flex-col gap-2 w-full">
                              <div className="flex items-center gap-1.5">
                                <span className="grow">
                                  {chartConfig[name as keyof typeof chartConfig]
                                    ?.label || name}
                                </span>
                                <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                                  {value}
                                </div>
                              </div>
                            </div>
                          </>
                        );
                      }}
                    />
                  }
                  cursor={true}
                  defaultIndex={1}
                />
                <Bar
                  dataKey="bookings"
                  className="fill-primary-500"
                  name="Bookings"
                  radius={4}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle className={"text-lg font-semibold"}>
              Veg vs. Non-Veg Split
            </CardTitle>
            <CardDescription>
              Total Vegetarian vs. Non-Vegetarian Bookings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <PieChart accessibilityLayer>
                <Pie
                  data={vegNonVegData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="currentColor"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {vegNonVegData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      className={`${
                        index === 0 ? "fill-primary-300" : "fill-primary-700"
                      }`}
                    />
                  ))}
                </Pie>
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value, name) => (
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-2.5 w-2.5 rounded-[2px] ${
                              name === "Vegetarian"
                                ? "bg-primary-300"
                                : "bg-primary-700"
                            }`}
                          />
                          <span className="font-medium text-foreground">
                            {name}:
                          </span>
                          <span className="ml-auto font-mono text-foreground">
                            {value}
                          </span>
                        </div>
                      )}
                    />
                  }
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* <Card>
        <CardHeader>
          <CardTitle>Weekly Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyTrendsData}>
              <CartesianGrid strokeDasharray="1 3" />
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
      </Card> */}
      </div>
    </>
  );
}
