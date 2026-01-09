import api from "./api";

export const authService = {
  login: async (credentials: any) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  register: async (userData: any) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  getCurrentUser: async () => {
    // Assuming you have an endpoint to get current user details
    // If not, we might decoding JWT or relying on login response
    // For now, let's assume we decode from token or store user in localstorage
    return JSON.parse(localStorage.getItem("user") || "null");
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};
