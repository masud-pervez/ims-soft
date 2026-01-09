import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Activity,
  User as UserIcon,
  Clock,
  Database,
  AlertCircle,
  Box,
  ShoppingCart,
  CreditCard,
  Layers,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { AuditLog } from "../types";

import { useAuditLogs } from "../hooks/useQueries";

const AuditNetwork: React.FC = () => {
  const { data: logs = [], refetch } = useAuditLogs();
  const queryClient = useQueryClient();

  // onRefresh here maps to refetch or generic invalidation
  const onRefresh = async () => {
    await queryClient.invalidateQueries(); // safer to invalidate all or just refetch
  };
  const getModuleIcon = (module: string) => {
    switch (module) {
      case "Order":
        return <ShoppingCart size={14} />;
      case "Inventory":
        return <Box size={14} />;
      case "Expense":
        return <CreditCard size={14} />;
      case "Category":
        return <Layers size={14} />;
      default:
        return <Database size={14} />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "CREATE":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "DELETE":
        return "bg-rose-100 text-rose-700 border-rose-200";
      case "UPDATE":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "STATUS_CHANGE":
        return "bg-indigo-100 text-indigo-700 border-indigo-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-200">
            <Activity size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Audit Network
            </h2>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
              Real-time state immutable ledger
            </p>
          </div>
        </div>
        <button
          onClick={onRefresh}
          className="flex items-center space-x-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all"
        >
          <RefreshCw size={14} />
          <span>Sync Network</span>
        </button>
      </div>

      <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-10 border-b border-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck size={18} className="text-emerald-500" />
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
              Global Activity Stream
            </span>
          </div>
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">
            Displaying latest 100 entries
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Event Time
                </th>
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Actor
                </th>
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Module
                </th>
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Action
                </th>
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  State Change (Old → New)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {logs.map((log) => {
                const oldState = log.oldState ? JSON.parse(log.oldState) : null;
                const newState = log.newState ? JSON.parse(log.newState) : null;

                return (
                  <tr
                    key={log.id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-10 py-6">
                      <div className="flex items-center space-x-2 text-slate-400">
                        <Clock size={12} />
                        <span className="text-[10px] font-bold">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                          <UserIcon size={14} />
                        </div>
                        <span className="text-xs font-black text-slate-700">
                          {log.changedBy}
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center space-x-2 text-slate-500">
                        {getModuleIcon(log.module)}
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          {log.module}
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <span
                        className={`px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${getActionColor(
                          log.action
                        )}`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center space-x-3 max-w-xs">
                        <span className="text-[10px] font-bold text-slate-400 truncate bg-slate-50 px-2 py-1 rounded border border-slate-100 italic">
                          {oldState
                            ? oldState.status ||
                              oldState.name ||
                              oldState.amount ||
                              "Initial"
                            : "Null"}
                        </span>
                        <ArrowRight
                          size={10}
                          className="text-slate-300 shrink-0"
                        />
                        <span className="text-[10px] font-black text-slate-900 bg-indigo-50 px-2 py-1 rounded border border-indigo-100">
                          {newState
                            ? newState.status ||
                              newState.name ||
                              newState.amount ||
                              "Updated"
                            : "Void"}
                        </span>
                      </div>
                      <p className="text-[8px] text-slate-400 font-bold uppercase mt-1 tracking-tighter">
                        ID: {log.targetId}
                      </p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {logs.length === 0 && (
            <div className="p-20 text-center">
              <AlertCircle size={48} className="mx-auto text-slate-100 mb-4" />
              <p className="text-slate-400 font-black uppercase text-xs tracking-widest">
                Ledger is currently empty
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditNetwork;
