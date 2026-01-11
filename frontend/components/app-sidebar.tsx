"use client";

import { useSidebarStore } from "@/store/sidebar-store";
import { navRoutes, NavItem } from "@/lib/navroute";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, useState } from "react";
import {
  ChevronDown,
  ChevronsUpDown,
  LogOut,
  Settings,
  Sparkles,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { clearAuthToken } from "@/store/user-store";

export function AppSidebar() {
  const { isOpen } = useSidebarStore();
  const pathname = usePathname();

  return (
    <aside
      data-state={isOpen ? "expanded" : "collapsed"}
      className={cn(
        "group/sidebar relative flex h-svh bg-zinc-50 dark:bg-zinc-950 flex-col gap-2 transition-[width] duration-300 ease-in-out border-r",
        isOpen ? "w-64" : "w-[calc(3.5rem+1px)]"
      )}
    >
      {/* Sidebar Header */}
      <div className="flex flex-col gap-2 p-2">
        <ul className="flex w-full min-w-0 flex-col gap-1">
          <li className="relative">
            <Button
              variant="ghost"
              className={cn(
                "flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800",
                isOpen ? "px-2" : "px-0 justify-center"
              )}
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold">
                IMS
              </div>
              {isOpen && (
                <div className="flex flex-1 items-center justify-between">
                  <span className="font-semibold truncate">IMS Pro</span>
                </div>
              )}
            </Button>
          </li>
        </ul>
      </div>

      {/* Sidebar Content */}
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-4 p-2">
          {navRoutes.map((group, index) => (
            <div key={index} className="flex flex-col gap-1">
              {isOpen && (
                <div className="px-2 text-xs font-semibold text-muted-foreground/70 mb-2">
                  {group.label}
                </div>
              )}
              {group.items.map((item, itemIndex) => (
                <SidebarItem
                  key={itemIndex}
                  item={item}
                  isOpen={isOpen}
                  pathname={pathname}
                />
              ))}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Sidebar Footer */}
      <div className="p-2 border-t">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "h-auto w-full justify-start gap-2 px-2 hover:bg-zinc-100 dark:hover:bg-zinc-800",
                !isOpen && "justify-center px-0"
              )}
            >
              <Avatar className="h-8 w-8 rounded-lg">
                {/* <AvatarImage src="/images/avatars/01.png" alt="User" /> */}
                <AvatarFallback className="rounded-lg">US</AvatarFallback>
              </Avatar>
              {isOpen && (
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">User Name</span>
                  <span className="truncate text-xs text-muted-foreground">
                    user@example.com
                  </span>
                </div>
              )}
              {isOpen && <ChevronsUpDown className="ml-auto size-4" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56"
            side={isOpen ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">User Name</p>
                <p className="text-xs leading-none text-muted-foreground">
                  user@example.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Sparkles className="mr-2 size-4" />
              Upgrade to Pro
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="mr-2 size-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-950/20"
              onClick={() => {
                clearAuthToken();
                window.location.href = "/login";
              }}
            >
              <LogOut className="mr-2 size-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}

function SidebarItem({
  item,
  isOpen,
  pathname,
}: {
  item: NavItem;
  isOpen: boolean;
  pathname: string;
}) {
  const isActive = item.href ? pathname === item.href : false;
  const hasChildren = item.children && item.children.length > 0;
  const [isExpanded, setIsExpanded] = useState(false);

  // If collapsed, we show tooltips or just icons (simplified for now)
  // For the purpose of this task, we focus on the structure.

  if (hasChildren) {
    return (
      <Collapsible
        open={isOpen ? isExpanded : false}
        onOpenChange={setIsExpanded}
        className="group/collapsible"
      >
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-2 px-2 hover:bg-zinc-100 dark:hover:bg-zinc-800",
              !isOpen && "justify-center px-0"
            )}
          >
            {item.icon && <item.icon className="size-4 shrink-0" />}
            {isOpen && (
              <>
                <span className="flex-1 text-left text-sm font-medium truncate">
                  {item.title}
                </span>
                <ChevronDown
                  className={cn(
                    "size-4 shrink-0 transition-transform duration-200",
                    isExpanded ? "rotate-180" : ""
                  )}
                />
              </>
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
          {isOpen && (
            <div className="ml-4 mt-1 flex flex-col gap-1 border-l py-1 pl-2">
              {item.children?.map((child, index) => (
                <Link
                  key={index}
                  href={child.href || "#"}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md p-2 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800",
                    pathname === child.href
                      ? "bg-zinc-100 dark:bg-zinc-800 text-indigo-600"
                      : "text-muted-foreground"
                  )}
                >
                  {child.title}
                </Link>
              ))}
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <Button
      asChild
      variant="ghost"
      className={cn(
        "w-full justify-start gap-2 px-2 hover:bg-zinc-100 dark:hover:bg-zinc-800",
        isActive && "bg-zinc-100 dark:bg-zinc-800 text-indigo-600",
        !isOpen && "justify-center px-0"
      )}
    >
      <Link href={item.href || "#"}>
        {item.icon && <item.icon className="size-4 shrink-0" />}
        {isOpen && (
          <span className="flex-1 text-left text-sm font-medium truncate">
            {item.title}
          </span>
        )}
        {isOpen && item.badge && (
          <span
            className={cn(
              "text-[10px] border px-1 rounded-sm",
              item.badgeColor
                ? item.badgeColor
                : "text-zinc-500 border-zinc-200"
            )}
          >
            {item.badge}
          </span>
        )}
      </Link>
    </Button>
  );
}
