"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GlassCard, GlassCardContent } from "@/components/ui/glass-card";
import { Phone, MessageSquare, Mail, Check, ArrowRight } from "lucide-react";

const solutions = [
  {
    title: "Phone Systems",
    href: "/solutions/phone-systems",
    description:
      "Professional cloud phone systems powered by Amazon Connect. Enterprise-grade IVR, intelligent call routing, real-time analytics, and CRM integration -- all without the enterprise price tag.",
    awsService: "Amazon Connect",
    icon: Phone,
    color: "blue",
    features: [
      "IVR & auto-attendant",
      "Intelligent call routing & queuing",
      "Call recording & analytics",
      "CRM integration",
      "Real-time dashboards",
    ],
  },
  {
    title: "Customer Messaging",
    href: "/solutions/messaging",
    description:
      "Reach customers on their preferred channel with Amazon Pinpoint. SMS campaigns, two-way messaging, push notifications, and chat -- all managed from a single platform.",
    awsService: "Amazon Pinpoint",
    icon: MessageSquare,
    color: "emerald",
    features: [
      "SMS campaigns",
      "Two-way messaging",
      "Push notifications",
      "Chat integration",
      "Analytics & engagement tracking",
    ],
  },
  {
    title: "Business Email",
    href: "/solutions/email",
    description:
      "Enterprise email infrastructure powered by Amazon SES. High deliverability for transactional and marketing emails with full authentication and compliance built in.",
    awsService: "Amazon SES",
    icon: Mail,
    color: "purple",
    features: [
      "Transactional email",
      "Marketing campaigns",
      "Deliverability optimization",
      "DKIM/SPF/DMARC setup",
      "Bounce & complaint handling",
    ],
  },
];

const colorMap: Record<
  string,
  { bg: string; text: string; border: string; shadow: string; dot: string }
> = {
  blue: {
    bg: "bg-blue-500/10",
    text: "text-blue-500",
    border: "border-blue-500/30 hover:border-blue-500/50",
    shadow: "hover:shadow-blue-500/10",
    dot: "bg-blue-500",
  },
  emerald: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-500",
    border: "border-emerald-500/30 hover:border-emerald-500/50",
    shadow: "hover:shadow-emerald-500/10",
    dot: "bg-emerald-500",
  },
  purple: {
    bg: "bg-purple-500/10",
    text: "text-purple-500",
    border: "border-purple-500/30 hover:border-purple-500/50",
    shadow: "hover:shadow-purple-500/10",
    dot: "bg-purple-500",
  },
};

export default function SolutionsContent() {
  return (
    <>
      {/* Hero Section */}
      <section className="mx-auto max-w-4xl px-4 pt-20 text-center md:pt-32">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold tracking-tight md:text-6xl"
        >
          AWS Communication Services,{" "}
          <span className="text-syntax-cyan">Professionally Managed</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-muted-foreground mx-auto mt-6 max-w-2xl text-lg md:text-xl"
        >
          Enterprise-grade phone, messaging, and email infrastructure for your business. We handle
          the implementation, you enjoy the results.
        </motion.p>
      </section>

      {/* Solutions Grid */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="grid gap-8 md:grid-cols-3">
          {solutions.map((solution, i) => {
            const colors = colorMap[solution.color];
            const Icon = solution.icon;

            return (
              <motion.div
                key={solution.href}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Link
                  href={solution.href}
                  className={`night-surface group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 p-6 shadow-md transition-all hover:-translate-y-1 hover:shadow-lg ${colors.border} ${colors.shadow}`}
                >
                  {/* Header */}
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${colors.bg}`}
                    >
                      <Icon className={`h-6 w-6 ${colors.text}`} />
                    </div>
                    <div>
                      <span
                        className={`flex items-center gap-2 text-sm font-medium ${colors.text}`}
                      >
                        <span className={`h-2 w-2 rounded-full ${colors.dot}`} />
                        {solution.title}
                      </span>
                      <p className="text-muted-foreground text-xs">{solution.awsService}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground mt-4 flex-1 text-sm">
                    {solution.description}
                  </p>

                  {/* Features List */}
                  <ul className="mt-5 space-y-2">
                    {solution.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <Check className={`h-4 w-4 shrink-0 ${colors.text}`} />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Link */}
                  <div
                    className={`mt-6 flex items-center gap-1 text-sm font-medium ${colors.text}`}
                  >
                    Learn more
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Why AWS Section */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-muted-foreground mb-2 text-xs font-semibold tracking-widest uppercase">
            Why AWS
          </h2>
          <p className="text-2xl font-bold tracking-tight md:text-3xl">
            Built on the world&apos;s most reliable cloud
          </p>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl">
            Every solution we deploy runs on AWS infrastructure -- the same platform trusted by the
            largest enterprises in the world. You get that reliability at a fraction of the cost.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "99.99% Uptime",
              description: "AWS infrastructure ensures your communications never go down",
            },
            {
              title: "Pay-As-You-Go",
              description: "No long-term contracts or unused capacity. Pay only for what you use",
            },
            {
              title: "Enterprise Security",
              description: "SOC 2, HIPAA-eligible, and encrypted end-to-end by default",
            },
            {
              title: "Managed by Us",
              description:
                "We handle setup, monitoring, and maintenance so you can focus on business",
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="night-surface rounded-xl border border-white/10 p-5 shadow-md transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-muted-foreground mt-2 text-sm">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-4xl px-4 py-20">
        <GlassCard variant="night" className="p-12 text-center">
          <GlassCardContent className="p-0">
            <h2 className="text-3xl font-bold tracking-tight">
              Ready to upgrade your business communications?
            </h2>
            <p className="text-muted-foreground mx-auto mt-4 max-w-lg">
              Schedule a free consultation. We&apos;ll assess your current setup and show you
              exactly how AWS communication services can work for your business.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg">
                <Link href="/contact">Schedule a Consultation</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/how-it-works">See How It Works</Link>
              </Button>
            </div>
          </GlassCardContent>
        </GlassCard>
      </section>
    </>
  );
}
