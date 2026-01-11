"use client";

import { MoreHorizontal, Pencil, Trash, Shield } from "lucide-react"; // Shield for permissions
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@/types/api";
import { useDeleteUser } from "@/hooks/use-users";
import { useState } from "react";
// import { UserFormSheet } from "./user-form-sheet" // Will be implemented next

interface UserActionMenuProps {
  user: User;
  onEdit: (user: User) => void;
  onPermissions: (user: User) => void;
}

export function UserActionMenu({
  user,
  onEdit,
  onPermissions,
}: UserActionMenuProps) {
  const deleteUser = useDeleteUser();

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this user?")) {
      deleteUser.mutate(user.id);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onEdit(user)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onPermissions(user)}>
            <Shield className="mr-2 h-4 w-4" />
            Permissions
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleDelete}
            className="text-destructive focus:text-destructive"
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
