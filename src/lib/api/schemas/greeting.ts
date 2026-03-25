/**
 * Validation schemas for Greeting Message API endpoints
 */

import { z } from "zod";

export const greetingEntrySchema = z.object({
  channel: z.enum(["phone", "chat", "email", "sms"]),
  message: z.string().min(1).max(2000),
  isActive: z.boolean().default(true),
});

export const updateGreetingsSchema = z.object({
  greetings: z.array(greetingEntrySchema).min(1).max(4),
});

export type GreetingEntry = z.infer<typeof greetingEntrySchema>;
export type UpdateGreetingsParams = z.infer<typeof updateGreetingsSchema>;
