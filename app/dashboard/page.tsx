import { getWeeklyMenu, getMealBookingsForDate } from "../lib/data";
import { bookMeal } from "../lib/actions";

export default async function Dashboard() {
  const weeklyMenu = await getWeeklyMenu();
  const today = new Date().toISOString().split("T")[0];
  const todayBookings = await getMealBookingsForDate(today);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Cafeteria Dashboard</h1>

      <h2 className="text-xl font-semibold mb-2">Today&apos;s Menu</h2>
      {weeklyMenu.map((menu) => (
        <div key={menu.id} className="mb-4">
          <h3 className="text-lg font-medium">
            {
              [
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
              ][menu.day_of_week]
            }
          </h3>
          <p>Vegetarian: {menu.veg_items}</p>
          {menu.is_non_veg_available && (
            <p>Non-vegetarian: {menu.non_veg_items}</p>
          )}
        </div>
      ))}

      <h2 className="text-xl font-semibold mb-2 mt-8">Book a Meal</h2>
      <form action={bookMeal}>
        <input
          type="hidden"
          name="userId"
          value="410544b2-4001-4271-9855-fec4b6a6442a"
        />
        <input type="hidden" name="bookingDate" value={today} />
        <label className="block mb-2">
          <input
            type="checkbox"
            name="isVegetarian"
            value="true"
            className="mr-2"
          />
          Vegetarian
        </label>
        <button
          type="submit"
          className="bg-slate-700 text-white px-4 py-2 rounded"
        >
          Book Meal
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-2 mt-8">Today&apos;s Bookings</h2>
      <ul>
        {todayBookings.map((booking) => (
          <li key={booking.id}>
            User ID: {booking.user_id}, Vegetarian:{" "}
            {booking.is_vegetarian ? "Yes" : "No"}
          </li>
        ))}
      </ul>
    </div>
  );
}
