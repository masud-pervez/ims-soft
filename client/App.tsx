import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";

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

import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";

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
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        <Route path="/" element={<Layout currentUser={currentUser} />}>
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
