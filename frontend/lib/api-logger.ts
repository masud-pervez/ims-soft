/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";

type ApiHandler = (
  req: Request,
  params?: any
) => Promise<NextResponse> | NextResponse;

export function withApiLogger(handler: ApiHandler, routeName: string) {
  return async (req: Request, params?: any) => {
    const start = Date.now();
    const method = req.method;
    const url = req.url;

    logger.info({ method, url, route: routeName }, "API Request Started");

    try {
      const response = await handler(req, params);
      const duration = Date.now() - start;
      const status = response.status;

      logger.info(
        { method, url, route: routeName, status, duration: `${duration}ms` },
        "API Request Completed"
      );

      return response;
    } catch (error) {
      const duration = Date.now() - start;
      logger.error(
        {
          method,
          url,
          route: routeName,
          error: error instanceof Error ? error.message : "Unknown Error",
          duration: `${duration}ms`,
        },
        "API Request Failed"
      );
      throw error;
    }
  };
}
