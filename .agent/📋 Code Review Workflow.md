# 📋 Code Review Workflow

When reviewing code (self-review or existing code), follow this checklist:

## 1. Correctness

- [ ] Does the code do what it's supposed to do?
- [ ] Are edge cases handled?
- [ ] Are there potential race conditions?

## 2. Security

- [ ] Are inputs validated?
- [ ] Are secrets exposed? (Check `.env` usage)
- [ ] Is authentication/authorization enforced?

## 3. Performance

- [ ] Are there unnecessary loops or expensive operations?
- [ ] Is database access optimized (e.g., indexing, N+1 problem)?

## 4. Maintainability

- [ ] Is the code readable?
- [ ] Are functions small and focused?
- [ ] Is the code consistent with the existing style?

## 5. Documentation

- [ ] **CRITICAL**: Has the `docs/` folder been updated to reflect these changes?
- [ ] Are JSDoc/Swagger comments updated?
