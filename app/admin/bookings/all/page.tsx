"use client";
import { useContext } from "react";
import { BookingManagement } from "../../BookingManagement";
import { BookingContext } from "../../contexts/BookingsContext";

export default function AllBookingsPage() {
  const { bookings, setBookings } = useContext(BookingContext)!;
  return (
    <>
      <BookingManagement bookings={bookings} setBookings={setBookings} />
    </>
  );
}
