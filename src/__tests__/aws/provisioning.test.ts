import { describe, it, expect } from "vitest";
import {
  buildProvisioningPlan,
} from "@/lib/provisioning/orchestrator";
import { TIER_SERVICES } from "@/lib/provisioning/types";

describe("TIER_SERVICES", () => {
  it("basic tier only includes connect", () => {
    expect(TIER_SERVICES.basic).toEqual(["connect"]);
  });

  it("standard tier includes connect and ses", () => {
    expect(TIER_SERVICES.standard).toEqual(["connect", "ses"]);
  });

  it("premium tier includes connect, ses, and pinpoint", () => {
    expect(TIER_SERVICES.premium).toEqual(["connect", "ses", "pinpoint"]);
  });
});

describe("buildProvisioningPlan", () => {
  it("builds a basic plan with connect steps", () => {
    const plan = buildProvisioningPlan({
      organizationId: "org-1",
      ticketId: "ticket-1",
      tier: "basic",
    });

    expect(plan.organizationId).toBe("org-1");
    expect(plan.ticketId).toBe("ticket-1");
    expect(plan.tier).toBe("basic");
    expect(plan.status).toBe("pending");
    expect(plan.currentStepIndex).toBe(0);
    expect(plan.steps.length).toBeGreaterThan(0);
    expect(plan.steps.every((s) => s.service === "connect")).toBe(true);
  });

  it("builds a standard plan with connect and ses steps", () => {
    const plan = buildProvisioningPlan({
      organizationId: "org-2",
      ticketId: "ticket-2",
      tier: "standard",
    });

    const services = [...new Set(plan.steps.map((s) => s.service))];
    expect(services).toContain("connect");
    expect(services).toContain("ses");
    expect(services).not.toContain("pinpoint");
  });

  it("builds a premium plan with all three services", () => {
    const plan = buildProvisioningPlan({
      organizationId: "org-3",
      ticketId: "ticket-3",
      tier: "premium",
    });

    const services = [...new Set(plan.steps.map((s) => s.service))];
    expect(services).toContain("connect");
    expect(services).toContain("ses");
    expect(services).toContain("pinpoint");
  });

  it("all steps start as pending", () => {
    const plan = buildProvisioningPlan({
      organizationId: "org-1",
      ticketId: "ticket-1",
      tier: "premium",
    });

    expect(plan.steps.every((s) => s.status === "pending")).toBe(true);
  });

  it("each step has a unique id", () => {
    const plan = buildProvisioningPlan({
      organizationId: "org-1",
      ticketId: "ticket-1",
      tier: "premium",
    });

    const ids = plan.steps.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("each step has a name and service", () => {
    const plan = buildProvisioningPlan({
      organizationId: "org-1",
      ticketId: "ticket-1",
      tier: "premium",
    });

    for (const step of plan.steps) {
      expect(step.name).toBeTruthy();
      expect(step.service).toBeTruthy();
    }
  });

  it("falls back to basic tier for unknown tier", () => {
    const plan = buildProvisioningPlan({
      organizationId: "org-1",
      ticketId: "ticket-1",
      tier: "nonexistent",
    });

    expect(plan.steps.every((s) => s.service === "connect")).toBe(true);
  });

  it("connect steps are ordered correctly", () => {
    const plan = buildProvisioningPlan({
      organizationId: "org-1",
      ticketId: "ticket-1",
      tier: "basic",
    });

    const stepIds = plan.steps.map((s) => s.id);
    // Step IDs may be prefixed with service name (e.g. connect.create_instance)
    const normalize = (id: string) => id.replace(/^[^.]+\./, "");
    const normalized = stepIds.map(normalize);
    expect(normalized[0]).toBe("create_instance");
    // Instance creation should come before queue/flow/phone
    const instanceIdx = normalized.indexOf("create_instance");
    const queueIdx = normalized.indexOf("create_default_queue");
    if (queueIdx >= 0) {
      expect(instanceIdx).toBeLessThan(queueIdx);
    }
  });
});
