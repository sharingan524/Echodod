import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { NavSolutions } from "@/components/marketing/nav-solutions";
import { Logo } from "@/components/brand/logo";
import { MobileNav } from "@/components/marketing/MobileNav";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-soft-glow min-h-dvh">
      <header className="border-border/50 bg-background/60 sticky top-0 z-50 border-b backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center">
            <Logo size="sm" />
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {siteConfig.mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-muted-foreground hover:text-foreground rounded-md px-3 py-2 text-sm transition-colors"
              >
                {item.title}
              </Link>
            ))}
            <NavSolutions />
          </nav>

          <div className="flex items-center gap-3">
            <Button asChild size="sm" className="hidden md:inline-flex">
              <Link href="/contact">Contact Us</Link>
            </Button>
            <MobileNav />
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-border/50 mt-24 border-t">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            {/* Logo & tagline */}
            <div className="max-w-xs">
              <Link href="/" className="flex items-center">
                <Logo size="sm" />
              </Link>
              <p className="text-muted-foreground mt-3 text-sm">{siteConfig.description}</p>
            </div>

            {/* Links */}
            <div className="flex flex-wrap gap-8">
              <div>
                <h4 className="text-muted-foreground mb-3 text-xs font-semibold tracking-widest uppercase">
                  Product
                </h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link
                      href="/how-it-works"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      How It Works
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-muted-foreground mb-3 text-xs font-semibold tracking-widest uppercase">
                  Solutions
                </h4>
                <ul className="space-y-2 text-sm">
                  {siteConfig.solutions.map((s) => (
                    <li key={s.href}>
                      <Link href={s.href} className="text-muted-foreground hover:text-foreground">
                        {s.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-muted-foreground mb-3 text-xs font-semibold tracking-widest uppercase">
                  Company
                </h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                      Privacy
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                      Terms
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-muted-foreground mb-3 text-xs font-semibold tracking-widest uppercase">
                  Resources
                </h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/blog" className="text-muted-foreground hover:text-foreground">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/case-studies"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Case Studies
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/compare/twilio"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Echodod vs Twilio
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <Separator className="bg-border/50 my-8" />

          <p className="text-muted-foreground text-center text-xs">{siteConfig.footer.copyright}</p>
        </div>
      </footer>
    </div>
  );
}
