"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GlassCard, GlassCardContent } from "@/components/ui/glass-card";
import { Bot, Check, ArrowRight } from "lucide-react";

const features = [
  {
    title: "IVR Design & Implementation",
    description:
      "Custom IVR flows that guide callers to the right outcome — self-service, queue, or callback. Natural language and DTMF, with clear menus and escape to an agent when needed.",
  },
  {
    title: "AI Chatbots",
    description:
      "Conversational bots for web, mobile, and messaging. Amazon Lex powers intent recognition and slot filling; we design dialogs and connect to your APIs and knowledge bases.",
  },
  {
    title: "Omnichannel Routing",
    description:
      "Route voice, chat, and digital contacts through one logic layer. Same queue rules, skills, and reporting whether the customer called, chatted, or messaged.",
  },
  {
    title: "Self-Service & Handoff",
    description:
      "Deflect routine requests with IVR and chatbots; hand off to agents with full context. Seamless escalation so customers never repeat themselves.",
  },
  {
    title: "Integration with Connect & Pinpoint",
    description:
      "IVR and bots wired to Amazon Connect and Pinpoint. Use Connect for voice flows and Lex for chat; we handle the plumbing so it works end-to-end.",
  },
  {
    title: "Analytics & Tuning",
    description:
      "Track deflection rates, containment, and escalation paths. We help you tune prompts and bot responses so self-service and handoff both improve over time.",
  },
];

const steps = [
  {
    step: "01",
    title: "Channel & Use Case Discovery",
    description:
      "We map which channels and use cases you need — IVR only, chatbot only, or full omnichannel. We define success metrics and a phased rollout.",
  },
  {
    step: "02",
    title: "Flow & Dialog Design",
    description:
      "We design IVR flows and bot dialogs: prompts, intents, slots, and handoff rules. You review and approve before we build.",
  },
  {
    step: "03",
    title: "Build & Integrate",
    description:
      "We implement in Amazon Connect and Lex, connect to your backend and CRM, and configure routing. End-to-end testing with your team.",
  },
  {
    step: "04",
    title: "Launch & Optimize",
    description:
      "We go live, monitor containment and escalation, and tune based on real conversations. Ongoing support available for new intents and channels.",
  },
];

export default function IVRChatbotOmnichannelContent() {
  return (
    <>
      <section className="mx-auto max-w-4xl px-4 pt-20 md:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10">
              <Bot className="h-6 w-6 text-cyan-500" />
            </div>
            <span className="text-sm font-medium text-cyan-500">Amazon Connect & Lex</span>
          </div>

          <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-6xl">
            Automate and Unify <span className="text-cyan-500">Every Touchpoint</span>
          </h1>
          <p className="text-muted-foreground mt-6 max-w-2xl text-lg md:text-xl">
            IVR flows, AI chatbots, and omnichannel routing — implemented and integrated so
            customers get answers on any channel. Self-service and handoff that scale.
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
            Self-service and handoff that scale
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl">
            From IVR to AI chatbots to omnichannel routing, we implement the flows and integrations
            so your customers get consistent experiences across every channel.
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
              className="border-border bg-card/50 rounded-xl border p-6 transition-all hover:-translate-y-1 hover:border-cyan-500/30 hover:shadow-md"
            >
              <div className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-cyan-500" />
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
            How we implement IVR, chatbot, and omnichannel
          </p>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl">
            From channel discovery and flow design to build, integration, and launch — we deliver
            working IVR and chatbots with clear handoff to your contact center.
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
              <span className="text-4xl font-bold text-cyan-500/20">{step.step}</span>
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
              Ready to automate and unify your touchpoints?
            </h2>
            <p className="text-muted-foreground mx-auto mt-4 max-w-lg">
              Schedule a free consultation and we&apos;ll discuss your channels and use cases, then
              show you how IVR, chatbots, and omnichannel routing can reduce cost and improve CX.
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
