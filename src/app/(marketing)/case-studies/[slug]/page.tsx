import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CaseStudyData {
  company: string;
  industry: string;
  headline: string;
  summary: string;
  metrics: { label: string; value: string }[];
  challenge: string;
  solution: string;
  results: string;
  quote?: { text: string; author: string; role: string };
  services: string[];
}

const CASE_STUDIES: Record<string, CaseStudyData> = {
  "hill-country-dental": {
    company: "Hill Country Dental Group",
    industry: "Healthcare",
    headline: "Cut missed appointments by 40% with automated SMS reminders",
    summary:
      "A 12-location dental practice in Central Texas replaced their legacy phone system and manual reminder calls with Echodod.",
    metrics: [
      { label: "Missed appointments", value: "-40%" },
      { label: "Staff hours saved/week", value: "25 hrs" },
      { label: "Setup time", value: "3 days" },
    ],
    challenge:
      "Hill Country Dental Group operates 12 locations across the Austin–San Antonio corridor. Their front-desk staff spent hours each day making reminder calls manually, and their aging PBX system couldn't handle call routing between locations. Missed appointments were costing the practice an estimated $180,000 per year in lost revenue.",
    solution:
      "Echodod provisioned Amazon Connect across all 12 locations with unified call routing, so patients always reach the right office. Amazon Pinpoint powers automated SMS and voice reminders sent 48 hours and 2 hours before each appointment. The entire system was configured in 3 days with zero downtime during the transition.",
    results:
      "Within the first month, no-show rates dropped from 18% to under 11% — a 40% improvement. Front-desk staff reclaimed 25 hours per week previously spent on manual calls. The practice estimates the system pays for itself 6× over through recovered appointment revenue alone.",
    quote: {
      text: "We went from dreading our phone system to not even thinking about it. It just works. And the appointment reminders have been a game-changer for our bottom line.",
      author: "Dr. Maria Santos",
      role: "Managing Partner, Hill Country Dental Group",
    },
    services: ["Amazon Connect", "Amazon Pinpoint", "IVR", "SMS Reminders"],
  },
  "lonestar-logistics": {
    company: "Lonestar Logistics",
    industry: "Transportation",
    headline: "Unified 4 communication tools into one platform",
    summary:
      "A regional freight broker with 80 employees consolidated phone, email, SMS, and fax onto a single AWS-powered platform.",
    metrics: [
      { label: "Tools replaced", value: "4 → 1" },
      { label: "Monthly cost reduction", value: "62%" },
      { label: "Response time improvement", value: "3× faster" },
    ],
    challenge:
      "Lonestar Logistics was paying for four separate communication platforms: a Mitel PBX, a shared Gmail workspace, a Twilio SMS account, and an eFax service. Dispatchers had to check four different systems to track a single shipment's communication history. Training new hires took weeks because of the fragmented tooling.",
    solution:
      "Echodod migrated all communication to AWS: Amazon Connect for voice, Amazon SES for email, and Amazon Pinpoint for SMS. A unified Echodod dashboard gives dispatchers a single view of all interactions per shipment. Number porting was completed in 48 hours with no service interruption.",
    results:
      "Monthly communication costs dropped from $4,800 to $1,824 — a 62% reduction. Dispatcher response times improved 3× because they no longer switch between tools. New hire onboarding for communication tools went from 2 weeks to 2 hours.",
    quote: {
      text: "I didn't think we could get rid of Twilio, our PBX, AND our email provider all at once. Echodod made it happen in a week.",
      author: "James Whitfield",
      role: "COO, Lonestar Logistics",
    },
    services: ["Amazon Connect", "Amazon SES", "Amazon Pinpoint", "Number Porting"],
  },
  "bright-path-realty": {
    company: "Bright Path Realty",
    industry: "Real Estate",
    headline: "Professional phone system for a growing brokerage — in hours, not weeks",
    summary:
      "An Austin-based brokerage needed a phone system that could scale from 5 to 30+ agents without breaking.",
    metrics: [
      { label: "Agents onboarded", value: "30" },
      { label: "Provisioning time", value: "< 4 hrs" },
      { label: "Uptime since launch", value: "99.99%" },
    ],
    challenge:
      "Bright Path Realty started with 5 agents sharing a single business phone number. When they grew to 30 agents in one year, calls were getting missed, voicemails went unreturned, and their reputation was suffering on review sites. Traditional PBX vendors quoted 4–6 weeks for installation and $22,000 in upfront costs.",
    solution:
      "Echodod provisioned Amazon Connect with per-agent direct numbers, an IVR menu for general inquiries, call recording for compliance, and real-time analytics. The entire system was live in under 4 hours. Each agent got a dedicated number that rings on their mobile app and desk phone simultaneously.",
    results:
      "The brokerage hasn't missed a client call since launch. Call recording helped resolve two client disputes (in the agents' favor). The system has maintained 99.99% uptime over 8 months. When they added 6 more agents last quarter, it took 15 minutes to provision their lines.",
    quote: {
      text: "We went from 'this phone system is killing our growth' to 'our phone system is one of our competitive advantages.' That's not something I expected to say about phones.",
      author: "Rachel Kim",
      role: "Broker/Owner, Bright Path Realty",
    },
    services: ["Amazon Connect", "IVR", "Call Recording", "Analytics"],
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cs = CASE_STUDIES[slug];
  if (!cs) return { title: "Not Found" };

  return {
    title: `${cs.company} Case Study | Echodod`,
    description: cs.headline,
    openGraph: {
      title: `${cs.company} — ${cs.headline}`,
      description: cs.summary,
      type: "article",
    },
  };
}

export function generateStaticParams() {
  return Object.keys(CASE_STUDIES).map((slug) => ({ slug }));
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cs = CASE_STUDIES[slug];
  if (!cs) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:py-24">
      <Link
        href="/case-studies"
        className="text-muted-foreground hover:text-foreground mb-8 inline-flex items-center gap-1 text-sm transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All Case Studies
      </Link>

      {/* Header */}
      <header className="mb-10">
        <div className="mb-4 flex items-center gap-3 text-xs">
          <span className="bg-primary/10 text-primary rounded-full px-2.5 py-0.5 font-medium">
            {cs.industry}
          </span>
          <span className="text-muted-foreground">{cs.company}</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{cs.headline}</h1>
        <p className="text-muted-foreground mt-4 text-lg">{cs.summary}</p>
      </header>

      {/* Metrics */}
      <div className="mb-12 grid grid-cols-3 gap-4">
        {cs.metrics.map((m) => (
          <div key={m.label} className="border-border rounded-xl border p-4 text-center">
            <p className="text-primary text-2xl font-bold md:text-3xl">{m.value}</p>
            <p className="text-muted-foreground mt-1 text-xs">{m.label}</p>
          </div>
        ))}
      </div>

      {/* Sections */}
      <section className="mb-10">
        <h2 className="mb-3 text-xl font-bold">The Challenge</h2>
        <p className="text-muted-foreground leading-relaxed">{cs.challenge}</p>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-xl font-bold">The Solution</h2>
        <p className="text-muted-foreground leading-relaxed">{cs.solution}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {cs.services.map((s) => (
            <span
              key={s}
              className="bg-muted text-muted-foreground rounded-full px-3 py-1 text-xs font-medium"
            >
              {s}
            </span>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-xl font-bold">The Results</h2>
        <p className="text-muted-foreground leading-relaxed">{cs.results}</p>
      </section>

      {/* Quote */}
      {cs.quote && (
        <blockquote className="border-primary/30 bg-card/50 mb-12 rounded-xl border-l-4 p-6">
          <Quote className="text-primary/40 mb-3 h-6 w-6" />
          <p className="mb-4 text-lg leading-relaxed italic">&ldquo;{cs.quote.text}&rdquo;</p>
          <footer className="text-muted-foreground text-sm">
            <strong className="text-foreground">{cs.quote.author}</strong>
            <br />
            {cs.quote.role}
          </footer>
        </blockquote>
      )}

      {/* CTA */}
      <div className="border-border rounded-xl border p-8 text-center">
        <h2 className="mb-2 text-xl font-bold">Want results like {cs.company}?</h2>
        <p className="text-muted-foreground mb-6 text-sm">
          Get a free consultation and see what Echodod can do for your business.
        </p>
        <Button asChild>
          <Link href="/contact">
            Schedule a Consultation
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
