import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Contact,
  CreditCard,
  BarChart3,
  Settings,
  List,
  LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  href?: string;
  icon?: LucideIcon;
  badge?: string;
  badgeColor?: string;
  children?: NavItem[];
  isExternal?: boolean;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const navRoutes: NavGroup[] = [
  {
    label: "Main",
    items: [
      {
        title: "Overview",
        href: "/overview",
        icon: LayoutDashboard,
      },
      {
        title: "Users",
        href: "/users",
        icon: Users,
      },
      {
        title: "Inventory",
        href: "/inventory",
        icon: Package,
        children: [
          {
            title: "Product List",
            href: "/inventory",
            icon: List,
          },
          {
            title: "Stock",
            href: "/inventory/stock",
            // You can add an icon if you wish, or keep it text-only for sub-items
          },
        ],
      },
      {
        title: "Orders",
        href: "/orders",
        icon: ShoppingCart,
      },
      {
        title: "Customers",
        href: "/customers",
        icon: Contact,
      },
      {
        title: "Finance",
        href: "/finance",
        icon: CreditCard,
      },
      {
        title: "Reports",
        href: "/reports",
        icon: BarChart3,
      },
    ],
  },
  {
    label: "System",
    items: [
      {
        title: "Settings",
        href: "/settings",
        icon: Settings,
      },
    ],
  },
];
