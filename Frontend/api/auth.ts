import api from "@/lib/axios";
import { LoginPayload, RegisterPayload, AuthResponse } from "@/types/api";

export const authApi = {
  login: async (data: LoginPayload) => {
    const response = await api.post<AuthResponse>("/auth/login", data);
    return response.data;
  },
  register: async (data: RegisterPayload) => {
    const response = await api.post<AuthResponse>("/auth/register", data);
    return response.data;
  },
  logout: async () => {
    // Optional: Call logout endpoint if exists
    // await api.post("/auth/logout");
  },
  getCurrentUser: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },
};
