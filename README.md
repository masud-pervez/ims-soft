<div align="center">
  <h1>Inventory Management System (IMS_SOFT_V2)</h1>
  <p>A robust backend solution for inventory management, built with Node.js, Express, and MySQL.</p>
</div>

## 📋 Project Overview

This project is a comprehensive **Inventory Management System** designed to handle sales, purchases, stock tracking, and financial reporting. It features a secure backend with **Role-Based Access Control (RBAC)** to ensure data integrity and security between Admin and Staff users.

## 🚀 Features

- **User Management**: Admin-controlled user creation and role assignment (Admin/Staff).
- **Product & Stock**: Real-time inventory tracking with distinct categories.
- **Order Processing**: Support for Sales, Purchases, and Returns with automatic stock adjustment.
- **Financials**: Income and Expense tracking with Profit/Loss calculation.
- **CRM**: Management of Customers and Suppliers.
- **Audit Logs**: Comprehensive tracking of all critical system actions.
- **Security**: JWT Authentication and standard API response encryption.
- **Documentation**: Integrated Swagger UI for API testing.

## 🛠 Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: MySQL (using `mysql2`)
- **Authentication**: JSON Web Tokens (JWT)
- **Documentation**: Swagger / OpenAPI 3.0

## ⚙️ Prerequisites

Before running the application, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MySQL Server](https://dev.mysql.com/downloads/)

## 📦 Installation & Setup

1. **Clone the Repository**

   ```bash
   git clone <repository_url>
   cd ims-soft
   ```

2. **Navigate to Server Directory**

   ```bash
   cd server
   ```

3. **Install Dependencies**

   ```bash
   npm install
   ```

4. **Configure Environment**
   Create a `.env` file in the `server/` directory:

   ```env
   PORT=5000
   DB_HOST=127.0.0.1
   DB_USER=your_db_user   # e.g., root or ims_user
   DB_PASSWORD=your_pass  # e.g., IMS@User#2026!
   DB_NAME=ims_soft_db
   JWT_SECRET=super_secret_key
   ```

   _Note: The application will attempt to create the database and tables automatically if they don't exist._

5. **Start the Server**
   ```bash
   npm run dev
   ```
   The server will start on `http://localhost:5000`.

## 📖 API Documentation

Once the server is running, you can access the full interactive API documentation at:
👉 **[http://localhost:5000/api-docs](http://localhost:5000/api-docs)**

## 🧪 API Response Format

All API responses follow a strict JSON structure for consistency:

```json
{
  "status": true,
  "message": "Operation successful",
  "status_code": 200,
  "Data": { ... },
  "Error": null,
  "error_message": null
}
```

## 🔒 Roles & Permissions

- **Superadmin / Admin**: Complete control (User mgmt, Reports, Backups).
- **Staff**: Operational access (Orders, Products, Customers). Restricted from critical deletions and admin functions.
