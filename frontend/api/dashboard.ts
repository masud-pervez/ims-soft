// import axiosInstance from "@/lib/axios";

// Mock Data Types
export interface DashboardStats {
  totalRevenue: number;
  revenueChange: number; // percentage
  totalOrders: number;
  ordersChange: number;
  lowStockCount: number;
  activeUsers: number;
}

export interface ChartData {
  name: string;
  total: number;
}

export interface RecentOrder {
  id: string;
  customer: string;
  amount: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  date: string;
}

// Mock Data
const MOCK_ADMIN_STATS: DashboardStats = {
  totalRevenue: 45231.89,
  revenueChange: 20.1,
  totalOrders: 2350,
  ordersChange: 180.1,
  lowStockCount: 12,
  activeUsers: 573,
};

const MOCK_STAFF_STATS: DashboardStats = {
  totalRevenue: 1200.0, // Maybe daily sales for staff
  revenueChange: 5.4,
  totalOrders: 45,
  ordersChange: 12,
  lowStockCount: 12,
  activeUsers: 0,
};

const MOCK_CHART_DATA: ChartData[] = [
  { name: "Jan", total: 1500 },
  { name: "Feb", total: 2300 },
  { name: "Mar", total: 3400 },
  { name: "Apr", total: 2900 },
  { name: "May", total: 4500 },
  { name: "Jun", total: 5200 },
];

const MOCK_RECENT_ORDERS: RecentOrder[] = [
  {
    id: "ORD-001",
    customer: "John Doe",
    amount: 250.0,
    status: "completed",
    date: "2023-10-25",
  },
  {
    id: "ORD-002",
    customer: "Jane Smith",
    amount: 120.5,
    status: "processing",
    date: "2023-10-25",
  },
  {
    id: "ORD-003",
    customer: "Bob Johnson",
    amount: 450.0,
    status: "pending",
    date: "2023-10-24",
  },
  {
    id: "ORD-004",
    customer: "Alice Brown",
    amount: 85.0,
    status: "completed",
    date: "2023-10-24",
  },
  {
    id: "ORD-005",
    customer: "Charlie Wilson",
    amount: 300.0,
    status: "cancelled",
    date: "2023-10-23",
  },
];

export const dashboardApi = {
  getAdminStats: async (): Promise<DashboardStats> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return MOCK_ADMIN_STATS;
  },
  getStaffStats: async (): Promise<DashboardStats> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return MOCK_STAFF_STATS;
  },
  getRevenueChartData: async (): Promise<ChartData[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return MOCK_CHART_DATA;
  },
  getRecentOrders: async (): Promise<RecentOrder[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return MOCK_RECENT_ORDERS;
  },
};
