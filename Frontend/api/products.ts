import api from "@/lib/axios";
import { Product, ProductPayload, Category } from "@/types/api";

export const productApi = {
  getAll: async (params?: object) => {
    const response = await api.get<Product[]>("/products", { params });
    return response.data;
  },
  getOne: async (id: string) => {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },
  create: async (data: ProductPayload) => {
    const response = await api.post<Product>("/products", data);
    return response.data;
  },
  update: async (id: string, data: Partial<ProductPayload>) => {
    const response = await api.put<Product>(`/products/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
  getCategories: async () => {
    const response = await api.get<Category[]>("/categories");
    return response.data;
  },
};
