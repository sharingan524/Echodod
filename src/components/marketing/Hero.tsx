import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:py-20">
      <div className="max-w-3xl">
        <Badge variant="secondary" className="rounded-full">
          AWS Communication Services
        </Badge>
        <h1 className="mt-4 text-5xl font-semibold tracking-tight md:text-6xl">
          Enterprise Communication. Small Business Simplicity.
        </h1>
        <p className="text-muted-foreground mt-5 max-w-xl text-lg">
          Enterprise-grade AWS communication services — phone systems, messaging, and email —
          automatically provisioned in minutes and continuously maintained, so your business sounds
          as professional as a Fortune 500.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href="/contact">Get Started</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/how-it-works">See how it works</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
