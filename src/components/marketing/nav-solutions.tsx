"use client";

import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const accentDot: Record<string, string> = {
  blue: "bg-blue-500",
  emerald: "bg-emerald-500",
  purple: "bg-purple-500",
  pink: "bg-pink-500",
  rose: "bg-rose-500",
  orange: "bg-orange-500",
  cyan: "bg-cyan-500",
  amber: "bg-amber-500",
  fuchsia: "bg-fuchsia-500",
};

export function NavSolutions() {
  return (
    <NavigationMenu viewportClassName="night-surface rounded-xl border-white/10 shadow-lg">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent">Solutions</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[420px] gap-1 p-2">
              {siteConfig.solutions.map((s) => (
                <NavigationMenuLink key={s.href} asChild>
                  <Link
                    href={s.href}
                    className={cn(
                      "group rounded-xl px-3 py-3 transition",
                      "hover:bg-white/10 focus:bg-white/10"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "h-2 w-2 rounded-full transition-transform group-hover:scale-125",
                          accentDot[s.accent]
                        )}
                      />
                      <span className="text-sm font-medium">{s.title}</span>
                    </div>
                    <div className="text-muted-foreground mt-1 pl-4 text-xs">{s.description}</div>
                  </Link>
                </NavigationMenuLink>
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
