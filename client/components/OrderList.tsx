
import React, { useState, useMemo } from 'react';
import { 
  Eye, 
  Truck, 
  XCircle, 
  CheckCircle,
  Search,
  Facebook,
  MessageCircle,
  Undo2,
  AlertCircle,
  Banknote,
  Plus,
  Loader2,
  Package,
  Activity,
  ArrowRight
} from 'lucide-react';
import { Order, OrderStatus, PaymentStatus } from '../types';
import { apiService } from '../apiService';
import { PAYMENT_METHODS } from '../constants';

interface OrderListProps {
  orders: Order[];
  onUpdateStatus: (id: string, status: OrderStatus) => void;
  currentUser: any;
  onRefresh: () => Promise<void>;
}

const OrderList: React.FC<OrderListProps> = ({ orders, onUpdateStatus, currentUser, onRefresh }) => {
  const [filter, setFilter] = useState<OrderStatus | 'All'>('All');
  const [search, setSearch] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  
  // Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentOrderId, setPaymentOrderId] = useState<string | null>(null);
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    amount: 0,
    method: PAYMENT_METHODS[0],
    transactionId: ''
  });

  const filteredOrders = orders.filter(o => {
    const matchesFilter = filter === 'All' || o.delivery.status === filter;
    const matchesSearch = 
      o.customer.name.toLowerCase().includes(search.toLowerCase()) || 
      o.customer.phone.includes(search) || 
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.profileName.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const selectedOrder = useMemo(() => orders.find(o => o.id === selectedOrderId) || null, [orders, selectedOrderId]);
  const paymentTargetOrder = useMemo(() => orders.find(o => o.id === paymentOrderId) || null, [orders, paymentOrderId]);

  const stats = useMemo(() => ({
    pending: orders.filter(o => o.delivery.status === OrderStatus.PENDING).length,
    processing: orders.filter(o => o.delivery.status === OrderStatus.PROCESSING).length,
    delivered: orders.filter(o => o.delivery.status === OrderStatus.DELIVERED).length
  }), [orders]);

  const handleOpenPaymentModal = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    setPaymentOrderId(orderId);
    setPaymentForm({
      amount: order.payment.dueAmount,
      method: PAYMENT_METHODS[0],
      transactionId: ''
    });
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentOrderId || paymentForm.amount <= 0) return;
    
    setIsSubmittingPayment(true);
    try {
      await apiService.recordPayment(paymentOrderId, {
        ...paymentForm,
        receivedBy: currentUser.name
      });
      await onRefresh();
      setShowPaymentModal(false);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.DELIVERED: return 'bg-green-100 text-green-700';
      case OrderStatus.PENDING: return 'bg-amber-100 text-amber-700';
      case OrderStatus.PROCESSING: return 'bg-indigo-100 text-indigo-700';
      case OrderStatus.CANCELLED: return 'bg-red-100 text-red-700';
      case OrderStatus.RETURNED: return 'bg-rose-100 text-rose-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Payment Collection Modal */}
      {showPaymentModal && paymentTargetOrder && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[70] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 bg-indigo-600 text-white flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black uppercase tracking-tighter">Collect Due Cash</h3>
                <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest">Order: {paymentTargetOrder.id}</p>
              </div>
              <button onClick={() => setShowPaymentModal(false)} className="bg-white/10 p-2 rounded-xl hover:bg-white/20">
                <XCircle size={24} />
              </button>
            </div>
            
            <form onSubmit={handlePaymentSubmit} className="p-8 space-y-6">
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex justify-between items-center">
                 <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Net Payable</p>
                   <p className="text-xl font-black text-slate-900">৳{paymentTargetOrder.financials.netPayable.toLocaleString()}</p>
                 </div>
                 <div className="text-right">
                   <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Remaining Due</p>
                   <p className="text-xl font-black text-rose-600">৳{paymentTargetOrder.payment.dueAmount.toLocaleString()}</p>
                 </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Amount to Collect (৳)</label>
                <div className="relative">
                   <input 
                    required 
                    type="number" 
                    max={paymentTargetOrder.payment.dueAmount}
                    min="1"
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-xl font-black text-emerald-600 focus:ring-4 focus:ring-emerald-500/10"
                    value={paymentForm.amount}
                    onChange={e => setPaymentForm({...paymentForm, amount: parseFloat(e.target.value) || 0})}
                  />
                  <Banknote className="absolute right-5 top-1/2 -translate-y-1/2 text-emerald-300" size={24} />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Payment Gateway</label>
                <select 
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-black appearance-none"
                  value={paymentForm.method}
                  onChange={e => setPaymentForm({...paymentForm, method: e.target.value})}
                >
                  {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Transaction ID (Optional)</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-black"
                  placeholder="e.g. BKASH_8X29..."
                  value={paymentForm.transactionId}
                  onChange={e => setPaymentForm({...paymentForm, transactionId: e.target.value})}
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmittingPayment}
                className="w-full bg-indigo-600 text-white py-5 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center space-x-3 disabled:opacity-50"
              >
                {isSubmittingPayment ? <Loader2 size={18} className="animate-spin" /> : <Banknote size={18} />}
                <span>{isSubmittingPayment ? 'Processing Cash...' : 'Confirm Collection'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Header & Search */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div className="flex items-center space-x-3 overflow-x-auto pb-2 xl:pb-0 scrollbar-hide">
          <button onClick={() => setFilter('All')} className={`px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${filter === 'All' ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' : 'text-slate-400 hover:bg-slate-50'}`}>All</button>
          {Object.values(OrderStatus).map(s => (
            <button 
              key={s} 
              onClick={() => setFilter(s)} 
              className={`px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${filter === s ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search name, phone, or profile..." 
            className="bg-slate-50 border-none rounded-2xl py-3 pl-12 pr-6 text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 w-full xl:w-80"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Order</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Client Identity</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Commercials</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Workflow</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="font-black text-slate-900 tracking-tight">{order.id}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">{order.meta.orderDate}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <div className="flex items-center space-x-2">
                          <span className="font-black text-slate-700 truncate max-w-[120px]">{order.customer.name}</span>
                          {order.customer.platform === 'Facebook' ? <Facebook size={12} className="text-blue-600" /> : <MessageCircle size={12} className="text-emerald-500" />}
                        </div>
                        <div className="flex items-center text-[10px] font-bold text-slate-400 mt-0.5">
                          <span className="text-indigo-500 mr-2">{order.customer.profileName}</span>
                          <span>• {order.customer.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="font-black text-slate-900">৳{order.financials.netPayable.toLocaleString()}</span>
                        <div className="flex items-center space-x-1">
                          <span className={`text-[9px] font-black uppercase tracking-tighter ${order.payment.status === PaymentStatus.PAID ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {order.payment.status}
                          </span>
                          {order.payment.dueAmount > 0 && <span className="text-[8px] font-bold text-slate-400">(৳{order.payment.dueAmount} due)</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${getStatusColor(order.delivery.status)}`}>
                        {order.delivery.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {order.payment.dueAmount > 0 && (
                          <button 
                            onClick={() => handleOpenPaymentModal(order.id)} 
                            title="Collect Cash"
                            className="p-2.5 text-emerald-500 hover:text-white hover:bg-emerald-500 rounded-xl shadow-sm border border-transparent transition-all"
                          >
                            <Banknote size={16} />
                          </button>
                        )}
                        <button 
                          onClick={() => setSelectedOrderId(order.id)} 
                          title="View Details"
                          className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-slate-100 transition-all"
                        >
                          <Eye size={16} />
                        </button>
                        {order.delivery.status !== OrderStatus.DELIVERED && (
                          <button 
                            onClick={() => onUpdateStatus(order.id, OrderStatus.DELIVERED)} 
                            title="Mark Delivered"
                            className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-slate-100 transition-all"
                          >
                            <CheckCircle size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredOrders.length === 0 && (
            <div className="p-20 text-center">
              <Package size={56} className="mx-auto text-slate-100 mb-6" />
              <p className="text-slate-400 font-black uppercase text-xs tracking-[0.2em]">No Operational Records Found</p>
            </div>
          )}
        </div>

        {/* Side Detail Panel */}
        <div className="space-y-6">
          {selectedOrder ? (
            <div className="bg-slate-900 text-white rounded-[2.5rem] shadow-2xl p-8 relative overflow-hidden animate-in slide-in-from-right-10 duration-300">
              <div className="relative z-10 h-full flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-tighter">Order Dossier</h3>
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{selectedOrder.id}</p>
                  </div>
                  <button onClick={() => setSelectedOrderId(null)} className="bg-slate-800 text-slate-400 hover:text-white p-3 rounded-2xl transition-colors">
                    <XCircle size={20} />
                  </button>
                </div>

                <div className="space-y-6 overflow-y-auto pr-2 scrollbar-hide flex-1">
                  <div className="bg-slate-800/50 p-6 rounded-3xl border border-slate-800">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Paid</p>
                        <p className="text-xl font-black text-emerald-400">৳{selectedOrder.payment.paidAmount.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Balance Due</p>
                        <p className={`text-xl font-black ${selectedOrder.payment.dueAmount > 0 ? 'text-rose-400' : 'text-slate-400'}`}>৳{selectedOrder.payment.dueAmount.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {selectedOrder.delivery.status !== OrderStatus.RETURNED && selectedOrder.delivery.status !== OrderStatus.CANCELLED && (
                    <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-2xl flex items-start space-x-3">
                      <AlertCircle className="text-indigo-400 shrink-0 mt-0.5" size={16} />
                      <p className="text-[10px] text-indigo-200 font-bold leading-relaxed">
                        Setting this order to <span className="text-white">Returned</span> or <span className="text-white">Cancelled</span> will add <span className="text-white font-black">{selectedOrder.quantity} units</span> back to inventory.
                      </p>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Payment Ledger</p>
                      {selectedOrder.payment.dueAmount > 0 && (
                        <button 
                          onClick={() => handleOpenPaymentModal(selectedOrder.id)}
                          className="flex items-center space-x-1 text-[9px] font-black text-indigo-400 hover:text-indigo-300 uppercase tracking-widest bg-indigo-500/5 px-2 py-1 rounded-lg border border-indigo-500/20"
                        >
                          <Plus size={10} />
                          <span>Add Payment</span>
                        </button>
                      )}
                    </div>
                    <div className="space-y-3">
                      {!selectedOrder.payment.history || selectedOrder.payment.history.length === 0 ? (
                        <p className="text-center text-[10px] text-slate-600 font-bold py-4 bg-slate-800/20 rounded-2xl border border-dashed border-slate-800">No history.</p>
                      ) : (
                        selectedOrder.payment.history.map((pay) => (
                          <div key={pay.id} className="bg-slate-800/30 p-4 rounded-2xl border border-slate-800 flex justify-between items-center group">
                             <div className="flex items-center space-x-3">
                                <div className="p-2 bg-slate-700 rounded-xl text-emerald-400">
                                   <Banknote size={14} />
                                </div>
                                <div>
                                   <p className="text-[10px] font-black">৳{pay.amount.toLocaleString()}</p>
                                   <p className="text-[8px] text-slate-500 font-bold uppercase">{pay.method} • {new Date(pay.date).toLocaleDateString()}</p>
                                </div>
                             </div>
                             <div className="text-right">
                                <p className="text-[8px] text-indigo-400 font-black uppercase">{pay.receivedBy}</p>
                             </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="space-y-4 text-sm pt-4 border-t border-slate-800">
                    <div className="flex justify-between items-center py-2">
                      <span className="text-slate-500 font-bold uppercase text-[10px]">Product</span>
                      <span className="font-black text-indigo-400 truncate max-w-[150px]">{selectedOrder.productName} (x{selectedOrder.quantity})</span>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Delivery Coordinates</p>
                      <p className="text-slate-300 text-xs leading-relaxed font-bold">
                        {selectedOrder.customer.address.village}, {selectedOrder.customer.address.district}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-auto border-t border-slate-800">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Transition Workflow</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => onUpdateStatus(selectedOrder.id, OrderStatus.PROCESSING)}
                      className={`px-4 py-3 rounded-2xl text-[10px] font-black uppercase transition-all ${selectedOrder.delivery.status === OrderStatus.PROCESSING ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-800 text-slate-500 hover:bg-slate-700'}`}
                    >
                      Process
                    </button>
                    <button 
                      onClick={() => onUpdateStatus(selectedOrder.id, OrderStatus.DELIVERED)}
                      className={`px-4 py-3 rounded-2xl text-[10px] font-black uppercase transition-all ${selectedOrder.delivery.status === OrderStatus.DELIVERED ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-800 text-slate-500 hover:bg-slate-700'}`}
                    >
                      Deliver
                    </button>
                    <button 
                      onClick={() => onUpdateStatus(selectedOrder.id, OrderStatus.RETURNED)}
                      className={`px-4 py-3 rounded-2xl text-[10px] font-black uppercase flex items-center justify-center space-x-2 ${selectedOrder.delivery.status === OrderStatus.RETURNED ? 'bg-rose-600 text-white' : 'bg-slate-800 text-rose-400/60'}`}
                    >
                      <Undo2 size={12} />
                      <span>Return</span>
                    </button>
                    <button 
                      onClick={() => onUpdateStatus(selectedOrder.id, OrderStatus.CANCELLED)}
                      className={`px-4 py-3 rounded-2xl text-[10px] font-black uppercase flex items-center justify-center space-x-2 ${selectedOrder.delivery.status === OrderStatus.CANCELLED ? 'bg-red-600 text-white' : 'bg-slate-800 text-red-400/60'}`}
                    >
                      <XCircle size={12} />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm h-full flex flex-col justify-center text-center">
              <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-600 mx-auto mb-6">
                <Truck size={40} />
              </div>
              <h3 className="font-black text-slate-800 uppercase tracking-tight text-xl">Order Management</h3>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-2 mb-10">Select an entry to view dossier</p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center space-x-3">
                    <Activity size={16} className="text-amber-500" />
                    <span className="text-[10px] font-black uppercase text-slate-500">Pending Pool</span>
                  </div>
                  <span className="font-black text-slate-900">{stats.pending}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center space-x-3">
                    <Package size={16} className="text-indigo-500" />
                    <span className="text-[10px] font-black uppercase text-slate-500">In Processing</span>
                  </div>
                  <span className="font-black text-slate-900">{stats.processing}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <div className="flex items-center space-x-3">
                    <CheckCircle size={16} className="text-emerald-500" />
                    <span className="text-[10px] font-black uppercase text-slate-600">Delivered</span>
                  </div>
                  <span className="font-black text-emerald-600">{stats.delivered}</span>
                </div>
              </div>

              <div className="mt-12 p-6 bg-slate-900 rounded-[2rem] text-left relative overflow-hidden group cursor-pointer hover:bg-black transition-colors">
                <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Global Health</p>
                <h4 className="text-white font-black text-xs uppercase">Check Audit Network</h4>
                <ArrowRight className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-700 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" size={20} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderList;
