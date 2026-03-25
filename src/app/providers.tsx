"use client";

import type { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { OrgProvider } from "@/lib/org-context";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <OrgProvider>{children}</OrgProvider>
    </SessionProvider>
  );
}
