import { getUser, getWeeklyMenu, getTomorrowsDate } from "../lib/data";
import {
  bookMeal,
  recordMealPickup,
  getTodayBookingStatus,
  checkTomorrowBooking,
} from "../lib/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth, signOut } from "@/auth";

export default async function Dashboard() {
  const authUser = await auth();
  const user = await getUser(authUser?.user?.email || "user@nextmail.com");

  if (!user) {
    return <div>User not found</div>;
  }
  const weeklyMenu = await getWeeklyMenu();
  const todayStatus = await getTodayBookingStatus(user.id);
  const tomorrowBooked = await checkTomorrowBooking(user.id);
  const tomorrowDate = await getTomorrowsDate();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user.name}</h1>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Today&apos;s Status</CardTitle>
        </CardHeader>
        <CardContent>
          {todayStatus.status === "no_booking" && (
            <p>No meal booked for today.</p>
          )}
          {todayStatus.status === "not_picked_up" && (
            // @ts-expect-error: The function's return type is not compatible with the expected 'action' type.
            <form action={recordMealPickup}>
              <input type="hidden" name="userId" value={user.id} />
              <input
                type="hidden"
                name="bookingDate"
                value={new Date().toISOString().split("T")[0]}
              />
              <Button type="submit">Pick Up Meal</Button>
            </form>
          )}
          {todayStatus.status === "picked_up" && (
            <p>You&apos;ve already picked up your meal for today.</p>
          )}
        </CardContent>
      </Card>

      {!tomorrowBooked && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Book for Tomorrow</CardTitle>
          </CardHeader>
          <CardContent>
            {/* @ts-expect-error: The function's return type is not compatible with the expected 'action' type. */}
            <form action={bookMeal}>
              <input type="hidden" name="userId" value={user.id} />
              <input type="hidden" name="bookingDate" value={tomorrowDate} />
              <div className="mb-2">
                <label>
                  <input
                    type="radio"
                    name="isVegetarian"
                    value="true"
                    defaultChecked={user.is_vegetarian}
                  />{" "}
                  Vegetarian
                </label>
              </div>
              <div className="mb-2">
                <label>
                  <input
                    type="radio"
                    name="isVegetarian"
                    value="false"
                    defaultChecked={!user.is_vegetarian}
                  />{" "}
                  Non-Vegetarian
                </label>
              </div>
              <Button type="submit">Book for Tomorrow</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Weekly Menu</CardTitle>
        </CardHeader>
        <CardContent>
          {weeklyMenu.map((menu) => (
            <div key={menu.id} className="mb-4">
              <h3 className="text-lg font-medium">
                {
                  ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"][
                    menu.day_of_week
                  ]
                }
              </h3>
              <p>Vegetarian: {menu.veg_items}</p>
              {menu.is_non_veg_available && (
                <p>Non-vegetarian: {menu.non_veg_items}</p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <button className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
          <div className="hidden md:block">Sign Out</div>
        </button>
      </form>
    </div>
  );
}
