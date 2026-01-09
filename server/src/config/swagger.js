import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "OmniOrder Pro API",
      version: "1.0.0",
      description: "API documentation for OmniOrder Pro Enterprise OMS",
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
        Product: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            categoryId: { type: "string" },
            costPrice: { type: "number" },
            sellingPrice: { type: "number" },
            currentStock: { type: "integer" },
          },
        },
        Order: {
          type: "object",
          properties: {
            id: { type: "string" },
            productId: { type: "string" },
            quantity: { type: "integer" },
            status: { type: "string" },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.js"], // Path to the API docs
};

export const swaggerSpec = swaggerJsdoc(options);
