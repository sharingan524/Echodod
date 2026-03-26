"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

const accentDot: Record<string, string> = {
  blue: "bg-blue-500",
  emerald: "bg-emerald-500",
  purple: "bg-purple-500",
  pink: "bg-pink-500",
  rose: "bg-rose-500",
  orange: "bg-orange-500",
  cyan: "bg-blue-500",
  indigo: "bg-indigo-500",
  amber: "bg-amber-500",
  fuchsia: "bg-fuchsia-500",
};

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      {/* Hamburger Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
        className="relative z-50"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="bg-background/80 fixed inset-0 z-40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu Panel */}
          <div className="border-border bg-background/95 fixed inset-x-0 top-16 z-40 max-h-[calc(100dvh-4rem)] overflow-y-auto border-b backdrop-blur-xl">
            <nav className="container flex flex-col gap-0 p-4">
              {siteConfig.mainNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="text-foreground hover:bg-accent rounded-md px-3 py-3 text-base font-medium transition-colors"
                >
                  {item.title}
                </Link>
              ))}

              {/* Solutions — same structure as desktop (accent dot + title + description) */}
              <div className="border-border mt-3 border-t pt-3">
                <p className="text-muted-foreground mb-2 px-3 text-xs font-semibold tracking-wider uppercase">
                  Solutions
                </p>
                <div className="flex flex-col gap-0.5">
                  {siteConfig.solutions.map((solution) => (
                    <Link
                      key={solution.href}
                      href={solution.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "group rounded-xl px-3 py-3 transition",
                        "hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-none"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "h-2 w-2 shrink-0 rounded-full transition-transform group-hover:scale-125",
                            accentDot[solution.accent] ?? "bg-muted-foreground/50"
                          )}
                        />
                        <span className="text-foreground text-sm font-medium">
                          {solution.title}
                        </span>
                      </div>
                      <div className="text-muted-foreground mt-1 pl-4 text-xs">
                        {solution.description}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* CTA — no Log in on mobile */}
              <div className="border-border mt-4 flex flex-col gap-2 border-t pt-4">
                <Link href="/contact" onClick={() => setIsOpen(false)}>
                  <Button className="w-full">Get Started</Button>
                </Link>
              </div>
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
