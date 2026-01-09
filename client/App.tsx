import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";

import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import OrderEntry from "./components/OrderEntry";
import OrderList from "./components/OrderList";
import Inventory from "./components/Inventory";
import Expenses from "./components/Expenses";
import Purchases from "./components/Purchases";
import Reports from "./components/Reports";
import AuditNetwork from "./components/AuditNetwork";
import UserManagement from "./components/UserManagement";

import { INITIAL_USERS } from "./constants";
import { User } from "./types";

// Use a simple mock for now or the first user
const DEFAULT_USER = INITIAL_USERS[0];

function App() {
  const [currentUser, setCurrentUser] = useState<User>(DEFAULT_USER);

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route
            path="scan-order"
            element={<OrderEntry currentUser={currentUser} />}
          />
          <Route
            path="order-list"
            element={<OrderList currentUser={currentUser} />}
          />
          <Route path="inventory" element={<Inventory />} />
          <Route
            path="purchases"
            element={<Purchases currentUser={currentUser} />}
          />
          <Route
            path="expenses"
            element={<Expenses currentUser={currentUser} />}
          />
          <Route path="reports" element={<Reports />} />
          <Route path="audit-network" element={<AuditNetwork />} />
          <Route path="users" element={<UserManagement />} />
          {/* Catch all redirect to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
