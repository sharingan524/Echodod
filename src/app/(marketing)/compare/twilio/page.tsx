import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Echodod vs Twilio: Which Is Right for Your SMB?",
  description:
    "A fair comparison of Echodod and Twilio for small and medium businesses. See how managed AWS communication services stack up against DIY Twilio integration.",
  openGraph: {
    title: "Echodod vs Twilio",
    description: "Managed AWS communication vs. DIY Twilio — which is right for your SMB?",
    type: "website",
  },
};

interface ComparisonRow {
  feature: string;
  syntaxVoice: string | boolean;
  twilio: string | boolean;
}

const COMPARISON: ComparisonRow[] = [
  { feature: "Setup time", syntaxVoice: "Minutes (automated)", twilio: "Weeks (DIY)" },
  { feature: "Developer required", syntaxVoice: false, twilio: true },
  { feature: "Enterprise-grade voice (Amazon Connect)", syntaxVoice: true, twilio: false },
  { feature: "Built-in IVR & call routing", syntaxVoice: true, twilio: "Extra cost" },
  { feature: "Email (Amazon SES)", syntaxVoice: true, twilio: "Via SendGrid" },
  { feature: "SMS & push notifications", syntaxVoice: true, twilio: true },
  { feature: "Unified dashboard", syntaxVoice: true, twilio: false },
  { feature: "Managed infrastructure", syntaxVoice: true, twilio: false },
  { feature: "Per-minute voice pricing", syntaxVoice: "$0.018/min", twilio: "$0.022/min" },
  { feature: "Monthly platform fee", syntaxVoice: "From $49/mo", twilio: "$0 (usage-only)" },
  { feature: "Support included", syntaxVoice: "Priority support", twilio: "Paid plans only" },
  { feature: "Your own AWS account", syntaxVoice: true, twilio: false },
  {
    feature: "Data ownership",
    syntaxVoice: "You own everything",
    twilio: "Twilio's infrastructure",
  },
  { feature: "Compliance (HIPAA-eligible)", syntaxVoice: true, twilio: "Enterprise plan" },
];

function CellValue({ value }: { value: string | boolean }) {
  if (typeof value === "boolean") {
    return value ? (
      <CheckCircle className="mx-auto h-5 w-5 text-emerald-400" />
    ) : (
      <XCircle className="text-muted-foreground mx-auto h-5 w-5" />
    );
  }
  return <span className="text-sm">{value}</span>;
}

export default function CompareTwilioPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 md:py-24">
      {/* Hero */}
      <div className="mb-16 text-center">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
          Echodod vs. Twilio
        </h1>
        <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-lg">
          Twilio is a powerful developer platform. Echodod is a managed communication service for
          businesses that don&apos;t want to write code. Here&apos;s how they compare.
        </p>
      </div>

      {/* Comparison Table */}
      <div className="border-border mb-16 overflow-x-auto rounded-xl border">
        <table className="w-full">
          <thead>
            <tr className="border-border border-b">
              <th className="text-muted-foreground px-6 py-4 text-left text-xs font-semibold tracking-wider uppercase">
                Feature
              </th>
              <th className="bg-primary/5 text-primary px-6 py-4 text-center text-xs font-semibold tracking-wider uppercase">
                Echodod
              </th>
              <th className="text-muted-foreground px-6 py-4 text-center text-xs font-semibold tracking-wider uppercase">
                Twilio
              </th>
            </tr>
          </thead>
          <tbody>
            {COMPARISON.map((row, i) => (
              <tr
                key={row.feature}
                className={`border-border border-b last:border-0 ${i % 2 === 0 ? "bg-card/30" : ""}`}
              >
                <td className="px-6 py-3 text-sm font-medium">{row.feature}</td>
                <td className="bg-primary/5 px-6 py-3 text-center">
                  <CellValue value={row.syntaxVoice} />
                </td>
                <td className="px-6 py-3 text-center">
                  <CellValue value={row.twilio} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Sections */}
      <div className="mb-16 grid gap-8 md:grid-cols-2">
        <div className="border-border rounded-xl border p-6">
          <h2 className="text-primary mb-3 text-lg font-semibold">Choose Echodod if you...</h2>
          <ul className="text-muted-foreground space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
              Want enterprise-grade communication without hiring developers
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
              Need phone, email, AND messaging in one platform
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
              Prefer to own your infrastructure (your AWS account)
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
              Want managed setup, monitoring, and support
            </li>
          </ul>
        </div>

        <div className="border-border rounded-xl border p-6">
          <h2 className="mb-3 text-lg font-semibold">Choose Twilio if you...</h2>
          <ul className="text-muted-foreground space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
              Have an in-house development team
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
              Need highly customized communication flows
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
              Want usage-only pricing with no platform fee
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
              Are building a product on top of communication APIs
            </li>
          </ul>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <h2 className="mb-4 text-2xl font-bold">Ready to see the difference?</h2>
        <p className="text-muted-foreground mb-6">
          Get a personalized demo and cost comparison for your business.
        </p>
        <Button size="lg" asChild>
          <Link href="/contact">
            Schedule a Consultation
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
