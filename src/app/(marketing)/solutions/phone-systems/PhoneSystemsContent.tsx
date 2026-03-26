"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GlassCard, GlassCardContent } from "@/components/ui/glass-card";
import { Phone, Check, ArrowRight } from "lucide-react";

const features = [
  {
    title: "IVR & Auto-Attendant",
    description:
      "Custom interactive voice response menus that route callers to the right department automatically. Professional greetings and multi-level menu trees configured to your business.",
  },
  {
    title: "Call Routing & Queuing",
    description:
      "Intelligent call distribution based on skills, availability, and priority. Keep customers informed with estimated wait times and callback options.",
  },
  {
    title: "Call Recording & Analytics",
    description:
      "Automatic call recording with searchable transcriptions. Gain insights into call volume patterns, agent performance, and customer satisfaction.",
  },
  {
    title: "CRM Integration",
    description:
      "Connect your phone system to Salesforce, HubSpot, or your existing CRM. Screen pops with caller info so your team is always prepared.",
  },
  {
    title: "Real-Time Dashboards",
    description:
      "Live visibility into call queues, agent status, and key metrics. Custom wallboards for managers and supervisors to monitor performance.",
  },
];

const steps = [
  {
    step: "01",
    title: "Quick Setup",
    description:
      "Tell us about your current phone setup, call volumes, and business requirements. Our platform designs the ideal call flow for your organization.",
  },
  {
    step: "02",
    title: "Automated Provisioning",
    description:
      "Your Amazon Connect instance is automatically provisioned, phone numbers are configured, IVR menus are built, and call routing rules are set up — all in minutes.",
  },
  {
    step: "03",
    title: "Integration & Testing",
    description:
      "We connect your CRM, configure recording policies, set up dashboards, and thoroughly test every call path before going live.",
  },
  {
    step: "04",
    title: "Go Live & Ongoing Support",
    description:
      "Smooth cutover to your new system with zero downtime. We provide training for your team and ongoing monitoring and maintenance.",
  },
];

export default function PhoneSystemsContent() {
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
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
              <Phone className="h-6 w-6 text-blue-500" />
            </div>
            <span className="text-sm font-medium text-blue-500">Powered by Amazon Connect</span>
          </div>

          <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-6xl">
            Enterprise Phone Systems,{" "}
            <span className="text-blue-500">Without the Enterprise Cost</span>
          </h1>
          <p className="text-muted-foreground mt-6 max-w-2xl text-lg md:text-xl">
            Amazon Connect phone systems, automatically provisioned and managed for small and medium
            businesses. IVR, call routing, recording, analytics, and CRM integration —
            professionally configured and maintained.
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
            Everything your phone system needs
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl">
            Amazon Connect gives you the features of a Fortune 500 phone system with pay-per-minute
            pricing that makes sense for SMBs.
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
              className="night-surface rounded-xl border border-white/10 p-6 shadow-md transition-all hover:-translate-y-1 hover:border-blue-400/40 hover:shadow-lg"
            >
              <div className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
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
            How your phone system gets set up
          </p>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl">
            From initial setup to go-live, every step of your Amazon Connect implementation is
            automated.
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
              className="night-surface relative rounded-xl border border-white/10 p-6 shadow-md"
            >
              <span className="text-4xl font-bold text-blue-400/40">{step.step}</span>
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
            <h2 className="text-3xl font-bold tracking-tight">Ready for a better phone system?</h2>
            <p className="text-muted-foreground mx-auto mt-4 max-w-lg">
              Schedule a free consultation and we&apos;ll show you how Amazon Connect can transform
              your business communications.
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
