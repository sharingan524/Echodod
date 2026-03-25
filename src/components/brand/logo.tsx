"use client";

import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, showText = true, size = "md" }: LogoProps) {
  const sizes = {
    sm: {
      icon: "h-6 w-6",
      bars: [6, 10, 14, 10, 6],
      gap: "gap-[2px]",
      barWidth: "w-[2px]",
      text: "text-sm",
    },
    md: {
      icon: "h-8 w-8",
      bars: [8, 14, 20, 14, 8],
      gap: "gap-[2px]",
      barWidth: "w-[3px]",
      text: "text-base",
    },
    lg: {
      icon: "h-10 w-10",
      bars: [10, 18, 26, 18, 10],
      gap: "gap-[3px]",
      barWidth: "w-[4px]",
      text: "text-lg",
    },
  };

  const s = sizes[size];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Voice waveform icon */}
      <div className={cn("flex items-center justify-center rounded-lg bg-slate-900", s.icon)}>
        <div className={cn("flex items-center", s.gap)}>
          {s.bars.map((height, i) => (
            <div
              key={i}
              className={cn("rounded-full bg-cyan-400", s.barWidth)}
              style={{ height: `${height}px` }}
            />
          ))}
        </div>
      </div>

      {showText && <span className={cn("font-semibold tracking-tight", s.text)}>Echodod</span>}
    </div>
  );
}
