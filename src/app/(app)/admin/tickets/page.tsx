"use client";

import { useState, useEffect, useCallback } from "react";
import { GlassCard, GlassCardContent } from "@/components/ui/glass-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  AlertCircle,
  ClipboardList,
  Plus,
  CheckCircle2,
  XCircle,
  Circle,
  RotateCw,
  Zap,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";

interface ProvisioningStep {
  id: string;
  name: string;
  service: string;
  status: "pending" | "in_progress" | "completed" | "failed" | "skipped";
  error?: string;
}

interface ProvisioningPlan {
  tier: string;
  steps: ProvisioningStep[];
  currentStepIndex: number;
  status: "pending" | "in_progress" | "completed" | "failed" | "cancelled";
}

interface ImplementationTicket {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  assignedTo: string | null;
  clientId: string;
  clientName?: string;
  organization?: {
    name: string;
    clientProfile?: {
      businessName: string;
    } | null;
  };
  provisioningSteps?: ProvisioningPlan;
  provisioningMode?: string;
  createdAt: string;
}

interface TicketsResponse {
  data: ImplementationTicket[];
  meta?: {
    total: number;
    page: number;
    pageSize: number;
  };
}

function getStatusColor(status: string) {
  switch (status) {
    case "completed":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case "pending":
      return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    case "in-progress":
      return "bg-sky-500/10 text-sky-400 border-sky-500/20";
    case "cancelled":
      return "bg-red-500/10 text-red-400 border-red-500/20";
    default:
      return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
  }
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case "urgent":
      return "bg-red-500/10 text-red-400 border-red-500/20";
    case "high":
      return "bg-orange-500/10 text-orange-400 border-orange-500/20";
    case "medium":
      return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    case "low":
      return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
    default:
      return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
  }
}

function StepStatusIcon({ status }: { status: string }) {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
    case "in_progress":
      return <Loader2 className="h-4 w-4 animate-spin text-sky-400" />;
    case "failed":
      return <XCircle className="h-4 w-4 text-red-400" />;
    case "skipped":
      return <Circle className="h-4 w-4 text-zinc-500" />;
    default:
      return <Circle className="h-4 w-4 text-zinc-600" />;
  }
}

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<ImplementationTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  // Create dialog
  const [createOpen, setCreateOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newTicket, setNewTicket] = useState({
    title: "",
    description: "",
    priority: "medium",
    assignedTo: "",
    clientId: "",
  });

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const loadTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params: Record<string, string> = {};
      if (statusFilter !== "all") params.status = statusFilter;
      if (priorityFilter !== "all") params.priority = priorityFilter;
      const res = (await apiClient.getAdminTickets(params)) as TicketsResponse;
      setTickets(res.data || []);
    } catch {
      setError("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, priorityFilter]);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  const [retryingTicketId, setRetryingTicketId] = useState<string | null>(null);

  const handleRetryProvisioning = async (ticketId: string, clientId: string) => {
    try {
      setRetryingTicketId(ticketId);
      setError(null);
      await apiClient.retryProvisioning(clientId, ticketId);
      showSuccess("Provisioning retry initiated. Refreshing...");
      // Poll after a short delay to let the first step start
      setTimeout(() => loadTickets(), 3000);
    } catch {
      setError("Failed to retry provisioning");
    } finally {
      setRetryingTicketId(null);
    }
  };

  const handleCreateTicket = async () => {
    if (!newTicket.title.trim() || !newTicket.clientId.trim()) {
      setError("Title and Client ID are required");
      return;
    }
    try {
      setSaving(true);
      setError(null);
      await apiClient.createAdminTicket({
        title: newTicket.title,
        description: newTicket.description || undefined,
        priority: newTicket.priority,
        assignedTo: newTicket.assignedTo || undefined,
        clientId: newTicket.clientId,
      });
      setCreateOpen(false);
      setNewTicket({
        title: "",
        description: "",
        priority: "medium",
        assignedTo: "",
        clientId: "",
      });
      loadTickets();
      showSuccess("Ticket created successfully");
    } catch {
      setError("Failed to create ticket");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 md:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="mb-1 text-2xl font-bold">Implementation Tickets</h1>
            <p className="text-muted-foreground">
              Track and manage implementation tasks across all clients.
            </p>
          </div>
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Ticket
          </Button>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">
            {successMsg}
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tickets List */}
        <GlassCard>
          <GlassCardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : tickets.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <ClipboardList className="text-muted-foreground mb-3 h-10 w-10" />
                <p className="text-muted-foreground text-sm">
                  No tickets found matching your filters.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {tickets.map((ticket) => {
                  const clientName =
                    ticket.organization?.clientProfile?.businessName ||
                    ticket.organization?.name ||
                    ticket.clientName ||
                    ticket.clientId;

                  const plan = ticket.provisioningSteps;
                  const isAutoProvisioned = ticket.provisioningMode === "auto" && plan;
                  const completedSteps = plan?.steps.filter((s) => s.status === "completed").length ?? 0;
                  const totalSteps = plan?.steps.length ?? 0;
                  const hasFailed = plan?.status === "failed";

                  return (
                    <div key={ticket.id} className="border-border/50 rounded-lg border p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium">{ticket.title}</p>
                            {isAutoProvisioned && (
                              <span className="inline-flex items-center gap-1 rounded-full border border-violet-500/20 bg-violet-500/10 px-2 py-0.5 text-xs text-violet-400">
                                <Zap className="h-3 w-3" />
                                Auto
                              </span>
                            )}
                          </div>
                          <p className="text-muted-foreground mt-0.5 text-xs">
                            Client: {clientName}
                          </p>
                          {ticket.description && (
                            <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">
                              {ticket.description}
                            </p>
                          )}
                          <div className="text-muted-foreground mt-2 flex items-center gap-3 text-xs">
                            {ticket.assignedTo && <span>Assigned to: {ticket.assignedTo}</span>}
                            <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex shrink-0 flex-col items-end gap-2">
                          <span
                            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${getStatusColor(ticket.status)}`}
                          >
                            {ticket.status}
                          </span>
                          <span
                            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${getPriorityColor(ticket.priority)}`}
                          >
                            {ticket.priority}
                          </span>
                        </div>
                      </div>

                      {/* Provisioning Progress */}
                      {isAutoProvisioned && (
                        <div className="mt-4 border-t border-border/50 pt-4">
                          <div className="mb-2 flex items-center justify-between">
                            <p className="text-xs font-medium">
                              Provisioning Progress ({completedSteps}/{totalSteps})
                            </p>
                            {hasFailed && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 gap-1 text-xs"
                                onClick={() => handleRetryProvisioning(ticket.id, ticket.clientId)}
                                disabled={retryingTicketId === ticket.id}
                              >
                                {retryingTicketId === ticket.id ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <RotateCw className="h-3 w-3" />
                                )}
                                Retry
                              </Button>
                            )}
                          </div>

                          {/* Progress bar */}
                          <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-zinc-800">
                            <div
                              className={`h-full rounded-full transition-all ${hasFailed ? "bg-red-500" : plan.status === "completed" ? "bg-emerald-500" : "bg-sky-500"}`}
                              style={{ width: `${totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0}%` }}
                            />
                          </div>

                          {/* Steps list */}
                          <div className="space-y-1.5">
                            {plan.steps.map((step) => (
                              <div key={step.id} className="flex items-center gap-2">
                                <StepStatusIcon status={step.status} />
                                <span className={`text-xs ${step.status === "failed" ? "text-red-400" : step.status === "completed" ? "text-emerald-400" : "text-muted-foreground"}`}>
                                  {step.name}
                                </span>
                                {step.error && (
                                  <span className="ml-auto text-xs text-red-400/70 truncate max-w-[200px]" title={step.error}>
                                    {step.error}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </GlassCardContent>
        </GlassCard>

        {/* Create Ticket Dialog */}
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Implementation Ticket</DialogTitle>
              <DialogDescription>
                Create a new implementation ticket for a client.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="ticketTitle">Title</Label>
                <Input
                  id="ticketTitle"
                  value={newTicket.title}
                  onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                  placeholder="e.g. Set up Amazon Connect instance"
                />
              </div>
              <div>
                <Label htmlFor="ticketClientId">Client ID</Label>
                <Input
                  id="ticketClientId"
                  value={newTicket.clientId}
                  onChange={(e) => setNewTicket({ ...newTicket, clientId: e.target.value })}
                  placeholder="Organization ID"
                />
              </div>
              <div>
                <Label htmlFor="ticketDescription">Description</Label>
                <Textarea
                  id="ticketDescription"
                  rows={3}
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  placeholder="Describe the implementation task..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ticketPriority">Priority</Label>
                  <Select
                    value={newTicket.priority}
                    onValueChange={(value) => setNewTicket({ ...newTicket, priority: value })}
                  >
                    <SelectTrigger id="ticketPriority">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="ticketAssignee">Assigned To</Label>
                  <Input
                    id="ticketAssignee"
                    value={newTicket.assignedTo}
                    onChange={(e) => setNewTicket({ ...newTicket, assignedTo: e.target.value })}
                    placeholder="Name or email"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateTicket}
                disabled={saving || !newTicket.title.trim() || !newTicket.clientId.trim()}
              >
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Ticket
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
