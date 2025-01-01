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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

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
    unclaimedPercentage: parseInt(
      (((day.booked - day.pickedUp) / day.booked) * 100).toFixed(2)
    ),
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

  const chartConfig = {
    booked: {
      label: "Booked",
    },
    pickedUp: {
      label: "Picked Up",
    },
  };

  const unclaimedChartConfig = {
    unclaimedPercentage: {
      label: "Unclaimed %",
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Meals Booked vs. Picked Up
          </CardTitle>
          <CardDescription>
            Comparison of meals booked and picked up over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={pickupTrendsData}>
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
                    formatter={(value, name, item, index) => (
                      <>
                        <div className="flex flex-col gap-2 w-full">
                          <div className="flex items-center gap-1.5">
                            <div
                              className={`h-2.5 w-2.5 shrink-0 rounded-[2px] ${
                                name === "Booked"
                                  ? "bg-primary-300"
                                  : "bg-primary-700"
                              }`}
                            />
                            <span className="grow">{name}:</span>
                            <div className="ml-auto font-mono text-foreground">
                              {value}
                            </div>
                          </div>
                          {index === 1 && (
                            <>
                              <div className="flex items-center border-t pt-1.5 text-xs font-medium text-foreground justify-between w-full">
                                Unclaimed Meals
                                <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                                  {item.payload.booked - item.payload.pickedUp}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </>
                    )}
                  />
                }
                cursor={true}
                defaultIndex={2}
              />
              <Bar
                dataKey="booked"
                className="fill-primary-300"
                name="Booked"
                radius={4}
              />
              <Bar
                dataKey="pickedUp"
                className="fill-primary-700"
                name="Picked Up"
                radius={4}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Unclaimed Meals Percentage
          </CardTitle>
          <CardDescription>Percentage of Meals Not Picked Up</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={unclaimedChartConfig}>
            <BarChart accessibilityLayer data={unclaimedMealsPercentage}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 10)}
              />
              <ChartTooltip
                cursor={false}
                defaultIndex={2}
                content={
                  <ChartTooltipContent
                    className="w-16"
                    formatter={(value, name) => {
                      return (
                        <>
                          <div className="flex flex-col gap-2 w-full">
                            <div className="flex items-center gap-1.5">
                              <span className="grow">
                                {unclaimedChartConfig[
                                  name as keyof typeof unclaimedChartConfig
                                ]?.label || name}
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
              />
              <Bar
                dataKey="unclaimedPercentage"
                className="fill-primary-500"
                name="Unclaimed %"
                radius={4}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Users with High Unclaimed Rates
          </CardTitle>
          <CardDescription>
            List of Top 5 Users with the highest unclaimed rates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">User ID</TableHead>
                <TableHead className="text-right">Unclaimed Rate (%)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usersWithHighUnclaimedRates.map((user) => (
                <TableRow key={user.userId}>
                  <TableCell className="font-medium">{user.userId}</TableCell>
                  <TableCell className="text-right">
                    {(user.unclaimedRate * 100).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* <Card>
        <CardHeader>
          <CardTitle>Meals Booked vs. Picked Up</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={pickupTrendsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="booked" fill="#0ea5e9" name="Booked" />
              <Bar dataKey="pickedUp" fill="#22c55e" name="Picked Up" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card> */}

      {/* <Card>
        <CardHeader>
          <CardTitle>Unclaimed Meals Percentage</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={unclaimedMealsPercentage}>
              <CartesianGrid strokeDasharray="3 3" />
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
      </Card> */}

      {/* <Card>
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
      </Card> */}
    </div>
  );
}
