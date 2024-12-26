"use client";

import { useState } from "react";
import { User } from "../lib/definitions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { deleteUsers, resetUserPasswords } from "../lib/actions";
import { EditUserDialog } from "./EditUserDialog";
import { useToast } from "@/hooks/use-toast";

export function UserTable({ users: initialUsers }: { users: User[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectUser = (userId: string) => {
    setSelectedUsers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedUsers.size === filteredUsers.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(filteredUsers.map((user) => user.id)));
    }
  };

  const handleDeleteUsers = async () => {
    if (
      confirm(
        "Are you sure you want to delete the selected users? This will also delete all their bookings."
      )
    ) {
      const result = await deleteUsers(Array.from(selectedUsers));
      if (result.success) {
        setUsers(users.filter((user) => !selectedUsers.has(user.id)));
        setSelectedUsers(new Set());
        toast({
          title: "Users deleted",
          description: "Selected users and their bookings have been deleted.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete users: " + result.error,
          variant: "destructive",
        });
      }
    }
  };

  const handleResetPasswords = async () => {
    if (
      confirm(
        "Are you sure you want to reset the passwords for the selected users?"
      )
    ) {
      const result = await resetUserPasswords(Array.from(selectedUsers));
      if (result.success) {
        toast({
          title: "Passwords reset",
          description: "Passwords have been reset successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to reset passwords: " + result.error,
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <Input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <div>
          <Button
            onClick={handleDeleteUsers}
            disabled={selectedUsers.size === 0}
            className="mr-2"
          >
            Delete Selected
          </Button>
          <Button
            onClick={handleResetPasswords}
            disabled={selectedUsers.size === 0}
          >
            Reset Passwords
          </Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={selectedUsers.size === filteredUsers.length}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Is Admin</TableHead>
            <TableHead>Is Vegetarian</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <Checkbox
                  checked={selectedUsers.has(user.id)}
                  onCheckedChange={() => handleSelectUser(user.id)}
                />
              </TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.is_admin ? "Yes" : "No"}</TableCell>
              <TableCell>{user.is_vegetarian ? "Yes" : "No"}</TableCell>
              <TableCell>
                <EditUserDialog
                  user={user}
                  onUpdate={(updatedUser) => {
                    setUsers(
                      users.map((u) =>
                        u.id === updatedUser.id ? updatedUser : u
                      )
                    );
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
