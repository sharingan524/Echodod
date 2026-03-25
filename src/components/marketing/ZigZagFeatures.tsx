import { cn } from "@/lib/utils";
import { Phone, MessageSquare, Mail } from "lucide-react";

const features = [
  {
    title: "Professional Phone Systems",
    description:
      "Amazon Connect powered phone systems with IVR, intelligent call routing, real-time analytics, and 99.99% uptime. Enterprise-grade reliability at a fraction of the cost.",
    icon: Phone,
  },
  {
    title: "Unified Messaging",
    description:
      "Reach your customers on their preferred channel with SMS and chat powered by Amazon Pinpoint. Engage audiences with targeted, personalized communications at scale.",
    icon: MessageSquare,
  },
  {
    title: "Reliable Email",
    description:
      "Enterprise email infrastructure powered by Amazon SES with industry-leading deliverability. Your messages reach the inbox, not the spam folder.",
    icon: Mail,
  },
];

export function ZigZagFeatures() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="text-center text-3xl font-semibold tracking-tight">What We Implement</h2>
      <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-center">
        Enterprise AWS communication services, professionally set up and maintained for your
        business.
      </p>

      <div className="mt-16 space-y-20">
        {features.map((feature, index) => (
          <div
            key={feature.title}
            className={cn(
              "grid items-center gap-12 md:grid-cols-2",
              index % 2 === 1 && "md:flex-row-reverse"
            )}
          >
            <div className={cn(index % 2 === 1 && "md:order-2")}>
              <h3 className="text-2xl font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground mt-4 leading-relaxed">{feature.description}</p>
            </div>
            <div
              className={cn(
                "bg-muted/30 flex h-64 items-center justify-center rounded-2xl border",
                index % 2 === 1 && "md:order-1"
              )}
            >
              <feature.icon className="text-muted-foreground/50 h-20 w-20" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
