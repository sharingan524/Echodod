"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GlassCard, GlassCardContent } from "@/components/ui/glass-card";
import { siteConfig } from "@/lib/site";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const accentColors: Record<string, string> = {
  blue: "border-l-blue-500 hover:shadow-blue-500/10",
  emerald: "border-l-emerald-500 hover:shadow-emerald-500/10",
  purple: "border-l-purple-500 hover:shadow-purple-500/10",
  pink: "border-l-pink-500 hover:shadow-pink-500/10",
  rose: "border-l-rose-500 hover:shadow-rose-500/10",
  orange: "border-l-orange-500 hover:shadow-orange-500/10",
  cyan: "border-l-blue-500 hover:shadow-blue-500/10",
  indigo: "border-l-indigo-500 hover:shadow-indigo-500/10",
  amber: "border-l-amber-500 hover:shadow-amber-500/10",
  fuchsia: "border-l-fuchsia-500 hover:shadow-fuchsia-500/10",
};

const accentDot: Record<string, string> = {
  blue: "bg-blue-500",
  emerald: "bg-emerald-500",
  purple: "bg-purple-500",
  pink: "bg-pink-500",
  rose: "bg-rose-500",
  orange: "bg-orange-500",
  cyan: "bg-blue-500",
  indigo: "bg-indigo-500",
  amber: "bg-amber-500",
  fuchsia: "bg-fuchsia-500",
};

export default function HomePage() {
  return (
    <>
      {/* A. HERO SECTION */}
      <section className="mx-auto max-w-4xl px-4 pt-20 text-center md:pt-32">
        <motion.h1
          className="text-4xl font-bold tracking-tight md:text-6xl"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          Enterprise Communication.
          <br />
          Small Business Simplicity.
        </motion.h1>
        <motion.p
          className="text-muted-foreground mx-auto mt-6 max-w-2xl text-lg md:text-xl"
          initial="hidden"
          animate="visible"
          variants={{
            ...fadeIn,
            visible: { ...fadeIn.visible, transition: { duration: 0.5, delay: 0.15 } },
          }}
        >
          AWS-powered phone systems, messaging, and email — automatically provisioned in minutes,
          not weeks. Enterprise-grade infrastructure without the enterprise complexity.
        </motion.p>

        <motion.div
          className="mt-8 flex flex-wrap justify-center gap-3"
          initial="hidden"
          animate="visible"
          variants={{
            ...fadeIn,
            visible: { ...fadeIn.visible, transition: { duration: 0.5, delay: 0.3 } },
          }}
        >
          <Button asChild size="lg">
            <Link href="/contact">Get Started</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/how-it-works">See How It Works</Link>
          </Button>
        </motion.div>
      </section>

      {/* B. HOW IT WORKS SUMMARY */}
      <section className="mx-auto max-w-5xl px-4 py-20">
        <motion.div
          className="text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
        >
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Up and Running in Three Steps
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl">
            We handle the heavy lifting so you can focus on your business.
          </p>
        </motion.div>

        <motion.div
          className="mt-12 grid gap-8 md:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          {[
            {
              step: "01",
              title: "Sign Up",
              description:
                "Tell us about your business and communication needs. We'll design a solution tailored to you.",
            },
            {
              step: "02",
              title: "Automated Setup",
              description:
                "Your AWS communication services are automatically provisioned and configured in minutes — phone, messaging, or email.",
            },
            {
              step: "03",
              title: "Go Live",
              description:
                "Launch your new communication stack. We monitor, maintain, and optimize it going forward.",
            },
          ].map((item) => (
            <motion.div key={item.step} variants={fadeIn}>
              <GlassCard variant="night" hover="lift" className="h-full p-6">
                <GlassCardContent className="p-0">
                  <span className="text-primary text-sm font-semibold">{item.step}</span>
                  <h3 className="mt-2 text-lg font-semibold">{item.title}</h3>
                  <p className="text-muted-foreground mt-2 text-sm">{item.description}</p>
                </GlassCardContent>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* C. VALUE PROPOSITIONS */}
      <section className="mx-auto max-w-5xl px-4 py-20">
        <motion.div
          className="text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
        >
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Why Echodod?</h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl">
            The communication infrastructure your business deserves, without the overhead of
            managing it yourself.
          </p>
        </motion.div>

        <motion.div
          className="mt-12 grid gap-8 md:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          {[
            {
              title: "Enterprise-Grade Infrastructure",
              description:
                "Built on AWS — the same platform trusted by the world's largest companies. Your business gets 99.99% uptime and global reliability.",
            },
            {
              title: "Fully Managed",
              description:
                "No AWS expertise needed. We handle provisioning, configuration, monitoring, and ongoing maintenance so you never have to.",
            },
            {
              title: "Pay Only for What You Use",
              description:
                "No bloated licenses or long-term contracts. AWS usage-based pricing means you scale costs with your actual business needs.",
            },
          ].map((item) => (
            <motion.div key={item.title} variants={fadeIn}>
              <GlassCard variant="night" hover="lift" className="h-full p-6">
                <GlassCardContent className="p-0">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-muted-foreground mt-2 text-sm">{item.description}</p>
                </GlassCardContent>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* D. SOLUTIONS GRID */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <motion.div
          className="text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
        >
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Communication Solutions for Every Need
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl">
            From phone systems to email, we set up the AWS services that power your business
            communications — automatically.
          </p>
        </motion.div>

        <motion.div
          className="mt-12 grid gap-6 md:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          {siteConfig.solutions.map((solution) => (
            <motion.div key={solution.href} variants={fadeIn}>
              <Link
                href={solution.href}
                className={`night-surface group flex h-full flex-col rounded-xl border border-l-4 border-white/10 p-6 shadow-md transition-all hover:-translate-y-1 hover:shadow-lg ${accentColors[solution.accent]}`}
              >
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${accentDot[solution.accent]}`} />
                  <span className="text-sm font-medium">{solution.title}</span>
                </div>
                <h3 className="mt-3 text-lg font-semibold">{solution.hook}</h3>
                <p className="text-muted-foreground mt-2 flex-1 text-sm">{solution.description}</p>
                <p className="text-muted-foreground mt-4 text-xs">
                  <span className="text-primary font-medium">{solution.benefit}</span>
                </p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* E. FINAL CTA */}
      <section className="mx-auto max-w-4xl px-4 py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
        >
          <GlassCard variant="night" className="p-12 text-center">
            <GlassCardContent className="p-0">
              <h2 className="text-3xl font-bold tracking-tight">
                Ready to upgrade your business communications?
              </h2>
              <p className="text-muted-foreground mx-auto mt-4 max-w-lg">
                Tell us about your needs and we&apos;ll design the right solution. No commitment
                required for your initial consultation.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button asChild size="lg">
                  <Link href="/contact">Get Started</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/pricing">View Pricing</Link>
                </Button>
              </div>
            </GlassCardContent>
          </GlassCard>
        </motion.div>
      </section>
    </>
  );
}
