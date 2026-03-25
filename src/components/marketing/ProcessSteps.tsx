const steps = [
  {
    step: "01",
    title: "Sign Up",
    description: "Tell us about your business and communication needs.",
  },
  {
    step: "02",
    title: "Instant Configuration",
    description:
      "Our platform auto-generates an optimized AWS communication plan tailored to your business.",
  },
  {
    step: "03",
    title: "Automated Provisioning",
    description:
      "Your services are automatically provisioned and configured in your AWS account — typically in under 10 minutes.",
  },
  {
    step: "04",
    title: "Go Live",
    description: "Launch your new communication system with full support.",
  },
];

export function ProcessSteps() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <h2 className="text-center text-3xl font-semibold tracking-tight">
        Get Started in Four Steps
      </h2>
      <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-center">
        From sign-up to go-live in minutes, not weeks.
      </p>

      <div className="mt-12 grid gap-8 sm:grid-cols-2 md:grid-cols-4">
        {steps.map((item) => (
          <div key={item.step} className="text-center">
            <div className="bg-primary text-primary-foreground mx-auto flex h-12 w-12 items-center justify-center rounded-full text-lg font-semibold">
              {item.step}
            </div>
            <h3 className="mt-4 text-xl font-semibold">{item.title}</h3>
            <p className="text-muted-foreground mt-2">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
