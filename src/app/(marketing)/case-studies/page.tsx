import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Case Studies | Echodod",
  description:
    "See how small and medium businesses transformed their communications with Echodod's managed AWS services.",
  openGraph: {
    title: "Case Studies | Echodod",
    description: "Real results from real SMBs using enterprise AWS communication services.",
    type: "website",
  },
};

interface CaseStudy {
  slug: string;
  company: string;
  industry: string;
  headline: string;
  summary: string;
  metrics: { label: string; value: string }[];
}

const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "hill-country-dental",
    company: "Hill Country Dental Group",
    industry: "Healthcare",
    headline: "Cut missed appointments by 40% with automated SMS reminders",
    summary:
      "A 12-location dental practice in Central Texas replaced their legacy phone system and manual reminder calls with Echodod. Automated SMS and voice reminders now reach every patient 48 hours before their appointment.",
    metrics: [
      { label: "Missed appointments", value: "-40%" },
      { label: "Staff hours saved/week", value: "25 hrs" },
      { label: "Setup time", value: "3 days" },
    ],
  },
  {
    slug: "lonestar-logistics",
    company: "Lonestar Logistics",
    industry: "Transportation",
    headline: "Unified 4 communication tools into one platform",
    summary:
      "A regional freight broker with 80 employees was juggling separate systems for phone, email, SMS, and fax. Echodod consolidated everything onto AWS, giving dispatchers a single dashboard for all customer communication.",
    metrics: [
      { label: "Tools replaced", value: "4 → 1" },
      { label: "Monthly cost reduction", value: "62%" },
      { label: "Response time improvement", value: "3× faster" },
    ],
  },
  {
    slug: "bright-path-realty",
    company: "Bright Path Realty",
    industry: "Real Estate",
    headline: "Professional phone system for a growing brokerage — in hours, not weeks",
    summary:
      "When this Austin-based brokerage grew from 5 to 30 agents in one year, they needed a phone system that could scale with them. Echodod provisioned Amazon Connect with IVR, call recording, and per-agent analytics in under 4 hours.",
    metrics: [
      { label: "Agents onboarded", value: "30" },
      { label: "Provisioning time", value: "< 4 hrs" },
      { label: "Uptime since launch", value: "99.99%" },
    ],
  },
];

export default function CaseStudiesIndexPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 md:py-24">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Case Studies</h1>
        <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-lg">
          Real businesses, real results. See how SMBs use Echodod to get enterprise-grade
          communication without the enterprise complexity.
        </p>
      </div>

      <div className="space-y-6">
        {CASE_STUDIES.map((cs) => (
          <Link
            key={cs.slug}
            href={`/case-studies/${cs.slug}`}
            className="border-border hover:border-primary/30 hover:bg-card/50 group block rounded-xl border p-6 transition-all"
          >
            <div className="flex items-center gap-3 text-xs">
              <span className="bg-primary/10 text-primary rounded-full px-2.5 py-0.5 font-medium">
                {cs.industry}
              </span>
              <span className="text-muted-foreground">{cs.company}</span>
            </div>
            <h2 className="group-hover:text-primary mt-3 text-xl font-semibold transition-colors">
              {cs.headline}
            </h2>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{cs.summary}</p>
            <div className="mt-4 flex flex-wrap gap-4">
              {cs.metrics.map((m) => (
                <div key={m.label} className="bg-muted/50 rounded-lg px-3 py-2">
                  <p className="text-primary text-lg font-bold">{m.value}</p>
                  <p className="text-muted-foreground text-xs">{m.label}</p>
                </div>
              ))}
            </div>
          </Link>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-16 text-center">
        <h2 className="mb-4 text-xl font-bold">Ready to write your own success story?</h2>
        <Button asChild>
          <Link href="/contact">
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
