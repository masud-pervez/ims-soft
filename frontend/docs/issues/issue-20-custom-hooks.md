# Issue #20: Missing Custom Hooks

## Priority: Medium 🟡 | Status: Partial

## Description
Verify and create missing domain-specific React hooks.

## Current State
- ✅ Base hooks exist: likely `useFetchData.ts`, `usePostData.ts`
- ❌ Missing: Domain-specific hooks

## Required Hooks

### 1. `useAuth.ts`
- Login/logout functionality
- User state management
- Token management
- Permission checks

### 2. `useInventory.ts`
- Stock management helpers
- Low stock alerts
- Product search/filter

### 3. Additional domain hooks as needed
- `useOrders()`, `useCustomers()`, etc.

## Technical Requirements
- Built on top of useFetchData/usePostData
- React Query integration
- Proper TypeScript typing

## Estimated Effort: 3-4 hours
