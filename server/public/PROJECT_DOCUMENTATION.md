# IMS_SOFT_V2 Backend Codebase Documentation

## 1. Project Overview

This repository contains the backend for the **Inventory Management System (IMS_SOFT_V2)**. It is built using **Node.js** and **Express.js**, backed by a **MySQL** database.

The system is designed with a **Layered Architecture** (Controller-Service-Model pattern, though simplified to Controller-Model for this iteration) and implements robust **Role-Based Access Control (RBAC)**.

## 2. Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL (using `mysql2` driver)
- **Authentication**: JWT (JSON Web Tokens) with Bearer Authentication
- **Documentation**: Swagger UI (`swagger-ui-express`)
- **Logging**: Winston

## 3. Architecture & Folder Structure

```
server/
├── src/
│   ├── config/         # Configuration (DB, Env, Swagger, Logger)
│   ├── controllers/    # Request Handlers (Business Logic)
│   ├── middleware/     # Auth, Logging, Error Handling
│   ├── models/         # Raw SQL Database Interaction Layer
│   ├── routes/         # API Route Defintions
│   ├── utils/          # Utilities (DB Init, Response Handler)
│   └── app.js          # Express App Setup
├── schema.sql          # Database Schema Definition
└── server.js           # Entry Point
```

## 4. Database Schema (MySQL)

The database `ims_soft_db` (or as configured in `.env`) consists of the following core tables:

- **users**: Accounts with roles (`superadmin`, `admin`, `staff`).
- **products**: Inventory items with pricing and stock.
- **categories**: Product classifications.
- **orders**: Sales/Purchase transactions with JSON fields for flexibility (customer, pricing details).
- **customers / suppliers**: CRM entities.
- **expenses / income**: Financial tracking.
- **audit_logs**: System-wide activity tracking.

## 5. Authentication & RBAC

### Authentication

- Uses **JWT** (JSON Web Tokens).
- Token must be passed in the header: `Authorization: Bearer <token>`.

### Roles & Permissions

- **Superadmin / Admin**: Full access to all modules, including User Management, Finances, and sensitive Reports.
- **Staff**: Limited access.
  - **Allowed**: View/Create Orders, Products, Customers.
  - **Restricted**: Cannot delete items, cannot manage Users, cannot view Profit/Loss reports.

## 6. API Usage

### Standard Response Format

All API endpoints return data in the following standardized JSON structure:

```json
{
  "status": true,
  "message": "Operation successful",
  "status_code": 200,
  "Data": { ... },     // Object or Array
  "Error": null,       // or Error Object
  "error_message": null
}
```

### Swagger Documentation

Interactive API documentation is available locally.

1. Start the server: `npm run dev`
2. Visit: `http://localhost:5000/api-docs`

## 7. Key Features Implemented

- **User Management**: Admin-only CRUD for system users.
- **Inventory Control**: Real-time stock updates on Order creation.
- **Financial Reporting**: Profit/Loss and Daily Ledger calculations.
- **Transaction Safety**: Orders use database transactions to ensure consistency between `orders` and `products` (stock).
- **Backup**: One-click SQL dump download for Admins.

## 8. Setup & Installation

1. **Install Dependencies**:
   ```bash
   cd server
   npm install
   ```
2. **Environment Setup**:
   Create a `.env` file in `server/`:
   ```env
   PORT=5000
   DB_HOST=127.0.0.1
   DB_USER=ims_user
   DB_PASSWORD=your_password
   DB_NAME=ims_soft_db
   JWT_SECRET=your_secret
   ```
3. **Database Initialization**:
   The app uses `mysql2`. Ensure your MySQL server is running. Tables are auto-checked on startup, or you can run `schema.sql` manually.
4. **Run Server**:
   ```bash
   npm run dev
   ```
