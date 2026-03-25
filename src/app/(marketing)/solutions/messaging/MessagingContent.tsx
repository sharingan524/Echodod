"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GlassCard, GlassCardContent } from "@/components/ui/glass-card";
import { MessageSquare, Check, ArrowRight } from "lucide-react";

const features = [
  {
    title: "SMS Campaigns",
    description:
      "Send targeted SMS messages to your customers at scale. Segment audiences, schedule sends, and track delivery rates -- all compliant with carrier regulations.",
  },
  {
    title: "Two-Way Messaging",
    description:
      "Enable real-time conversations with customers over SMS. Automate responses, route complex inquiries to your team, and maintain conversation history.",
  },
  {
    title: "Push Notifications",
    description:
      "Reach customers on mobile with timely push notifications. Order updates, appointment reminders, and promotional alerts delivered directly to their devices.",
  },
  {
    title: "Chat Integration",
    description:
      "Add live chat to your website or app. Connect with customers in real time, use chatbots for common questions, and escalate to human agents when needed.",
  },
  {
    title: "Analytics & Engagement Tracking",
    description:
      "Understand campaign performance with detailed analytics. Track open rates, click-throughs, delivery metrics, and customer engagement across every channel.",
  },
];

const steps = [
  {
    step: "01",
    title: "Channel Strategy",
    description:
      "Tell us how your customers prefer to communicate. Our platform designs a multi-channel messaging strategy tailored to your business.",
  },
  {
    step: "02",
    title: "Automated Pinpoint Setup",
    description:
      "Amazon Pinpoint is automatically configured in your AWS account — messaging channels, sender IDs, and audience segments are set up in minutes.",
  },
  {
    step: "03",
    title: "Campaign & Automation Build",
    description:
      "We create your messaging workflows, set up automated journeys, configure two-way messaging, and integrate with your existing systems.",
  },
  {
    step: "04",
    title: "Launch & Optimize",
    description:
      "We launch your messaging campaigns, monitor engagement, A/B test content, and continuously optimize for higher conversions.",
  },
];

export default function MessagingContent() {
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
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
              <MessageSquare className="h-6 w-6 text-emerald-500" />
            </div>
            <span className="text-sm font-medium text-emerald-500">Powered by Amazon Pinpoint</span>
          </div>

          <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-6xl">
            Meet Your Customers <span className="text-emerald-500">Where They Are</span>
          </h1>
          <p className="text-muted-foreground mt-6 max-w-2xl text-lg md:text-xl">
            Amazon Pinpoint messaging, automatically provisioned and managed for your business. SMS,
            push notifications, and chat — all configured, integrated, and optimized.
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
            Every messaging channel, one platform
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl">
            Amazon Pinpoint lets you reach customers across SMS, push, and chat with centralized
            analytics and pay-per-message pricing.
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
              className="border-border bg-card/50 rounded-xl border p-6 transition-all hover:-translate-y-1 hover:border-emerald-500/30 hover:shadow-md"
            >
              <div className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
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
            How your messaging gets set up
          </p>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl">
            From channel strategy to campaign launch, we handle every aspect of your Amazon Pinpoint
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
              <span className="text-4xl font-bold text-emerald-500/20">{step.step}</span>
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
            <h2 className="text-3xl font-bold tracking-tight">Ready to engage your customers?</h2>
            <p className="text-muted-foreground mx-auto mt-4 max-w-lg">
              Schedule a free consultation and we&apos;ll design a messaging strategy that drives
              engagement and grows your business.
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
