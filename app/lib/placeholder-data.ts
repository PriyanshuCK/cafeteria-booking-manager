export const users = [
  {
    id: "410544b2-4001-4271-9855-fec4b6a6442a",
    name: "User",
    email: "user@nextmail.com",
    password: "123456",
    is_admin: false,
    is_vegetarian: true,
  },
  {
    id: "3958dc9e-712f-4377-85e9-fec4b6a6442a",
    name: "Admin",
    email: "admin@nextmail.com",
    password: "123456",
    is_admin: true,
    is_vegetarian: false,
  },
];

export const weeklyMenu: {
  id: string;
  day_of_week: number;
  veg_items: string;
  non_veg_items: string;
  is_non_veg_available: boolean;
}[] = [
  {
    id: "e0c56c45-5395-4a57-9f5d-e6ec0edf0556",
    day_of_week: 0,
    veg_items: "Roti;Dal;Rice;Aloo Gobi;Raita",
    non_veg_items: "Chicken Curry",
    is_non_veg_available: true,
  },
  {
    id: "f4c56c45-5395-4a57-9f5d-e6ec0edf0557",
    day_of_week: 1,
    veg_items: "Roti;Dal;Rice;Palak Paneer;Fruit Salad",
    non_veg_items: "",
    is_non_veg_available: false,
  },
  {
    id: "d6e15727-9fe1-4961-8c5b-ea44a9bd81aa",
    day_of_week: 2,
    veg_items: "Roti;Dal;Rice;Bhindi Masala;Kheer",
    non_veg_items: "Fish Curry",
    is_non_veg_available: true,
  },
  {
    id: "3958dc9e-712f-4377-85e9-fec4b6a6442a",
    day_of_week: 3,
    veg_items: "Roti;Dal;Rice;Matar Paneer;Gulab Jamun",
    non_veg_items: "Chicken Curry",
    is_non_veg_available: true,
  },
  {
    id: "3958dc9e-742f-4377-85e9-fec4b6a6442a",
    day_of_week: 4,
    veg_items: "Roti;Dal;Rice;Chana Masala;Fruit Custard",
    non_veg_items: "",
    is_non_veg_available: false,
  },
];

export const mealBookings = [
  {
    id: "b9c56c45-5395-4a57-9f5d-e6ec0edf0563",
    user_id: "410544b2-4001-4271-9855-fec4b6a6442a",
    booking_date: "2023-05-01",
    is_vegetarian: true,
    pickup_date: null,
  },
  {
    id: "c0c56c45-5395-4a57-9f5d-e6ec0edf0564",
    user_id: "3958dc9e-712f-4377-85e9-fec4b6a6442a",
    booking_date: "2023-05-01",
    is_vegetarian: false,
    pickup_date: null,
  },
];
