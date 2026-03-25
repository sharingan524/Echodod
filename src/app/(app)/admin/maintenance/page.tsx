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
import { Loader2, AlertCircle, Wrench, Plus } from "lucide-react";
import { apiClient } from "@/lib/api-client";

interface MaintenanceLog {
  id: string;
  description: string;
  type: string;
  performedBy: string | null;
  performedAt: string;
  clientId: string;
  clientName?: string;
  organization?: {
    name: string;
    clientProfile?: {
      businessName: string;
    } | null;
  };
}

interface MaintenanceLogsResponse {
  data: MaintenanceLog[];
  meta?: {
    total: number;
    page: number;
    pageSize: number;
  };
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

export default function AdminMaintenancePage() {
  const [logs, setLogs] = useState<MaintenanceLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Filter
  const [typeFilter, setTypeFilter] = useState("all");

  // Create dialog
  const [createOpen, setCreateOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newLog, setNewLog] = useState({
    description: "",
    type: "routine",
    performedBy: "",
    clientId: "",
  });

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const loadLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params: Record<string, string> = {};
      if (typeFilter !== "all") params.type = typeFilter;
      const res = (await apiClient.getAdminMaintenanceLogs(params)) as MaintenanceLogsResponse;
      setLogs(res.data || []);
    } catch {
      setError("Failed to load maintenance logs");
    } finally {
      setLoading(false);
    }
  }, [typeFilter]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const handleCreateLog = async () => {
    if (!newLog.description.trim() || !newLog.clientId.trim()) {
      setError("Description and Client ID are required");
      return;
    }
    try {
      setSaving(true);
      setError(null);
      await apiClient.createAdminMaintenanceLog({
        description: newLog.description,
        type: newLog.type,
        performedBy: newLog.performedBy || undefined,
        clientId: newLog.clientId,
      });
      setCreateOpen(false);
      setNewLog({
        description: "",
        type: "routine",
        performedBy: "",
        clientId: "",
      });
      loadLogs();
      showSuccess("Maintenance log added successfully");
    } catch {
      setError("Failed to create maintenance log");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 md:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="mb-1 text-2xl font-bold">Maintenance Logs</h1>
            <p className="text-muted-foreground">
              Track maintenance activities across all client environments.
            </p>
          </div>
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Log
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

        {/* Filter */}
        <div className="mb-6">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="routine">Routine</SelectItem>
              <SelectItem value="fix">Fix</SelectItem>
              <SelectItem value="update">Update</SelectItem>
              <SelectItem value="emergency">Emergency</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Maintenance Logs List */}
        <GlassCard>
          <GlassCardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : logs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Wrench className="text-muted-foreground mb-3 h-10 w-10" />
                <p className="text-muted-foreground text-sm">
                  No maintenance logs found matching your filter.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {logs.map((log) => {
                  const clientName =
                    log.organization?.clientProfile?.businessName ||
                    log.organization?.name ||
                    log.clientName ||
                    log.clientId;

                  return (
                    <div
                      key={log.id}
                      className="border-border/50 flex items-center justify-between rounded-lg border p-4"
                    >
                      <div className="flex-1">
                        <p className="text-sm">{log.description}</p>
                        <div className="text-muted-foreground mt-1 flex flex-wrap items-center gap-3 text-xs">
                          <span>Client: {clientName}</span>
                          {log.performedBy && <span>By: {log.performedBy}</span>}
                          <span>{new Date(log.performedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <span
                        className={`ml-3 inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${getMaintenanceTypeColor(log.type)}`}
                      >
                        {log.type}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </GlassCardContent>
        </GlassCard>

        {/* Create Maintenance Log Dialog */}
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Maintenance Log</DialogTitle>
              <DialogDescription>
                Record a maintenance activity for a client environment.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="logClientId">Client ID</Label>
                <Input
                  id="logClientId"
                  value={newLog.clientId}
                  onChange={(e) => setNewLog({ ...newLog, clientId: e.target.value })}
                  placeholder="Organization ID"
                />
              </div>
              <div>
                <Label htmlFor="logDescription">Description</Label>
                <Textarea
                  id="logDescription"
                  rows={3}
                  value={newLog.description}
                  onChange={(e) => setNewLog({ ...newLog, description: e.target.value })}
                  placeholder="Describe the maintenance activity..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="logType">Type</Label>
                  <Select
                    value={newLog.type}
                    onValueChange={(value) => setNewLog({ ...newLog, type: value })}
                  >
                    <SelectTrigger id="logType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="routine">Routine</SelectItem>
                      <SelectItem value="fix">Fix</SelectItem>
                      <SelectItem value="update">Update</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="logPerformedBy">Performed By</Label>
                  <Input
                    id="logPerformedBy"
                    value={newLog.performedBy}
                    onChange={(e) => setNewLog({ ...newLog, performedBy: e.target.value })}
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
                onClick={handleCreateLog}
                disabled={saving || !newLog.description.trim() || !newLog.clientId.trim()}
              >
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Log
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
