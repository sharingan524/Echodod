"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GlassCard, GlassCardContent } from "@/components/ui/glass-card";
import {
  Phone,
  MessageSquare,
  Mail,
  Smartphone,
  ArrowUpRight,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Clock,
  Activity,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { OnboardingDialog } from "@/components/dashboard/OnboardingDialog";
import { UsageWarningBanner } from "@/components/dashboard/UsageWarningBanner";
import { ServiceStatusPanel } from "@/components/dashboard/ServiceStatusPanel";
import { ProvisioningProgress } from "@/components/dashboard/ProvisioningProgress";

interface DashboardMetrics {
  communicationsToday: { value: number; change: string };
  activeChannels: { value: number };
  serviceStatus: { value: string };
}

interface RecentActivity {
  id: string;
  createdAt: string;
  content: string;
  contactInfo: string;
  channel: string;
  outcome: string;
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
}

function formatTime(date: string) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function getChannelIcon(channel: string) {
  switch (channel) {
    case "phone":
      return <Phone className="h-4 w-4 text-sky-400" />;
    case "chat":
      return <MessageSquare className="h-4 w-4 text-violet-400" />;
    case "email":
      return <Mail className="h-4 w-4 text-amber-400" />;
    case "sms":
      return <Smartphone className="h-4 w-4 text-emerald-400" />;
    default:
      return <Activity className="text-muted-foreground h-4 w-4" />;
  }
}

function getOutcomeIcon(outcome: string) {
  if (outcome === "resolved" || outcome === "delivered") {
    return <CheckCircle className="h-4 w-4 text-emerald-400" />;
  }
  if (outcome === "escalated") {
    return <Clock className="h-4 w-4 text-amber-400" />;
  }
  return <AlertTriangle className="text-destructive h-4 w-4" />;
}

function getServiceStatusColor(status: string) {
  switch (status) {
    case "active":
      return "text-emerald-400";
    case "pending":
      return "text-amber-400";
    case "suspended":
      return "text-destructive";
    case "terminated":
      return "text-muted-foreground";
    default:
      return "text-muted-foreground";
  }
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await apiClient.getDashboardMetrics();
        setMetrics(data.metrics);
        setRecentActivity(data.recentActivity || []);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load dashboard data";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 md:p-8">
        <div className="border-destructive/50 bg-destructive/10 text-destructive rounded-lg border p-4">
          {error}
        </div>
      </div>
    );
  }

  const serviceStatus = metrics?.serviceStatus?.value || "pending";

  return (
    <div className="p-6 md:p-8">
      {/* Onboarding Dialog */}
      <OnboardingDialog />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          {getGreeting()}, Dispatch.
        </h1>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-muted-foreground flex items-center gap-1.5 text-sm">
            <span
              className={`h-2 w-2 rounded-full ${serviceStatus === "active" ? "animate-pulse bg-emerald-400" : "bg-amber-400"}`}
            />
            Service Status:{" "}
            <span className={getServiceStatusColor(serviceStatus)}>
              {serviceStatus.toUpperCase()}
            </span>
          </span>
          <span className="text-muted-foreground">•</span>
          <span className="text-muted-foreground text-sm">
            Powered by AWS Communication Services
          </span>
        </div>
      </div>

      {/* Usage Warning Banner */}
      <UsageWarningBanner />

      {/* Key Metrics */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <GlassCard className="p-6">
            <GlassCardContent className="p-0">
              <div className="flex items-center justify-between">
                <Activity className="text-syntax-cyan h-5 w-5" />
                {metrics?.communicationsToday?.change && (
                  <span className="flex items-center gap-1 text-xs text-emerald-400">
                    <ArrowUpRight className="h-3 w-3" />
                    {metrics.communicationsToday.change}
                  </span>
                )}
              </div>
              <p className="text-syntax-cyan mt-4 text-3xl font-bold">
                {metrics?.communicationsToday?.value || 0}
              </p>
              <p className="text-muted-foreground mt-1 text-sm">Communications Today</p>
            </GlassCardContent>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard className="p-6">
            <GlassCardContent className="p-0">
              <div className="flex items-center justify-between">
                <Phone className="h-5 w-5 text-emerald-400" />
              </div>
              <p className="mt-4 text-3xl font-bold text-emerald-400">
                {metrics?.activeChannels?.value || 0}
              </p>
              <p className="text-muted-foreground mt-1 text-sm">Active Channels</p>
            </GlassCardContent>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard className="p-6">
            <GlassCardContent className="p-0">
              <div className="flex items-center justify-between">
                <CheckCircle className={`h-5 w-5 ${getServiceStatusColor(serviceStatus)}`} />
              </div>
              <p
                className={`mt-4 text-3xl font-bold capitalize ${getServiceStatusColor(serviceStatus)}`}
              >
                {serviceStatus}
              </p>
              <p className="text-muted-foreground mt-1 text-sm">Service Status</p>
            </GlassCardContent>
          </GlassCard>
        </motion.div>
      </div>

      {/* Service Health & Provisioning Widgets */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <ServiceStatusPanel compact />
        <ProvisioningProgress compact />
      </div>

      {/* Recent Activity */}
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/logs">
              View Full Logs
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="border-border bg-card/50 rounded-xl border">
          <div className="divide-border divide-y">
            {recentActivity.length === 0 ? (
              <div className="text-muted-foreground p-8 text-center">No recent activity</div>
            ) : (
              recentActivity.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-4 p-4"
                >
                  <div className="flex-shrink-0">{getChannelIcon(item.channel)}</div>
                  <div className="text-muted-foreground hidden w-20 shrink-0 text-sm sm:block">
                    {formatTime(item.createdAt)}
                  </div>
                  <div className="flex-1">
                    <p className="line-clamp-1 text-sm">&quot;{item.content}&quot;</p>
                    <p className="text-muted-foreground text-xs">{item.contactInfo}</p>
                  </div>
                  <div className="hidden shrink-0 sm:block">
                    <span className="bg-muted rounded-md px-2 py-1 font-mono text-xs capitalize">
                      {item.channel}
                    </span>
                  </div>
                  <div className="flex shrink-0 items-center gap-2 text-sm">
                    {getOutcomeIcon(item.outcome)}
                    <span className="text-muted-foreground hidden capitalize lg:block">
                      {item.outcome}
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/business">
            <Clock className="mr-2 h-4 w-4" />
            Update Business Hours
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/logs">View Logs</Link>
        </Button>
      </div>
    </div>
  );
}
