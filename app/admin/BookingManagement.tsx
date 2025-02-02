"use client";

import { useState } from "react";
import { MealBooking } from "../lib/definitions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { deleteBookings } from "../lib/actions";

interface BookingManagementProps {
  bookings: MealBooking[];
  setBookings: React.Dispatch<React.SetStateAction<MealBooking[]>>;
}

export function BookingManagement({
  bookings,
  setBookings,
}: BookingManagementProps) {
  const [selectedBookings, setSelectedBookings] = useState<Set<string>>(
    new Set()
  );

  const [searchTerm, setSearchTerm] = useState("");

  const filteredBookings = bookings.filter(
    (booking) =>
      booking.user_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      new Date(booking.booking_date)
        .toDateString()
        .toLowerCase()
        .includes(searchTerm)
  );

  const handleSelectBooking = (bookingId: string) => {
    setSelectedBookings((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(bookingId)) {
        newSet.delete(bookingId);
      } else {
        newSet.add(bookingId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedBookings.size === filteredBookings.length) {
      setSelectedBookings(new Set());
    } else {
      setSelectedBookings(
        new Set(filteredBookings.map((booking) => booking.id))
      );
    }
  };

  const handleDeleteBookings = async () => {
    if (confirm("Are you sure you want to delete the selected bookings?")) {
      const result = await deleteBookings(Array.from(selectedBookings));
      if (result.success) {
        setBookings(
          bookings.filter((booking) => !selectedBookings.has(booking.id))
        );
        setSelectedBookings(new Set());
      } else {
        alert("Failed to delete bookings: " + result.error);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <Input
          type="text"
          placeholder="Search bookings..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button
          onClick={handleDeleteBookings}
          disabled={selectedBookings.size === 0}
        >
          Delete Selected
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={selectedBookings.size === filteredBookings.length}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>User ID</TableHead>
            <TableHead>Booking Date</TableHead>
            <TableHead>Is Vegetarian</TableHead>
            <TableHead>Pickup Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredBookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell>
                <Checkbox
                  checked={selectedBookings.has(booking.id)}
                  onCheckedChange={() => handleSelectBooking(booking.id)}
                />
              </TableCell>
              <TableCell>{booking.user_id}</TableCell>
              <TableCell>{booking.booking_date}</TableCell>
              <TableCell>{booking.is_vegetarian ? "Yes" : "No"}</TableCell>
              <TableCell>{booking.pickup_date || "Not picked up"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
