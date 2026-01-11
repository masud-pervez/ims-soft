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
  name: string;
  email: string;
  role: "admin" | "staff" | "SUPER_ADMIN" | "ADMIN";
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
  success: boolean;
  message: string;
  data: T;
  meta?: {
    pagination?: Pagination;
  };
}
