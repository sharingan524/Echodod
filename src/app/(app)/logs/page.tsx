"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GlassCard, GlassCardContent } from "@/components/ui/glass-card";
import {
  Search,
  Phone,
  MessageSquare,
  Mail,
  Smartphone,
  CheckCircle,
  AlertTriangle,
  Clock,
  Activity,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";

interface CommunicationLog {
  id: string;
  externalId: string;
  channel: string;
  direction: string;
  contactInfo: string;
  subject: string | null;
  content: string;
  duration: number | null;
  outcome: string;
  status: string;
  provider: string;
  createdAt: string;
}

function formatTime(date: string) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDuration(seconds: number | null) {
  if (seconds === null || seconds === undefined) return "--";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
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

export default function LogsPage() {
  const [logs, setLogs] = useState<CommunicationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    search: "",
    channel: "",
    status: "",
    outcome: "",
  });

  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filters]);

  async function fetchLogs() {
    try {
      setLoading(true);
      const params: Record<string, string> = { page: String(page), pageSize: "20" };
      if (filters.search) params.search = filters.search;
      if (filters.channel) params.channel = filters.channel;
      if (filters.status) params.status = filters.status;
      if (filters.outcome) params.outcome = filters.outcome;

      const response = (await apiClient.getLogs(params)) as {
        data?: CommunicationLog[];
        pagination?: { total?: number };
      };
      setLogs(response.data || []);
      setTotal(response.pagination?.total || 0);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load logs";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  const totalPages = Math.ceil(total / 20);

  if (loading && page === 1) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Communication Logs</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          View and filter your communication history across all channels
        </p>
      </div>

      {error && (
        <div className="border-destructive/50 bg-destructive/10 text-destructive mb-4 rounded-lg border p-4">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-3">
        <div className="min-w-[200px] flex-1">
          <Input
            placeholder="Search content or contact info..."
            value={filters.search}
            onChange={(e) => {
              setFilters({ ...filters, search: e.target.value });
              setPage(1);
            }}
            className="w-full"
          />
        </div>
        <Select
          value={filters.channel}
          onValueChange={(value) => {
            setFilters({ ...filters, channel: value });
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Channels" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Channels</SelectItem>
            <SelectItem value="phone">Phone</SelectItem>
            <SelectItem value="chat">Chat</SelectItem>
            <SelectItem value="sms">SMS</SelectItem>
            <SelectItem value="email">Email</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filters.status}
          onValueChange={(value) => {
            setFilters({ ...filters, status: value });
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filters.outcome}
          onValueChange={(value) => {
            setFilters({ ...filters, outcome: value });
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Outcomes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Outcomes</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="escalated">Escalated</SelectItem>
            <SelectItem value="missed">Missed</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="bounced">Bounced</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Logs List */}
      <GlassCard>
        <GlassCardContent className="p-0">
          <div className="divide-border divide-y">
            {logs.length === 0 ? (
              <div className="p-12 text-center">
                <Search className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                <h3 className="mb-2 text-lg font-semibold">No logs found</h3>
                <p className="text-muted-foreground text-sm">Try adjusting your filters</p>
              </div>
            ) : (
              logs.map((log, i) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className="p-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 pt-1">{getChannelIcon(log.channel)}</div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium">{log.contactInfo}</span>
                        <span className="text-muted-foreground text-xs">
                          {formatTime(log.createdAt)}
                        </span>
                        <span className="bg-muted rounded px-2 py-0.5 font-mono text-xs capitalize">
                          {log.channel}
                        </span>
                        <span className="text-muted-foreground text-xs capitalize">
                          {log.direction}
                        </span>
                      </div>
                      <p className="text-muted-foreground mb-2 line-clamp-2 text-sm">
                        {log.content}
                      </p>
                      <div className="text-muted-foreground flex flex-wrap items-center gap-3 text-xs">
                        {log.duration !== null && (
                          <span>Duration: {formatDuration(log.duration)}</span>
                        )}
                        <span className="capitalize">Status: {log.status}</span>
                        <span className="capitalize">Outcome: {log.outcome}</span>
                        <span className="capitalize">Provider: {log.provider}</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 pt-1">{getOutcomeIcon(log.outcome)}</div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </GlassCardContent>
      </GlassCard>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-muted-foreground text-sm">
            Showing {logs.length} of {total} total logs
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page === 1 || loading}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="flex items-center px-3 text-sm">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages || loading}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
