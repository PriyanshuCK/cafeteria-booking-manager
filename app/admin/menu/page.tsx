import { getWeeklyMenu } from "@/app/lib/data";
import { MenuManagement } from "../MenuManagement";

export default async function MenuPage() {
  const weeklyMenu = await getWeeklyMenu();
  return (
    <>
      <h2 className="text-2xl font-semibold mt-2">Menu</h2>
      <p className="text-sm text-gray-500 mb-4">
        View and manage the weekly menu.
      </p>
      <MenuManagement weeklyMenu={weeklyMenu} />
    </>
  );
}
