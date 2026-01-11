# Issue #21: Invoice Generation Feature

## Priority: High 🔴 | Status: Not Implemented

## Description
Implement invoice generation, preview, print, and PDF export functionality.

## Required Features
- Visual invoice preview component
- Print functionality (browser print)
- PDF export/download
- Invoice templates (customizable)
- Invoice numbering system
- Company logo and details
- Itemized product list
- Tax calculations
- Payment status display

## Integration Points
- Triggered from Sales Order completion
- Accessible from Order details page
- Email invoice to customer option

## Technical Requirements
- Components: `InvoicePreview`, `InvoiceTemplate`
- Libraries: react-to-print or jsPDF for PDF generation
- API: POST /invoices/generate, GET /invoices/:id

## Estimated Effort: 6-8 hours
