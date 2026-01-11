# Issue #15: Daily Ledger

## Priority: High 🔴 | Status: Not Implemented

## Current State
- ✅ Folder: `/app/(dashboard)/reports/ledger/`
- ❌ Missing: `page.tsx`, `api/reports.ts`

## Required Features
- Detailed financial movements timeline
- Date filtering (single day or range)
- Transaction categories (income, expense, sales, purchases)
- Running balance calculations
- Export to PDF/Excel

## Technical Requirements
- API: GET /reports/ledger?startDate=...&endDate=...
- Components: `DailyLedger`, `LedgerTable`, `BalanceCard`

## Estimated Effort: 5-6 hours
