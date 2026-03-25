/**
 * Error handling wrapper for API routes
 */

import { ApiError } from "./errors";
import { jsonError } from "./response";
import { logger } from "@/lib/logger";

type RouteHandler<R extends Request = Request, C = unknown> = (
  request: R,
  context: C
) => Promise<Response>;

export function withErrorHandler<R extends Request>(
  handler: (request: R) => Promise<Response>
): (request: R) => Promise<Response>;
export function withErrorHandler<R extends Request, C>(
  handler: RouteHandler<R, C>
): RouteHandler<R, C>;
export function withErrorHandler(handler: unknown) {
  return async (request: Request, context: unknown) => {
    try {
      return await (handler as (request: Request, context: unknown) => Promise<Response>)(
        request,
        context
      );
    } catch (error) {
      logger.error("API Error", {}, error);

      if (error instanceof ApiError) {
        const payload = error.toJSON().error;
        return jsonError(
          request,
          {
            message: payload.message,
            code: payload.code,
            details: payload.details,
          },
          error.statusCode
        );
      }

      // Prisma errors
      if (error && typeof error === "object" && "code" in error) {
        if (error.code === "P2002") {
          return jsonError(
            request,
            {
              message: "A record with this value already exists",
              code: "DUPLICATE_ENTRY",
            },
            409
          );
        }
        if (error.code === "P2025") {
          return jsonError(
            request,
            {
              message: "Record not found",
              code: "NOT_FOUND",
            },
            404
          );
        }
      }

      // Generic error
      return jsonError(
        request,
        {
          message: "An unexpected error occurred",
          code: "INTERNAL_ERROR",
        },
        500
      );
    }
  };
}
