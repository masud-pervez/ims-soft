# 🛡️ Guardrails & Footgun Prevention

## 🚫 NEVER DO THIS

1.  **Delete User Data**: Never delete `node_modules` or database files without explicit permission.
2.  **Commit Secrets**: Never commit `.env` files or hardcoded keys.
3.  **Blindly Copy-Paste**: Always understand the code you are writing.

## ⚠️ BE CAREFUL WITH

1.  **`package.json` Updates**: Ensure version compatibility.
2.  **Database Migrations**: specific attention to `DROP TABLE` or destructive `ALTER` commands.
3.  **Global Refactors**: Limit scope to avoid breaking unrelated parts.

## ✅ ALWAYS CHECK

1.  **Current Directory**: Verify you are in the correct folder before running commands.
2.  **Lint/Syntax**: Run `npm run lint` or `node --check` after edits.
3.  **Tests**: If tests exist, run them to ensure no regressions.
