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
      isAuthenticated: false,
      _hasHydrated: false,

      actions: {
        setUser: (user) =>
          set({
            user,
            isAuthenticated: true,
          }),
        setToken: (token) =>
          set({
            token,
          }),
        clearUser: () =>
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          }),
        updateUser: (updates) =>
          set((state) => ({
            user: state.user ? { ...state.user, ...updates } : null,
          })),
        hasPermission: (permission: string) => {
          const { user } = get();
          // Assuming permissions might be an object or array based on backend,
          // adjusting strictly to backend 'permissions: {}' (object) check if needed.
          // Since backend uses object for permissions, we need to know the specific structure
          // to implement strictly. For now, checking if key exists or similar if it's a map.
          // However, previous code assumed string array.
          // Backend `userModel.js` line 15 defines `permissions = {}`.
          // Let's assume for now simplistic check or keep it flexible.
          // If permissions is an object like { "READ_USER": true }, we check key.
          if (!user?.permissions) return false;
          // Adaptation for object based permissions if applicable, or array.
          // Safe check:
          if (Array.isArray(user.permissions)) {
            return user.permissions.includes(permission);
          } else if (typeof user.permissions === "object") {
            return !!(user.permissions as Record<string, unknown>)[permission];
          }
          return false;
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
        isAuthenticated: state.isAuthenticated,
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
      isAuthenticated: state.isAuthenticated,
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
      isAuthenticated: false,
      _hasHydrated: false,
    };
  }

  return storeData;
};

export const useUserActions = (): UserStoreActions =>
  useStore((state) => state.actions);

export const getAuthToken = (): string | null => {
  const token = useStore.getState().token;
  if (token) return token;

  // Fallback: Try reading directly from localStorage if store hasn't hydrated yet
  if (typeof window !== "undefined") {
    try {
      const storageStr = localStorage.getItem("user-storage");
      if (storageStr) {
        const storage = JSON.parse(storageStr);
        return storage.state?.token || null;
      }
    } catch (e) {
      console.error("Error reading token from localStorage:", e);
    }
  }

  return null;
};

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
