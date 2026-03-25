"use client";

import { ProvisioningProgress } from "@/components/dashboard/ProvisioningProgress";

export default function SetupPage() {
  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Setup</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Track your service provisioning progress and complete remaining setup steps.
        </p>
      </div>

      <div className="mx-auto max-w-2xl">
        <ProvisioningProgress />
      </div>
    </div>
  );
}
