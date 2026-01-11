"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type Theme = "light" | "dark" | "system";

interface ThemeStore {
  theme: Theme;
  actions: {
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
  };
}

const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: "system",
      actions: {
        setTheme: (theme: Theme) => set({ theme }),
        toggleTheme: () => {
          const currentTheme = get().theme;
          const nextTheme: Theme =
            currentTheme === "light"
              ? "dark"
              : currentTheme === "dark"
              ? "system"
              : "light";
          set({ theme: nextTheme });
        },
      },
    }),
    {
      name: "theme-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
      }),
    }
  )
);

export const useTheme = () => useThemeStore((state) => state.theme);
export const useThemeActions = () => useThemeStore((state) => state.actions);

export { useThemeStore };
