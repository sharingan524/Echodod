/**
 * Validation schemas for API Key endpoints
 */

import { z } from "zod";

export const createApiKeySchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
});

export type CreateApiKeyInput = z.infer<typeof createApiKeySchema>;
