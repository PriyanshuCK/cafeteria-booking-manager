"use client";

import { useState } from "react";
import { User } from "../lib/definitions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { editUser } from "../lib/actions";

interface EditUserDialogProps {
  user: User;
  onUpdate: (updatedUser: User) => void;
}

export function EditUserDialog({ user, onUpdate }: EditUserDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(user);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await editUser(formData);
    if (result.success) {
      onUpdate(formData);
      setIsOpen(false);
    } else {
      alert("Failed to update user: " + result.error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right">
                Name
              </label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="email" className="text-right">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="is_admin" className="text-right">
                Is Admin
              </label>
              <Checkbox
                id="is_admin"
                checked={formData.is_admin}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_admin: checked as boolean })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="is_vegetarian" className="text-right">
                Is Vegetarian
              </label>
              <Checkbox
                id="is_vegetarian"
                checked={formData.is_vegetarian}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    is_vegetarian: checked as boolean,
                  })
                }
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit">Save changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
