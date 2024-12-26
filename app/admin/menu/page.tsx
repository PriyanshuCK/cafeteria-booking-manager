import { getWeeklyMenu } from "@/app/lib/data";
import { MenuManagement } from "../MenuManagement";

export default async function MenuPage() {
  const weeklyMenu = await getWeeklyMenu();
  return (
    <>
      <MenuManagement weeklyMenu={weeklyMenu} />
    </>
  );
}
