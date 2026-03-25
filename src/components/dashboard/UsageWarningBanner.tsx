"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ServiceData {
  serviceStatus: string;
  implementationPaidAt: string | null;
}

export function UsageWarningBanner() {
  const [serviceData, setServiceData] = useState<ServiceData | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServiceStatus() {
      try {
        const response = await fetch("/api/settings/billing");
        if (response.ok) {
          const data = await response.json();
          const payload = data?.data ?? data;
          setServiceData(payload);
        }
      } catch (error) {
        console.error("Failed to fetch service data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchServiceStatus();
  }, []);

  if (loading || !serviceData || dismissed) {
    return null;
  }

  // Only show banner for non-active statuses
  if (serviceData.serviceStatus === "active") {
    return null;
  }

  const getWarningConfig = () => {
    switch (serviceData.serviceStatus) {
      case "suspended":
        return {
          color: "bg-destructive/10 border-destructive/50",
          textColor: "text-destructive",
          title: "Service Suspended",
          message:
            "Your services have been suspended due to a billing issue. Please update your payment method.",
          action: "Manage Billing",
        };
      case "terminated":
        return {
          color: "bg-destructive/10 border-destructive/50",
          textColor: "text-destructive",
          title: "Service Terminated",
          message:
            "Your services have been terminated. Please contact support to discuss reactivation.",
          action: "Contact Support",
        };
      case "pending":
      default:
        if (!serviceData.implementationPaidAt) {
          return {
            color: "bg-amber-500/10 border-amber-500/50",
            textColor: "text-amber-600 dark:text-amber-400",
            title: "Implementation Payment Pending",
            message:
              "Complete your implementation payment to begin the setup of your communication services.",
            action: "Complete Payment",
          };
        }
        return {
          color: "bg-blue-500/10 border-blue-500/50",
          textColor: "text-blue-600 dark:text-blue-400",
          title: "Setup In Progress",
          message:
            "Our team is setting up your communication services. You'll be notified when everything is ready.",
          action: "View Status",
        };
    }
  };

  const config = getWarningConfig();

  return (
    <div className={`relative mb-6 flex items-start gap-4 rounded-lg border p-4 ${config.color}`}>
      <AlertTriangle className={`mt-0.5 h-5 w-5 flex-shrink-0 ${config.textColor}`} />
      <div className="flex-1">
        <h3 className={`font-semibold ${config.textColor}`}>{config.title}</h3>
        <p className="text-muted-foreground mt-1 text-sm">{config.message}</p>
        <Link href="/settings">
          <Button variant="outline" size="sm" className="mt-3">
            {config.action}
          </Button>
        </Link>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="text-muted-foreground hover:text-foreground"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
