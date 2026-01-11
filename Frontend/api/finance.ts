import api from "@/lib/axios";
import { Income, IncomePayload, Expense, ExpensePayload } from "@/types/api";

export const financeApi = {
  // Income operations
  income: {
    getAll: async (params?: object) => {
      const response = await api.get<Income[]>("/expenses/income", { params });
      return response.data;
    },
    create: async (data: IncomePayload) => {
      const response = await api.post<Income>("/expenses/income", data);
      return response.data;
    },
    delete: async (id: string) => {
      const response = await api.delete(`/expenses/income/${id}`);
      return response.data;
    },
  },

  // Expense operations
  expense: {
    getAll: async (params?: object) => {
      const response = await api.get<Expense[]>("/expenses", { params });
      return response.data;
    },
    create: async (data: ExpensePayload) => {
      const response = await api.post<Expense>("/expenses", data);
      return response.data;
    },
    delete: async (id: string) => {
      const response = await api.delete(`/expenses/${id}`);
      return response.data;
    },
  },
};
