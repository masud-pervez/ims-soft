# 🗺️ Project Structure Map

## Root: `/home/masud-pervez/Desktop/project/ims`

### `.agent/`

- Contains rules, workflows, and protocols for the AI agent.

### `client/`

- Frontend application (React/Vite).
- Dependencies: `package.json`

### `server/`

- Backend application (Node.js/Express).
- `src/`: Source code.
  - `config/`: Configuration (DB, Swagger, Env).
  - `controllers/`: Request handlers.
  - `routes/`: API route definitions.
  - `utils/`: Helper functions.
- `schema.sql`: Database schema definition.

### `docs/`

- **MANDATORY**: Documentation for all features and modules.
