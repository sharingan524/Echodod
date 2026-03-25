import { Shuffle, Settings, PhoneOff, HelpCircle } from "lucide-react";

const painPoints = [
  {
    icon: Shuffle,
    title: "Fragmented Systems",
    description: "Juggling multiple tools for calls, messages, and email wastes time and money.",
  },
  {
    icon: Settings,
    title: "Complex Setup",
    description: "Setting up enterprise communication tools requires specialized expertise.",
  },
  {
    icon: PhoneOff,
    title: "Unreliable Service",
    description: "Dropped calls and missed messages cost you customers.",
  },
  {
    icon: HelpCircle,
    title: "No Expert Support",
    description: "When something breaks, you're on your own.",
  },
];

export function PainGrid() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <h2 className="text-center text-3xl font-semibold tracking-tight">
        The chaos you know too well
      </h2>
      <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-center">
        Disconnected tools. Complicated setup. Zero support. Sound familiar?
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {painPoints.map((point) => (
          <div key={point.title} className="bg-card rounded-xl border p-6">
            <point.icon className="text-primary h-8 w-8" />
            <h3 className="mt-4 font-semibold">{point.title}</h3>
            <p className="text-muted-foreground mt-2 text-sm">{point.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
