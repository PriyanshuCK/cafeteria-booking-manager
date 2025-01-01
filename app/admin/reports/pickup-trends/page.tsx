"use client";
import { useContext } from "react";
import { PickupTrends } from "../../PickupTrends";
import { BookingContext } from "../../contexts/BookingsContext";

export default function PickupTrendsPage() {
  const { bookings } = useContext(BookingContext)!;
  return (
    <>
      <h2 className="text-xl font-semibold">Pickup Trends</h2>
      <p className="text-sm text-gray-500 mb-4">
        View reports on pickup trends.
      </p>
      <PickupTrends bookings={bookings} />
    </>
  );
}
