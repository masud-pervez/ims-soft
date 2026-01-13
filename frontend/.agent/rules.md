# Agent Rules

These rules provide context and guidelines for AI agents working on this project.

## Project Setup

When setting up the project for the first time or resetting the environment, ALWAYS follow these steps:

1.  **Install Dependencies**: `npm install`
1.  **Install Dependencies**: `npm install`
1.  **Setup Database**: `npm run setup`.
    - This command automates database connection check, schema push, and seeding.
    - It creates the database `ims_db` if it doesn't exist (unless restricted by permissions).
    - It runs `npx prisma db seed` internally.
    - **Crucial**: If the user mentions "seed data" or "initial data", refer to `prisma/seed.ts`.

## Database Management

- **Schema Changes**: Modify `prisma/schema.prisma` and then run `npx prisma db push` to apply changes.
- **Client Generation**: Run `npx prisma generate` after any schema change to update the TypeScript client.
- **Seeding**: The seed logic is in `prisma/seed.ts`. It checks for existing data before inserting to prevent duplicates.

## Code Style

- Use **TypeScript** for all new files.
- Prefer **Functional Components** with Hooks.
- Use **Tailwind CSS** for styling updates.

## API Documentation

- This project uses `next-swagger-doc`.
- When adding new API routes in `app/api/...`, ALWAYS add JSDoc `@swagger` comments to document the endpoint.
