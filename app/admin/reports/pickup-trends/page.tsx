"use client";
import { useContext } from "react";
import { PickupTrends } from "../../PickupTrends";
import { BookingContext } from "../../contexts/BookingsContext";

export default function PickupTrendsPage() {
  const { bookings } = useContext(BookingContext)!;
  return (
    <>
      <h1 className="text-3xl font-semibold my-10">Pickup Trends</h1>
      <PickupTrends bookings={bookings} />
    </>
  );
}
