"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GlassCard, GlassCardContent } from "@/components/ui/glass-card";
import { Headphones, Check, ArrowRight } from "lucide-react";

const features = [
  {
    title: "Scalable Support Teams",
    description:
      "Outsourced customer service agents who represent your brand. We hire, train, and manage support teams that scale with your volume — email, chat, phone, or omnichannel.",
  },
  {
    title: "Support Recruitment",
    description:
      "We source and screen customer service and support candidates for your roles. You get qualified applicants; we can support onboarding and training so they ramp quickly.",
  },
  {
    title: "Brand-Aligned Training",
    description:
      "Agents trained on your product, tone, and processes. We build playbooks and knowledge bases so every interaction meets your standards.",
  },
  {
    title: "Quality Assurance",
    description:
      "Ongoing QA on tickets and calls — calibration, coaching, and feedback so quality stays high as your team scales.",
  },
  {
    title: "Flexible Engagement Models",
    description:
      "Full-time teams, part-time overflow, or seasonal scaling. We adapt to your demand so you don&apos;t overstaff or understaff.",
  },
  {
    title: "Integration With Your Tools",
    description:
      "Agents work in your CRM, help desk, and contact center tools. We integrate with Zendesk, Salesforce, Amazon Connect, and others so support feels in-house.",
  },
];

const steps = [
  {
    step: "01",
    title: "Discovery & Requirements",
    description:
      "We learn your support volumes, channels, SLAs, and brand guidelines. We define team size, skills, and engagement model.",
  },
  {
    step: "02",
    title: "Team Build or Recruitment",
    description:
      "We assemble an outsourced team or run recruitment for your open roles. You approve candidates; we handle contracts and onboarding.",
  },
  {
    step: "03",
    title: "Training & Ramp",
    description:
      "We train agents on your product, tools, and tone. Playbooks, shadowing, and go-live support so your customers get a seamless experience.",
  },
  {
    step: "04",
    title: "Ongoing Delivery & QA",
    description:
      "We deliver support at scale with regular reporting and QA. We scale up or down as your volume changes and support hiring when you grow.",
  },
];

export default function CustomerServiceOutsourcingContent() {
  return (
    <>
      <section className="mx-auto max-w-4xl px-4 pt-20 md:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-fuchsia-500/10">
              <Headphones className="h-6 w-6 text-fuchsia-500" />
            </div>
            <span className="text-sm font-medium text-fuchsia-500">
              Customer Service Outsourcing & Recruitment
            </span>
          </div>

          <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-6xl">
            Support That Scales <span className="text-fuchsia-500">With Your Customers</span>
          </h1>
          <p className="text-muted-foreground mt-6 max-w-2xl text-lg md:text-xl">
            Customer service outsourcing and recruitment. Scalable support teams and hiring so you
            can focus on growth — trained agents and hiring pipelines when you need them.
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

      <section className="mx-auto max-w-6xl px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Trained agents and hiring pipelines
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl">
            From outsourced support teams to recruitment for your in-house roles — we deliver
            brand-aligned agents and clear processes so your customers get great support.
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
              className="border-border bg-card/50 rounded-xl border p-6 transition-all hover:-translate-y-1 hover:border-fuchsia-500/30 hover:shadow-md"
            >
              <div className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-fuchsia-500" />
                <div>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground mt-2 text-sm">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

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
            How we deliver support teams and recruitment
          </p>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl">
            From discovery and requirements to team build, training, and ongoing delivery — we
            manage hiring and operations so you can focus on product and growth.
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
              <span className="text-4xl font-bold text-fuchsia-500/20">{step.step}</span>
              <h3 className="mt-2 font-semibold">{step.title}</h3>
              <p className="text-muted-foreground mt-2 text-sm">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-20">
        <GlassCard className="p-12 text-center">
          <GlassCardContent className="p-0">
            <h2 className="text-3xl font-bold tracking-tight">
              Ready to scale your customer support?
            </h2>
            <p className="text-muted-foreground mx-auto mt-4 max-w-lg">
              Schedule a free consultation and we&apos;ll discuss your support volumes and hiring
              needs, then show you how our outsourcing and recruitment options can help you deliver
              great support at scale.
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
