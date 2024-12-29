"use client";
import { useContext } from "react";
import { BookingManagement } from "../../BookingManagement";
import { BookingContext } from "../../contexts/BookingsContext";
import { DateRangeSelector } from "@/components/date-range-selector";

export default function AllBookingsPage() {
  const { bookings, setBookings } = useContext(BookingContext)!;
  return (
    <>
      <DateRangeSelector />
      <BookingManagement bookings={bookings} setBookings={setBookings} />
    </>
  );
}
