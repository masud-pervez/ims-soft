# Issue #17: System Settings Module

## Priority: Medium 🟡 | Status: Not Implemented

## Current State
- ✅ Folder: `/app/(dashboard)/settings/`
- ❌ Missing: `page.tsx`

## Required Features
- General settings (company info, currency, timezone)
- Backup/restore UI with trigger button
- Email/notification settings
- Tax configuration
- Admin-only access control

## Technical Requirements
- API: GET/PUT /settings, POST /settings/backup, POST /settings/restore
- Components: `SettingsForm`, `BackupSection`

## Estimated Effort: 4-5 hours
