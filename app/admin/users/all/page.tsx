import { getUsers } from "@/app/lib/data";
import { UserTable } from "../../UserTable";

export default async function AllUsersPage() {
  const users = await getUsers();
  return (
    <>
      <UserTable users={users} />
    </>
  );
}
