import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog | Echodod",
  description:
    "Insights on business communication, AWS cloud telephony, and how SMBs can leverage enterprise-grade phone, messaging, and email systems.",
  openGraph: {
    title: "Blog | Echodod",
    description:
      "Insights on business communication, AWS cloud telephony, and how SMBs can leverage enterprise-grade phone, messaging, and email systems.",
    type: "website",
  },
};

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
}

const posts: BlogPost[] = [
  {
    slug: "why-smbs-need-cloud-phone-systems",
    title: "Why SMBs Need Cloud Phone Systems in 2026",
    excerpt:
      "Traditional PBX systems are expensive, fragile, and hard to scale. Cloud phone systems powered by AWS Connect give small businesses the same reliability as Fortune 500 companies — at a fraction of the cost.",
    date: "2026-01-15",
    readTime: "5 min read",
    category: "Phone Systems",
  },
  {
    slug: "amazon-connect-vs-traditional-pbx",
    title: "Amazon Connect vs. Traditional PBX: The Real Cost Comparison",
    excerpt:
      "We break down the total cost of ownership between legacy PBX hardware and Amazon Connect for a 25-seat company. The results may surprise you.",
    date: "2026-01-08",
    readTime: "7 min read",
    category: "Cost Analysis",
  },
  {
    slug: "email-deliverability-ses-guide",
    title: "A Practical Guide to Email Deliverability with Amazon SES",
    excerpt:
      "Stop landing in spam. Learn how Amazon SES combined with proper DKIM, SPF, and DMARC configuration ensures your business emails reach every inbox.",
    date: "2025-12-20",
    readTime: "6 min read",
    category: "Email",
  },
  {
    slug: "sms-marketing-compliance-2026",
    title: "SMS Marketing Compliance for Small Businesses in 2026",
    excerpt:
      "TCPA and 10DLC regulations can be confusing. Here's a plain-English guide to staying compliant while running effective SMS campaigns with Amazon Pinpoint.",
    date: "2025-12-12",
    readTime: "8 min read",
    category: "Messaging",
  },
  {
    slug: "unified-communications-strategy",
    title: "Building a Unified Communications Strategy on AWS",
    excerpt:
      "Phone, email, SMS, and chat — all on one platform. How Echodod ties together Amazon Connect, SES, and Pinpoint into a single dashboard for your team.",
    date: "2025-11-30",
    readTime: "6 min read",
    category: "Strategy",
  },
];

export default function BlogIndexPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 md:py-24">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Blog</h1>
        <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-lg">
          Practical insights on cloud communication, AWS services, and running a modern SMB phone
          &amp; messaging stack.
        </p>
      </div>

      <div className="space-y-8">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="night-surface hover:border-primary/40 group block rounded-xl border border-white/10 p-6 shadow-md transition-all hover:shadow-lg"
          >
            <div className="flex items-center gap-3 text-xs">
              <span className="bg-primary/10 text-primary rounded-full px-2.5 py-0.5 font-medium">
                {post.category}
              </span>
              <span className="text-muted-foreground">{post.date}</span>
              <span className="text-muted-foreground">{post.readTime}</span>
            </div>
            <h2 className="group-hover:text-primary mt-3 text-xl font-semibold transition-colors">
              {post.title}
            </h2>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{post.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
