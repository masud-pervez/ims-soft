import React from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  PlusCircle,
  ShoppingCart,
  Package,
  BarChart3,
  Users,
  LogOut,
  ChevronRight,
  Database,
  Layers,
  Activity,
  WifiOff,
  RefreshCw,
  CreditCard,
  Truck,
} from "lucide-react";
import { User, UserRole } from "../types";
import { useHealthCheck } from "../hooks/useQueries";
import { useQueryClient } from "@tanstack/react-query";

interface LayoutProps {
  currentUser: User;
}

const Layout: React.FC<LayoutProps> = ({ currentUser }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    data: isDbConnected,
    refetch: checkHealth,
    isFetching: isCheckingHealth,
  } = useHealthCheck();

  const handleSync = async () => {
    await queryClient.invalidateQueries();
    await checkHealth();
  };

  const SidebarItem = ({
    to,
    icon: Icon,
    label,
    roles,
  }: {
    to: string;
    icon: any;
    label: string;
    roles: UserRole[];
  }) => {
    if (!roles.includes(currentUser.role)) return null;
    return (
      <NavLink
        to={to}
        className={({ isActive }) =>
          `w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
            isActive
              ? "bg-indigo-600 text-white shadow-xl shadow-indigo-500/20"
              : "text-slate-400 hover:bg-slate-800 hover:text-white"
          }`
        }
      >
        <Icon size={20} />
        <span className="font-semibold text-sm">{label}</span>
      </NavLink>
    );
  };

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/":
        return "Dashboard";
      case "/orders":
        return "New Order";
      case "/order-list":
        return "All Orders";
      case "/purchases":
        return "Stock Purchases";
      case "/expenses":
        return "Expenditure";
      case "/inventory":
        return "Inventory & Cat";
      case "/reports":
        return "BI Reporting";
      case "/audit-network":
        return "Audit Network";
      case "/users":
        return "Team Management";
      default:
        return "Overview";
    }
  };

  return (
    <div className="flex h-screen bg-slate-900 overflow-hidden font-inter text-slate-900">
      <aside className="w-64 bg-slate-950 flex flex-col border-r border-slate-800 shrink-0">
        <div className="p-8 flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Package className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-white font-black text-lg leading-tight">
              OmniOrder
            </h1>
            <span className="text-indigo-500 text-[10px] font-black tracking-widest uppercase">
              Enterprise OMS
            </span>
          </div>
        </div>
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto mt-4">
          <SidebarItem
            to="/"
            icon={LayoutDashboard}
            label="Dashboard"
            roles={[
              UserRole.ADMIN,
              UserRole.ORDER_RECEIVER,
              UserRole.DELIVERY_MANAGER,
            ]}
          />
          <SidebarItem
            to="/orders"
            icon={PlusCircle}
            label="New Order"
            roles={[UserRole.ADMIN, UserRole.ORDER_RECEIVER]}
          />
          <SidebarItem
            to="/order-list"
            icon={ShoppingCart}
            label="All Orders"
            roles={[
              UserRole.ADMIN,
              UserRole.ORDER_RECEIVER,
              UserRole.DELIVERY_MANAGER,
            ]}
          />
          <SidebarItem
            to="/purchases"
            icon={Truck}
            label="Stock Purchases"
            roles={[UserRole.ADMIN]}
          />
          <SidebarItem
            to="/expenses"
            icon={CreditCard}
            label="Expenditure"
            roles={[UserRole.ADMIN, UserRole.DELIVERY_MANAGER]}
          />
          <SidebarItem
            to="/inventory"
            icon={Layers}
            label="Inventory & Cat"
            roles={[UserRole.ADMIN]}
          />
          <SidebarItem
            to="/reports"
            icon={BarChart3}
            label="BI Reporting"
            roles={[UserRole.ADMIN]}
          />
          <SidebarItem
            to="/audit-network"
            icon={Activity}
            label="Audit Network"
            roles={[UserRole.ADMIN]}
          />
          <SidebarItem
            to="/users"
            icon={Users}
            label="Team Management"
            roles={[UserRole.ADMIN]}
          />
        </nav>
        <div className="p-4 bg-slate-900 m-6 rounded-2xl border border-slate-800 shadow-inner">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center text-sm font-black text-white uppercase border border-slate-600">
              {currentUser.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-black text-white truncate">
                {currentUser.name}
              </p>
              <p className="text-[10px] text-indigo-400 uppercase font-black tracking-tighter">
                {currentUser.role}
              </p>
            </div>
          </div>
          <button className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-slate-800 text-xs text-rose-400 font-bold hover:bg-rose-500/10 transition-colors">
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
      <main className="flex-1 flex flex-col bg-slate-50 relative overflow-hidden">
        {isDbConnected === false && (
          <div className="absolute inset-0 z-[100] bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-6 overflow-y-auto">
            <div className="max-w-3xl w-full bg-white rounded-[3.5rem] shadow-2xl overflow-hidden border border-slate-200 text-center p-12">
              <WifiOff className="mx-auto text-rose-600 mb-6" size={64} />
              <h2 className="text-3xl font-black text-slate-900">
                Connection Lost
              </h2>
              <p className="text-slate-500 font-bold mb-8">
                Ensure your node server is running on port 3001
              </p>
              <button
                onClick={() => checkHealth()}
                className="bg-slate-900 text-white px-10 py-4 rounded-3xl font-black uppercase text-xs tracking-widest"
              >
                Reconnect Bridge
              </button>
            </div>
          </div>
        )}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 z-10 shrink-0">
          <div className="flex items-center space-x-3 text-slate-400 text-sm font-bold uppercase tracking-widest">
            <span>{getPageTitle()}</span>
            <ChevronRight size={14} className="text-slate-300" />
            <span className="text-slate-900">Workspace</span>
          </div>
          <div className="flex items-center space-x-6">
            <button
              onClick={handleSync}
              disabled={isCheckingHealth}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-50 text-indigo-600 border-indigo-100 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm hover:bg-indigo-100 transition-colors"
            >
              <RefreshCw
                size={14}
                className={isCheckingHealth ? "animate-spin" : ""}
              />
              <span>{isCheckingHealth ? "Syncing..." : "Sync Data"}</span>
            </button>
            <div
              className={`flex items-center space-x-2 px-4 py-2 ${
                isDbConnected
                  ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                  : "bg-rose-50 text-rose-600 border-rose-100"
              } rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm`}
            >
              <Database size={14} />
              <span>
                {isDbConnected ? "MySQL 8 Ready" : "API Connection Lost"}
              </span>
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
