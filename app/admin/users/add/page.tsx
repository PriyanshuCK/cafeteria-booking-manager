import { AddUser } from "../../AddUser";

export default function AddUserPage() {
  return (
    <>
      <h2 className="text-2xl font-semibold mt-2">Add a New User</h2>
      <p className="text-sm text-gray-500 mb-4">
        Add a new user to the database.
      </p>
      <AddUser />
    </>
  );
}
