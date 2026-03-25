import type { Metadata } from "next";
import { ProcessSteps } from "@/components/marketing/ProcessSteps";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "See how Echodod automatically provisions and manages AWS communication services for your business. From sign-up to go-live in minutes.",
};

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-semibold tracking-tight">How it works</h1>
        <p className="text-muted-foreground mt-3">
          From sign-up to go-live in minutes. Your AWS communication services are automatically
          provisioned and continuously managed so you can focus on running your business.
        </p>
      </div>
      <div className="mt-10">
        <ProcessSteps />
      </div>
    </div>
  );
}
