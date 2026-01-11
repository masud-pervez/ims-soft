# Frontend Generation Prompt: Modern Inventory Management System (IMS)

## Project Overview

Build a production-ready, highly aesthetic, and responsive **Inventory Management System (IMS)** frontend using **Next.js (App Router)**. The application must connect to an existing Express.js backend API and support **Dark Mode** by default (with a toggle).

**IMPORTANT: The project must be initialized in a folder named `Frontend` (sibling to the `server` folder).**

## Tech Stack

- **Framework:** Next.js (Latest) with TypeScript
- **Styling:** Tailwind CSS (v3.4+)
- **UI Library:** Shadcn UI (Radix Primitives)
- **State Management:** React Query (TanStack Query) for massive server-state checking.
- **Icons:** Lucide React
- **Charts:** Recharts (for Dashboard analytics)
- **Forms:** React Hook Form + Zod validation
- **HTTP Client:** Axios (with interceptors for JWT auth)

## Design Aesthetics

- **Theme:** "Modern Premium" – generic/flat designs.
- **Colors:** Deep/State blacks (`#09090b`) for backgrounds in dark mode, vibrant accents (e.g., Indigo/Violet or Emerald) for primary actions.
- **Glassmorphism:** Subtle glass effects on sidebars, cards, and modals.
- **Interactions:** smooth transitions, hover effects on rows/cards, skeleton loading states.
- **Layout:**
  - **Sidebar:** Collapsible, sticky left navigation.
  - **Top Bar:** Breadcrumbs, Global Search, Theme Toggle, User Profile dropdown.
  - **Content Area:** Padding-rich, card-based layouts.

## Core Features & Requirements

### 1. Authentication (Auth System)

- **Sign In (Login):** Beautiful split-screen layout (Image on left, Form on right).
- **Sign Up (Register):** Dedicated registration page with form validation.
- **Features:** JWT storage (localStorage/cookies), redirect processing, and "Forgot Password" UI.

### 2. Role-Based Access Control (RBAC)

The app must adapt based on the logged-in user:

- **Admin:** Full access to all modules, settings, and user management.
- **Staff:** Restricted access (e.g., can manage Orders/Products but cannot access System Settings or Audit Logs).
- **Dashboard Variants:**
  - **Admin Dashboard:** High-level financial overview (Revenue, Net Profit), Staff performance, System health.
  - **Staff Dashboard:** Daily tasks, Recent orders, Low stock alerts.

### 3. Module Breakdown (Based on API)

#### A. Users & Permissions

- Data Grid showing all users.
- Role management & status toggling.

#### B. Inventory (Products & Categories)

- **Product List:** Advanced table with filters.
- **Stock Management:** Dedicated page for stock adjustments and tracking.
- **Stock Indicators:** Color-coded badges.
- **Categories:** Tree or list view.

#### C. Order Management

- **Transactions:** Separate pages for distinct workflows:
  - **Sales Page:** Create and view sales.
  - **Purchase Page:** Create and view purchases.
  - **Returns:** Dedicated sub-pages for Sales Returns and Purchase Returns.
- **Invoice Generation:** Visual invoice preview.

#### D. People (Customers & Suppliers)

- CRM-lite features: Contact info, Order history.

#### E. Finance & Reports

- **Income & Expenses:** Dedicated sub-modules.
- **Reports:** Comprehensive analytics dashboard including:
  - **Daily & Weekly Sales Reports**
  - **User Performance Report:** Sales tracked by staff member.
  - **Top Selling Products**
  - **Daily Ledger:** Detailed financial movements.
  - **Profit & Loss Statement**

#### F. System (Admin Only)

- Audit Logs: Timeline view of system activities.
- Backup/Settings: UI for triggering system backups.

## Technical Implementation Guidelines

1.  **Axios Instance:** Create a `lib/axios.ts` that automatically attaches the `Bearer <token>` from storage.
2.  **Wrappers:** Use a `DashboardLayout` for protected routes and `AuthLayout` for public routes.
3.  **Hooks:** Create custom hooks like `useAuth`, `useInventory`.
4.  **Error Handling:** Global Toasts (Sonner/Hot-Toast) for API success/error messages.

### Data Fetching Architecture

- **Tech:** TanStack Query (React Query) is mandatory.
- **Custom Hooks:** Create reusable generic hooks:
  - `useFetchData`: Wrapper around `useQuery` for GET requests.
  - `usePostData`: Wrapper around `useMutation` for POST/PUT/DELETE requests.
- **API Organization:** Do not write API calls inside components. Create a dedicated `api` or `services` folder with specific files for each domain:
  - `api/auth.ts`
  - `api/products.ts`
  - `api/orders.ts`
  - etc.

## Folder Structure Suggestion

```
/Frontend  <-- Project Root
  /app
    /(auth)/login/page.tsx
    /(auth)/signup/page.tsx
    /(dashboard)/layout.tsx
    /(dashboard)/page.tsx
    /(dashboard)/users/page.tsx
    /(dashboard)/inventory/page.tsx
    /(dashboard)/inventory/stock/page.tsx
    /(dashboard)/orders/sales/page.tsx
    /(dashboard)/orders/purchase/page.tsx
    /(dashboard)/orders/returns/sales/page.tsx
    /(dashboard)/orders/returns/purchase/page.tsx
    /(dashboard)/customers/page.tsx
    /(dashboard)/finance/income/page.tsx
    /(dashboard)/finance/expense/page.tsx
    /(dashboard)/reports/daily-sales/page.tsx
    /(dashboard)/reports/weekly-sales/page.tsx
    /(dashboard)/reports/ledger/page.tsx
    /(dashboard)/reports/profit-loss/page.tsx
    /(dashboard)/settings/page.tsx
  /components
    /ui (shadcn)
    /shared (Sidebar, Header, DataTable)
  /hooks
    useFetchData.ts
    usePostData.ts
  /api  <-- Dedicated API calls per feature
    auth.ts
    products.ts
    orders.ts
  /lib
    axios.ts
    utils.ts
  /types
    api.ts
```
