import {
  LayoutDashboard,
  PlusCircle,
  ShoppingCart,
  Truck,
  CreditCard,
  Layers,
  BarChart3,
  Activity,
  Users,
} from "lucide-react";
import { UserRole } from "../types";

export interface NavItem {
  to: string;
  icon: any;
  label: string;
  roles: UserRole[];
}

export const NAV_ITEMS: NavItem[] = [
  {
    to: "/",
    icon: LayoutDashboard,
    label: "Dashboard",
    roles: [UserRole.ADMIN, UserRole.ORDER_RECEIVER, UserRole.DELIVERY_MANAGER],
  },
  {
    to: "/orders",
    icon: PlusCircle,
    label: "New Order",
    roles: [UserRole.ADMIN, UserRole.ORDER_RECEIVER],
  },
  {
    to: "/order-list",
    icon: ShoppingCart,
    label: "All Orders",
    roles: [UserRole.ADMIN, UserRole.ORDER_RECEIVER, UserRole.DELIVERY_MANAGER],
  },
  {
    to: "/purchases",
    icon: Truck,
    label: "Stock Purchases",
    roles: [UserRole.ADMIN],
  },
  {
    to: "/expenses",
    icon: CreditCard,
    label: "Expenditure",
    roles: [UserRole.ADMIN, UserRole.DELIVERY_MANAGER],
  },
  {
    to: "/inventory",
    icon: Layers,
    label: "Inventory & Cat",
    roles: [UserRole.ADMIN],
  },
  {
    to: "/reports",
    icon: BarChart3,
    label: "BI Reporting",
    roles: [UserRole.ADMIN],
  },
  {
    to: "/audit-network",
    icon: Activity,
    label: "Audit Network",
    roles: [UserRole.ADMIN],
  },
  {
    to: "/users",
    icon: Users,
    label: "Team Management",
    roles: [UserRole.ADMIN],
  },
];
