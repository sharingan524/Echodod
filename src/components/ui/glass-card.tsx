import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const glassCardVariants = cva("rounded-2xl transition-all duration-300", {
  variants: {
    variant: {
      default: "glass",
      subtle: "glass-subtle",
      heavy: "glass-heavy",
      cyan: "glass-cyan",
      night: "night-surface border shadow-lg",
    },
    hover: {
      none: "",
      lift: "hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10",
      glow: "hover:shadow-lg hover:shadow-primary/20 hover:border-primary/30",
      scale: "hover:scale-[1.02]",
    },
  },
  defaultVariants: {
    variant: "default",
    hover: "none",
  },
});

export interface GlassCardProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof glassCardVariants> {
  accent?: "phone" | "messaging" | "email" | "none";
}

function GlassCard({
  className,
  variant,
  hover,
  accent = "none",
  children,
  ...props
}: GlassCardProps) {
  const accentBorder = {
    phone: "border-l-4 border-l-phone",
    messaging: "border-l-4 border-l-messaging",
    email: "border-l-4 border-l-email",
    none: "",
  };

  return (
    <div
      className={cn(glassCardVariants({ variant, hover }), accentBorder[accent], className)}
      {...props}
    >
      {children}
    </div>
  );
}

function GlassCardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-2 p-6 pb-0", className)} {...props} />;
}

function GlassCardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-lg font-semibold tracking-tight", className)} {...props} />;
}

function GlassCardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-muted-foreground text-sm", className)} {...props} />;
}

function GlassCardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6", className)} {...props} />;
}

function GlassCardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex items-center p-6 pt-0", className)} {...props} />;
}

export {
  GlassCard,
  GlassCardHeader,
  GlassCardTitle,
  GlassCardDescription,
  GlassCardContent,
  GlassCardFooter,
  glassCardVariants,
};
