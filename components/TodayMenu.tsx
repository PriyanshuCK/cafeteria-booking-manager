import { getWeeklyMenu } from "@/app/lib/data";

export default async function TodayMenu() {
  const today = new Date().getDay() - 1;
  // Todo: Performance optimization -> get only today's menu instead of complete menu
  const weeklyMenu = await getWeeklyMenu();
  const menuDay = today > 4 ? 4 : today;

  const todaysMenu = weeklyMenu.find((menu) => menu.day_of_week === menuDay);

  const veg_items_today = todaysMenu?.veg_items.split(";") || [];
  const non_veg_items_today = todaysMenu?.is_non_veg_available
    ? todaysMenu.non_veg_items.split(";")
    : [];

  return (
    <>
      <div className="flex sm:items-center flex-col">
        <h1 className="text-center mb-6 font-bold text-lg">
          Today&apos;s Menu
        </h1>
        <div className="flex gap-4 flex-col sm:flex-row sm:w-96 sm:justify-between">
          <div>
            <h2 className="font-semibold">Veg Items</h2>
            <ul>
              {veg_items_today.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-semibold">Non-Veg Items</h2>
            {non_veg_items_today.length > 0 ? (
              <ul>
                {non_veg_items_today.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            ) : (
              <p>Not available today!</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
