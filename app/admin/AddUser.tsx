"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { addUser } from "../lib/actions";

export function AddUser() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    isAdmin: false,
    isVegetarian: false,
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await addUser(formData);
      if (result.success) {
        alert("User added successfully!");
        setFormData({
          name: "",
          email: "",
          password: "",
          isAdmin: false,
          isVegetarian: false,
        });
        setError(null);
      } else {
        setError(result.error || "An error occurred while adding the user.");
      }
    } catch (error) {
      setError("An unexpected error occurred." + error);
    }
  };

  return (
    <Card className="w-fit">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-wrap flex-row gap-4">
            <Input
              name="name"
              placeholder="Name"
              value={formData.name}
              className="max-w-sm"
              onChange={handleChange}
              required
            />
            <Input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              className="max-w-sm"
              onChange={handleChange}
              required
            />
            <Input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              className="max-w-sm"
              onChange={handleChange}
              required
            />
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isAdmin"
                name="isAdmin"
                checked={formData.isAdmin}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    isAdmin: checked as boolean,
                  }))
                }
              />
              <label htmlFor="isAdmin">Is Admin</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isVegetarian"
                name="isVegetarian"
                checked={formData.isVegetarian}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    isVegetarian: checked as boolean,
                  }))
                }
              />
              <label htmlFor="isVegetarian">Is Vegetarian</label>
            </div>
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          <Button type="submit" className="mt-4">
            Add User
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
