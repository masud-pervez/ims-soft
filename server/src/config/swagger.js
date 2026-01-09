import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "IMS SOFT",
      version: "1.0.0",
      description: "API documentation for IMS SOFT",
      contact: {
        name: "API Support",
        email: "support@example.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3001/api",
        description: "Development Server",
      },
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
        Category: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
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
      },
    },
  },
  apis: ["./src/routes/*.js"], // Path to the API docs
};

export const swaggerSpec = swaggerJsdoc(options);
