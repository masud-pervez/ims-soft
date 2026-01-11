import api from "@/lib/axios";
import { Customer, CustomerPayload, Order } from "@/types/api";

export const customerApi = {
  getAll: async (params?: object) => {
    const response = await api.get<Customer[]>("/customers", { params });
    return response.data;
  },
  getOne: async (id: string) => {
    const response = await api.get<Customer>(`/customers/${id}`);
    return response.data;
  },
  create: async (data: CustomerPayload) => {
    const response = await api.post<Customer>("/customers", data);
    return response.data;
  },
  update: async (id: string, data: Partial<CustomerPayload>) => {
    const response = await api.put<Customer>(`/customers/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/customers/${id}`);
    return response.data;
  },
  getOrders: async (id: string) => {
    const response = await api.get<Order[]>(`/customers/${id}/orders`);
    return response.data;
  },
};
