import React, { useState, useMemo } from "react";
import {
  // Fix: Alias User to UserIcon to resolve the missing name error on line 226
  User as UserIcon,
  MapPin,
  Phone,
  Package,
  Tag,
  Truck,
  CreditCard,
  Calendar,
  Save,
  Globe,
  MessageCircle,
  Link as LinkIcon,
  Facebook,
} from "lucide-react";
import {
  Product,
  Order,
  DeliveryType,
  OrderStatus,
  PaymentStatus,
} from "../types";
import { DISTRICTS, PAYMENT_METHODS, DELIVERY_CHARGES } from "../constants";

import { useProducts, useCreateOrder } from "../hooks/useQueries";

interface OrderEntryProps {
  currentUser: any;
}

const OrderEntry: React.FC<OrderEntryProps> = ({ currentUser }) => {
  const { data: products = [] } = useProducts();
  const createOrder = useCreateOrder();

  const onAddOrder = async (order: Order) => {
    try {
      await createOrder.mutateAsync(order);
      // Reset form or show success is handled by mutation, but here we might want to clear form.
      // For now maintaining existing "parent handles it" logic but inside component.
      alert("Order created successfully!");
    } catch (e: any) {
      alert(e.message || "Failed to create order.");
    }
  };

  const [formData, setFormData] = useState({
    anjoliRef: "",
    papiyaRef: "",
    mahabubRef: "",
    fbLink: "",
    platform: "Facebook" as "Facebook" | "WhatsApp",
    profileName: "",
    receiverName: "",
    phone: "",
    village: "",
    union: "",
    thana: "",
    district: DISTRICTS[0],
    productId: "",
    quantity: 1,
    discountType: "fixed" as "fixed" | "percentage",
    discountValue: 0,
    discountReason: "",
    deliveryType: DeliveryType.INSIDE,
    paymentMethod: PAYMENT_METHODS[0],
    paidAmount: 0,
    transactionId: "",
    proposedDeliveryDate: "",
    customerRequiredDate: "",
    notes: "",
  });

  const selectedProduct = useMemo(
    () => products.find((p) => p.id === formData.productId),
    [formData.productId, products]
  );

  const calculations = useMemo(() => {
    const subtotal = (selectedProduct?.sellingPrice || 0) * formData.quantity;
    const discountAmount =
      formData.discountType === "fixed"
        ? formData.discountValue
        : (subtotal * formData.discountValue) / 100;

    const deliveryCharge = DELIVERY_CHARGES[formData.deliveryType];
    const netPayable = subtotal - discountAmount + deliveryCharge;
    const dueAmount = netPayable - formData.paidAmount;

    const totalCost = (selectedProduct?.costPrice || 0) * formData.quantity;
    const profit = netPayable - totalCost - deliveryCharge;

    return {
      subtotal,
      discountAmount,
      deliveryCharge,
      netPayable,
      dueAmount,
      profit,
    };
  }, [selectedProduct, formData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return alert("Select a product");
    if (selectedProduct.currentStock < formData.quantity)
      return alert("Insufficient stock!");
    if (!formData.phone.match(/^\d{10,14}$/))
      return alert("Invalid phone number (10-14 digits)");
    if (!formData.profileName.trim()) return alert("Profile Name is required");

    const now = new Date();
    const order: Order = {
      id: `NC-${String(Date.now()).slice(-4)}`,
      refNumbers: {
        anjoli: formData.anjoliRef,
        papiya: formData.papiyaRef,
        mahabub: formData.mahabubRef,
      },
      facebookLink: formData.fbLink,
      customer: {
        name: formData.receiverName,
        phone: formData.phone,
        platform: formData.platform,
        profileName: formData.profileName,
        address: {
          village: formData.village,
          union: formData.union,
          thana: formData.thana,
          district: formData.district,
        },
      },
      productId: formData.productId,
      productName: selectedProduct.name,
      quantity: formData.quantity,
      unitPrice: selectedProduct.sellingPrice,
      subtotal: calculations.subtotal,
      discount: {
        type: formData.discountType,
        value: formData.discountValue,
        amount: calculations.discountAmount,
        reason: formData.discountReason,
      },
      delivery: {
        type: formData.deliveryType,
        charge: calculations.deliveryCharge,
        status: OrderStatus.PENDING,
      },
      payment: {
        status:
          calculations.dueAmount <= 0
            ? PaymentStatus.PAID
            : formData.paidAmount > 0
            ? PaymentStatus.PARTIAL
            : PaymentStatus.UNPAID,
        method: formData.paymentMethod,
        paidAmount: formData.paidAmount,
        dueAmount: calculations.dueAmount,
        transactionId: formData.transactionId,
      },
      financials: {
        netPayable: calculations.netPayable,
        profit: calculations.profit,
      },
      meta: {
        orderDate: now.toISOString().split("T")[0],
        proposedDeliveryDate: formData.proposedDeliveryDate,
        customerRequiredDate: formData.customerRequiredDate,
        receivedBy: currentUser.name,
        notes: formData.notes,
        month: now.getMonth() + 1,
        year: now.getFullYear(),
      },
    };

    onAddOrder(order);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-6xl mx-auto pb-20 animate-in fade-in duration-700"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Order Architecture
          </h2>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1">
            Acquisition & Logistical Data Entry
          </p>
        </div>
        <button
          type="submit"
          className="bg-indigo-600 text-white px-10 py-4 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center space-x-3"
        >
          <Save size={18} />
          <span>Confirm Record</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-8 lg:col-span-2">
          {/* Source Panel */}
          <section className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform"></div>
            <div className="relative z-10">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8 flex items-center">
                <Globe size={14} className="mr-2 text-indigo-500" />
                Acquisition Origin
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                    Target Platform
                  </label>
                  <div className="flex items-center p-1.5 bg-slate-100 rounded-[1.5rem] border border-slate-200">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, platform: "Facebook" })
                      }
                      className={`flex-1 flex items-center justify-center space-x-2 py-3.5 rounded-[1.2rem] font-black text-[10px] uppercase tracking-widest transition-all ${
                        formData.platform === "Facebook"
                          ? "bg-white text-blue-600 shadow-xl shadow-slate-200"
                          : "text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      <Facebook size={16} />
                      <span>Facebook</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, platform: "WhatsApp" })
                      }
                      className={`flex-1 flex items-center justify-center space-x-2 py-3.5 rounded-[1.2rem] font-black text-[10px] uppercase tracking-widest transition-all ${
                        formData.platform === "WhatsApp"
                          ? "bg-white text-emerald-600 shadow-xl shadow-slate-200"
                          : "text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      <MessageCircle size={16} />
                      <span>WhatsApp</span>
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                    Profile Identity *
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.profileName}
                    onChange={(e) =>
                      setFormData({ ...formData, profileName: e.target.value })
                    }
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-black focus:ring-4 focus:ring-indigo-500/10 transition-all"
                    placeholder="Username / Account Name"
                  />
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                  Profile / Chat URL
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={formData.fbLink}
                    onChange={(e) =>
                      setFormData({ ...formData, fbLink: e.target.value })
                    }
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-14 pr-6 text-sm font-black focus:ring-4 focus:ring-indigo-500/10 transition-all"
                    placeholder="https://facebook.com/user_profile"
                  />
                  <LinkIcon
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"
                    size={18}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                    Anjoli Ref
                  </label>
                  <input
                    type="text"
                    value={formData.anjoliRef}
                    onChange={(e) =>
                      setFormData({ ...formData, anjoliRef: e.target.value })
                    }
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-black"
                    placeholder="A-000"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                    Papiya Ref
                  </label>
                  <input
                    type="text"
                    value={formData.papiyaRef}
                    onChange={(e) =>
                      setFormData({ ...formData, papiyaRef: e.target.value })
                    }
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-black"
                    placeholder="P-000"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                    Mahabub Ref
                  </label>
                  <input
                    type="text"
                    value={formData.mahabubRef}
                    onChange={(e) =>
                      setFormData({ ...formData, mahabubRef: e.target.value })
                    }
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-black"
                    placeholder="M-000"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Identity Panel */}
          <section className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
            <div className="flex items-center space-x-3 mb-8">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                <UserIcon size={20} />
              </div>
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">
                Delivery Logistics
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                  Receiver Name *
                </label>
                <input
                  required
                  type="text"
                  value={formData.receiverName}
                  onChange={(e) =>
                    setFormData({ ...formData, receiverName: e.target.value })
                  }
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-black"
                  placeholder="Contact person name"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                  Primary Phone *
                </label>
                <div className="relative">
                  <input
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-14 pr-6 text-sm font-black"
                    placeholder="017XXXXXXXX"
                  />
                  <Phone
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"
                    size={18}
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                  Village
                </label>
                <input
                  type="text"
                  value={formData.village}
                  onChange={(e) =>
                    setFormData({ ...formData, village: e.target.value })
                  }
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-black"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                  Union
                </label>
                <input
                  type="text"
                  value={formData.union}
                  onChange={(e) =>
                    setFormData({ ...formData, union: e.target.value })
                  }
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-black"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                  Thana
                </label>
                <input
                  type="text"
                  value={formData.thana}
                  onChange={(e) =>
                    setFormData({ ...formData, thana: e.target.value })
                  }
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-black"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                  District
                </label>
                <select
                  value={formData.district}
                  onChange={(e) =>
                    setFormData({ ...formData, district: e.target.value })
                  }
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-black appearance-none"
                >
                  {DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Product Panel */}
          <section className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
            <div className="flex items-center space-x-3 mb-8">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                <Package size={20} />
              </div>
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">
                Stock Commitment
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="md:col-span-3">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                  Select Inventory Item *
                </label>
                <select
                  required
                  value={formData.productId}
                  onChange={(e) =>
                    setFormData({ ...formData, productId: e.target.value })
                  }
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-black appearance-none"
                >
                  <option value="">-- Click to choose --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (৳{p.sellingPrice}) — Stock: {p.currentStock}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                  Quantity *
                </label>
                <input
                  required
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      quantity: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-black"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Commercial Sidebar */}
        <div className="space-y-8">
          <section className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute bottom-0 left-0 w-full h-1 bg-indigo-500"></div>
            <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] mb-8">
              Commercial Matrix
            </h3>
            <div className="space-y-6">
              <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-slate-500 uppercase text-[10px] tracking-widest">
                  Base Value
                </span>
                <span className="text-slate-200">
                  ৳{calculations.subtotal.toLocaleString()}
                </span>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 uppercase text-[10px] tracking-widest">
                    Adjustment
                  </span>
                  <div className="flex bg-slate-800 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, discountType: "fixed" })
                      }
                      className={`px-3 py-1.5 rounded-lg text-[9px] font-black transition-all ${
                        formData.discountType === "fixed"
                          ? "bg-indigo-600 text-white shadow-lg"
                          : "text-slate-500"
                      }`}
                    >
                      ৳
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, discountType: "percentage" })
                      }
                      className={`px-3 py-1.5 rounded-lg text-[9px] font-black transition-all ${
                        formData.discountType === "percentage"
                          ? "bg-indigo-600 text-white shadow-lg"
                          : "text-slate-500"
                      }`}
                    >
                      %
                    </button>
                  </div>
                </div>
                <input
                  type="number"
                  value={formData.discountValue}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      discountValue: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm text-indigo-400 font-black focus:ring-2 focus:ring-indigo-500"
                  placeholder="0.00"
                />
              </div>
              <div className="pt-8 border-t border-slate-800">
                <div className="flex flex-col">
                  <span className="text-slate-500 uppercase text-[10px] tracking-widest mb-2 text-center">
                    Grand Settlement Due
                  </span>
                  <span className="text-4xl font-black text-center tracking-tighter text-white">
                    ৳{calculations.netPayable.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
            <div className="flex items-center space-x-3 mb-8">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                <CreditCard size={20} />
              </div>
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">
                Payment Stream
              </h3>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                  Settle Method
                </label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) =>
                    setFormData({ ...formData, paymentMethod: e.target.value })
                  }
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-black appearance-none"
                >
                  {PAYMENT_METHODS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                    Advance Collateral (৳)
                  </label>
                  <input
                    type="number"
                    value={formData.paidAmount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        paidAmount: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-black text-emerald-600"
                  />
                </div>
                <div className="p-6 bg-rose-50 rounded-[2rem] border border-rose-100">
                  <label className="block text-[10px] font-black text-rose-400 uppercase tracking-widest mb-1 text-center">
                    Remaining Balance
                  </label>
                  <p className="text-2xl font-black text-rose-600 text-center">
                    ৳{calculations.dueAmount.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </form>
  );
};

export default OrderEntry;
