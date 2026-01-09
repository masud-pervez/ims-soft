import React, { useState, useMemo } from "react";
import {
  Truck,
  Plus,
  Search,
  History,
  Package,
  Tag,
  User as UserIcon,
  Calendar,
  ArrowRight,
  TrendingUp,
  Box,
  Save,
  Loader2,
  DollarSign,
  ShoppingCart,
} from "lucide-react";
import { Product, Purchase } from "../types";
// import { apiService } from "../apiService";

import {
  useProducts,
  usePurchases,
  useCreatePurchase,
} from "../hooks/useQueries";
import { useUser } from "../hooks/useAuth";

const Purchases: React.FC = () => {
  const { data: currentUser } = useUser();
  const { data: products = [] } = useProducts();
  const { data: purchases = [], refetch } = usePurchases();
  const createPurchase = useCreatePurchase();

  // onRefresh used to be passed, now we can use refetch if needed locally or cleaner, just rely on invalidation.
  // The component calls onRefresh after submit. We should rely on mutation success invalidation which is automatic via query client.
  const onRefresh = async () => {}; // No-op, handled by mutation

  const [activeTab, setActiveTab] = useState<"entry" | "history">("entry");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    productId: "",
    quantity: 1,
    purchasePrice: 0,
    supplierName: "",
    purchaseDate: new Date().toISOString().split("T")[0],
  });

  const selectedProduct = useMemo(
    () => products.find((p) => p.id === formData.productId),
    [formData.productId, products]
  );
  const totalCost = formData.quantity * formData.purchasePrice;

  const filteredHistory = useMemo(() => {
    return purchases.filter(
      (p) =>
        p.productName.toLowerCase().includes(search.toLowerCase()) ||
        p.supplierName.toLowerCase().includes(search.toLowerCase()) ||
        p.id.toLowerCase().includes(search.toLowerCase())
    );
  }, [purchases, search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return alert("Please select a product");
    if (formData.quantity <= 0) return alert("Quantity must be greater than 0");

    setIsSubmitting(true);
    try {
      const purchaseId = `PUR-${Date.now()}`;
      await createPurchase.mutateAsync({
        id: purchaseId,
        productId: formData.productId,
        productName: selectedProduct.name,
        quantity: formData.quantity,
        purchasePrice: formData.purchasePrice,
        totalCost,
        supplierName: formData.supplierName,
        purchaseDate: formData.purchaseDate,
        createdBy: currentUser.name,
      });

      // await onRefresh();
      alert("Stock updated successfully!");
      setFormData({
        productId: "",
        quantity: 1,
        purchasePrice: 0,
        supplierName: "",
        purchaseDate: new Date().toISOString().split("T")[0],
      });
      setActiveTab("history");
    } catch (err: any) {
      alert("Error logging purchase: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Stock Procurement
          </h2>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1">
            Inventory Replenishment & Vendor Tracking
          </p>
        </div>
        <div className="flex bg-white p-1.5 rounded-[1.5rem] border border-slate-100 shadow-sm">
          <button
            onClick={() => setActiveTab("entry")}
            className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === "entry"
                ? "bg-indigo-600 text-white shadow-lg"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <Plus size={14} />
            <span>Stock Entry</span>
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === "history"
                ? "bg-indigo-600 text-white shadow-lg"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <History size={14} />
            <span>Procurement Logs</span>
          </button>
        </div>
      </div>

      {activeTab === "entry" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full translate-x-1/2 -translate-y-1/2"></div>
              <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                    <Box size={20} />
                  </div>
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">
                    Replenishment Details
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                      Target Product *
                    </label>
                    <select
                      required
                      value={formData.productId}
                      onChange={(e) =>
                        setFormData({ ...formData, productId: e.target.value })
                      }
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-black appearance-none focus:ring-4 focus:ring-indigo-500/10"
                    >
                      <option value="">-- Choose Product to Restock --</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} (ID: {p.id}) • Stock: {p.currentStock}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                      Unit Purchase Price (৳)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        required
                        value={formData.purchasePrice}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            purchasePrice: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-black text-rose-600"
                        placeholder="0.00"
                      />
                      <DollarSign
                        size={16}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                      Entry Quantity *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        required
                        min="1"
                        value={formData.quantity}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            quantity: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-black text-indigo-600"
                      />
                      <Package
                        size={16}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                      Vendor / Supplier Name
                    </label>
                    <input
                      type="text"
                      value={formData.supplierName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          supplierName: e.target.value,
                        })
                      }
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-black"
                      placeholder="e.g. Acme Supplies Ltd."
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                      Procurement Date
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.purchaseDate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          purchaseDate: e.target.value,
                        })
                      }
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-black"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-slate-200 hover:bg-black transition-all flex items-center justify-center space-x-3 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Save size={18} />
                  )}
                  <span>
                    {isSubmitting
                      ? "Syncing with Inventory..."
                      : "Commit to Stock"}
                  </span>
                </button>
              </form>
            </section>
          </div>

          <div className="space-y-8">
            <section className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute bottom-0 left-0 w-full h-1 bg-indigo-500"></div>
              <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] mb-8">
                Asset Valuation
              </h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center text-sm font-bold">
                  <span className="text-slate-500 uppercase text-[10px] tracking-widest">
                    Selected Item
                  </span>
                  <span className="text-slate-200 truncate max-w-[120px]">
                    {selectedProduct ? selectedProduct.name : "None"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold">
                  <span className="text-slate-500 uppercase text-[10px] tracking-widest">
                    Qty Update
                  </span>
                  <span className="text-emerald-400">
                    +{formData.quantity} Units
                  </span>
                </div>
                {selectedProduct && (
                  <div className="flex justify-between items-center text-sm font-bold">
                    <span className="text-slate-500 uppercase text-[10px] tracking-widest">
                      New Stock Depth
                    </span>
                    <span className="text-indigo-400">
                      {selectedProduct.currentStock + formData.quantity} Units
                    </span>
                  </div>
                )}
                <div className="pt-8 border-t border-slate-800">
                  <div className="flex flex-col">
                    <span className="text-slate-500 uppercase text-[10px] tracking-widest mb-2 text-center">
                      Procurement Outflow
                    </span>
                    <span className="text-4xl font-black text-center tracking-tighter text-white">
                      ৳{totalCost.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
              <div className="flex items-center space-x-3 mb-6">
                <TrendingUp className="text-indigo-500" size={18} />
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                  Recent Activity
                </span>
              </div>
              <div className="space-y-4">
                {purchases.slice(0, 3).map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100"
                  >
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-900">
                        {p.productName}
                      </span>
                      <span className="text-[8px] text-slate-400 font-bold uppercase">
                        {p.purchaseDate}
                      </span>
                    </div>
                    <span className="text-xs font-black text-indigo-600">
                      +{p.quantity}
                    </span>
                  </div>
                ))}
                {purchases.length === 0 && (
                  <p className="text-[10px] text-center text-slate-300 font-bold py-4">
                    No recent purchases.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 flex justify-between items-center">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search vendor, product, or ID..."
                className="bg-slate-50 border-none rounded-2xl py-3 pl-12 pr-6 text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">
              <Box size={14} />
              <span>{purchases.length} Logged Events</span>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Entry Date
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Product / Asset
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Quantity
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Vendor
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                    Investment (৳)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredHistory.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-2 text-slate-400">
                        <Calendar size={12} />
                        <span className="text-[10px] font-bold">
                          {p.purchaseDate}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-slate-900 leading-tight">
                          {p.productName}
                        </span>
                        <span className="text-[8px] text-slate-400 font-bold uppercase mt-1">
                          Ref: {p.id}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                        +{p.quantity}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[10px] font-bold text-slate-600">
                        {p.supplierName || "General Market"}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <span className="text-sm font-black text-slate-900">
                        ৳{p.totalCost.toLocaleString()}
                      </span>
                      <p className="text-[8px] text-slate-400 font-bold uppercase">
                        @ ৳{p.purchasePrice}/unit
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredHistory.length === 0 && (
              <div className="p-20 text-center">
                <Truck className="mx-auto text-slate-100 mb-6" size={56} />
                <p className="text-slate-400 font-black uppercase text-xs tracking-widest">
                  No procurement records found
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Purchases;
