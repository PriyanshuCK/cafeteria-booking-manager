"use client";

import { useState } from "react";
import { WeeklyMenu } from "../lib/definitions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { editMenuItem } from "../lib/actions";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export function MenuManagement({
  weeklyMenu: initialMenu,
}: {
  weeklyMenu: WeeklyMenu[];
}) {
  const [weeklyMenu, setWeeklyMenu] = useState(initialMenu);
  const [editedItems, setEditedItems] = useState<{ [key: string]: WeeklyMenu }>(
    {}
  );

  const handleSaveItem = async (id: string) => {
    const item = editedItems[id];
    if (item) {
      const result = await editMenuItem(item);
      if (result.success) {
        setWeeklyMenu(weeklyMenu.map((i) => (i.id === item.id ? item : i)));
        setEditedItems((prev) => {
          const { [id]: _, ...remaining } = prev;
          return remaining;
        });
      } else {
        alert("Failed to save menu item: " + result.error);
      }
    }
  };

  const handleInputChange = (id: string, field: string, value: string) => {
    setEditedItems((prev) => ({
      ...prev,
      [id]: {
        ...weeklyMenu.find((item) => item.id === id)!,
        [field]: value,
      },
    }));
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Day</TableHead>
            <TableHead>Vegetarian Items</TableHead>
            <TableHead>Non-Vegetarian Items</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {weeklyMenu.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{DAYS[item.day_of_week]}</TableCell>
              <TableCell>
                <Input
                  value={editedItems[item.id]?.veg_items ?? item.veg_items}
                  onChange={(e) =>
                    handleInputChange(item.id, "veg_items", e.target.value)
                  }
                />
              </TableCell>
              <TableCell>
                <Input
                  value={
                    editedItems[item.id]?.non_veg_items ?? item.non_veg_items
                  }
                  onChange={(e) =>
                    handleInputChange(item.id, "non_veg_items", e.target.value)
                  }
                />
              </TableCell>
              <TableCell>
                <Button onClick={() => handleSaveItem(item.id)}>Save</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
