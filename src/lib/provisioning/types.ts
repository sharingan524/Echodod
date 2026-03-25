/**
 * Type definitions for the provisioning pipeline
 */

export type ProvisioningStepStatus =
  | "pending"
  | "in_progress"
  | "completed"
  | "failed"
  | "skipped";

export interface ProvisioningStep {
  id: string;
  name: string;
  service: "connect" | "pinpoint" | "ses";
  status: ProvisioningStepStatus;
  startedAt?: string;
  completedAt?: string;
  error?: string;
  result?: Record<string, unknown>;
}

export interface ProvisioningPlan {
  organizationId: string;
  ticketId: string;
  tier: "basic" | "standard" | "premium";
  steps: ProvisioningStep[];
  currentStepIndex: number;
  status: "pending" | "in_progress" | "completed" | "failed" | "cancelled";
  startedAt?: string;
  completedAt?: string;
}

/** Maps tiers to which services get provisioned */
export const TIER_SERVICES: Record<string, string[]> = {
  basic: ["connect"],
  standard: ["connect", "ses"],
  premium: ["connect", "ses", "pinpoint"],
};
