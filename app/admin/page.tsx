import { getBookings, getUsers } from "../lib/data";
import { AddUser } from "./AddUser";
import { BookingOverview } from "./BookingOverview";
import { BulkUserImport } from "./BulkUserImport";
import { PickupTrends } from "./PickupTrends";
import { UserTable } from "./UserTable";

export default async function AdminDashboard() {
  const users = await getUsers();
  const bookings = await getBookings();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <BulkUserImport />
        <AddUser />
      </div>

      <UserTable users={users} />

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Booking Overview</h2>
        <BookingOverview bookings={bookings} />
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Pickup Trends</h2>
        <PickupTrends bookings={bookings} />
      </div>
    </div>
  );
}
