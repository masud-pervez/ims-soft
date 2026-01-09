import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "../services/apiService";
import {
  Order,
  Product,
  Category,
  Expense,
  Purchase,
  AuditLog,
  OrderStatus,
  User,
} from "../types";

// Keys
export const QUERY_KEYS = {
  products: ["products"],
  categories: ["categories"],
  orders: ["orders"],
  expenses: ["expenses"],
  purchases: ["purchases"],
  auditLogs: ["auditLogs"],
  health: ["health"],
};

// Health Check
export const useHealthCheck = () => {
  return useQuery({
    queryKey: QUERY_KEYS.health,
    queryFn: apiService.checkHealth,
    refetchInterval: 30000, // Sync every 30s as in original App.tsx
  });
};

// Products
export const useProducts = () => {
  return useQuery({
    queryKey: QUERY_KEYS.products,
    queryFn: apiService.getProducts,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: apiService.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: apiService.updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: apiService.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products });
    },
  });
};

// Categories
export const useCategories = () => {
  return useQuery({
    queryKey: QUERY_KEYS.categories,
    queryFn: apiService.getCategories,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: apiService.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      apiService.updateCategory(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: apiService.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories });
    },
  });
};

// Orders
export const useOrders = () => {
  return useQuery({
    queryKey: QUERY_KEYS.orders,
    queryFn: apiService.getOrders,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: apiService.createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders });
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
      changedBy,
    }: {
      id: string;
      status: OrderStatus;
      changedBy: string;
    }) => apiService.updateOrderStatus(id, status, changedBy),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders });
    },
  });
};

export const useRecordPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      orderId,
      paymentData,
    }: {
      orderId: string;
      paymentData: {
        amount: number;
        method: string;
        transactionId: string;
        receivedBy: string;
      };
    }) => apiService.recordPayment(orderId, paymentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders });
    },
  });
};

// Expenses
export const useExpenses = () => {
  return useQuery({
    queryKey: QUERY_KEYS.expenses,
    queryFn: apiService.getExpenses,
  });
};

export const useCreateExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: apiService.createExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.expenses });
    },
  });
};

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: apiService.deleteExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.expenses });
    },
  });
};

// Purchases
export const usePurchases = () => {
  return useQuery({
    queryKey: QUERY_KEYS.purchases,
    queryFn: apiService.getPurchases,
  });
};

export const useCreatePurchase = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: apiService.createPurchase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.purchases });
    },
  });
};

// Audit Logs
export const useAuditLogs = () => {
  return useQuery({
    queryKey: QUERY_KEYS.auditLogs,
    queryFn: apiService.getAuditLogs,
  });
};

export const useBackup = () => {
  return useMutation({
    mutationFn: apiService.downloadBackup,
  });
};
