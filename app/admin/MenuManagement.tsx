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
import { Badge } from "@/components/ui/badge";
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

  const parseItems = (items: string) =>
    items.split(";").map((item) => item.trim());

  const stringifyItems = (items: string[]) => items.join(";");

  const handleSaveItem = async (id: string) => {
    const item = editedItems[id];
    if (item) {
      const result = await editMenuItem(item);
      if (result.success) {
        setWeeklyMenu(weeklyMenu.map((i) => (i.id === item.id ? item : i)));
        setEditedItems((prev) => {
          const { [id]: _, ...remaining } = prev; // eslint-disable-line @typescript-eslint/no-unused-vars
          return remaining;
        });
      } else {
        alert("Failed to save menu item: " + result.error);
      }
    }
  };

  const handleAddDish = (
    id: string,
    field: "veg_items" | "non_veg_items",
    value: string
  ) => {
    const updatedMenu = {
      ...weeklyMenu.find((item) => item.id === id)!,
      [field]: stringifyItems([
        ...parseItems(
          editedItems[id]?.[field] ??
            weeklyMenu.find((item) => item.id === id)![field]
        ),
        value,
      ]),
    };
    setEditedItems((prev) => ({ ...prev, [id]: updatedMenu }));
  };

  const handleRemoveDish = (
    id: string,
    field: "veg_items" | "non_veg_items",
    dish: string
  ) => {
    const updatedMenu = {
      ...weeklyMenu.find((item) => item.id === id)!,
      [field]: stringifyItems(
        parseItems(
          editedItems[id]?.[field] ??
            weeklyMenu.find((item) => item.id === id)![field]
        ).filter((item) => item !== dish)
      ),
    };
    setEditedItems((prev) => ({ ...prev, [id]: updatedMenu }));
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
                <div className="flex flex-wrap gap-2">
                  {parseItems(
                    editedItems[item.id]?.veg_items ?? item.veg_items
                  ).map((dish) =>
                    dish !== "" ? (
                      <Badge
                        key={dish}
                        className="cursor-pointer"
                        onClick={() =>
                          handleRemoveDish(item.id, "veg_items", dish)
                        }
                        variant={"outline"}
                      >
                        {dish} ⨯
                      </Badge>
                    ) : null
                  )}
                </div>
                <Input
                  placeholder="Add a veg dish & press Enter"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.currentTarget.value.trim()) {
                      handleAddDish(
                        item.id,
                        "veg_items",
                        e.currentTarget.value.trim()
                      );
                      e.currentTarget.value = "";
                    }
                  }}
                  className={"mt-3"}
                />
              </TableCell>

              <TableCell>
                <div className="flex flex-wrap gap-2">
                  {parseItems(
                    editedItems[item.id]?.non_veg_items ?? item.non_veg_items
                  ).map((dish) =>
                    dish !== "" ? (
                      <Badge
                        key={dish}
                        className="cursor-pointer"
                        onClick={() =>
                          handleRemoveDish(item.id, "non_veg_items", dish)
                        }
                        variant={"outline"}
                      >
                        {dish} ⨯
                      </Badge>
                    ) : null
                  )}
                </div>
                <Input
                  placeholder="Add a non-veg dish & press Enter"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.currentTarget.value.trim()) {
                      handleAddDish(
                        item.id,
                        "non_veg_items",
                        e.currentTarget.value.trim()
                      );
                      e.currentTarget.value = "";
                    }
                  }}
                  className={"mt-3"}
                />
              </TableCell>

              {/* Save Button */}
              <TableCell>
                <Button
                  onClick={() => handleSaveItem(item.id)}
                  disabled={!editedItems[item.id]} // Disable if no changes
                >
                  Save
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
