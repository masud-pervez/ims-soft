"use client";

import { useEffect } from "react";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useShallow } from "zustand/shallow";

import { clearAllCookies } from "../lib/auth-utils";

import type { UserStore, UserStoreActions } from "../types/user-store.types";

const useStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      organization: null,
      jobRole: null,
      employeeId: null,
      practitionerId: null,
      _hasHydrated: false,

      actions: {
        setOrganization: (organization) => set({ organization }),
        clearOrganization: () => set({ organization: null }),
        setJobRole: (jobRole) => set({ jobRole }),
        clearJobRole: () => set({ jobRole: null }),
        setEmployeeId: (employeeId) => set({ employeeId }),
        clearEmployeeId: () => set({ employeeId: null }),
        setPractitionerId: (practitionerId) => set({ practitionerId }),
        clearPractitionerId: () => set({ practitionerId: null }),
        setUser: (user) =>
          set({
            user,
            isAuthenticated: true,
          }),
        setTokens: (token, refreshToken) =>
          set({
            token,
            refreshToken,
          }),
        clearUser: () =>
          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            organization: null,
            jobRole: null,
            employeeId: null,
            practitionerId: null,
          }),
        updateUser: (updates) =>
          set((state) => ({
            user: state.user ? { ...state.user, ...updates } : null,
          })),
        hasPermission: (permission: string) => {
          const { user } = get();
          return user?.permissions?.includes(permission) ?? false;
        },
        hasRole: (role: string) => {
          const { user } = get();
          return user?.role === role;
        },
        setHasHydrated: (state) => {
          set({
            _hasHydrated: state,
          });
        },
      },
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        organization: state.organization,
        jobRole: state.jobRole,
        employeeId: state.employeeId,
        practitionerId: state.practitionerId,
      }),
      skipHydration: true,
      onRehydrateStorage: () => (state) => {
        state?.actions.setHasHydrated(true);
      },
    }
  )
);

export const useUserStore = () => {
  const storeData = useStore(
    useShallow((state) => ({
      user: state.user,
      token: state.token,
      refreshToken: state.refreshToken,
      isAuthenticated: state.isAuthenticated,
      organization: state.organization,
      jobRole: state.jobRole,
      employeeId: state.employeeId,
      practitionerId: state.practitionerId,
      _hasHydrated: state._hasHydrated,
    }))
  );

  useEffect(() => {
    if (!useStore.persist.hasHydrated()) {
      useStore.persist.rehydrate();
    }
  }, []);

  if (!storeData._hasHydrated) {
    return {
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      organization: null,
      jobRole: null,
      employeeId: null,
      practitionerId: null,
      _hasHydrated: false,
    };
  }

  return storeData;
};

export const useUserActions = (): UserStoreActions =>
  useStore((state) => state.actions);
export const useOrganizationActions = (): UserStoreActions =>
  useStore((state) => state.actions);

export const getAuthToken = (): string | null => useStore.getState().token;

export const clearAuthToken = (): void => {
  const { clearUser } = useStore.getState().actions;
  clearUser();

  // Also clear browser cookies to prevent infinite redirect loops
  // when authentication fails (e.g., after backend database reset)
  if (typeof window !== "undefined") {
    clearAllCookies();
  }
};

export { useStore };
