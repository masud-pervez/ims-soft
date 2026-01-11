"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AppSidebar } from "@/components/app-sidebar";
import { useSidebarStore } from "@/store/sidebar-store";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { isOpen, toggleSidebar, isMobileOpen, setMobileOpen } =
    useSidebarStore();

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname, setMobileOpen]);

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed inset-y-0 left-0 z-40 bg-background">
        <AppSidebar />
      </div>

      {/* Main Content */}
      <main
        className={cn(
          "flex-1 flex flex-col min-h-screen transition-[margin] duration-300 ease-in-out",
          isOpen ? "lg:ml-64" : "lg:ml-[calc(3.5rem+1px)]"
        )}
      >
        {/* Header */}
        <header className="h-16 px-6 border-b bg-background flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            {/* Mobile Sidebar Trigger */}
            <Sheet open={isMobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="p-0 w-72 border-r-0 bg-background"
              >
                <div className="h-full pointer-events-none">
                  <AppSidebar />
                </div>
              </SheetContent>
            </Sheet>

            {/* Desktop Sidebar Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="hidden lg:flex"
            >
              <PanelLeft className="h-5 w-5" />
            </Button>

            <h1 className="text-xl font-semibold hidden md:block">
              {/* Breadcrumb or Page Title can go here */}
              Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-6 overflow-auto">{children}</div>
      </main>
    </div>
  );
}
