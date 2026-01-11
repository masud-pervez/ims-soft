# Issue #19: Missing API Services

## Priority: Critical 🔴 | Status: ✅ Complete

## Description

Create all missing API service files following the established pattern.

## Current State

- ✅ Implemented: `api/auth.ts`, `api/dashboard.ts`, `api/products.ts`
- ✅ **All 8 missing API services now implemented!** (Completed: 2026-01-12)

## Required API Services

### 1. `api/users.ts`

- GET/POST /users
- GET/PUT/DELETE /users/:id
- PUT /users/:id/permissions
- PUT /users/:id/status

### 2. `api/customers.ts`

- GET/POST /customers
- GET/PUT/DELETE /customers/:id
- GET /customers/:id/orders

### 3. `api/suppliers.ts`

- GET/POST /suppliers
- GET/PUT/DELETE /suppliers/:id
- GET /suppliers/:id/purchases

### 4. `api/categories.ts`

- GET/POST /categories
- GET/PUT/DELETE /categories/:id

### 5. `api/orders.ts`

- Sales: GET/POST /orders/sales, GET/PUT /orders/sales/:id
- Purchases: GET/POST /orders/purchase, GET/PUT /orders/purchase/:id
- Returns: GET/POST /returns/sales, GET/POST /returns/purchase

### 6. `api/finance.ts`

- Income: GET/POST/PUT/DELETE /finance/income
- Expense: GET/POST/PUT/DELETE /finance/expense

### 7. `api/reports.ts`

- GET /reports/daily-sales, /reports/weekly-sales
- GET /reports/user-performance, /reports/top-products
- GET /reports/ledger, /reports/profit-loss

### 8. `api/audit.ts`

- GET /audit-logs

## Technical Requirements

- Follow existing Axios instance pattern
- Include JWT token automatically
- Proper TypeScript types
- Error handling

## Estimated Effort: 6-8 hours
