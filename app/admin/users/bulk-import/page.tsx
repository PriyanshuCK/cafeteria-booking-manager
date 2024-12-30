import { BulkUserImport } from "../../BulkUserImport";

export default function BulkImportUsersPage() {
  return (
    <>
      <h2 className="text-2xl font-semibold mt-2">Bulk Import Users</h2>
      <p className="text-sm text-gray-500 mb-4">
        Import users in bulk by uploading a CSV or Excel file.
      </p>
      <BulkUserImport />
    </>
  );
}
