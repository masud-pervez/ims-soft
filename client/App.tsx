import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import OrderEntry from "./pages/OrderEntry";
import OrderList from "./pages/OrderList";
import Inventory from "./pages/Inventory";
import Expenses from "./pages/Expenses";
import Purchases from "./pages/Purchases";
import Reports from "./pages/Reports";
import AuditNetwork from "./pages/AuditNetwork";
import UserManagement from "./pages/UserManagement";

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ProtectedRoute from "./components/ProtectedRoute";

import { INITIAL_USERS } from "./constants";
import { User } from "./types";

const queryClient = new QueryClient();

// Helper to get user from storage (Optional if handled by hook, keeping for queryClient potentially if needed externally)
// But strictly simpler:
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="scan-order" element={<OrderEntry />} />
            <Route path="order-list" element={<OrderList />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="purchases" element={<Purchases />} />
            <Route path="expenses" element={<Expenses />} />
            <Route path="reports" element={<Reports />} />
            <Route path="audit-network" element={<AuditNetwork />} />
            <Route path="users" element={<UserManagement />} />
            {/* Catch all redirect to dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Route>
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
