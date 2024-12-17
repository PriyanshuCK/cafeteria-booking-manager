import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function csvToJson(csv: string) {
  const rows = csv.trim().split("\n");

  const headers = rows[0].split(",");

  const jsonArray = rows.slice(1).map((row) => {
    const values = row.split(",");
    const jsonObject: { [key: string]: string } = {};

    headers.forEach((header, index) => {
      jsonObject[header.trim()] = values[index]?.trim() || "";
    });

    return jsonObject;
  });

  return jsonArray;
}
