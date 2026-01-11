import api from "@/lib/axios";
import { Order, OrderPayload } from "@/types/api";

export const orderApi = {
  // General order operations
  getAll: async (params?: object) => {
    const response = await api.get<Order[]>("/orders", { params });
    return response.data;
  },
  getOne: async (id: string) => {
    const response = await api.get<Order>(`/orders/${id}`);
    return response.data;
  },
  create: async (data: OrderPayload) => {
    const response = await api.post<Order>("/orders", data);
    return response.data;
  },

  // Sales orders
  sales: {
    getAll: async (params?: object) => {
      const response = await api.get<Order[]>("/orders/sales", { params });
      return response.data;
    },
    create: async (data: OrderPayload) => {
      const response = await api.post<Order>("/orders/sales", data);
      return response.data;
    },
    update: async (id: string, data: Partial<OrderPayload>) => {
      const response = await api.put<Order>(`/orders/sales/${id}`, data);
      return response.data;
    },
  },

  // Purchase orders
  purchase: {
    getAll: async (params?: object) => {
      const response = await api.get<Order[]>("/orders/purchase", { params });
      return response.data;
    },
    create: async (data: OrderPayload) => {
      const response = await api.post<Order>("/orders/purchase", data);
      return response.data;
    },
    update: async (id: string, data: Partial<OrderPayload>) => {
      const response = await api.put<Order>(`/orders/purchase/${id}`, data);
      return response.data;
    },
  },

  // Returns
  returns: {
    createSalesReturn: async (data: OrderPayload) => {
      const response = await api.post<Order>("/returns/sales", data);
      return response.data;
    },
    createPurchaseReturn: async (data: OrderPayload) => {
      const response = await api.post<Order>("/returns/purchase", data);
      return response.data;
    },
  },
};
