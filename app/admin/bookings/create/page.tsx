"use client";

import { createBooking } from "@/app/lib/actions";
import { useContext, useState } from "react";
import { BookingContext } from "../../contexts/BookingsContext";
import { DatePicker } from "@/components/ui/date-picker";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function CreateBookingPage() {
  const [newBooking, setNewBooking] = useState({
    user_id: "",
    booking_date: "",
    is_vegetarian: false,
  });

  const { bookings, setBookings } = useContext(BookingContext)!;

  const handleCreateBooking = async () => {
    const result = await createBooking(newBooking);
    if (result.success && result.booking) {
      setBookings([...bookings, result.booking]);
      setNewBooking({ user_id: "", booking_date: "", is_vegetarian: false });
    } else {
      alert("Failed to create booking: " + result.error);
    }
  };
  return (
    <>
      <div className="mt-4 grid grid-cols-4 gap-4">
        <Input
          placeholder="User ID"
          value={newBooking.user_id}
          onChange={(e) =>
            setNewBooking({ ...newBooking, user_id: e.target.value })
          }
        />
        <DatePicker
          date={
            newBooking.booking_date
              ? new Date(newBooking.booking_date)
              : undefined
          }
          setDate={(date) =>
            setNewBooking({
              ...newBooking,
              booking_date: date ? format(date, "yyyy-MM-dd") : "",
            })
          }
        />
        <div className="flex items-center">
          <Checkbox
            id="is_vegetarian"
            checked={newBooking.is_vegetarian}
            onCheckedChange={(checked) =>
              setNewBooking({
                ...newBooking,
                is_vegetarian: checked as boolean,
              })
            }
          />
          <label htmlFor="is_vegetarian" className="ml-2">
            Is Vegetarian
          </label>
        </div>
        <Button onClick={handleCreateBooking}>Create Booking</Button>
      </div>
    </>
  );
}
