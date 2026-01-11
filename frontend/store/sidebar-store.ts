import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface SidebarStore {
  isOpen: boolean;
  isHover: boolean;
  isMobileOpen: boolean;
  toggleSidebar: () => void;
  setSidebarState: (isOpen: boolean) => void;
  setHoverState: (isHover: boolean) => void;
  setMobileOpen: (isOpen: boolean) => void;
}

export const useSidebarStore = create<SidebarStore>()(
  persist(
    (set) => ({
      isOpen: true,
      isHover: false,
      isMobileOpen: false,
      toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),
      setSidebarState: (isOpen) => set({ isOpen }),
      setHoverState: (isHover) => set({ isHover }),
      setMobileOpen: (isMobileOpen) => set({ isMobileOpen }),
    }),
    {
      name: "sidebar-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
