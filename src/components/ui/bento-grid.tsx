import * as React from "react";
import { cn } from "@/lib/utils";

interface BentoGridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

function BentoGrid({ className, children, ...props }: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid auto-rows-[minmax(180px,1fr)] grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface BentoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "default" | "large" | "wide" | "tall";
  accent?: "phone" | "messaging" | "email" | "none";
  icon?: React.ReactNode;
  title: string;
  description?: string;
  visual?: React.ReactNode;
  href?: string;
}

function BentoCard({
  className,
  size = "default",
  accent = "none",
  icon,
  title,
  description,
  visual,
  href,
  children,
  ...props
}: BentoCardProps) {
  const sizeClasses = {
    default: "",
    large: "md:col-span-2 md:row-span-2",
    wide: "md:col-span-2",
    tall: "md:row-span-2",
  };

  const accentColors = {
    phone: "border-phone/30 hover:border-phone/50",
    messaging: "border-messaging/30 hover:border-messaging/50",
    email: "border-email/30 hover:border-email/50",
    none: "border-border hover:border-primary/30",
  };

  const accentGlow = {
    phone: "hover:shadow-phone/10",
    messaging: "hover:shadow-messaging/10",
    email: "hover:shadow-email/10",
    none: "hover:shadow-primary/10",
  };

  const accentIconBg = {
    phone: "bg-phone/10 text-phone",
    messaging: "bg-messaging/10 text-messaging",
    email: "bg-email/10 text-email",
    none: "bg-primary/10 text-primary",
  };

  const sharedClassName = cn(
    "group relative flex flex-col overflow-hidden rounded-2xl border bg-card/50 p-6 transition-all duration-300",
    "hover:-translate-y-1 hover:shadow-lg",
    sizeClasses[size],
    accentColors[accent],
    accentGlow[accent],
    className
  );

  const content = (
    <>
      {/* Icon */}
      {icon && (
        <div
          className={cn(
            "mb-4 flex h-10 w-10 items-center justify-center rounded-lg",
            accentIconBg[accent]
          )}
        >
          {icon}
        </div>
      )}

      {/* Content */}
      <div className="flex-1">
        <h3 className="mb-2 text-lg font-semibold tracking-tight">{title}</h3>
        {description && <p className="text-muted-foreground text-sm">{description}</p>}
        {children}
      </div>

      {/* Visual element */}
      {visual && <div className="mt-4 overflow-hidden rounded-lg">{visual}</div>}

      {/* Hover gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </>
  );

  if (href) {
    return (
      <a href={href} className={sharedClassName}>
        {content}
      </a>
    );
  }

  return (
    <div className={sharedClassName} {...props}>
      {content}
    </div>
  );
}

export { BentoGrid, BentoCard };
