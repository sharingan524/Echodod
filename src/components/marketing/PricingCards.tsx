import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const implementationPlans = [
  {
    name: "Basic",
    price: "$999",
    description: "Single-service setup for small teams.",
    features: [
      "1 AWS communication service",
      "Standard configuration",
      "Basic IVR or email setup",
      "Up to 5 users",
      "Documentation & training",
    ],
    featured: false,
  },
  {
    name: "Standard",
    price: "$2,499",
    description: "Multi-service implementation for growing businesses.",
    features: [
      "Up to 2 AWS services",
      "Custom call routing & IVR",
      "CRM integration",
      "Up to 25 users",
      "Number porting",
      "Team training session",
    ],
    featured: true,
  },
  {
    name: "Premium",
    price: "$4,999",
    description: "Full communication stack for established businesses.",
    features: [
      "All 3 AWS services",
      "Advanced call flows & analytics",
      "Multi-channel messaging",
      "Unlimited users",
      "Custom integrations",
      "Number porting",
      "Dedicated onboarding manager",
    ],
    featured: false,
  },
];

const maintenancePlans = [
  {
    name: "Essential",
    price: "$149",
    description: "Keep the lights on.",
    features: [
      "System monitoring",
      "Monthly health reports",
      "Email support (48hr response)",
      "AWS billing review",
    ],
    featured: false,
  },
  {
    name: "Professional",
    price: "$349",
    description: "Proactive care for your communication stack.",
    features: [
      "24/7 system monitoring",
      "Weekly health reports",
      "Priority support (4hr response)",
      "Quarterly optimization review",
      "Minor configuration changes",
      "AWS cost optimization",
    ],
    featured: true,
  },
  {
    name: "Enterprise",
    price: "$699",
    description: "White-glove service for mission-critical systems.",
    features: [
      "24/7 monitoring & alerting",
      "Real-time dashboards",
      "Dedicated support (1hr response)",
      "Monthly optimization reviews",
      "Unlimited configuration changes",
      "AWS cost optimization",
      "Quarterly business reviews",
    ],
    featured: false,
  },
];

function PricingGrid({ plans, period }: { plans: typeof implementationPlans; period: string }) {
  return (
    <div className="mt-8 grid gap-8 md:grid-cols-3">
      {plans.map((plan) => (
        <Card
          key={plan.name}
          className={cn("flex flex-col", plan.featured && "border-primary shadow-lg")}
        >
          <CardHeader>
            <CardTitle>{plan.name}</CardTitle>
            <CardDescription>{plan.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="text-4xl font-bold">{plan.price}</div>
            <p className="text-muted-foreground text-sm">{period}</p>
            <ul className="mt-6 space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <Check className="text-primary h-4 w-4 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full" variant={plan.featured ? "default" : "secondary"}>
              <Link href="/contact">Get Started</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export function PricingCards() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <h2 className="text-center text-3xl font-semibold tracking-tight">
        Simple, Transparent Pricing
      </h2>
      <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-center">
        One-time implementation plus affordable monthly maintenance. No hidden fees.
      </p>

      {/* Implementation Fees */}
      <div className="mt-16">
        <h3 className="text-center text-xl font-semibold">Implementation Fees</h3>
        <p className="text-muted-foreground mt-2 text-center text-sm">
          One-time setup &mdash; we build it, you own it.
        </p>
        <PricingGrid plans={implementationPlans} period="one-time" />
      </div>

      {/* Monthly Maintenance */}
      <div className="mt-20">
        <h3 className="text-center text-xl font-semibold">Monthly Maintenance</h3>
        <p className="text-muted-foreground mt-2 text-center text-sm">
          Ongoing support to keep everything running smoothly.
        </p>
        <PricingGrid plans={maintenancePlans} period="/month" />
      </div>
    </section>
  );
}
