/**
 * Validation schemas for Phone Number endpoints
 */

import { z } from "zod";

export const createPhoneNumberSchema = z.object({
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),
  provider: z.enum(["aws-connect", "pinpoint"]),
  providerSid: z.string().optional(),
});

export const updatePhoneNumberSchema = z.object({
  isActive: z.boolean().optional(),
});

export type CreatePhoneNumberInput = z.infer<typeof createPhoneNumberSchema>;
export type UpdatePhoneNumberInput = z.infer<typeof updatePhoneNumberSchema>;
