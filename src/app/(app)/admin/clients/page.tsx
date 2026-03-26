"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { GlassCard, GlassCardContent } from "@/components/ui/glass-card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, AlertCircle, Users, Search } from "lucide-react";
import { apiClient } from "@/lib/api-client";

interface AdminClient {
  id: string;
  name: string;
  createdAt: string;
  clientProfile: {
    businessName: string;
    email: string | null;
    phone: string | null;
    industry: string | null;
  } | null;
  billingInfo: {
    serviceStatus: string;
  } | null;
  _count?: {
    serviceConfigs: number;
  };
}

interface AdminClientsResponse {
  data: AdminClient[];
  meta?: {
    total: number;
    page: number;
    pageSize: number;
  };
}

function getStatusColor(status: string) {
  switch (status) {
    case "active":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case "pending":
      return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    case "suspended":
      return "bg-red-500/10 text-red-400 border-red-500/20";
    case "terminated":
      return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
    default:
      return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
  }
}

export default function AdminClientsPage() {
  const router = useRouter();
  const [clients, setClients] = useState<AdminClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const loadClients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params: Record<string, string> = {};
      if (search) params.search = search;
      if (statusFilter !== "all") params.status = statusFilter;
      const res = (await apiClient.getAdminClients(params)) as AdminClientsResponse;
      setClients(res.data || []);
    } catch {
      setError("Failed to load clients");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      loadClients();
    }, 300);
    return () => clearTimeout(debounce);
  }, [loadClients]);

  return (
    <div className="p-6 md:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <h1 className="mb-1 text-2xl font-bold">Clients</h1>
          <p className="text-muted-foreground">
            Manage all client organizations and their service configurations.
          </p>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Search by business name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
              <SelectItem value="terminated">Terminated</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Clients Table */}
        <GlassCard>
          <GlassCardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : clients.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Users className="text-muted-foreground mb-3 h-10 w-10" />
                <p className="text-muted-foreground text-sm">
                  No clients found matching your criteria.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-border/50 border-b text-left">
                      <th className="text-muted-foreground pb-3 text-xs font-medium tracking-wider uppercase">
                        Business Name
                      </th>
                      <th className="text-muted-foreground pb-3 text-xs font-medium tracking-wider uppercase">
                        Email
                      </th>
                      <th className="text-muted-foreground pb-3 text-xs font-medium tracking-wider uppercase">
                        Status
                      </th>
                      <th className="text-muted-foreground pb-3 text-xs font-medium tracking-wider uppercase">
                        Services
                      </th>
                      <th className="text-muted-foreground pb-3 text-xs font-medium tracking-wider uppercase">
                        Created
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-border/50 divide-y">
                    {clients.map((client) => {
                      const businessName =
                        client.clientProfile?.businessName || client.name || "Unnamed";
                      const email = client.clientProfile?.email || "-";
                      const status = client.billingInfo?.serviceStatus || "pending";
                      const serviceCount = client._count?.serviceConfigs ?? 0;
                      const createdDate = new Date(client.createdAt).toLocaleDateString();

                      return (
                        <tr
                          key={client.id}
                          onClick={() => router.push(`/admin/clients/${client.id}`)}
                          className="cursor-pointer transition-colors hover:bg-zinc-100"
                        >
                          <td className="py-3 pr-4">
                            <span className="font-medium">{businessName}</span>
                          </td>
                          <td className="text-muted-foreground py-3 pr-4 text-sm">{email}</td>
                          <td className="py-3 pr-4">
                            <span
                              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${getStatusColor(status)}`}
                            >
                              {status}
                            </span>
                          </td>
                          <td className="text-muted-foreground py-3 pr-4 text-sm">
                            {serviceCount}
                          </td>
                          <td className="text-muted-foreground py-3 text-sm">{createdDate}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </GlassCardContent>
        </GlassCard>
      </div>
    </div>
  );
}
