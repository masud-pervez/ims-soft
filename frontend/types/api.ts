export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  costPrice: number;
  stock: number;
  minStock: number;
  categoryId: string;
  category?: Category;
  description?: string;
  imageUrl?: string;
  status: "active" | "inactive" | "archived";
  createdAt: string;
  updatedAt: string;
}

export interface ProductPayload {
  name: string;
  sku: string;
  price: number;
  costPrice: number;
  stock: number;
  minStock: number;
  categoryId: string;
  description?: string;
  imageUrl?: string;
  status?: "active" | "inactive" | "archived";
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: "STAFF" | "SUPER_ADMIN" | "ADMIN";
  permissions: Record<string, boolean>;
  created_at?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginPayload {
  email: string;
  password?: string;
  otp?: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  role?: string;
}

export interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success?: boolean;
  status?: boolean;
  message: string;
  data?: T;
  Data?: T;
  status_code?: number;
  meta?: {
    pagination?: Pagination;
  };
  Error?: unknown;
  error_message?: string;
}

// Customer types
export interface Customer {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerPayload {
  name: string;
  phone?: string;
  email?: string;
}

// Supplier types
export interface Supplier {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SupplierPayload {
  name: string;
  phone?: string;
  email?: string;
}

// Category payload type (Category interface already exists)
export interface CategoryPayload {
  name: string;
  description?: string;
}

// Order types
export type OrderType = "SALE" | "PURCHASE" | "SALE_RETURN" | "PURCHASE_RETURN";

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Order {
  id: string;
  type: OrderType;
  date: string;
  customerId?: string;
  supplierId?: string;
  totalAmount: number;
  items?: OrderItem[];
  createdAt: string;
}

export interface OrderPayload {
  type: OrderType;
  date?: string;
  customerId?: string;
  supplierId?: string;
  totalAmount: number;
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
}

// Finance types
export interface Income {
  id: string;
  source: string;
  amount: number;
  date: string;
  createdAt: string;
}

export interface IncomePayload {
  source: string;
  amount: number;
  date?: string;
}

export interface Expense {
  id: string;
  category: string;
  amount: number;
  date: string;
  createdAt: string;
}

export interface ExpensePayload {
  category: string;
  amount: number;
  date?: string;
}

// Report types
export interface ProfitLossReport {
  startDate: string;
  endDate: string;
  totalIncome: number;
  totalExpense: number;
  profitOrLoss: number;
  status: "Profit" | "Loss";
}

export interface DailyLedgerReport {
  date: string;
  incomes: Income[];
  expenses: Expense[];
  summary: {
    totalIncome: number;
    totalExpense: number;
    net: number;
  };
}

// Audit types
export interface AuditLog {
  id: string;
  event: string;
  userId?: string;
  timestamp: string;
}

// User permission and status update types
export interface UserPermissionsPayload {
  permissions: Record<string, boolean>;
}

export interface UserStatusPayload {
  status: "active" | "inactive";
}
