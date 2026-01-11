import api from "@/lib/axios";
import { ProfitLossReport, DailyLedgerReport } from "@/types/api";

export const reportApi = {
  getProfitLoss: async (params?: { startDate?: string; endDate?: string }) => {
    const response = await api.get<ProfitLossReport>("/reports/profit-loss", {
      params,
    });
    return response.data;
  },
  getDailyLedger: async (params?: { date?: string }) => {
    const response = await api.get<DailyLedgerReport>("/reports/daily-ledger", {
      params,
    });
    return response.data;
  },
};
