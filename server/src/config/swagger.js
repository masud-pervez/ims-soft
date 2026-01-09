import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "IMS API",
      version: "1.0.0",
      description: "Inventory Management System API Documentation",
      contact: {
        name: "API Support",
        email: "support@example.com",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: "http://localhost:4000/api",
        description: "Development Server",
      },
    ],
    tags: [
      { name: "Auth", description: "Authentication Routes" },
      { name: "Users", description: "User Management" },
      { name: "Backup", description: "System Backup" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        AuditLog: {
          type: "object",
          properties: {
            id: { type: "integer" },
            targetId: { type: "string" },
            module: { type: "string" },
            action: { type: "string" },
            oldState: { type: "string" },
            newState: { type: "string" },
            changedBy: { type: "string" },
            timestamp: { type: "string", format: "date-time" },
          },
        },
        Category: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
          },
        },
        Expense: {
          type: "object",
          properties: {
            id: { type: "string" },
            amount: { type: "number" },
            type: { type: "string" },
            description: { type: "string" },
            date: { type: "string", format: "date" },
            createdBy: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Order: {
          type: "object",
          properties: {
            id: { type: "string" },
            productId: { type: "string" },
            productName: { type: "string" },
            quantity: { type: "integer" },
            unitPrice: { type: "number" },
            subtotal: { type: "number" },
            refNumbers: { type: "object" },
            customer: { type: "object" },
            discount: { type: "object" },
            delivery: { type: "object" },
            payment: { type: "object" },
            financials: { type: "object" },
            meta: { type: "object" },
            orderDate: { type: "string", format: "date" },
          },
        },
        Product: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            categoryId: { type: "string" },
            costPrice: { type: "number" },
            sellingPrice: { type: "number" },
            openingStock: { type: "integer" },
            currentStock: { type: "integer" },
            image: { type: "string" },
          },
        },
        Purchase: {
          type: "object",
          properties: {
            id: { type: "string" },
            productId: { type: "string" },
            productName: { type: "string" },
            quantity: { type: "integer" },
            purchasePrice: { type: "number" },
            totalCost: { type: "number" },
            supplierName: { type: "string" },
            purchaseDate: { type: "string", format: "date" },
            createdBy: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        User: {
          type: "object",
          properties: {
            id: { type: "string", description: "UUID" },
            email: { type: "string", format: "email" },
            firstName: { type: "string" },
            lastName: { type: "string" },
            role: {
              type: "string",
              enum: ["admin", "manager", "staff"],
              default: "staff",
            },
            accessScope: {
              type: "object",
              description: "JSON defining warehouse/store access",
              properties: {
                warehouses: { type: "array", items: { type: "string" } },
                stores: { type: "array", items: { type: "string" } },
              },
            },
            permissionsOverride: { type: "array", items: { type: "string" } },
            isVerified: { type: "boolean" },
            status: {
              type: "string",
              enum: ["active", "inactive", "suspended"],
              default: "active",
            },
            lastLoginAt: { type: "string", format: "date-time" },
            failedLoginAttempts: { type: "integer" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.js"], // Path to the API docs
};

export const swaggerSpec = swaggerJsdoc(options);
