"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/common/data-table/data-table";
import { columns } from "./components/user-columns";
import { UserFormDialog } from "./components/user-form-dialog";
import { UserPermissionsDialog } from "./components/user-permissions-dialog";
import { useFetchData } from "@/hooks/useFetchData";
import { User } from "@/types/api";
import { userApi } from "@/api/endpoint/user-api";

const UsersPage = () => {
  const [openUserSheet, setOpenUserSheet] = useState(false);
  const [openPermissionSheet, setOpenPermissionSheet] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Fetch users
  const {
    data: users = [],
    isLoading,
    isError,
  } = useFetchData<User[]>({
    url: userApi.GET_ALL,
  });

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setOpenUserSheet(true);
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setOpenUserSheet(true);
  };

  // Permission handling would typically be triggered from the action menu.
  // However, my columns definition handles the action menu rendering.
  // I need to pass a handler for permissions to the columns as well.
  // I previously defined `columns` to take `onEdit`. I should update it to take `onPermissions` too.
  // Or better, I can keep state logic inside the action menu? No, ideally state is lifted.
  // Let's see how I implemented `user-columns.tsx`.
  // It takes `onEdit`. I likely need to update `user-columns.tsx` and `user-action-menu.tsx` to support `onPermissions`.

  // For now, let's proceed and I will update `user-columns.ts` and `user-action-menu.tsx` in a subsequent step to wire up permissions properly.
  // Wait, I can do it right after this file write.

  const handleManagePermissions = (user: User) => {
    setSelectedUser(user);
    setOpenPermissionSheet(true);
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
        <div className="flex items-center space-x-2">
          <Button onClick={handleCreateUser}>
            <Plus className="mr-2 h-4 w-4" /> Add User
          </Button>
        </div>
      </div>
      <div className="hidden h-full flex-1 flex-col space-y-8 md:flex">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <DataTable
            data={users}
            columns={columns(handleEditUser, handleManagePermissions)}
            searchKey="username"
          />
        )}
      </div>

      <UserFormDialog
        open={openUserSheet}
        onOpenChange={setOpenUserSheet}
        user={selectedUser}
      />

      <UserPermissionsDialog
        open={openPermissionSheet}
        onOpenChange={setOpenPermissionSheet}
        user={selectedUser}
      />
    </div>
  );
};

export default UsersPage;
