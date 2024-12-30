import { getUsers } from "@/app/lib/data";
import { UserTable } from "../../UserTable";

export default async function AllUsersPage() {
  const users = await getUsers();
  return (
    <>
      <h2 className="text-2xl font-semibold mt-2">All Users</h2>
      <p className="text-sm text-gray-500 mb-4">View and manage all users.</p>
      <UserTable users={users} />
    </>
  );
}
