/**
 * Validation schemas for Communication Log API endpoints
 */

import { z } from "zod";

export const logFilterSchema = z.object({
  channel: z.enum(["phone", "chat", "sms", "email"]).optional(),
  status: z.enum(["completed", "failed", "in-progress", "sent"]).optional(),
  outcome: z.enum(["resolved", "escalated", "missed", "delivered", "bounced"]).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  search: z.string().optional(),
});

export type LogFilterParams = z.infer<typeof logFilterSchema>;
