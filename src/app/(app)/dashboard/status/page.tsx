"use client";

import { ServiceStatusPanel } from "@/components/dashboard/ServiceStatusPanel";

export default function ServiceStatusPage() {
  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Service Status</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Real-time health of your AWS communication services.
        </p>
      </div>

      <ServiceStatusPanel />
    </div>
  );
}
