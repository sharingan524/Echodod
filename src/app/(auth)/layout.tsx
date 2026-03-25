import Link from "next/link";
import { siteConfig } from "@/lib/site";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-soft-glow flex min-h-dvh flex-col">
      {/* Minimal header */}
      <header className="border-border/50 bg-background/60 fixed inset-x-0 top-0 z-50 border-b backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center px-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="bg-primary h-2.5 w-2.5 rounded-full" />
            <span className="text-sm font-semibold tracking-tight">{siteConfig.name}</span>
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center pt-16">{children}</main>
    </div>
  );
}
