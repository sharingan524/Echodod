"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GlassCard, GlassCardContent } from "@/components/ui/glass-card";
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  HelpCircle,
  RefreshCw,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";

interface ServiceHealth {
  service: string;
  status: "healthy" | "degraded" | "unhealthy" | "unknown";
  details?: Record<string, unknown>;
  checkedAt: string;
}

const STATUS_CONFIG = {
  healthy: {
    icon: CheckCircle,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    label: "Healthy",
  },
  degraded: {
    icon: AlertTriangle,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    label: "Degraded",
  },
  unhealthy: {
    icon: XCircle,
    color: "text-red-400",
    bg: "bg-red-400/10",
    label: "Unhealthy",
  },
  unknown: {
    icon: HelpCircle,
    color: "text-muted-foreground",
    bg: "border border-border bg-white",
    label: "Unknown",
  },
} as const;

const SERVICE_LABELS: Record<string, string> = {
  connect: "Amazon Connect",
  ses: "Amazon SES",
  pinpoint: "Amazon Pinpoint",
};

export function ServiceStatusPanel({ compact = false }: { compact?: boolean }) {
  const [services, setServices] = useState<ServiceHealth[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHealth = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const res = await apiClient.getServiceHealth();
      setServices(res.data.services);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHealth();
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

  if (error) {
    return (
      <GlassCard className="p-6">
        <GlassCardContent className="p-0">
          <p className="text-muted-foreground text-sm">{error}</p>
        </GlassCardContent>
      </GlassCard>
    );
  }

  const overallStatus =
    services.length === 0
      ? "unknown"
      : services.every((s) => s.status === "healthy")
        ? "healthy"
        : services.some((s) => s.status === "unhealthy")
          ? "unhealthy"
          : "degraded";

  const OverallIcon = STATUS_CONFIG[overallStatus].icon;

  if (compact) {
    return (
      <GlassCard className="p-6">
        <GlassCardContent className="p-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`rounded-lg p-2 ${STATUS_CONFIG[overallStatus].bg}`}>
                <OverallIcon className={`h-5 w-5 ${STATUS_CONFIG[overallStatus].color}`} />
              </div>
              <div>
                <p className="text-sm font-medium">Service Health</p>
                <p className={`text-xs ${STATUS_CONFIG[overallStatus].color}`}>
                  {services.length === 0
                    ? "No active services"
                    : `${services.filter((s) => s.status === "healthy").length}/${services.length} healthy`}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/status">
                Details
                <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </div>
        </GlassCardContent>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Service Status</h2>
        <Button variant="ghost" size="sm" onClick={() => fetchHealth(true)} disabled={refreshing}>
          <RefreshCw className={`mr-1 h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {services.length === 0 ? (
        <GlassCard className="p-6">
          <GlassCardContent className="p-0 text-center">
            <HelpCircle className="text-muted-foreground mx-auto mb-2 h-8 w-8" />
            <p className="text-muted-foreground text-sm">No active services configured yet.</p>
          </GlassCardContent>
        </GlassCard>
      ) : (
        <div className="grid gap-3">
          {services.map((service) => {
            const config = STATUS_CONFIG[service.status];
            const Icon = config.icon;
            return (
              <GlassCard key={service.service} className="p-4">
                <GlassCardContent className="p-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`rounded-lg p-1.5 ${config.bg}`}>
                        <Icon className={`h-4 w-4 ${config.color}`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {SERVICE_LABELS[service.service] || service.service}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          Last checked{" "}
                          {new Date(service.checkedAt).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${config.bg} ${config.color}`}
                    >
                      {config.label}
                    </span>
                  </div>
                </GlassCardContent>
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
