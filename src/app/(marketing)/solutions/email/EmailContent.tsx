"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GlassCard, GlassCardContent } from "@/components/ui/glass-card";
import { Mail, Check, ArrowRight } from "lucide-react";

const features = [
  {
    title: "Transactional Email",
    description:
      "Order confirmations, password resets, shipping notifications, and receipts delivered reliably and instantly. High-throughput sending with sub-second delivery.",
  },
  {
    title: "Marketing Campaigns",
    description:
      "Send newsletters, promotions, and announcements at scale. Audience segmentation, scheduling, and A/B testing to maximize your open and conversion rates.",
  },
  {
    title: "Deliverability Optimization",
    description:
      "We configure and monitor your sending reputation to ensure emails land in the inbox, not spam. Dedicated IPs, warm-up schedules, and ongoing reputation management.",
  },
  {
    title: "DKIM/SPF/DMARC Setup",
    description:
      "Full email authentication configuration so receiving servers trust your messages. We set up and verify DKIM, SPF, and DMARC records for your domain.",
  },
  {
    title: "Bounce & Complaint Handling",
    description:
      "Automated processing of bounces, complaints, and unsubscribes. We configure suppression lists and feedback loops to protect your sending reputation.",
  },
];

const steps = [
  {
    step: "01",
    title: "Email Audit",
    description:
      "We review your current email setup, sending volumes, deliverability metrics, and authentication records to identify gaps and opportunities.",
  },
  {
    step: "02",
    title: "Automated SES Configuration",
    description:
      "Amazon SES is automatically set up in your AWS account — domains are verified, DKIM/SPF/DMARC configured, and dedicated sending infrastructure established in minutes.",
  },
  {
    step: "03",
    title: "Integration & Warm-Up",
    description:
      "We integrate SES with your application, migrate your email sending, and execute a sending warm-up plan to establish your new IP reputation.",
  },
  {
    step: "04",
    title: "Monitor & Maintain",
    description:
      "Ongoing monitoring of deliverability, bounce rates, and sending reputation. We proactively address issues before they impact your business.",
  },
];

export default function EmailContent() {
  return (
    <>
      {/* Hero Section */}
      <section className="mx-auto max-w-4xl px-4 pt-20 md:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10">
              <Mail className="h-6 w-6 text-purple-500" />
            </div>
            <span className="text-sm font-medium text-purple-500">Powered by Amazon SES</span>
          </div>

          <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-6xl">
            Email That Actually <span className="text-purple-500">Reaches the Inbox</span>
          </h1>
          <p className="text-muted-foreground mt-6 max-w-2xl text-lg md:text-xl">
            Amazon SES email infrastructure, automatically provisioned and managed for your
            business. Transactional email, marketing campaigns, and deliverability optimization —
            all handled for you.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/contact">Get a Free Consultation</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/solutions">
                View All Solutions
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Enterprise email, simplified
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl">
            Amazon SES delivers your emails with 99.9% deliverability at a fraction of the cost of
            traditional email service providers.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              viewport={{ once: true }}
              className="border-border bg-card/50 rounded-xl border p-6 transition-all hover:-translate-y-1 hover:border-purple-500/30 hover:shadow-md"
            >
              <div className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-purple-500" />
                <div>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground mt-2 text-sm">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-muted-foreground mb-2 text-xs font-semibold tracking-widest uppercase">
            Implementation Process
          </h2>
          <p className="text-3xl font-bold tracking-tight md:text-4xl">
            How your email infrastructure gets set up
          </p>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl">
            From email audit to ongoing monitoring, we manage every aspect of your Amazon SES
            implementation.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              viewport={{ once: true }}
              className="border-border bg-card/50 relative rounded-xl border p-6"
            >
              <span className="text-4xl font-bold text-purple-500/20">{step.step}</span>
              <h3 className="mt-2 font-semibold">{step.title}</h3>
              <p className="text-muted-foreground mt-2 text-sm">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-4xl px-4 py-20">
        <GlassCard className="p-12 text-center">
          <GlassCardContent className="p-0">
            <h2 className="text-3xl font-bold tracking-tight">
              Ready to fix your email deliverability?
            </h2>
            <p className="text-muted-foreground mx-auto mt-4 max-w-lg">
              Schedule a free consultation and we&apos;ll audit your current email setup, then show
              you how Amazon SES can improve your deliverability and cut costs.
            </p>
            <div className="mt-8">
              <Button asChild size="lg">
                <Link href="/contact">Schedule a Consultation</Link>
              </Button>
            </div>
          </GlassCardContent>
        </GlassCard>
      </section>
    </>
  );
}
