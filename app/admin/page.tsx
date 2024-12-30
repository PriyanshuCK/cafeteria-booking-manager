import { auth } from "@/auth";
import { getUser } from "../lib/data";

export default async function AdminDashboard() {
  const authUser = await auth();
  const user = await getUser(authUser?.user?.email || "");

  return (
    <>
      <h2 className="text-xl font-semibold">Hi, {user?.name} 👋</h2>
    </>
  );
}
