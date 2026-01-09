import React, { useState, useMemo } from "react";
import {
  CreditCard,
  Plus,
  Search,
  Trash2,
  Calendar,
  DollarSign,
  Tag,
  FileText,
  User as UserIcon,
  Loader2,
  TrendingDown,
  ArrowDownCircle,
  Clock,
} from "lucide-react";
import { Expense, ExpenseType } from "../types";
// import { apiService } from "../apiService";

import {
  useExpenses,
  useCreateExpense,
  useDeleteExpense,
} from "../hooks/useQueries";

interface ExpensesProps {
  currentUser: any;
}

const Expenses: React.FC<ExpensesProps> = ({ currentUser }) => {
  const { data: expenses = [] } = useExpenses();
  const createExpense = useCreateExpense();
  const deleteExpense = useDeleteExpense();

  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("All");

  const [formData, setFormData] = useState({
    amount: 0,
    type: ExpenseType.ADS,
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      const matchesSearch = e.description
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesType = typeFilter === "All" || e.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [expenses, search, typeFilter]);

  const stats = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return {
      total: expenses.reduce((sum, e) => sum + Number(e.amount), 0),
      today: expenses
        .filter((e) => e.date === today)
        .reduce((sum, e) => sum + Number(e.amount), 0),
      topType: Object.values(ExpenseType).reduce((prev, curr) => {
        const currSum = expenses
          .filter((e) => e.type === curr)
          .reduce((sum, e) => sum + Number(e.amount), 0);
        const prevSum = expenses
          .filter((e) => e.type === prev)
          .reduce((sum, e) => sum + Number(e.amount), 0);
        return currSum > prevSum ? curr : prev;
      }, ExpenseType.ADS),
    };
  }, [expenses]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.amount <= 0) return alert("Amount must be greater than 0");

    setIsSubmitting(true);
    try {
      const newId = `EXP-${Date.now()}`;
      await createExpense.mutateAsync({
        ...formData,
        id: newId,
        createdBy: currentUser.name,
      });
      // await onRefresh();
      setShowAddForm(false);
      setFormData({
        amount: 0,
        type: ExpenseType.ADS,
        description: "",
        date: new Date().toISOString().split("T")[0],
      });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Permanent deletion of this record?")) return;
    try {
      await deleteExpense.mutateAsync(id);
      // await onRefresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <TrendingDown size={100} />
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
            Cumulative OPEX
          </p>
          <h3 className="text-3xl font-black">
            ৳{stats.total.toLocaleString()}
          </h3>
          <p className="text-[10px] text-indigo-400 font-bold mt-2 uppercase">
            Total Operational Outflow
          </p>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center space-x-6">
          <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl">
            <ArrowDownCircle size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
              Daily Burn Rate
            </p>
            <h4 className="text-xl font-black text-slate-900">
              ৳{stats.today.toLocaleString()}
            </h4>
            <p className="text-[9px] text-rose-500 font-bold mt-1 uppercase">
              Allocated Today
            </p>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center space-x-6">
          <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl">
            <CreditCard size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
              Top Expense Stream
            </p>
            <h4 className="text-sm font-black text-slate-900">
              {stats.topType}
            </h4>
            <p className="text-[9px] text-indigo-500 font-bold mt-1 uppercase">
              Heaviest Category
            </p>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div className="flex items-center space-x-3 overflow-x-auto pb-2 xl:pb-0 scrollbar-hide">
          <button
            onClick={() => setTypeFilter("All")}
            className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
              typeFilter === "All"
                ? "bg-slate-900 text-white shadow-lg"
                : "text-slate-400 hover:bg-slate-50"
            }`}
          >
            All
          </button>
          {Object.values(ExpenseType).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                typeFilter === t
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "text-slate-400 hover:bg-slate-50"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search description..."
              className="bg-slate-50 border-none rounded-2xl py-3 pl-12 pr-6 text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 w-full xl:w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center space-x-2 shadow-xl shadow-indigo-200"
          >
            <Plus size={16} />
            <span>Log Expense</span>
          </button>
        </div>
      </div>

      {/* Expense List */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Entry Date
              </th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Stream Category
              </th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Description
              </th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                Amount (৳)
              </th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                Ops
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredExpenses.map((e) => (
              <tr
                key={e.id}
                className="hover:bg-slate-50/50 transition-colors group"
              >
                <td className="px-8 py-5">
                  <div className="flex items-center space-x-3">
                    <Calendar className="text-slate-300" size={14} />
                    <span className="text-xs font-black text-slate-900">
                      {e.date}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                    {e.type}
                  </span>
                </td>
                <td className="px-8 py-5">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-700">
                      {e.description || "No memo provided"}
                    </span>
                    <span className="text-[9px] text-slate-400 font-black uppercase mt-1">
                      Ref: {e.id} • By: {e.createdBy}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-5 text-right font-black text-rose-500">
                  ৳{Number(e.amount).toLocaleString()}
                </td>
                <td className="px-8 py-5 text-right">
                  <button
                    onClick={() => handleDelete(e.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredExpenses.length === 0 && (
          <div className="p-20 text-center">
            <Clock className="mx-auto text-slate-100 mb-6" size={56} />
            <p className="text-slate-400 font-black uppercase text-xs tracking-widest">
              No Expenditures Logged
            </p>
          </div>
        )}
      </div>

      {/* Add Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[80] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-10 bg-slate-900 text-white">
              <h3 className="text-2xl font-black uppercase tracking-tighter">
                Expenditure Record
              </h3>
              <p className="text-[10px] text-slate-500 font-black tracking-widest uppercase mt-2">
                Documenting Operational Yields
              </p>
            </div>
            <form onSubmit={handleSubmit} className="p-10 space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                    Allocated Amount (৳)
                  </label>
                  <div className="relative">
                    <input
                      required
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          amount: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-xl font-black text-rose-600 focus:ring-4 focus:ring-rose-500/10"
                    />
                    <DollarSign
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-rose-300"
                      size={24}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                    Stream Category
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value as ExpenseType,
                      })
                    }
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-xs font-black appearance-none"
                  >
                    {Object.values(ExpenseType).map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                    Posting Date
                  </label>
                  <input
                    required
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-xs font-black"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                    Context / Memo
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold min-h-[120px]"
                    placeholder="Add specific details for this outflow..."
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 py-4 rounded-2xl text-xs font-black uppercase text-slate-400 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="flex-[2] bg-slate-900 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center space-x-3"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <FileText size={18} />
                  )}
                  <span>{isSubmitting ? "Posting..." : "Commit Expense"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;
