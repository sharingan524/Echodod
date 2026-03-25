import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { FAQAccordion } from "@/components/marketing/FAQAccordion";

const PricingCards = dynamic(
  () => import("@/components/marketing/PricingCards").then((m) => m.PricingCards),
  { loading: () => <div className="grid h-96 gap-6 md:grid-cols-3" /> }
);

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Transparent implementation and maintenance pricing for Echodod. One-time setup plus simple monthly management — no hidden fees.",
};

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-semibold tracking-tight">
          Implementation &amp; maintenance pricing
        </h1>
        <p className="text-muted-foreground mt-3">
          One-time implementation plus simple monthly management. No hidden fees, no long-term
          contracts.
        </p>
      </div>
      <div className="mt-10">
        <PricingCards />
      </div>
      <div className="mt-14">
        <FAQAccordion />
      </div>
    </div>
  );
}
