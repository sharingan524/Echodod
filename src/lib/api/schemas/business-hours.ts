/**
 * Validation schemas for Business Hours API endpoints
 */

import { z } from "zod";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const businessHoursEntrySchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  openTime: z.string().regex(timeRegex, "Must be in HH:MM format"),
  closeTime: z.string().regex(timeRegex, "Must be in HH:MM format"),
  isClosed: z.boolean(),
});

export const updateBusinessHoursSchema = z.object({
  hours: z.array(businessHoursEntrySchema).length(7),
});

export type BusinessHoursEntry = z.infer<typeof businessHoursEntrySchema>;
export type UpdateBusinessHoursParams = z.infer<typeof updateBusinessHoursSchema>;
