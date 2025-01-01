"use client";

import React, { useState } from "react";

const tailwindColors = [
  "slate",
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",
];

export default function ThemeColorForm() {
  const [themeColor, setThemeColor] = useState("emerald");

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const color: string = event.target.value;
    document.body.classList.remove(`theme-${themeColor}`);
    document.body.classList.add(`theme-${color}`);
    setThemeColor(color);
    document.documentElement.style.setProperty("--theme-color", color);
    console.log("Theme color set to", color);
  };

  return (
    <form className="space-y-4">
      <label htmlFor="themeColor" className="block font-medium text-gray-700">
        Select Theme Color:
      </label>
      <select
        id="themeColor"
        name="themeColor"
        value={themeColor}
        onChange={handleChange}
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      >
        {tailwindColors.map((color) => (
          <option key={color} value={color}>
            {color}
          </option>
        ))}
      </select>
    </form>
  );
}
