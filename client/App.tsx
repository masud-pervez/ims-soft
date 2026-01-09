
import React, { useState, useEffect } from 'react';
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
  Truck
} from 'lucide-react';
import { Order, Product, User, UserRole, OrderStatus, AuditLog, Category, Expense, Purchase } from './types.ts';
import { INITIAL_USERS } from './constants.tsx';
import { apiService } from './apiService.ts';
import Dashboard from './components/Dashboard.tsx';
import OrderEntry from './components/OrderEntry.tsx';
import OrderList from './components/OrderList.tsx';
import Inventory from './components/Inventory.tsx';
import Reports from './components/Reports.tsx';
import UserManagement from './components/UserManagement.tsx';
import Expenses from './components/Expenses.tsx';
import AuditNetwork from './components/AuditNetwork.tsx';
import Purchases from './components/Purchases.tsx';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]);
  const [isDbConnected, setIsDbConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  const syncData = async () => {
    setIsRetrying(true);
    try {
      const isHealthy = await apiService.checkHealth();
      setIsDbConnected(isHealthy);
      if (isHealthy) {
        setSyncError(null);
        const [dbCats, dbProds, dbOrders, dbLogs, dbExpenses, dbPurchases] = await Promise.all([
          apiService.getCategories(),
          apiService.getProducts(),
          apiService.getOrders(),
          apiService.getAuditLogs(),
          apiService.getExpenses(),
          apiService.getPurchases()
        ]);
        setCategories(dbCats || []);
        setProducts(dbProds || []);
        setOrders(dbOrders || []);
        setAuditLogs(dbLogs || []);
        setExpenses(dbExpenses || []);
        setPurchases(dbPurchases || []);
        setLastSyncedAt(new Date());
      } else {
        setSyncError("DATABASE_CONFIG_ERROR");
      }
    } catch (e: any) {
      console.error("Connection Error:", e);
      setIsDbConnected(false);
      setSyncError("NETWORK_OFFLINE");
    } finally {
      setIsLoading(false);
      setIsRetrying(false);
    }
  };

  const handleBackup = async () => {
    try {
      if (window.confirm("Generate a full SQL database backup now?")) {
        await apiService.downloadBackup();
      }
    } catch (e) {
      alert("Backup failed. Ensure server is running.");
    }
  };

  useEffect(() => {
    syncData();
    const interval = setInterval(() => {
      if (!isRetrying) syncData();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleAddOrder = async (newOrder: Order) => {
    try {
      await apiService.createOrder(newOrder);
      await syncData();
    } catch (e: any) {
      alert(e.message || "Failed to create order.");
    }
  };

  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    try {
      await apiService.updateOrderStatus(orderId, status, currentUser.name);
      await syncData();
    } catch (e) {
      alert("Status update failed.");
    }
  };

  const SidebarItem = ({ id, icon: Icon, label, roles }: { id: string, icon: any, label: string, roles: UserRole[] }) => {
    if (!roles.includes(currentUser.role)) return null;
    const active = activeTab === id;
    return (
      <button
        onClick={() => setActiveTab(id)}
        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
          active ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
        }`}
      >
        <Icon size={20} />
        <span className="font-semibold text-sm">{label}</span>
      </button>
    );
  };

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-900">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-6 text-slate-400 font-black tracking-widest uppercase text-[10px]">Initializing Omni Workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-900 overflow-hidden font-inter text-slate-900">
      <aside className="w-64 bg-slate-950 flex flex-col border-r border-slate-800 shrink-0">
        <div className="p-8 flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Package className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-white font-black text-lg leading-tight">OmniOrder</h1>
            <span className="text-indigo-500 text-[10px] font-black tracking-widest uppercase">Enterprise OMS</span>
          </div>
        </div>
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto mt-4">
          <SidebarItem id="dashboard" icon={LayoutDashboard} label="Dashboard" roles={[UserRole.ADMIN, UserRole.ORDER_RECEIVER, UserRole.DELIVERY_MANAGER]} />
          <SidebarItem id="orders" icon={PlusCircle} label="New Order" roles={[UserRole.ADMIN, UserRole.ORDER_RECEIVER]} />
          <SidebarItem id="order-list" icon={ShoppingCart} label="All Orders" roles={[UserRole.ADMIN, UserRole.ORDER_RECEIVER, UserRole.DELIVERY_MANAGER]} />
          <SidebarItem id="purchases" icon={Truck} label="Stock Purchases" roles={[UserRole.ADMIN]} />
          <SidebarItem id="expenses" icon={CreditCard} label="Expenditure" roles={[UserRole.ADMIN, UserRole.DELIVERY_MANAGER]} />
          <SidebarItem id="inventory" icon={Layers} label="Inventory & Cat" roles={[UserRole.ADMIN]} />
          <SidebarItem id="reports" icon={BarChart3} label="BI Reporting" roles={[UserRole.ADMIN]} />
          <SidebarItem id="audit-network" icon={Activity} label="Audit Network" roles={[UserRole.ADMIN]} />
          <SidebarItem id="users" icon={Users} label="Team Management" roles={[UserRole.ADMIN]} />
        </nav>
        <div className="p-4 bg-slate-900 m-6 rounded-2xl border border-slate-800 shadow-inner">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center text-sm font-black text-white uppercase border border-slate-600">
              {currentUser.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-black text-white truncate">{currentUser.name}</p>
              <p className="text-[10px] text-indigo-400 uppercase font-black tracking-tighter">{currentUser.role}</p>
            </div>
          </div>
          <button className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-slate-800 text-xs text-rose-400 font-bold hover:bg-rose-500/10 transition-colors">
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
      <main className="flex-1 flex flex-col bg-slate-50 relative overflow-hidden">
        {syncError && (
          <div className="absolute inset-0 z-[100] bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-6 overflow-y-auto">
            <div className="max-w-3xl w-full bg-white rounded-[3.5rem] shadow-2xl overflow-hidden border border-slate-200 text-center p-12">
              <WifiOff className="mx-auto text-rose-600 mb-6" size={64} />
              <h2 className="text-3xl font-black text-slate-900">Connection Lost</h2>
              <p className="text-slate-500 font-bold mb-8">Ensure your node server is running on port 3001</p>
              <button onClick={syncData} className="bg-slate-900 text-white px-10 py-4 rounded-3xl font-black uppercase text-xs tracking-widest">Reconnect Bridge</button>
            </div>
          </div>
        )}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 z-10 shrink-0">
          <div className="flex items-center space-x-3 text-slate-400 text-sm font-bold uppercase tracking-widest">
            <span>{activeTab.replace('-', ' ')}</span>
            <ChevronRight size={14} className="text-slate-300" />
            <span className="text-slate-900">Workspace</span>
          </div>
          <div className="flex items-center space-x-6">
             <button 
               onClick={syncData}
               disabled={isRetrying}
               className="flex items-center space-x-2 px-4 py-2 bg-indigo-50 text-indigo-600 border-indigo-100 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm hover:bg-indigo-100 transition-colors"
             >
               <RefreshCw size={14} className={isRetrying ? 'animate-spin' : ''} />
               <span>{isRetrying ? 'Syncing...' : 'Sync Data'}</span>
             </button>
             <div className={`flex items-center space-x-2 px-4 py-2 ${isDbConnected ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'} rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm`}>
               <Database size={14} />
               <span>{isDbConnected ? 'MySQL 8 Ready' : 'API Connection Lost'}</span>
             </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-10">
          {activeTab === 'dashboard' && <Dashboard orders={orders} products={products} expenses={expenses} purchases={purchases} lastSyncedAt={lastSyncedAt} />}
          {activeTab === 'audit-network' && <AuditNetwork logs={auditLogs} onRefresh={syncData} />}
          {activeTab === 'orders' && <OrderEntry products={products} onAddOrder={handleAddOrder} currentUser={currentUser} />}
          {activeTab === 'order-list' && (
            <OrderList 
              orders={orders} 
              onUpdateStatus={handleUpdateStatus} 
              currentUser={currentUser}
              onRefresh={syncData}
            />
          )}
          {activeTab === 'purchases' && <Purchases products={products} purchases={purchases} currentUser={currentUser} onRefresh={syncData} />}
          {activeTab === 'expenses' && <Expenses expenses={expenses} currentUser={currentUser} onRefresh={syncData} />}
          {activeTab === 'inventory' && <Inventory products={products} categories={categories} onRefresh={syncData} isBackendLive={isDbConnected} />}
          {activeTab === 'reports' && <Reports orders={orders} products={products} users={INITIAL_USERS} categories={categories} expenses={expenses} />}
          {activeTab === 'users' && <UserManagement users={INITIAL_USERS} onBackup={handleBackup} />}
        </div>
      </main>
    </div>
  );
};

export default App;
