# IMS Soft Frontend

This is the frontend application for the IMS Soft project, built with Next.js and Prisma. I also includes the backend logic via Next.js API routes.

## Prerequisites

- **Node.js**: v18 or higher
- **MySQL**: Ensure you have a MySQL server running.

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create a `.env` file in the root directory (if not already present) and configure your database connection:

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/ims_db"
JWT_SECRET="your_secret_key"
```

### 3. Database Setup

Run the automated setup script. This will connect to MySQL, create the database `ims_db` (if it doesn't exist), push the schema, and seed the initial data.

```bash
npm run setup
```

_Note: If the script fails to create the database due to permissions, create it manually (`CREATE DATABASE ims_db;`) and run the command again._

### 4. Run the Application

Start the development server:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## API Documentation

Swagger documentation is available at:

- `http://localhost:3000/api/doc` (JSON Spec)
- or check the `/docs` route if implemented in the UI.

## Project Structure

- `app/`: Next.js App Router (Pages and API routes).
- `prisma/`: Database schema (`schema.prisma`) and seed script (`seed.ts`).
- `lib/`: Utility libraries (e.g., `prisma.ts` client instance).
- `components/`: React components.
