"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useUpdateUserPermissions } from "@/hooks/use-users";
import { User } from "@/types/api";

interface UserPermissionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
}

// Mock permissions list - ideally fetching from backend or defined in constants
const AVAILABLE_PERMISSIONS = [
  { id: "users.view", label: "View Users" },
  { id: "users.create", label: "Create Users" },
  { id: "users.edit", label: "Edit Users" },
  { id: "users.delete", label: "Delete Users" },
  { id: "inventory.view", label: "View Inventory" },
  { id: "inventory.manage", label: "Manage Inventory" },
  { id: "reports.view", label: "View Reports" },
];

export function UserPermissionsDialog({
  open,
  onOpenChange,
  user,
}: UserPermissionsDialogProps) {
  const updatePermissions = useUpdateUserPermissions();
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});

  // Initialize permissions from user object
  useEffect(() => {
    if (open) {
      // Only recalculate if dialog is open to avoid unnecessary work
      const perms: Record<string, boolean> = {};
      AVAILABLE_PERMISSIONS.forEach((p) => (perms[p.id] = false));

      if (user && user.permissions) {
        if (
          typeof user.permissions === "object" &&
          !Array.isArray(user.permissions)
        ) {
          Object.keys(user.permissions).forEach((key) => {
            if (user.permissions[key]) {
              perms[key] = true;
            }
          });
        } else if (Array.isArray(user.permissions)) {
          (user.permissions as string[]).forEach(
            (p: string) => (perms[p] = true)
          );
        }
      }

      // Deep compare to avoid unnecessary re-renders
      // Simple JSON stringify is enough for this flat object
      if (JSON.stringify(permissions) !== JSON.stringify(perms)) {
        setPermissions(perms);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, open]);

  const handleToggle = (id: string, checked: boolean) => {
    setPermissions((prev) => ({
      ...prev,
      [id]: checked,
    }));
  };

  const handleSave = () => {
    if (!user) return;

    updatePermissions.mutate(
      {
        id: user.id,
        data: { permissions },
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage Permissions</DialogTitle>
          <DialogDescription>
            Configure access rights for {user?.username}.
          </DialogDescription>
        </DialogHeader>
        <div className="py-6 space-y-6">
          <div className="space-y-4">
            {AVAILABLE_PERMISSIONS.map((perm) => (
              <div key={perm.id} className="flex items-center justify-between">
                <Label htmlFor={perm.id} className="flex-1 cursor-pointer">
                  {perm.label}
                </Label>
                <Switch
                  id={perm.id}
                  checked={permissions[perm.id] || false}
                  onCheckedChange={(checked: boolean) =>
                    handleToggle(perm.id, checked)
                  }
                />
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave} disabled={updatePermissions.isPending}>
            {updatePermissions.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Save Permissions
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
