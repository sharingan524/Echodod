/**
 * Input validation helpers using Zod
 */

import { z, ZodSchema } from "zod";
import { ValidationError } from "./errors";

/**
 * Validates request body against a Zod schema
 * @param request - The incoming request
 * @param schema - Zod schema for validation
 * @returns Parsed and validated data
 * @throws ValidationError if validation fails
 */
export async function validateBody<T>(request: Request, schema: ZodSchema<T>): Promise<T> {
  try {
    const body = await request.json();
    return schema.parse(body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError("Invalid request body", {
        errors: error.issues.map((e) => ({
          path: e.path.join("."),
          message: e.message,
        })),
      });
    }
    throw new ValidationError("Failed to parse request body");
  }
}

/**
 * Validates URL query parameters against a Zod schema
 * @param url - The request URL
 * @param schema - Zod schema for validation
 * @returns Parsed and validated query parameters
 * @throws ValidationError if validation fails
 */
export function validateQuery<T>(url: URL, schema: ZodSchema<T>): T {
  const params = Object.fromEntries(url.searchParams);

  try {
    return schema.parse(params);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError("Invalid query parameters", {
        errors: error.issues.map((e) => ({
          path: e.path.join("."),
          message: e.message,
        })),
      });
    }
    throw new ValidationError("Failed to parse query parameters");
  }
}
