"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GlassCard, GlassCardContent } from "@/components/ui/glass-card";
import { Headset, Check, ArrowRight } from "lucide-react";

const features = [
  {
    title: "Omnichannel Routing",
    description:
      "Voice, chat, email, and social in one queue. Route contacts by skill, availability, and priority so every customer reaches the right agent the first time.",
  },
  {
    title: "Real-Time Analytics",
    description:
      "Live dashboards for queue depth, handle time, abandonment, and agent performance. Historical reporting and custom metrics so you can optimize continuously.",
  },
  {
    title: "Agent Desktop & CRM Integration",
    description:
      "Unified agent workspace with screen pops, customer history, and CRM integration. Amazon Connect flows and third-party tools connected in one place.",
  },
  {
    title: "Quality Management",
    description:
      "Call recording, evaluation forms, and coaching workflows. Monitor quality, spot trends, and improve agent performance with structured feedback.",
  },
  {
    title: "Self-Service & Deflection",
    description:
      "IVR and chatbot deflection to reduce live demand. Customers resolve common issues 24/7 while complex cases route to agents with full context.",
  },
  {
    title: "Workforce Management",
    description:
      "Forecasting, scheduling, and adherence tools so you staff to demand. Optional WFM integration or guidance for building your own approach.",
  },
];

const steps = [
  {
    step: "01",
    title: "Discovery & Requirements",
    description:
      "We learn your contact center goals, volumes, channels, and integrations. We define success metrics and a phased implementation plan.",
  },
  {
    step: "02",
    title: "Amazon Connect Setup",
    description:
      "Connect is configured in your AWS account — flows, queues, routing, and agent hierarchy. We set up channels and integrate with your telephony where needed.",
  },
  {
    step: "03",
    title: "Flows, Integrations & Agent Tools",
    description:
      "We build contact flows, integrate CRM and other systems, and configure the agent desktop. You get a production-ready contact center.",
  },
  {
    step: "04",
    title: "Launch & Optimize",
    description:
      "We launch with your team, train agents and supervisors, and hand off runbooks. Ongoing support available for tuning and new features.",
  },
];

export default function ContactCenterCXContent() {
  return (
    <>
      <section className="mx-auto max-w-4xl px-4 pt-20 md:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10">
              <Headset className="h-6 w-6 text-orange-500" />
            </div>
            <span className="text-sm font-medium text-orange-500">Powered by Amazon Connect</span>
          </div>

          <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-6xl">
            Every Call and Message, <span className="text-orange-500">One Great Experience</span>
          </h1>
          <p className="text-muted-foreground mt-6 max-w-2xl text-lg md:text-xl">
            Contact center customer experience powered by Amazon Connect. Omnichannel routing,
            analytics, and agent tools — implemented and managed so you can focus on customers.
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
            Unified voice and digital in one platform
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl">
            Amazon Connect gives you omnichannel routing, real-time analytics, and flexible
            integrations at a fraction of traditional contact center cost.
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
              className="border-border bg-card/50 rounded-xl border p-6 transition-all hover:-translate-y-1 hover:border-orange-500/30 hover:shadow-md"
            >
              <div className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-orange-500" />
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
            How your contact center gets built
          </p>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl">
            From discovery and requirements to Amazon Connect setup, integrations, and launch — we
            manage the build so you can focus on your team and customers.
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
              <span className="text-4xl font-bold text-orange-500/20">{step.step}</span>
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
              Ready to unify your contact center?
            </h2>
            <p className="text-muted-foreground mx-auto mt-4 max-w-lg">
              Schedule a free consultation and we&apos;ll review your current setup, then show you
              how Amazon Connect can deliver omnichannel CX at a fraction of the cost.
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
