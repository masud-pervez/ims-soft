import React, { useMemo } from "react";
import {
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Truck,
  AlertCircle,
  Package,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  CreditCard,
  RefreshCw,
  Wallet,
  Coins,
  TrendingDown,
  Briefcase,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Order,
  Product,
  PaymentStatus,
  OrderStatus,
  Expense,
  Purchase,
} from "../types";

import {
  useOrders,
  useProducts,
  useExpenses,
  usePurchases,
} from "../hooks/useQueries";

const Dashboard: React.FC = () => {
  const { data: orders = [] } = useOrders();
  const { data: products = [] } = useProducts();
  const { data: expenses = [] } = useExpenses();
  const { data: purchases = [] } = usePurchases();
  // Remove lastSyncedAt or use specific query info if needed, for now omitted or hardcoded null
  const lastSyncedAt = null;

  const stats = useMemo(() => {
    const activeOrders = orders.filter(
      (o) =>
        o.delivery.status !== OrderStatus.CANCELLED &&
        o.delivery.status !== OrderStatus.RETURNED
    );
    // ... rest of calculation uses orders, products, expenses, purchases variables which are now from hooks
    const grossProfit = activeOrders.reduce(
      (sum, o) => sum + Number(o.financials.profit || 0),
      0
    );
    const totalExpenses = expenses.reduce(
      (sum, e) => sum + Number(e.amount || 0),
      0
    );
    const totalPurchases = purchases.reduce(
      (sum, p) => sum + Number(p.totalCost || 0),
      0
    );
    const netYield = grossProfit - totalExpenses;

    return {
      totalOrders: orders.length,
      totalSales: activeOrders.reduce(
        (sum, o) => sum + Number(o.financials.netPayable || 0),
        0
      ),
      grossProfit,
      totalExpenses,
      totalPurchases,
      netYield,
      totalCollected: activeOrders.reduce(
        (sum, o) => sum + Number(o.payment.paidAmount || 0),
        0
      ),
      totalDelivered: orders.filter(
        (o) => o.delivery.status === OrderStatus.DELIVERED
      ).length,
      pendingDelivery: orders.filter((o) =>
        [OrderStatus.PENDING, OrderStatus.PROCESSING].includes(
          o.delivery.status
        )
      ).length,
      unpaidOrders: orders.filter(
        (o) => o.payment.status === PaymentStatus.UNPAID
      ).length,
      totalDue: activeOrders.reduce(
        (sum, o) => sum + Number(o.payment.dueAmount || 0),
        0
      ),
      lowStock: products.filter((p) => p.currentStock < 10).length,
    };
  }, [orders, products, expenses, purchases]);

  const chartData = useMemo(() => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return months.map((m, i) => {
      const monthlyOrders = orders.filter(
        (o) =>
          o.meta.month === i + 1 &&
          o.delivery.status !== OrderStatus.CANCELLED &&
          o.delivery.status !== OrderStatus.RETURNED
      );
      const monthlyExpenses = expenses.filter(
        (e) => new Date(e.date).getMonth() === i
      );
      const monthlyPurchases = purchases.filter(
        (p) => new Date(p.purchaseDate).getMonth() === i
      );

      return {
        name: m,
        sales: monthlyOrders.reduce(
          (sum, o) => sum + Number(o.financials.netPayable || 0),
          0
        ),
        expenses: monthlyExpenses.reduce(
          (sum, e) => sum + Number(e.amount || 0),
          0
        ),
        purchases: monthlyPurchases.reduce(
          (sum, p) => sum + Number(p.totalCost || 0),
          0
        ),
        collected: monthlyOrders.reduce(
          (sum, o) => sum + Number(o.payment.paidAmount || 0),
          0
        ),
      };
    });
  }, [orders, expenses, purchases]);

  const lowStockProducts = useMemo(
    () =>
      [...products].sort((a, b) => a.currentStock - b.currentStock).slice(0, 5),
    [products]
  );

  const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all transform hover:-translate-y-1">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
            {title}
          </p>
          <h3 className="text-2xl font-black text-slate-900 mt-2">{value}</h3>
          {trend && (
            <div
              className={`flex items-center mt-2 font-bold text-[10px] ${
                trend.includes("-") ? "text-rose-500" : "text-emerald-500"
              }`}
            >
              <ArrowUpRight size={12} className="mr-1" />
              <span>{trend}</span>
            </div>
          )}
        </div>
        <div
          className={`p-4 rounded-2xl ${
            color === "indigo"
              ? "bg-indigo-50 text-indigo-600"
              : color === "emerald"
              ? "bg-emerald-50 text-emerald-600"
              : color === "blue"
              ? "bg-blue-50 text-blue-600"
              : color === "rose"
              ? "bg-rose-50 text-rose-600"
              : color === "amber"
              ? "bg-amber-50 text-amber-600"
              : "bg-violet-50 text-violet-600"
          }`}
        >
          <Icon size={24} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 pb-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Enterprise Ledger Live
          </span>
        </div>
        {lastSyncedAt && (
          <div className="flex items-center text-[10px] font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
            <RefreshCw size={10} className="mr-2 opacity-50" />
            <span>Last Sync: {lastSyncedAt.toLocaleTimeString()}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          title="Confirmed Sales"
          value={`৳${stats.totalSales.toLocaleString()}`}
          icon={ShoppingCart}
          color="indigo"
          trend="Gross GMV"
        />
        <StatCard
          title="Inventory Buy"
          value={`৳${stats.totalPurchases.toLocaleString()}`}
          icon={Truck}
          color="amber"
          trend="Procurement Cost"
        />
        <StatCard
          title="Total OPEX"
          value={`৳${stats.totalExpenses.toLocaleString()}`}
          icon={TrendingDown}
          color="rose"
          trend="Operational Outflow"
        />
        <StatCard
          title="Cash In-Hand"
          value={`৳${stats.totalCollected.toLocaleString()}`}
          icon={Wallet}
          color="emerald"
          trend="Liquid Capital"
        />
        <StatCard
          title="True Net Yield"
          value={`৳${stats.netYield.toLocaleString()}`}
          icon={TrendingUp}
          color="violet"
          trend="Profit After Expense"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-amber-50 border border-amber-100 p-6 rounded-3xl flex items-center space-x-5">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-amber-600 shadow-sm">
            <Clock size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black text-amber-800 uppercase tracking-widest">
              In Logistical Pipeline
            </p>
            <h4 className="text-3xl font-black text-amber-900">
              {stats.pendingDelivery}
            </h4>
            <p className="text-xs text-amber-700 font-medium">
              Processing / In-Transit
            </p>
          </div>
        </div>
        <div className="bg-rose-50 border border-rose-100 p-6 rounded-3xl flex items-center space-x-5">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-rose-600 shadow-sm">
            <AlertCircle size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black text-rose-800 uppercase tracking-widest">
              Unpaid Receivables
            </p>
            <h4 className="text-3xl font-black text-rose-900">
              ৳{stats.totalDue.toLocaleString()}
            </h4>
            <p className="text-xs text-rose-700 font-medium">
              Outstanding Collection
            </p>
          </div>
        </div>
        <div className="bg-slate-900 p-6 rounded-3xl flex items-center space-x-5 text-white">
          <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center text-indigo-400">
            <Package size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Inventory Alerts
            </p>
            <h4 className="text-3xl font-black">{stats.lowStock}</h4>
            <p className="text-xs text-slate-400 font-medium">
              Items near exhaustion
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h4 className="font-black text-slate-800 text-lg mb-8">
            Collection & Expense Pulse
          </h4>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 700 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 700 }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "20px",
                    border: "none",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  name="Gross Sales"
                  stroke="#6366f1"
                  strokeWidth={4}
                  fillOpacity={0.05}
                  fill="#6366f1"
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  name="Operational Expense"
                  stroke="#f43f5e"
                  strokeWidth={4}
                  fillOpacity={0.05}
                  fill="#f43f5e"
                />
                <Area
                  type="monotone"
                  dataKey="purchases"
                  name="Inventory Buy"
                  stroke="#f59e0b"
                  strokeWidth={4}
                  fillOpacity={0.05}
                  fill="#f59e0b"
                />
                <Area
                  type="monotone"
                  dataKey="collected"
                  name="Liquid Cash"
                  stroke="#10b981"
                  strokeWidth={4}
                  fillOpacity={0.05}
                  fill="#10b981"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h4 className="font-black text-slate-800 uppercase tracking-tighter mb-8">
            Inventory Sync Priority
          </h4>
          <div className="space-y-6">
            {lowStockProducts.map((p) => (
              <div key={p.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={p.image}
                    className="w-12 h-12 rounded-2xl object-cover"
                  />
                  <div>
                    <span className="text-sm text-slate-800 font-black block truncate w-24">
                      {p.name}
                    </span>
                    <div className="w-24 bg-slate-100 h-1 rounded-full mt-1 overflow-hidden">
                      <div
                        className={`h-full ${
                          p.currentStock < 5 ? "bg-rose-500" : "bg-indigo-500"
                        }`}
                        style={{
                          width: `${Math.min(
                            (p.currentStock / 20) * 100,
                            100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`text-xs font-black ${
                      p.currentStock < 10 ? "text-rose-500" : "text-slate-400"
                    }`}
                  >
                    {p.currentStock} Units
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
