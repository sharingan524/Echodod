"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Clock, MessageSquare, CreditCard, Building2 } from "lucide-react";

const ONBOARDING_STORAGE_KEY = "syntaxvoice_onboarding_completed";

const onboardingSteps = [
  {
    icon: Building2,
    title: "Complete Your Profile",
    description: "Add your business name, address, and contact details",
    action: "Set Up Profile",
    href: "/business",
    completed: false,
  },
  {
    icon: Clock,
    title: "Set Business Hours",
    description: "Configure your operating hours for each day of the week",
    action: "Set Hours",
    href: "/business",
    completed: false,
  },
  {
    icon: MessageSquare,
    title: "Customize Greetings",
    description: "Set up greeting messages for each communication channel",
    action: "Edit Greetings",
    href: "/business",
    completed: false,
  },
  {
    icon: CreditCard,
    title: "Complete Payment",
    description: "Pay your implementation fee to get started",
    action: "View Billing",
    href: "/settings",
    completed: false,
  },
];

export function OnboardingDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if onboarding was already completed
    const completed = localStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (!completed) {
      // Show dialog after a brief delay
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    // Mark onboarding as completed
    localStorage.setItem(ONBOARDING_STORAGE_KEY, "true");
    setIsOpen(false);
  };

  const handleStepClick = (href: string) => {
    handleClose();
    router.push(href);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Welcome to Echodod!</DialogTitle>
          <DialogDescription className="text-base">
            Let&apos;s get your business communication services set up. Follow these steps to get
            started.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {onboardingSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="border-border flex items-start gap-4 rounded-lg border p-4 transition-colors hover:bg-zinc-100"
              >
                <div className="bg-primary/10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg">
                  <Icon className="text-primary h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">
                      {index + 1}. {step.title}
                    </h3>
                    {step.completed && <Check className="h-4 w-4 text-emerald-500" />}
                  </div>
                  <p className="text-muted-foreground mt-1 text-sm">{step.description}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => handleStepClick(step.href)}>
                  {step.action}
                </Button>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between border-t pt-4">
          <p className="text-muted-foreground text-sm">
            You can always access My Business from the sidebar
          </p>
          <Button onClick={handleClose}>Got it!</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
