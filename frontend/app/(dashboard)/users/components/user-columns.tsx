"use client";

import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/types/api";
// Since I haven't created the header yet, I should remove this import and use the simplified version.
// Or I should create the header. I mentioned I would use simplified version.
// So I will remove this import.

import { UserActionMenu } from "./user-action-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

// Creating a simple column header since I didn't create the reusable one in common yet
// Correction: I should probably create the reusable column header to allow sorting
// For now I'll implement a simple one inline or I can create the missing component.
// Let's create `data-table-column-header.tsx` in common first as it's better practice.
// But since I am in `user-columns.tsx` creation step, and I cannot create two files in one step unless using tool calls properly.
// I'll stick to simple headers for now or I can assume I'll create it.
// Let's assume I will create `data-table-column-header.tsx` right after this or use a simplified version.
// I will use a simplified version here.

export const columns = (
  onEdit: (user: User) => void,
  onPermissions: (user: User) => void
): ColumnDef<User>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value: boolean) =>
          table.toggleAllPageRowsSelected(!!value)
        }
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "username",
    header: "Username",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("username")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      return <Badge variant="outline">{role}</Badge>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <UserActionMenu
        user={row.original}
        onEdit={onEdit}
        onPermissions={onPermissions}
      />
    ),
  },
];
