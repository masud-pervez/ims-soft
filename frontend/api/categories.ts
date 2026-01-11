import api from "@/lib/axios";
import { Category, CategoryPayload } from "@/types/api";

export const categoryApi = {
  getAll: async (params?: object) => {
    const response = await api.get<any>("/categories", { params });
    return response.data.Data || [];
  },
  getOne: async (id: string) => {
    const response = await api.get<Category>(`/categories/${id}`);
    return response.data;
  },
  create: async (data: CategoryPayload) => {
    const response = await api.post<Category>("/categories", data);
    return response.data;
  },
  update: async (id: string, data: Partial<CategoryPayload>) => {
    const response = await api.put<Category>(`/categories/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};
