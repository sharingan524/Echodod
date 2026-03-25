/**
 * Validation schemas for Holiday Schedule API endpoints
 */

import { z } from "zod";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const createHolidaySchema = z.object({
  date: z.coerce.date(),
  name: z.string().min(1).max(100),
  isClosed: z.boolean().default(true),
  specialOpenTime: z.string().regex(timeRegex, "Must be in HH:MM format").optional().nullable(),
  specialCloseTime: z.string().regex(timeRegex, "Must be in HH:MM format").optional().nullable(),
});

export type CreateHolidayParams = z.infer<typeof createHolidaySchema>;
