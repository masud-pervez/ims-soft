# Issue #2: Customers Management Module

## Priority: High 🔴

## Status: Not Implemented

## Description
Implement Customers Management with CRM-lite features.

## Current State
- ✅ Folder: `/app/(dashboard)/customers/`
- ❌ Missing: `page.tsx`
- ❌ Missing: `api/customers.ts`

## Required Features
- Customer list with data grid
- Contact information (name, email, phone, address)
- Order history per customer
- Customer CRUD operations
- Search & filter by name/email/phone
- Customer status (Active/Inactive)

## Technical Requirements
- API endpoints: GET/POST /customers, GET/PUT/DELETE /customers/:id
- Components: `CustomersList`, `CustomerFormModal`, `CustomerDetails`
- Hooks: `useFetchCustomers()`, `useCreateCustomer()`, etc.

## Estimated Effort: 3-4 hours
