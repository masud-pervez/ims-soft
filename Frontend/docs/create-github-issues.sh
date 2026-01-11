#!/bin/bash

# Script to create GitHub Issues from markdown files
# Repository: masud-pervez/ims-soft

REPO="masud-pervez/ims-soft"
ISSUES_DIR="docs/issues"

echo "Creating GitHub Issues for IMS Frontend..."
echo "Repository: $REPO"
echo ""

# Counter
created=0
failed=0

# Issue #1
gh issue create --repo "$REPO" --title "Frontend: Users Management Module Implementation" --body-file "$ISSUES_DIR/issue-01-users-management.md" && ((created++)) || ((failed++))

# Issue #2
gh issue create --repo "$REPO" --title "Frontend: Customers Management Module" --body-file "$ISSUES_DIR/issue-02-customers-management.md" && ((created++)) || ((failed++))

# Issue #3
gh issue create --repo "$REPO" --title "Frontend: Suppliers Management Module" --body-file "$ISSUES_DIR/issue-03-suppliers-management.md" && ((created++)) || ((failed++))

# Issue #4
gh issue create --repo "$REPO" --title "Frontend: Categories Management" --body-file "$ISSUES_DIR/issue-04-categories-management.md" && ((created++)) || ((failed++))

# Issue #5
gh issue create --repo "$REPO" --title "Frontend: Sales Order Management" --body-file "$ISSUES_DIR/issue-05-sales-order-management.md" && ((created++)) || ((failed++))

# Issue #6
gh issue create --repo "$REPO" --title "Frontend: Purchase Order Management" --body-file "$ISSUES_DIR/issue-06-purchase-order-management.md" && ((created++)) || ((failed++))

# Issue #7
gh issue create --repo "$REPO" --title "Frontend: Sales Returns Management" --body-file "$ISSUES_DIR/issue-07-sales-returns.md" && ((created++)) || ((failed++))

# Issue #8
gh issue create --repo "$REPO" --title "Frontend: Purchase Returns Management" --body-file "$ISSUES_DIR/issue-08-purchase-returns.md" && ((created++)) || ((failed++))

# Issue #9
gh issue create --repo "$REPO" --title "Frontend: Income Management Module" --body-file "$ISSUES_DIR/issue-09-income-management.md" && ((created++)) || ((failed++))

# Issue #10
gh issue create --repo "$REPO" --title "Frontend: Expense Management Module" --body-file "$ISSUES_DIR/issue-10-expense-management.md" && ((created++)) || ((failed++))

# Issue #11
gh issue create --repo "$REPO" --title "Frontend: Daily Sales Report" --body-file "$ISSUES_DIR/issue-11-daily-sales-report.md" && ((created++)) || ((failed++))

# Issue #12
gh issue create --repo "$REPO" --title "Frontend: Weekly Sales Report" --body-file "$ISSUES_DIR/issue-12-weekly-sales-report.md" && ((created++)) || ((failed++))

# Issue #13
gh issue create --repo "$REPO" --title "Frontend: User Performance Report" --body-file "$ISSUES_DIR/issue-13-user-performance-report.md" && ((created++)) || ((failed++))

# Issue #14
gh issue create --repo "$REPO" --title "Frontend: Top Selling Products Report" --body-file "$ISSUES_DIR/issue-14-top-products-report.md" && ((created++)) || ((failed++))

# Issue #15
gh issue create --repo "$REPO" --title "Frontend: Daily Ledger" --body-file "$ISSUES_DIR/issue-15-daily-ledger.md" && ((created++)) || ((failed++))

# Issue #16
gh issue create --repo "$REPO" --title "Frontend: Profit & Loss Statement" --body-file "$ISSUES_DIR/issue-16-profit-loss-statement.md" && ((created++)) || ((failed++))

# Issue #17
gh issue create --repo "$REPO" --title "Frontend: System Settings Module" --body-file "$ISSUES_DIR/issue-17-system-settings.md" && ((created++)) || ((failed++))

# Issue #18
gh issue create --repo "$REPO" --title "Frontend: Audit Logs Module" --body-file "$ISSUES_DIR/issue-18-audit-logs.md" && ((created++)) || ((failed++))

# Issue #19 (CRITICAL)
gh issue create --repo "$REPO" --title "Frontend: Missing API Services (CRITICAL)" --body-file "$ISSUES_DIR/issue-19-missing-api-services.md" && ((created++)) || ((failed++))

# Issue #20
gh issue create --repo "$REPO" --title "Frontend: Missing Custom Hooks" --body-file "$ISSUES_DIR/issue-20-custom-hooks.md" && ((created++)) || ((failed++))

# Issue #21
gh issue create --repo "$REPO" --title "Frontend: Invoice Generation Feature" --body-file "$ISSUES_DIR/issue-21-invoice-generation.md" && ((created++)) || ((failed++))

echo ""
echo "========================================"
echo "Summary:"
echo "✅ Created: $created issues"
echo "❌ Failed: $failed issues"
echo "========================================"
echo ""
echo "View all issues at: https://github.com/$REPO/issues"
