import api from "@/lib/axios";
import { AuditLog } from "@/types/api";

export const auditApi = {
  getAll: async (params?: object) => {
    const response = await api.get<AuditLog[]>("/audit-logs", { params });
    return response.data;
  },
};
