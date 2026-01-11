import api from "@/lib/axios";
import { Supplier, SupplierPayload, Order } from "@/types/api";

export const supplierApi = {
  getAll: async (params?: object) => {
    const response = await api.get<Supplier[]>("/suppliers", { params });
    return response.data;
  },
  getOne: async (id: string) => {
    const response = await api.get<Supplier>(`/suppliers/${id}`);
    return response.data;
  },
  create: async (data: SupplierPayload) => {
    const response = await api.post<Supplier>("/suppliers", data);
    return response.data;
  },
  update: async (id: string, data: Partial<SupplierPayload>) => {
    const response = await api.put<Supplier>(`/suppliers/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/suppliers/${id}`);
    return response.data;
  },
  getPurchases: async (id: string) => {
    const response = await api.get<Order[]>(`/suppliers/${id}/purchases`);
    return response.data;
  },
};
