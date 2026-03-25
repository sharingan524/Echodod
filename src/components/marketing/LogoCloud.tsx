const awsServices = [
  { name: "Amazon Connect" },
  { name: "Amazon Pinpoint" },
  { name: "Amazon SES" },
  { name: "AWS" },
];

export function LogoCloud() {
  return (
    <section className="bg-muted/30 border-y py-12">
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-muted-foreground text-center text-sm font-medium">Powered by AWS</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {awsServices.map((service) => (
            <div
              key={service.name}
              className="text-muted-foreground bg-background rounded-lg border px-6 py-3 text-sm font-semibold tracking-tight"
            >
              {service.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
