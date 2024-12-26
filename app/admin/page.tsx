"use client";

import { useState, useEffect, useContext } from "react";
import {
  fetchUsers,
  fetchWeeklyMenu,
  fetchDisabledDates,
  fetchBookings,
} from "../lib/actions";
import { DateRangeSelector } from "@/components/date-range-selector";
import { BulkUserImport } from "./BulkUserImport";
import { AddUser } from "./AddUser";
import { UserTable } from "./UserTable";
import { BookingManagement } from "./BookingManagement";
import { MenuManagement } from "./MenuManagement";
import { BookingOverview } from "./BookingOverview";
import { PickupTrends } from "./PickupTrends";
// import { DisableDates } from "./DisableDates";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MealBooking, User, WeeklyMenu } from "../lib/definitions";
import { DateRangeContext } from "./contexts/DateRangeContext";

export default function AdminDashboard() {
  const { dateRange } = useContext(DateRangeContext)!;
  const [bookings, setBookings] = useState<MealBooking[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [weeklyMenu, setWeeklyMenu] = useState<WeeklyMenu[]>([]);
  // const [disabledDates, setDisabledDates] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedUsers, fetchedWeeklyMenu] = await Promise.all([
          fetchUsers(),
          fetchWeeklyMenu(),
          fetchDisabledDates(),
        ]);
        setUsers(fetchedUsers);
        setWeeklyMenu(fetchedWeeklyMenu);
        // setDisabledDates(fetchedDisabledDates);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        alert("Failed to fetch some data. Please try refreshing the page.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchBookingsData = async () => {
      if (dateRange?.from && dateRange?.to) {
        try {
          const fetchedBookings = await fetchBookings(
            dateRange.from,
            dateRange.to
          );
          setBookings(fetchedBookings);
        } catch (error) {
          console.error("Failed to fetch bookings:", error);
          alert("Failed to fetch bookings. Please try again.");
        }
      }
    };

    fetchBookingsData();
  }, [dateRange]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="mb-4">
        <DateRangeSelector />
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="menu">Menu</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage users, import in bulk, or add individually
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <BulkUserImport />
                <AddUser />
              </div>
              <UserTable users={users} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>Booking Management</CardTitle>
              <CardDescription>View and manage meal bookings</CardDescription>
            </CardHeader>
            <CardContent>
              <BookingManagement
                bookings={bookings}
                setBookings={setBookings}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="menu">
          <Card>
            <CardHeader>
              <CardTitle>Menu Management</CardTitle>
              <CardDescription>Manage weekly menu items</CardDescription>
            </CardHeader>
            <CardContent>
              <MenuManagement weeklyMenu={weeklyMenu} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>
                View booking statistics and generate reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mt-8">
                <BookingOverview bookings={bookings} />
              </div>
              <div className="mt-8">
                <PickupTrends bookings={bookings} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>Manage system settings</CardDescription>
            </CardHeader>
            <CardContent>
              {/* <DisableDates disabledDates={disabledDates} /> */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
