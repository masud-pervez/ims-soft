"use client";

import { Loader2 } from "lucide-react";

import { AdminDashboard } from "@/components/dashboard/admin-dashboard";
import { StaffDashboard } from "@/components/dashboard/staff-dashboard";
import { useUserStore } from "@/store/user-store";

export default function DashboardPage() {
  const { user, _hasHydrated } = useUserStore();

  // Show loading spinner if store hasn't hydrated or user data is missing but we're theoretically logged in (handled by middleware usually, but UI safety here)
  if (!_hasHydrated) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    // This state should ideally be handled by middleware redirect,
    // but as a fallback, we render a message or could router.push('/login')
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Access Denied</h2>
          <p className="text-muted-foreground">
            Please log in to view the dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {["admin", "SUPER_ADMIN", "ADMIN"].includes(user.role) ? (
        <AdminDashboard />
      ) : (
        <StaffDashboard />
      )}
    </div>
  );
}
