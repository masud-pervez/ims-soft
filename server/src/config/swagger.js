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
        url: "http://localhost:5000/api",
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
        User: {
          type: "object",
          properties: {
            id: { type: "string" },
            username: { type: "string" },
            email: { type: "string" },
            role: { type: "string", enum: ["superadmin", "admin", "staff"] },
            permissions: { type: "object" },
          },
        },
        Product: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            categoryId: { type: "string" },
            purchasePrice: { type: "number" },
            salePrice: { type: "number" },
            stockQuantity: { type: "integer" },
          },
        },
        Category: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
          },
        },
        Order: {
          type: "object",
          properties: {
            id: { type: "string" },
            type: {
              type: "string",
              enum: ["SALE", "PURCHASE", "SALE_RETURN", "PURCHASE_RETURN"],
            },
            totalAmount: { type: "number" },
            customerId: { type: "string" },
            supplierId: { type: "string" },
            items: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  productId: { type: "string" },
                  quantity: { type: "integer" },
                  price: { type: "number" },
                },
              },
            },
          },
        },
        Customer: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            phone: { type: "string" },
            email: { type: "string" },
          },
        },
        Supplier: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            phone: { type: "string" },
            email: { type: "string" },
          },
        },
        Income: {
          type: "object",
          properties: {
            id: { type: "string" },
            source: { type: "string" },
            amount: { type: "number" },
            date: { type: "string", format: "date-time" },
          },
        },
        Expense: {
          type: "object",
          properties: {
            id: { type: "string" },
            category: { type: "string" },
            amount: { type: "number" },
            date: { type: "string", format: "date-time" },
          },
        },
        AuditLog: {
          type: "object",
          properties: {
            id: { type: "string" },
            event: { type: "string" },
            userId: { type: "string" },
            timestamp: { type: "string", format: "date-time" },
          },
        },
        ApiResponse: {
          type: "object",
          properties: {
            status: { type: "boolean", example: true },
            message: { type: "string", example: "Operation successful" },
            status_code: { type: "integer", example: 200 },
            Data: {
              nullable: true,
              oneOf: [{ type: "object" }, { type: "array", items: {} }],
              example: { id: "123", name: "Sample Item" },
            },
            Error: { type: "object", nullable: true, example: null },
            error_message: { type: "string", nullable: true, example: null },
          },
          example: {
            status: true,
            message: "Operation successful",
            status_code: 200,
            Data: {
              key: "value",
            },
            Error: null,
            error_message: null,
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.js"], // Path to the API docs
};

export const swaggerSpec = swaggerJsdoc(options);
