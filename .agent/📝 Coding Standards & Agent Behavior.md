# 📝 Coding Standards & Agent Behavior

## 🚨 MANDATORY RULES 🚨

### 📚 DOCUMENTATION IS NOT OPTIONAL

**Rule**: For **ANY** feature implementation, modification, or bug fix ("kaj jodi kori"), you **MUST** create or update proper documentation in the root `docs/` folder.

**Requirements**:

1.  **Location**: All documentation must live in `{root}/docs/`.
2.  **Structure**: Maintain a clean folder structure within `docs/` that mirrors the feature's domain (e.g., `docs/auth/`, `docs/api/`, `docs/database/`).
3.  **Content**: Documentation must include:
    - Feature Overview
    - Technical Implementation Details
    - API Endpoints (if applicable)
    - Configuration / Env Variables
    - Usage Examples

## Coding Standards

### General

- **Clean Code**: Write readable, maintainable code. Use meaningful variable names.
- **DRY (Don't Repeat Yourself)**: Refactor repeated logic into reusable functions or components.
- **Comments**: Comment complex logic, but let clean code speak for itself where possible.

### JavaScript/Node.js

- Use `ES6+` features (const/let, fat arrows, destructuring).
- Prefer `async/await` over callbacks or raw promises.
- Handle errors gracefully using `try/catch` and proper error middleware.

## Agent Behavior

- **Ask Before Big Changes**: If a change involves a major refactor or deletion, clarify with the user first.
- **Self-Correction**: If a tool fails, analyze the error and try a logical fix.
- **Status Updates**: Keep the user informed of what you are doing using the `task_boundary` tool.
