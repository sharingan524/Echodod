import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface BlogPostData {
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  content: string;
}

const POSTS: Record<string, BlogPostData> = {
  "why-smbs-need-cloud-phone-systems": {
    title: "Why SMBs Need Cloud Phone Systems in 2026",
    excerpt:
      "Traditional PBX systems are expensive, fragile, and hard to scale. Cloud phone systems powered by AWS Connect give small businesses the same reliability as Fortune 500 companies.",
    date: "2026-01-15",
    readTime: "5 min read",
    category: "Phone Systems",
    content: `## The Problem with Traditional Phone Systems

Most small businesses still rely on on-premises PBX hardware that was installed years ago. These systems require dedicated IT staff, expensive maintenance contracts, and physical phone lines that scale linearly with cost.

When something breaks — and it will — you're looking at hours or days of downtime while a technician drives to your office.

## Enter Cloud Telephony

Amazon Connect changed the game by offering the same contact-center technology used by Amazon's own customer service teams. With Echodod, we bring that technology to businesses with 5–200 employees, without requiring a single piece of hardware.

### Key Benefits

- **99.99% uptime** backed by AWS infrastructure
- **Pay-per-minute pricing** — no more paying for unused lines
- **Instant scaling** — add 10 agents in minutes, not weeks
- **Built-in IVR** — professional call routing without expensive add-ons
- **Real-time analytics** — see call volume, wait times, and outcomes on a live dashboard

## What This Means for Your Business

Instead of budgeting $15,000–$50,000 for a phone system upgrade, you can be up and running with enterprise-grade voice for a one-time implementation fee and a predictable monthly cost.

Echodod handles the AWS setup, configuration, and ongoing management so your team can focus on what matters — serving your customers.

## Getting Started

Ready to modernize your phone system? [Get in touch](/contact) for a free consultation and we'll show you exactly what the migration looks like for your business.`,
  },
  "amazon-connect-vs-traditional-pbx": {
    title: "Amazon Connect vs. Traditional PBX: The Real Cost Comparison",
    excerpt:
      "We break down the total cost of ownership between legacy PBX hardware and Amazon Connect for a 25-seat company.",
    date: "2026-01-08",
    readTime: "7 min read",
    category: "Cost Analysis",
    content: `## The Hidden Costs of Legacy PBX

When businesses evaluate phone systems, they often compare the sticker price of hardware vs. a cloud subscription. But the real story is in the total cost of ownership (TCO) over 3–5 years.

### Traditional PBX (25 seats, 3-year TCO)

| Item | Cost |
|------|------|
| Hardware & installation | $18,000 |
| Annual maintenance contract | $3,600/yr × 3 = $10,800 |
| Phone line rentals | $1,200/yr × 3 = $3,600 |
| IT staff time (est. 4 hrs/month) | $7,200 |
| **Total** | **$39,600** |

### Amazon Connect via Echodod (25 seats, 3-year TCO)

| Item | Cost |
|------|------|
| One-time implementation | $2,500 |
| Monthly platform fee | $149/mo × 36 = $5,364 |
| AWS usage (est. 8,000 min/mo) | $720/yr × 3 = $2,160 |
| IT staff time | $0 (managed) |
| **Total** | **$10,024** |

## 75% Savings — and Better Service

The cloud option isn't just cheaper. It includes features that would cost tens of thousands more with legacy hardware: call recording, real-time dashboards, IVR, and automatic scaling.

## Making the Switch

Migration is simpler than you think. Echodod handles number porting, IVR configuration, and agent onboarding. Most businesses are fully migrated within a week.

[Schedule a consultation](/contact) to get a custom cost comparison for your business.`,
  },
  "email-deliverability-ses-guide": {
    title: "A Practical Guide to Email Deliverability with Amazon SES",
    excerpt:
      "Stop landing in spam. Learn how Amazon SES with proper authentication ensures your business emails reach every inbox.",
    date: "2025-12-20",
    readTime: "6 min read",
    category: "Email",
    content: `## Why Your Emails Land in Spam

Email deliverability isn't about writing better subject lines — it's about technical trust signals. ISPs like Gmail and Outlook check three things before delivering your email:

1. **SPF** — Is this server authorized to send for your domain?
2. **DKIM** — Was this email tampered with in transit?
3. **DMARC** — What should happen if SPF or DKIM fail?

If any of these are misconfigured, your emails go straight to spam — or get silently dropped.

## Amazon SES: Built for Deliverability

Amazon SES handles over 100 billion emails per year. Its infrastructure is trusted by ISPs worldwide, which means you start with a strong sender reputation.

### What Echodod Configures for You

- **SPF records** added to your DNS
- **DKIM signing** with 2048-bit keys, automatically rotated
- **DMARC policy** set to quarantine, then gradually tightened
- **Dedicated IP** (optional for high-volume senders)
- **Bounce and complaint handling** to protect your sender reputation

## Monitoring Your Reputation

Echodod's dashboard shows your real-time deliverability metrics: bounce rate, complaint rate, and delivery rate. If anything dips below threshold, you'll get an alert before damage is done.

## Getting Started

Email setup is included in our Standard and Premium tiers. [See pricing](/pricing) or [contact us](/contact) to learn more.`,
  },
  "sms-marketing-compliance-2026": {
    title: "SMS Marketing Compliance for Small Businesses in 2026",
    excerpt:
      "TCPA and 10DLC regulations can be confusing. Here's a plain-English guide to staying compliant.",
    date: "2025-12-12",
    readTime: "8 min read",
    category: "Messaging",
    content: `## The Regulatory Landscape

SMS marketing is one of the most effective channels for SMBs — open rates above 95% — but the regulatory environment has tightened significantly.

### Key Regulations

- **TCPA** (Telephone Consumer Protection Act) — Requires express written consent before sending marketing texts
- **10DLC** (10-Digit Long Code) — Carriers now require brand and campaign registration for A2P messaging
- **CTIA Guidelines** — Industry standards for opt-in/opt-out handling

## What You Need to Do

### 1. Get Proper Consent

Every contact must opt in explicitly. A checkbox that says "I agree to receive text messages from [Business]" is the minimum. Keep records of when and how consent was obtained.

### 2. Register Your Brand (10DLC)

As of 2024, all businesses sending SMS via 10-digit numbers must register with The Campaign Registry (TCR). Echodod handles this registration as part of our Pinpoint setup.

### 3. Honor Opt-Outs Immediately

When someone texts STOP, they must be removed from your list within 24 hours. Amazon Pinpoint handles this automatically.

### 4. Include Required Disclosures

Every initial message must include: your business name, message frequency, "Msg & data rates may apply", and instructions to text STOP.

## How Echodod Helps

Our Pinpoint integration includes built-in compliance tools: automatic opt-out processing, consent tracking, and 10DLC registration assistance. You focus on the message — we handle the compliance.

[Learn more about our messaging solution](/solutions/messaging).`,
  },
  "unified-communications-strategy": {
    title: "Building a Unified Communications Strategy on AWS",
    excerpt:
      "Phone, email, SMS, and chat — all on one platform. How Echodod ties together Amazon Connect, SES, and Pinpoint.",
    date: "2025-11-30",
    readTime: "6 min read",
    category: "Strategy",
    content: `## The Multi-Vendor Problem

Most SMBs cobble together communication tools from 3–5 different vendors: one for phones, one for email, another for SMS, maybe a separate chat platform. Each has its own login, its own billing, and its own data silo.

The result: your team wastes time switching between tools, and you have no unified view of customer interactions.

## The AWS Solution

Amazon Web Services offers three best-in-class communication services:

- **Amazon Connect** — Cloud contact center (voice, chat)
- **Amazon SES** — Email sending and receiving
- **Amazon Pinpoint** — SMS, push notifications, and customer engagement

Individually, each is powerful. Together, they give you a complete communication platform that rivals what enterprises spend millions on.

## What Echodod Brings Together

Our dashboard unifies all three services into a single interface:

- **One inbox** for all customer interactions
- **Unified analytics** — see phone, email, and SMS metrics side by side
- **Cross-channel context** — when a customer calls, see their email and SMS history
- **Single billing** — one monthly invoice instead of three

## The Implementation Path

1. **Assess** — We audit your current communication stack and identify gaps
2. **Plan** — Choose which services you need (basic, standard, or premium tier)
3. **Provision** — We configure everything on AWS in your own account
4. **Migrate** — Port numbers, verify domains, register SMS campaigns
5. **Launch** — Go live with training and 30 days of priority support

## Ready to Unify?

[Schedule a consultation](/contact) and we'll map out exactly what a unified communications strategy looks like for your business.`,
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = POSTS[slug];
  if (!post) return { title: "Not Found" };

  return {
    title: `${post.title} | Echodod Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export function generateStaticParams() {
  return Object.keys(POSTS).map((slug) => ({ slug }));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = POSTS[slug];
  if (!post) notFound();

  // Simple markdown-to-HTML (headings, paragraphs, bold, links, tables)
  const lines = post.content.split("\n");
  const htmlParts: string[] = [];
  let inTable = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      if (!inTable) {
        htmlParts.push(
          '<div class="my-6 overflow-x-auto"><table class="w-full text-sm border-collapse">'
        );
        inTable = true;
      }
      // Skip separator rows
      if (/^\|[\s-|]+\|$/.test(trimmed)) continue;
      const cells = trimmed
        .split("|")
        .filter(Boolean)
        .map((c) => c.trim());
      if (
        !htmlParts.some((p) => p.includes("<tbody>")) &&
        htmlParts.some((p) => p.includes("<thead>"))
      ) {
        htmlParts.push("</thead><tbody>");
      }
      if (!htmlParts.some((p) => p.includes("<thead>"))) {
        htmlParts.push("<thead>");
        htmlParts.push(
          `<tr>${cells.map((c) => `<th class="border-b border-border px-4 py-2 text-left font-medium">${c}</th>`).join("")}</tr>`
        );
        continue;
      }
      htmlParts.push(
        `<tr>${cells.map((c) => `<td class="border-b border-border/50 px-4 py-2">${c}</td>`).join("")}</tr>`
      );
      continue;
    }

    if (inTable) {
      htmlParts.push("</tbody></table></div>");
      inTable = false;
    }

    if (trimmed === "") {
      continue;
    }
    if (trimmed.startsWith("### ")) {
      htmlParts.push(`<h3 class="mt-8 mb-3 text-lg font-semibold">${trimmed.slice(4)}</h3>`);
    } else if (trimmed.startsWith("## ")) {
      htmlParts.push(`<h2 class="mt-10 mb-4 text-xl font-bold">${trimmed.slice(3)}</h2>`);
    } else if (trimmed.startsWith("- ")) {
      const item = trimmed
        .slice(2)
        .replace(/\*\*(.+?)\*\*/g, '<strong class="text-foreground">$1</strong>')
        .replace(
          /\[(.+?)\]\((.+?)\)/g,
          '<a href="$2" class="text-primary underline underline-offset-4">$1</a>'
        );
      htmlParts.push(`<li class="ml-4 mb-1 text-muted-foreground list-disc">${item}</li>`);
    } else if (/^\d+\.\s/.test(trimmed)) {
      const item = trimmed
        .replace(/^\d+\.\s/, "")
        .replace(/\*\*(.+?)\*\*/g, '<strong class="text-foreground">$1</strong>')
        .replace(
          /\[(.+?)\]\((.+?)\)/g,
          '<a href="$2" class="text-primary underline underline-offset-4">$1</a>'
        );
      htmlParts.push(`<li class="ml-4 mb-1 text-muted-foreground list-decimal">${item}</li>`);
    } else {
      const paragraph = trimmed
        .replace(/\*\*(.+?)\*\*/g, '<strong class="text-foreground">$1</strong>')
        .replace(
          /\[(.+?)\]\((.+?)\)/g,
          '<a href="$2" class="text-primary underline underline-offset-4">$1</a>'
        );
      htmlParts.push(`<p class="mb-4 text-muted-foreground leading-relaxed">${paragraph}</p>`);
    }
  }

  if (inTable) {
    htmlParts.push("</tbody></table></div>");
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 md:py-24">
      <Link
        href="/blog"
        className="text-muted-foreground hover:text-foreground mb-8 inline-flex items-center gap-1 text-sm transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Blog
      </Link>

      <header className="mb-10">
        <div className="mb-4 flex items-center gap-3 text-xs">
          <span className="bg-primary/10 text-primary rounded-full px-2.5 py-0.5 font-medium">
            {post.category}
          </span>
          <span className="text-muted-foreground">{post.date}</span>
          <span className="text-muted-foreground">{post.readTime}</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{post.title}</h1>
        <p className="text-muted-foreground mt-4 text-lg">{post.excerpt}</p>
      </header>

      <div className="prose-custom" dangerouslySetInnerHTML={{ __html: htmlParts.join("\n") }} />
    </article>
  );
}
