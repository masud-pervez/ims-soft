import api from "@/lib/axios";
import { User, UserPermissionsPayload, UserStatusPayload } from "@/types/api";

export const userApi = {
  getAll: async (params?: object) => {
    const response = await api.get<User[]>("/users", { params });
    return response.data;
  },
  getOne: async (id: string) => {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },
  create: async (data: {
    username: string;
    email: string;
    password: string;
    role?: string;
  }) => {
    const response = await api.post<User>("/users", data);
    return response.data;
  },
  update: async (
    id: string,
    data: Partial<{
      username: string;
      email: string;
      password: string;
      role: string;
    }>
  ) => {
    const response = await api.put<User>(`/users/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
  updatePermissions: async (id: string, data: UserPermissionsPayload) => {
    const response = await api.put<User>(`/users/${id}/permissions`, data);
    return response.data;
  },
  updateStatus: async (id: string, data: UserStatusPayload) => {
    const response = await api.put<User>(`/users/${id}/status`, data);
    return response.data;
  },
};
