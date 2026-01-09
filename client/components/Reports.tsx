import React, { useMemo, useState } from "react";
import {
  BarChart3,
  Download,
  ArrowUpRight,
  Layers,
  PieChart as PieChartIcon,
  TrendingUp,
  Target,
  Users as UsersIcon,
  CreditCard,
  Briefcase,
  FileSpreadsheet,
  FileText,
  FileCode,
  File as FileIcon,
  ChevronDown,
  Printer,
  ShoppingBag,
  History,
  TrendingDown,
} from "lucide-react";
import {
  Order,
  Product,
  User,
  Category,
  OrderStatus,
  Expense,
  ExpenseType,
} from "../types";

import {
  useOrders,
  useProducts,
  useCategories,
  useExpenses,
} from "../hooks/useQueries";
import { INITIAL_USERS } from "../constants";

const Reports: React.FC = () => {
  const { data: orders = [] } = useOrders();
  const { data: products = [] } = useProducts();
  const { data: categories = [] } = useCategories();
  const { data: expenses = [] } = useExpenses();
  const users = INITIAL_USERS;

  const [individualFilter, setIndividualFilter] = useState<string>("All");
  const [showExportMenu, setShowExportMenu] = useState(false);

  const analytics = useMemo(() => {
    const successfulOrders = orders.filter(
      (o) =>
        o.delivery.status !== OrderStatus.CANCELLED &&
        o.delivery.status !== OrderStatus.RETURNED
    );

    const filteredOrders =
      individualFilter === "All"
        ? successfulOrders
        : successfulOrders.filter(
            (o) => o.meta.receivedBy === individualFilter
          );

    const filteredExpenses =
      individualFilter === "All"
        ? expenses
        : expenses.filter((e) => e.createdBy === individualFilter);

    const totalRevenue = filteredOrders.reduce(
      (sum, o) => sum + Number(o.financials.netPayable || 0),
      0
    );
    const grossProfit = filteredOrders.reduce(
      (sum, o) => sum + Number(o.financials.profit || 0),
      0
    );
    const totalOPEX = filteredExpenses.reduce(
      (sum, e) => sum + Number(e.amount || 0),
      0
    );
    const netYield = grossProfit - totalOPEX;

    const categoryStats = categories
      .map((cat) => {
        const catProducts = products.filter((p) => p.categoryId === cat.id);
        const catOrders = filteredOrders.filter((o) =>
          catProducts.some((p) => p.id === o.productId)
        );
        const sales = catOrders.reduce(
          (sum, o) => sum + Number(o.financials.netPayable || 0),
          0
        );
        return { name: cat.name, sales };
      })
      .sort((a, b) => b.sales - a.sales);

    const expenseStats = Object.values(ExpenseType)
      .map((type) => {
        const amount = filteredExpenses
          .filter((e) => e.type === type)
          .reduce((sum, e) => sum + Number(e.amount || 0), 0);
        return { name: type, amount };
      })
      .filter((e) => e.amount > 0)
      .sort((a, b) => b.amount - a.amount);

    // Individual staff performance breakdown
    const staffStats = users.map((user) => {
      const userOrders = successfulOrders.filter(
        (o) => o.meta.receivedBy === user.name
      );
      const userExpenses = expenses.filter((e) => e.createdBy === user.name);
      const revenue = userOrders.reduce(
        (sum, o) => sum + Number(o.financials.netPayable || 0),
        0
      );
      const opex = userExpenses.reduce(
        (sum, e) => sum + Number(e.amount || 0),
        0
      );
      return {
        id: user.id,
        name: user.name,
        role: user.role,
        orderCount: userOrders.length,
        revenue,
        opex,
        orders: userOrders,
        expenses: userExpenses,
      };
    });

    return {
      totalRevenue,
      grossProfit,
      totalOPEX,
      netYield,
      categoryStats,
      expenseStats,
      filteredOrders,
      filteredExpenses,
      staffStats,
    };
  }, [orders, products, categories, expenses, individualFilter, users]);

  const exportReport = (
    targetName: string,
    targetOrders: Order[],
    targetExpenses: Expense[],
    format: "excel" | "word" | "xml"
  ) => {
    let content = "";
    let fileName = `Performance_Report_${targetName.replace(/\s+/g, "_")}_${
      new Date().toISOString().split("T")[0]
    }`;
    let mimeType = "";

    const rev = targetOrders.reduce(
      (sum, o) => sum + Number(o.financials.netPayable || 0),
      0
    );
    const exp = targetExpenses.reduce(
      (sum, e) => sum + Number(e.amount || 0),
      0
    );

    if (format === "excel") {
      mimeType = "text/csv;charset=utf-8;";
      fileName += ".csv";
      content = "Date,Type,Category,Description,Amount,Logged By\n";
      targetOrders.forEach((o) => {
        content += `${o.meta.orderDate},Inflow,Sales,Order ${o.id},${o.financials.netPayable},${o.meta.receivedBy}\n`;
      });
      targetExpenses.forEach((e) => {
        content += `${e.date},Outflow,${e.type},"${e.description.replace(
          /"/g,
          '""'
        )}",${e.amount},${e.createdBy}\n`;
      });
      content += `\n,,TOTAL REVENUE,,${rev},\n,,TOTAL EXPENSE,,${exp},\n,,NET YIELD,,${
        rev - exp
      },`;
    } else if (format === "word") {
      mimeType = "application/msword";
      fileName += ".doc";
      content = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head><meta charset='utf-8'></head>
        <body style="font-family: 'Segoe UI', Arial, sans-serif; padding: 40px;">
          <h1 style="color: #4f46e5; text-align: center; border-bottom: 3px solid #6366f1; padding-bottom: 20px;">Staff Performance Dossier</h1>
          <div style="background: #f8fafc; padding: 25px; border-radius: 15px; margin: 25px 0; border: 1px solid #e2e8f0;">
            <p style="margin: 5px 0;"><strong>Agent Name:</strong> ${targetName}</p>
            <p style="margin: 5px 0;"><strong>Reporting Cycle:</strong> ${new Date().toLocaleDateString()}</p>
            <p style="margin: 5px 0;"><strong>Total Volume:</strong> ${
              targetOrders.length
            } Completed Cycles</p>
          </div>
          <h2 style="color: #1e293b; border-left: 5px solid #4f46e5; padding-left: 15px;">Financial Summary</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr><td style="padding: 10px; border: 1px solid #e2e8f0; background: #f1f5f9;">Gross Revenue</td><td style="padding: 10px; border: 1px solid #e2e8f0; text-align: right;">৳${rev.toLocaleString()}</td></tr>
            <tr><td style="padding: 10px; border: 1px solid #e2e8f0; background: #f1f5f9;">Operational Expense</td><td style="padding: 10px; border: 1px solid #e2e8f0; text-align: right;">৳${exp.toLocaleString()}</td></tr>
            <tr style="font-weight: bold; font-size: 1.2em;"><td style="padding: 15px; border: 1px solid #e2e8f0; background: #4f46e5; color: white;">Net Yield</td><td style="padding: 15px; border: 1px solid #e2e8f0; text-align: right; background: #4f46e5; color: white;">৳${(
              rev - exp
            ).toLocaleString()}</td></tr>
          </table>
          <p style="margin-top: 50px; text-align: center; font-size: 0.8em; color: #94a3b8;">Generated by OmniOrder Pro BI Engine</p>
        </body>
        </html>`;
    } else if (format === "xml") {
      mimeType = "text/xml";
      fileName += ".xml";
      content = `<?xml version="1.0" encoding="UTF-8"?>
<PerformanceReport>
  <Header>
    <Agent>${targetName}</Agent>
    <Generated>${new Date().toISOString()}</Generated>
  </Header>
  <Aggregates>
    <Revenue>${rev}</Revenue>
    <Expense>${exp}</Expense>
    <NetYield>${rev - exp}</NetYield>
    <OrderCount>${targetOrders.length}</OrderCount>
  </Aggregates>
  <Details>
    <Orders>${targetOrders
      .map(
        (o) =>
          `<Order><ID>${o.id}</ID><Value>${o.financials.netPayable}</Value><Date>${o.meta.orderDate}</Date></Order>`
      )
      .join("")}</Orders>
    <Expenses>${targetExpenses
      .map(
        (e) =>
          `<Expense><Type>${e.type}</Type><Amount>${e.amount}</Amount></Expense>`
      )
      .join("")}</Expenses>
  </Details>
</PerformanceReport>`;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowExportMenu(false);
  };

  return (
    <div className="space-y-12 pb-24">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            BI Reporting Engine
          </h2>
          <p className="text-slate-500 font-medium mt-1">
            Consolidated network performance & expenditure matrix
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-white rounded-2xl border border-slate-100 px-4 py-2 shadow-sm">
            <UsersIcon size={16} className="text-slate-400 mr-3" />
            <select
              value={individualFilter}
              onChange={(e) => setIndividualFilter(e.target.value)}
              className="bg-transparent border-none text-xs font-black uppercase tracking-widest outline-none cursor-pointer"
            >
              <option value="All">Full Network View</option>
              {users.map((u) => (
                <option key={u.id} value={u.name}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="bg-slate-900 text-white px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center space-x-3 shadow-xl hover:bg-black transition-all"
            >
              <Download size={16} />
              <span>Consolidated Export</span>
              <ChevronDown
                size={14}
                className={`transition-transform ${
                  showExportMenu ? "rotate-180" : ""
                }`}
              />
            </button>
            {showExportMenu && (
              <div className="absolute right-0 mt-4 w-56 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-[50] animate-in slide-in-from-top-2 duration-200">
                <button
                  onClick={() =>
                    exportReport(
                      individualFilter,
                      analytics.filteredOrders,
                      analytics.filteredExpenses,
                      "excel"
                    )
                  }
                  className="w-full flex items-center space-x-3 px-6 py-4 text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <FileSpreadsheet size={18} className="text-emerald-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Excel (CSV)
                  </span>
                </button>
                <button
                  onClick={() =>
                    exportReport(
                      individualFilter,
                      analytics.filteredOrders,
                      analytics.filteredExpenses,
                      "word"
                    )
                  }
                  className="w-full flex items-center space-x-3 px-6 py-4 text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <FileText size={18} className="text-blue-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Word (DOC)
                  </span>
                </button>
                <button
                  onClick={() =>
                    exportReport(
                      individualFilter,
                      analytics.filteredOrders,
                      analytics.filteredExpenses,
                      "xml"
                    )
                  }
                  className="w-full flex items-center space-x-3 px-6 py-4 text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <FileCode size={18} className="text-amber-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    XML Data
                  </span>
                </button>
                <button
                  onClick={() => {
                    setShowExportMenu(false);
                    window.print();
                  }}
                  className="w-full flex items-center space-x-3 px-6 py-4 text-slate-600 hover:bg-slate-50 transition-colors border-t border-slate-100"
                >
                  <Printer size={18} className="text-slate-900" />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Print Full Report
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">
            Realized Revenue
          </p>
          <h4 className="text-2xl font-black text-slate-900">
            ৳{analytics.totalRevenue.toLocaleString()}
          </h4>
          <TrendingUp
            className="absolute -bottom-4 -right-4 text-indigo-50/50"
            size={80}
          />
        </div>
        <div className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">
            Operational Outflow
          </p>
          <h4 className="text-2xl font-black text-rose-600">
            ৳{analytics.totalOPEX.toLocaleString()}
          </h4>
          <TrendingDown
            className="absolute -bottom-4 -right-4 text-rose-50/50"
            size={80}
          />
        </div>
        <div className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">
            Staff Contribution
          </p>
          <h4 className="text-2xl font-black text-indigo-600">
            {analytics.filteredOrders.length} Orders
          </h4>
          <ShoppingBag
            className="absolute -bottom-4 -right-4 text-indigo-50/50"
            size={80}
          />
        </div>
        <div className="bg-slate-900 p-7 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">
            Net Financial Yield
          </p>
          <h4 className="text-2xl font-black">
            ৳{analytics.netYield.toLocaleString()}
          </h4>
          <Target
            className="absolute -bottom-4 -right-4 text-slate-800"
            size={80}
          />
        </div>
      </div>

      {/* Main Charts & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
            <div className="flex items-center space-x-3 mb-10">
              <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600">
                <Briefcase size={20} />
              </div>
              <h3 className="font-black text-slate-800 uppercase tracking-tight">
                Opex Matrix
              </h3>
            </div>
            <div className="space-y-6">
              {analytics.expenseStats.map((exp) => (
                <div key={exp.name} className="group">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-black text-slate-500 uppercase">
                      {exp.name}
                    </span>
                    <span className="text-xs font-black text-rose-600">
                      ৳{exp.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-rose-500"
                      style={{
                        width: `${
                          analytics.totalOPEX
                            ? (exp.amount / analytics.totalOPEX) * 100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Performance Ledger - NEW INDIVIDUAL REPORT DOWNLOADS SECTION */}
        <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                <UsersIcon size={20} />
              </div>
              <div>
                <h3 className="font-black text-slate-800 uppercase tracking-tight">
                  Team Performance Ledger
                </h3>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                  Individual Staff Statistics & Reports
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-50">
                  <th className="pb-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Team Member
                  </th>
                  <th className="pb-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                    Volume
                  </th>
                  <th className="pb-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                    Yield (৳)
                  </th>
                  <th className="pb-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                    Individual Exports
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {analytics.staffStats.map((staff) => (
                  <tr
                    key={staff.id}
                    className="group hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="py-5">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-xs uppercase">
                          {staff.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900 leading-tight">
                            {staff.name}
                          </p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                            {staff.role}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span className="text-xs font-black text-slate-900">
                          {staff.orderCount}
                        </span>
                        <div className="w-12 h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
                          <div
                            className="h-full bg-indigo-500"
                            style={{
                              width: `${Math.min(
                                (staff.orderCount / 100) * 100,
                                100
                              )}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 text-right font-black text-emerald-600 text-sm">
                      ৳{staff.revenue.toLocaleString()}
                    </td>
                    <td className="py-5 text-right">
                      <div className="flex items-center justify-end space-x-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() =>
                            exportReport(
                              staff.name,
                              staff.orders,
                              staff.expenses,
                              "excel"
                            )
                          }
                          title="Excel Report"
                          className="p-2 text-emerald-600 bg-white border border-slate-100 rounded-xl hover:shadow-lg transition-all"
                        >
                          <FileSpreadsheet size={14} />
                        </button>
                        <button
                          onClick={() =>
                            exportReport(
                              staff.name,
                              staff.orders,
                              staff.expenses,
                              "word"
                            )
                          }
                          title="Word Summary"
                          className="p-2 text-blue-600 bg-white border border-slate-100 rounded-xl hover:shadow-lg transition-all"
                        >
                          <FileText size={14} />
                        </button>
                        <button
                          onClick={() =>
                            exportReport(
                              staff.name,
                              staff.orders,
                              staff.expenses,
                              "xml"
                            )
                          }
                          title="XML Extract"
                          className="p-2 text-amber-500 bg-white border border-slate-100 rounded-xl hover:shadow-lg transition-all"
                        >
                          <FileCode size={14} />
                        </button>
                        <button
                          onClick={() => window.print()}
                          title="Print/PDF"
                          className="p-2 text-slate-900 bg-white border border-slate-100 rounded-xl hover:shadow-lg transition-all"
                        >
                          <Printer size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
