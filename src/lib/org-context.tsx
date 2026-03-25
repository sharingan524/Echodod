"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { useSession } from "next-auth/react";
import { apiClient } from "@/lib/api-client";

export interface OrgInfo {
  id: string;
  name: string;
  slug: string;
  plan: string;
  role: string;
}

interface OrgContextValue {
  organizations: OrgInfo[];
  activeOrg: OrgInfo | null;
  setActiveOrgId: (id: string) => void;
  loading: boolean;
}

const OrgContext = createContext<OrgContextValue>({
  organizations: [],
  activeOrg: null,
  setActiveOrgId: () => {},
  loading: true,
});

const STORAGE_KEY = "syntax-active-org";

export function OrgProvider({ children }: { children: ReactNode }) {
  const { status } = useSession();
  const [organizations, setOrganizations] = useState<OrgInfo[]>([]);
  const [activeOrgId, setActiveOrgIdState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const setActiveOrgId = useCallback((id: string) => {
    setActiveOrgIdState(id);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      // localStorage unavailable
    }
  }, []);

  useEffect(() => {
    if (status !== "authenticated") {
      if (status === "unauthenticated") setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchOrgs() {
      try {
        const res = await fetch("/api/organizations");
        if (!res.ok) return;
        const body = await res.json();
        const orgs: OrgInfo[] = body.data ?? body;

        if (cancelled) return;
        setOrganizations(orgs);

        // Restore saved org or default to first
        const savedId = (() => {
          try {
            return localStorage.getItem(STORAGE_KEY);
          } catch {
            return null;
          }
        })();

        const match = orgs.find((o) => o.id === savedId);
        if (match) {
          setActiveOrgIdState(match.id);
        } else if (orgs.length > 0) {
          setActiveOrgIdState(orgs[0].id);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchOrgs();
    return () => {
      cancelled = true;
    };
  }, [status]);

  const activeOrg = organizations.find((o) => o.id === activeOrgId) ?? null;

  // Keep API client in sync
  useEffect(() => {
    apiClient.organizationId = activeOrgId;
  }, [activeOrgId]);

  return (
    <OrgContext.Provider value={{ organizations, activeOrg, setActiveOrgId, loading }}>
      {children}
    </OrgContext.Provider>
  );
}

export function useOrg() {
  return useContext(OrgContext);
}
