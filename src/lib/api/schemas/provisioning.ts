/**
 * Validation schemas for provisioning endpoints
 */

import { z } from "zod";

export const triggerProvisioningSchema = z.object({
  tier: z.enum(["basic", "standard", "premium"]).optional(),
  ticketId: z.string().optional(),
});

export type TriggerProvisioningInput = z.infer<
  typeof triggerProvisioningSchema
>;
