"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GlassCard, GlassCardContent } from "@/components/ui/glass-card";
import { CheckCircle, Circle, Loader2, AlertTriangle, ArrowRight, Rocket } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";

interface SetupStep {
  id: string;
  label: string;
  status: "completed" | "in_progress" | "pending" | "failed";
  detail?: string;
}

interface SetupStatus {
  data: {
    progress: number;
    steps: SetupStep[];
    plan: string | null;
    ticketStatus: string | null;
  };
}

const STEP_ICONS = {
  completed: <CheckCircle className="h-4 w-4 text-emerald-400" />,
  in_progress: <Loader2 className="h-4 w-4 animate-spin text-sky-400" />,
  pending: <Circle className="text-muted-foreground h-4 w-4" />,
  failed: <AlertTriangle className="h-4 w-4 text-red-400" />,
} as const;

export function ProvisioningProgress({ compact = false }: { compact?: boolean }) {
  const [data, setData] = useState<SetupStatus["data"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await apiClient.getSetupStatus();
        setData(res.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    }
    fetchStatus();
  }, []);

  if (loading) {
    return (
      <GlassCard className="p-6">
        <GlassCardContent className="flex items-center justify-center p-0">
          <Loader2 className="text-muted-foreground h-5 w-5 animate-spin" />
        </GlassCardContent>
      </GlassCard>
    );
  }

  if (error || !data) {
    return null;
  }

  // Don't show if setup is 100% complete
  if (data.progress === 100) {
    return null;
  }

  if (compact) {
    return (
      <GlassCard className="p-6">
        <GlassCardContent className="p-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-sky-400/10 p-2">
                <Rocket className="h-5 w-5 text-sky-400" />
              </div>
              <div>
                <p className="text-sm font-medium">Setup Progress</p>
                <p className="text-muted-foreground text-xs">{data.progress}% complete</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/setup">
                Continue
                <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </div>
          {/* Progress bar */}
          <div className="bg-border mt-3 h-1.5 overflow-hidden rounded-full">
            <div
              className="h-full rounded-full bg-sky-400 transition-all duration-500"
              style={{ width: `${data.progress}%` }}
            />
          </div>
        </GlassCardContent>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Setup Progress</h2>
        <span className="text-muted-foreground text-sm">{data.progress}% complete</span>
      </div>

      {/* Progress bar */}
      <div className="bg-border h-2 overflow-hidden rounded-full">
        <div
          className="h-full rounded-full bg-sky-400 transition-all duration-500"
          style={{ width: `${data.progress}%` }}
        />
      </div>

      {/* Steps */}
      <div className="space-y-1">
        {data.steps.map((step, i) => (
          <div key={step.id} className="flex items-start gap-3 rounded-lg px-3 py-2.5">
            <div className="mt-0.5">{STEP_ICONS[step.status]}</div>
            <div className="flex-1">
              <p
                className={`text-sm font-medium ${
                  step.status === "completed"
                    ? "text-muted-foreground line-through"
                    : step.status === "failed"
                      ? "text-red-400"
                      : ""
                }`}
              >
                {i + 1}. {step.label}
              </p>
              {step.detail && <p className="text-muted-foreground text-xs">{step.detail}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
