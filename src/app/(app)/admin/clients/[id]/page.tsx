"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { GlassCard, GlassCardContent } from "@/components/ui/glass-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
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
  ArrowLeft,
  Building2,
  Server,
  ClipboardList,
  Wrench,
  CreditCard,
  Plus,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";

// ---- Types ----

interface ClientProfile {
  businessName: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  industry: string | null;
  timezone: string;
  description: string | null;
}

interface BillingInfo {
  serviceStatus: string;
  implementationFee: number | null;
  monthlyMaintenanceFee: number | null;
  nextPaymentDate: string | null;
  lastPaymentDate: string | null;
}

interface AdminClientDetail {
  id: string;
  name: string;
  createdAt: string;
  clientProfile: ClientProfile | null;
  billingInfo: BillingInfo | null;
  _count?: {
    serviceConfigs: number;
    implementationTickets: number;
    maintenanceLogs: number;
  };
}

interface ServiceConfig {
  id: string;
  serviceType: string;
  status: string;
  awsRegion: string | null;
  createdAt: string;
}

interface ImplementationTicket {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  assignedTo: string | null;
  createdAt: string;
}

interface MaintenanceLog {
  id: string;
  description: string;
  type: string;
  performedBy: string | null;
  performedAt: string;
}

// ---- Helpers ----

function getStatusColor(status: string) {
  switch (status) {
    case "active":
    case "completed":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case "pending":
      return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    case "in-progress":
    case "provisioning":
      return "bg-sky-500/10 text-sky-400 border-sky-500/20";
    case "suspended":
    case "cancelled":
      return "bg-red-500/10 text-red-400 border-red-500/20";
    case "terminated":
    case "deprovisioned":
      return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
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

function getMaintenanceTypeColor(type: string) {
  switch (type) {
    case "routine":
      return "bg-sky-500/10 text-sky-400 border-sky-500/20";
    case "fix":
      return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    case "update":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case "emergency":
      return "bg-red-500/10 text-red-400 border-red-500/20";
    default:
      return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
  }
}

function formatCurrency(amount: number | null | undefined) {
  if (amount == null) return "-";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

// ---- Component ----

export default function AdminClientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.id as string;

  const [activeTab, setActiveTab] = useState("overview");
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Client detail
  const [client, setClient] = useState<AdminClientDetail | null>(null);
  const [clientLoading, setClientLoading] = useState(true);

  // Services
  const [services, setServices] = useState<ServiceConfig[]>([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [addServiceOpen, setAddServiceOpen] = useState(false);
  const [newService, setNewService] = useState({
    serviceType: "amazon-connect",
    awsRegion: "us-east-1",
  });
  const [savingService, setSavingService] = useState(false);

  // Tickets
  const [tickets, setTickets] = useState<ImplementationTicket[]>([]);
  const [ticketsLoading, setTicketsLoading] = useState(false);

  // Maintenance logs
  const [maintenanceLogs, setMaintenanceLogs] = useState<MaintenanceLog[]>([]);
  const [maintenanceLoading, setMaintenanceLoading] = useState(false);

  // Billing
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  // Load client detail
  const loadClient = useCallback(async () => {
    try {
      setClientLoading(true);
      setError(null);
      const res = (await apiClient.getAdminClient(clientId)) as {
        data: AdminClientDetail;
      };
      setClient(res.data);
    } catch {
      setError("Failed to load client details");
    } finally {
      setClientLoading(false);
    }
  }, [clientId]);

  // Load services
  const loadServices = useCallback(async () => {
    try {
      setServicesLoading(true);
      const res = (await apiClient.getAdminClientServices(clientId)) as {
        data: ServiceConfig[];
      };
      setServices(res.data || []);
    } catch {
      setError("Failed to load services");
    } finally {
      setServicesLoading(false);
    }
  }, [clientId]);

  // Load tickets
  const loadTickets = useCallback(async () => {
    try {
      setTicketsLoading(true);
      const res = (await apiClient.getAdminTickets({
        clientId,
      })) as { data: ImplementationTicket[] };
      setTickets(res.data || []);
    } catch {
      setError("Failed to load tickets");
    } finally {
      setTicketsLoading(false);
    }
  }, [clientId]);

  // Load maintenance logs
  const loadMaintenanceLogs = useCallback(async () => {
    try {
      setMaintenanceLoading(true);
      const res = (await apiClient.getAdminMaintenanceLogs({
        clientId,
      })) as { data: MaintenanceLog[] };
      setMaintenanceLogs(res.data || []);
    } catch {
      setError("Failed to load maintenance logs");
    } finally {
      setMaintenanceLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    loadClient();
  }, [loadClient]);

  useEffect(() => {
    if (activeTab === "services") loadServices();
    if (activeTab === "tickets") loadTickets();
    if (activeTab === "maintenance") loadMaintenanceLogs();
  }, [activeTab, loadServices, loadTickets, loadMaintenanceLogs]);

  // Create service
  const handleCreateService = async () => {
    try {
      setSavingService(true);
      setError(null);
      await apiClient.createAdminClientService(clientId, newService);
      setAddServiceOpen(false);
      setNewService({ serviceType: "amazon-connect", awsRegion: "us-east-1" });
      loadServices();
      showSuccess("Service added successfully");
    } catch {
      setError("Failed to create service");
    } finally {
      setSavingService(false);
    }
  };

  // Update service status (billing tab)
  const handleUpdateServiceStatus = async (newStatus: string) => {
    try {
      setUpdatingStatus(true);
      setError(null);
      await apiClient.updateAdminClient(clientId, {
        serviceStatus: newStatus,
      });
      showSuccess("Service status updated");
      loadClient();
    } catch {
      setError("Failed to update service status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (clientLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!client && !clientLoading) {
    return (
      <div className="p-6 md:p-8">
        <div className="border-destructive/50 bg-destructive/10 text-destructive rounded-lg border p-4">
          Client not found.
        </div>
      </div>
    );
  }

  const profile = client?.clientProfile;
  const billing = client?.billingInfo;
  const serviceStatus = billing?.serviceStatus || "pending";

  return (
    <div className="p-6 md:p-8">
      <div className="mx-auto max-w-5xl">
        {/* Back button and header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/admin/clients")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Clients
          </Button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">
              {profile?.businessName || client?.name || "Unnamed Client"}
            </h1>
            <span
              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${getStatusColor(serviceStatus)}`}
            >
              {serviceStatus}
            </span>
          </div>
          <p className="text-muted-foreground mt-1">
            Client ID: {client?.id} | Created:{" "}
            {client?.createdAt ? new Date(client.createdAt).toLocaleDateString() : "-"}
          </p>
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

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center gap-2">
              <Server className="h-4 w-4" />
              <span className="hidden sm:inline">Services</span>
            </TabsTrigger>
            <TabsTrigger value="tickets" className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              <span className="hidden sm:inline">Tickets</span>
            </TabsTrigger>
            <TabsTrigger value="maintenance" className="flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              <span className="hidden sm:inline">Maintenance</span>
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Billing</span>
            </TabsTrigger>
          </TabsList>

          {/* ==================== Overview Tab ==================== */}
          <TabsContent value="overview">
            <div className="grid gap-6 lg:grid-cols-2">
              <GlassCard>
                <GlassCardContent>
                  <h3 className="text-muted-foreground mb-4 text-sm font-semibold tracking-wider uppercase">
                    Business Profile
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-muted-foreground text-xs">Business Name</Label>
                      <p className="text-sm font-medium">{profile?.businessName || "-"}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">Email</Label>
                      <p className="text-sm">{profile?.email || "-"}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">Phone</Label>
                      <p className="text-sm">{profile?.phone || "-"}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">Address</Label>
                      <p className="text-sm">{profile?.address || "-"}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-muted-foreground text-xs">Industry</Label>
                        <p className="text-sm">{profile?.industry || "-"}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground text-xs">Timezone</Label>
                        <p className="text-sm">{profile?.timezone || "-"}</p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">Website</Label>
                      <p className="text-sm">{profile?.website || "-"}</p>
                    </div>
                  </div>
                </GlassCardContent>
              </GlassCard>

              <GlassCard>
                <GlassCardContent>
                  <h3 className="text-muted-foreground mb-4 text-sm font-semibold tracking-wider uppercase">
                    Quick Stats
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border-border/50 rounded-lg border p-4">
                      <p className="text-2xl font-bold text-sky-400">
                        {client?._count?.serviceConfigs ?? 0}
                      </p>
                      <p className="text-muted-foreground mt-1 text-xs">Services</p>
                    </div>
                    <div className="border-border/50 rounded-lg border p-4">
                      <p className="text-2xl font-bold text-amber-400">
                        {client?._count?.implementationTickets ?? 0}
                      </p>
                      <p className="text-muted-foreground mt-1 text-xs">Tickets</p>
                    </div>
                    <div className="border-border/50 rounded-lg border p-4">
                      <p className="text-2xl font-bold text-emerald-400">
                        {client?._count?.maintenanceLogs ?? 0}
                      </p>
                      <p className="text-muted-foreground mt-1 text-xs">Maintenance Logs</p>
                    </div>
                    <div className="border-border/50 rounded-lg border p-4">
                      <p
                        className={`text-2xl font-bold capitalize ${
                          serviceStatus === "active"
                            ? "text-emerald-400"
                            : serviceStatus === "pending"
                              ? "text-amber-400"
                              : "text-red-400"
                        }`}
                      >
                        {serviceStatus}
                      </p>
                      <p className="text-muted-foreground mt-1 text-xs">Service Status</p>
                    </div>
                  </div>
                </GlassCardContent>
              </GlassCard>
            </div>
          </TabsContent>

          {/* ==================== Services Tab ==================== */}
          <TabsContent value="services">
            <GlassCard>
              <GlassCardContent>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
                    Service Configurations
                  </h3>
                  <Button size="sm" onClick={() => setAddServiceOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Service
                  </Button>
                </div>

                {servicesLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : services.length === 0 ? (
                  <p className="text-muted-foreground py-8 text-center text-sm">
                    No services configured yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {services.map((svc) => (
                      <div
                        key={svc.id}
                        className="border-border/50 flex items-center justify-between rounded-lg border p-4"
                      >
                        <div>
                          <p className="text-sm font-medium">{svc.serviceType}</p>
                          <p className="text-muted-foreground text-xs">
                            Region: {svc.awsRegion || "-"} | Created:{" "}
                            {new Date(svc.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${getStatusColor(svc.status)}`}
                        >
                          {svc.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </GlassCardContent>
            </GlassCard>

            {/* Add Service Dialog */}
            <Dialog open={addServiceOpen} onOpenChange={setAddServiceOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Service Configuration</DialogTitle>
                  <DialogDescription>
                    Add a new AWS service configuration for this client.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="serviceType">Service Type</Label>
                    <Select
                      value={newService.serviceType}
                      onValueChange={(value) =>
                        setNewService({ ...newService, serviceType: value })
                      }
                    >
                      <SelectTrigger id="serviceType">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="amazon-connect">Amazon Connect</SelectItem>
                        <SelectItem value="pinpoint">Amazon Pinpoint</SelectItem>
                        <SelectItem value="ses">Amazon SES</SelectItem>
                        <SelectItem value="sns">Amazon SNS</SelectItem>
                        <SelectItem value="chime-sdk">Amazon Chime SDK</SelectItem>
                        <SelectItem value="lex">Amazon Lex</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="awsRegion">AWS Region</Label>
                    <Select
                      value={newService.awsRegion}
                      onValueChange={(value) => setNewService({ ...newService, awsRegion: value })}
                    >
                      <SelectTrigger id="awsRegion">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us-east-1">US East (N. Virginia)</SelectItem>
                        <SelectItem value="us-west-2">US West (Oregon)</SelectItem>
                        <SelectItem value="eu-west-1">EU (Ireland)</SelectItem>
                        <SelectItem value="eu-central-1">EU (Frankfurt)</SelectItem>
                        <SelectItem value="ap-southeast-1">Asia Pacific (Singapore)</SelectItem>
                        <SelectItem value="ap-northeast-1">Asia Pacific (Tokyo)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setAddServiceOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateService} disabled={savingService}>
                    {savingService && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Add Service
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* ==================== Tickets Tab ==================== */}
          <TabsContent value="tickets">
            <GlassCard>
              <GlassCardContent>
                <h3 className="text-muted-foreground mb-4 text-sm font-semibold tracking-wider uppercase">
                  Implementation Tickets
                </h3>

                {ticketsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : tickets.length === 0 ? (
                  <p className="text-muted-foreground py-8 text-center text-sm">
                    No implementation tickets for this client.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {tickets.map((ticket) => (
                      <div key={ticket.id} className="border-border/50 rounded-lg border p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <p className="text-sm font-medium">{ticket.title}</p>
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
                      </div>
                    ))}
                  </div>
                )}
              </GlassCardContent>
            </GlassCard>
          </TabsContent>

          {/* ==================== Maintenance Tab ==================== */}
          <TabsContent value="maintenance">
            <GlassCard>
              <GlassCardContent>
                <h3 className="text-muted-foreground mb-4 text-sm font-semibold tracking-wider uppercase">
                  Maintenance Logs
                </h3>

                {maintenanceLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : maintenanceLogs.length === 0 ? (
                  <p className="text-muted-foreground py-8 text-center text-sm">
                    No maintenance logs for this client.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {maintenanceLogs.map((log) => (
                      <div
                        key={log.id}
                        className="border-border/50 flex items-center justify-between rounded-lg border p-4"
                      >
                        <div>
                          <p className="text-sm">{log.description}</p>
                          <div className="text-muted-foreground mt-1 flex items-center gap-3 text-xs">
                            {log.performedBy && <span>By: {log.performedBy}</span>}
                            <span>{new Date(log.performedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${getMaintenanceTypeColor(log.type)}`}
                        >
                          {log.type}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </GlassCardContent>
            </GlassCard>
          </TabsContent>

          {/* ==================== Billing Tab ==================== */}
          <TabsContent value="billing">
            <GlassCard>
              <GlassCardContent>
                <h3 className="text-muted-foreground mb-4 text-sm font-semibold tracking-wider uppercase">
                  Billing Details
                </h3>

                <div className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="border-border/50 rounded-lg border p-4">
                      <Label className="text-muted-foreground text-xs">Implementation Fee</Label>
                      <p className="mt-1 text-lg font-semibold">
                        {formatCurrency(billing?.implementationFee)}
                      </p>
                    </div>
                    <div className="border-border/50 rounded-lg border p-4">
                      <Label className="text-muted-foreground text-xs">
                        Monthly Maintenance Fee
                      </Label>
                      <p className="mt-1 text-lg font-semibold">
                        {formatCurrency(billing?.monthlyMaintenanceFee)}
                      </p>
                    </div>
                    <div className="border-border/50 rounded-lg border p-4">
                      <Label className="text-muted-foreground text-xs">Last Payment Date</Label>
                      <p className="mt-1 text-sm font-medium">
                        {billing?.lastPaymentDate
                          ? new Date(billing.lastPaymentDate).toLocaleDateString()
                          : "-"}
                      </p>
                    </div>
                    <div className="border-border/50 rounded-lg border p-4">
                      <Label className="text-muted-foreground text-xs">Next Payment Date</Label>
                      <p className="mt-1 text-sm font-medium">
                        {billing?.nextPaymentDate
                          ? new Date(billing.nextPaymentDate).toLocaleDateString()
                          : "-"}
                      </p>
                    </div>
                  </div>

                  <div className="border-border/50 rounded-lg border p-4">
                    <Label className="text-muted-foreground text-xs">Service Status</Label>
                    <div className="mt-2 flex items-center gap-3">
                      <Select
                        value={serviceStatus}
                        onValueChange={handleUpdateServiceStatus}
                        disabled={updatingStatus}
                      >
                        <SelectTrigger className="w-[200px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="suspended">Suspended</SelectItem>
                          <SelectItem value="terminated">Terminated</SelectItem>
                        </SelectContent>
                      </Select>
                      {updatingStatus && <Loader2 className="h-4 w-4 animate-spin" />}
                    </div>
                  </div>
                </div>
              </GlassCardContent>
            </GlassCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
