/**
 * Validation schemas for Webhook endpoints
 */

import { z } from "zod";

export const createWebhookSchema = z.object({
  url: z.string().url("Must be a valid URL"),
  events: z
    .array(z.enum(["call.completed", "call.failed", "call.started", "intent.detected"]))
    .min(1, "At least one event must be selected"),
});

export const updateWebhookSchema = z.object({
  url: z.string().url("Must be a valid URL").optional(),
  events: z
    .array(z.enum(["call.completed", "call.failed", "call.started", "intent.detected"]))
    .min(1, "At least one event must be selected")
    .optional(),
  isActive: z.boolean().optional(),
});

export type CreateWebhookInput = z.infer<typeof createWebhookSchema>;
export type UpdateWebhookInput = z.infer<typeof updateWebhookSchema>;
