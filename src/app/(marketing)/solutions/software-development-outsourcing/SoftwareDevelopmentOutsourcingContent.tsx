"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GlassCard, GlassCardContent } from "@/components/ui/glass-card";
import { Code2, Check, ArrowRight } from "lucide-react";

const features = [
  {
    title: "Dedicated Development Teams",
    description:
      "Vetted engineers and teams aligned to your stack and roadmap. Full-time or part-time, on your time zone and tools — so you ship faster without hiring in-house.",
  },
  {
    title: "Technical Recruitment",
    description:
      "We source, screen, and shortlist developers for your roles. Backend, frontend, DevOps, mobile — you get qualified candidates and optional support through onboarding.",
  },
  {
    title: "Project-Based Outsourcing",
    description:
      "Fixed-scope or time-and-materials engagements for new products, migrations, or integrations. Clear milestones, regular demos, and handoff when the work is done.",
  },
  {
    title: "Stack Alignment",
    description:
      "Teams that match your stack — React, Node, Python, AWS, etc. We avoid mismatches so you don&apos;t spend time bringing people up to speed on your tech.",
  },
  {
    title: "Quality & Process",
    description:
      "Code reviews, testing, and CI/CD practices built in. We follow your standards or help define them so quality stays high as you scale.",
  },
  {
    title: "Flexible Engagement Models",
    description:
      "Staff augmentation, dedicated squads, or project-based. We adapt to how you work so you get the right level of commitment and control.",
  },
];

const steps = [
  {
    step: "01",
    title: "Discovery & Scope",
    description:
      "We learn your roadmap, stack, and team structure. We define roles, skills, and engagement model — dedicated team, augmentation, or project.",
  },
  {
    step: "02",
    title: "Talent Sourcing & Selection",
    description:
      "We source and screen candidates or assemble a team. You interview and approve; we handle contracts, onboarding, and tooling access.",
  },
  {
    step: "03",
    title: "Onboarding & Kickoff",
    description:
      "We onboard engineers to your codebase, processes, and communication channels. Clear roles, sprint cadence, and success metrics from day one.",
  },
  {
    step: "04",
    title: "Delivery & Iteration",
    description:
      "We deliver in sprints with demos and retrospectives. Ongoing recruitment and scaling available as your roadmap grows.",
  },
];

export default function SoftwareDevelopmentOutsourcingContent() {
  return (
    <>
      <section className="mx-auto max-w-4xl px-4 pt-20 md:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10">
              <Code2 className="h-6 w-6 text-amber-500" />
            </div>
            <span className="text-sm font-medium text-amber-500">
              Software Development & Recruitment
            </span>
          </div>

          <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-6xl">
            Ship Faster With <span className="text-amber-500">The Right Talent</span>
          </h1>
          <p className="text-muted-foreground mt-6 max-w-2xl text-lg md:text-xl">
            Outsource software development and technical recruitment. Vetted engineers and teams
            delivered to your roadmap — flexible engagement models aligned to your stack.
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
            Flexible teams aligned to your stack
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl">
            From dedicated teams to staff augmentation to project-based work — we deliver vetted
            engineers and clear processes so you can focus on product, not hiring.
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
              className="border-border bg-card/50 rounded-xl border p-6 transition-all hover:-translate-y-1 hover:border-amber-500/30 hover:shadow-md"
            >
              <div className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
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
            How we deliver development talent
          </p>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl">
            From discovery and scope to sourcing, onboarding, and delivery — we manage recruitment
            and engagement so you get the right people, fast.
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
              <span className="text-4xl font-bold text-amber-500/20">{step.step}</span>
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
              Ready to scale your development capacity?
            </h2>
            <p className="text-muted-foreground mx-auto mt-4 max-w-lg">
              Schedule a free consultation and we&apos;ll discuss your roadmap and team needs, then
              show you how our outsourcing and recruitment options can help you ship faster.
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
