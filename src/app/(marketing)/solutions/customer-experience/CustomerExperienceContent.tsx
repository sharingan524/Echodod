"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GlassCard, GlassCardContent } from "@/components/ui/glass-card";
import { Sparkles, Check, ArrowRight } from "lucide-react";

const features = [
  {
    title: "Journey Mapping",
    description:
      "End-to-end customer journey maps that show how people discover, use, and stay with your product. Identify friction, drop-off points, and moments that matter so you can design for outcomes.",
  },
  {
    title: "Touchpoint Optimization",
    description:
      "Audit and improve every touchpoint — website, app, support, sales, and marketing. We align messaging, flows, and interactions so the experience feels consistent and intentional.",
  },
  {
    title: "Persona Development",
    description:
      "Evidence-based personas grounded in research and data. Understand who your customers are, what they need, and how they behave so your teams can make decisions that resonate.",
  },
  {
    title: "UX Research",
    description:
      "User interviews, usability testing, and discovery workshops to validate assumptions and uncover needs. We turn insights into clear recommendations you can act on.",
  },
  {
    title: "Service Design",
    description:
      "Design the systems and processes behind the experience — front-stage and back-stage. From contact center flows to internal handoffs, we make sure the whole system supports a great CX.",
  },
  {
    title: "Voice of Customer",
    description:
      "Structured programs to capture, analyze, and act on customer feedback. NPS, CSAT, and qualitative feedback woven into a continuous improvement loop.",
  },
];

const steps = [
  {
    step: "01",
    title: "Discovery & Research",
    description:
      "We learn your business, your customers, and your goals. Stakeholder interviews, data review, and optional user research set the foundation for the work.",
  },
  {
    step: "02",
    title: "Journey Mapping",
    description:
      "We map current-state journeys, identify pain points and opportunities, and align with your team on the experience you want to deliver.",
  },
  {
    step: "03",
    title: "Experience Design",
    description:
      "We design target-state journeys, touchpoint improvements, and key flows. You get clear deliverables — journey maps, recommendations, and implementation priorities.",
  },
  {
    step: "04",
    title: "Implementation Support",
    description:
      "We work with your product, design, and operations teams to roll out changes. Optional ongoing support to measure impact and iterate.",
  },
  {
    step: "05",
    title: "Measure & Iterate",
    description:
      "Define success metrics and feedback loops. We help you track CX health and refine the experience based on real customer and business outcomes.",
  },
];

export default function CustomerExperienceContent() {
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
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/10">
              <Sparkles className="h-6 w-6 text-rose-500" />
            </div>
            <span className="text-sm font-medium text-rose-500">Customer Experience Design</span>
          </div>

          <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-6xl">
            Every Interaction <span className="text-rose-500">Shapes How Customers Feel</span>
          </h1>
          <p className="text-muted-foreground mt-6 max-w-2xl text-lg md:text-xl">
            Design and optimize end-to-end customer journeys and touchpoints. Journey mapping,
            persona development, UX research, and service design — so your experience builds
            loyalty.
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
            Seamless experiences that build loyalty
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl">
            From journey mapping to voice of customer programs, we help you design, measure, and
            improve the experience at every touchpoint.
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
              className="border-border bg-card/50 rounded-xl border p-6 transition-all hover:-translate-y-1 hover:border-rose-500/30 hover:shadow-md"
            >
              <div className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-rose-500" />
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
            How we design your customer experience
          </p>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl">
            From discovery and journey mapping to design, implementation support, and ongoing
            measurement — we work alongside your team.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              viewport={{ once: true }}
              className="border-border bg-card/50 relative rounded-xl border p-6"
            >
              <span className="text-4xl font-bold text-rose-500/20">{step.step}</span>
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
              Ready to design a better customer experience?
            </h2>
            <p className="text-muted-foreground mx-auto mt-4 max-w-lg">
              Schedule a free consultation and we&apos;ll discuss your goals, your customers, and
              how we can help you map, design, and improve the experience at every touchpoint.
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
