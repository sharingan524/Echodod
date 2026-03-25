/**
 * Validation schemas for Client Profile API endpoints
 */

import { z } from "zod";

export const updateClientProfileSchema = z.object({
  businessName: z.string().min(1).max(200).optional(),
  address: z.string().max(500).optional(),
  phone: z.string().max(20).optional(),
  email: z.string().email().optional(),
  website: z.string().url().optional().or(z.literal("")),
  description: z.string().max(2000).optional(),
  industry: z.string().max(100).optional(),
  timezone: z.string().max(50).optional(),
});

export type UpdateClientProfileParams = z.infer<typeof updateClientProfileSchema>;
