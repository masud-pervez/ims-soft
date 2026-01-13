import { createSwaggerSpec } from "next-swagger-doc";
import { NextResponse } from "next/server";

export async function GET() {
  const spec = createSwaggerSpec({
    apiFolder: "app/api", // Path to your API routes
    definition: {
      openapi: "3.0.0",
      info: {
        title: "IMS Soft API",
        version: "1.0.0",
        description: "API Documentation for IMS Soft",
      },
      components: {
        securitySchemes: {
          BearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
      security: [],
    },
  });
  return NextResponse.json(spec);
}
