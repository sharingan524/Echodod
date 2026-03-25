"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/brand/logo";
import {
  LayoutDashboard,
  ScrollText,
  BarChart3,
  Settings,
  LogOut,
  ChevronDown,
  Building2,
  ChevronsUpDown,
  Users,
  ClipboardList,
  Wrench,
  Rocket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useOrg } from "@/lib/org-context";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Business", href: "/business", icon: Building2 },
  { name: "Communication Logs", href: "/logs", icon: ScrollText },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Setup", href: "/setup", icon: Rocket },
  { name: "Settings", href: "/settings", icon: Settings },
];

const adminNavigation = [
  { name: "Clients", href: "/admin/clients", icon: Users },
  { name: "Tickets", href: "/admin/tickets", icon: ClipboardList },
  { name: "Maintenance", href: "/admin/maintenance", icon: Wrench },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { organizations, activeOrg, setActiveOrgId } = useOrg();

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  // Get user initials
  const userInitials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "??";

  const userName = session?.user?.name || "User";
  const userEmail = session?.user?.email || "user@example.com";

  return (
    <div className="bg-background flex min-h-dvh">
      {/* Sidebar */}
      <aside className="border-sidebar-border bg-sidebar fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r md:flex">
        {/* Logo */}
        <div className="border-sidebar-border flex h-16 items-center border-b px-6">
          <Link href="/dashboard">
            <Logo size="sm" />
          </Link>
        </div>

        {/* Organization Switcher */}
        {organizations.length > 0 && (
          <div className="border-sidebar-border border-b p-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="hover:bg-sidebar-accent/50 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors">
                  <Building2 className="text-muted-foreground h-4 w-4 shrink-0" />
                  <span className="flex-1 truncate text-left font-medium">
                    {activeOrg?.name || "Select org"}
                  </span>
                  {organizations.length > 1 && (
                    <ChevronsUpDown className="text-muted-foreground h-3.5 w-3.5 shrink-0" />
                  )}
                </button>
              </DropdownMenuTrigger>
              {organizations.length > 1 && (
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuLabel className="text-xs">Organizations</DropdownMenuLabel>
                  {organizations.map((org) => (
                    <DropdownMenuItem
                      key={org.id}
                      onClick={() => setActiveOrgId(org.id)}
                      className={cn(
                        "flex items-center gap-2",
                        org.id === activeOrg?.id && "bg-accent"
                      )}
                    >
                      <Building2 className="h-3.5 w-3.5" />
                      <span className="flex-1 truncate">{org.name}</span>
                      <span className="text-muted-foreground text-[10px] uppercase">
                        {org.plan}
                      </span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              )}
            </DropdownMenu>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}

          {/* Admin Section */}
          {activeOrg?.role === "owner" && (
            <div className="border-sidebar-border mt-4 border-t pt-4">
              <p className="text-muted-foreground mb-2 px-3 text-xs font-semibold tracking-wider uppercase">
                Admin
              </p>
              {adminNavigation.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          )}
        </nav>

        {/* User section */}
        <div className="border-sidebar-border border-t p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="hover:bg-sidebar-accent/50 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm">
                <div className="bg-primary/20 text-primary flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium">
                  {userInitials}
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium">{userName}</p>
                  <p className="text-muted-foreground truncate text-xs">{userEmail}</p>
                </div>
                <ChevronDown className="text-muted-foreground h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link href="/settings">Profile Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings?tab=billing">Billing</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Mobile header */}
      <header className="border-border bg-background/80 fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b px-4 backdrop-blur-xl md:hidden">
        <Link href="/dashboard">
          <Logo size="sm" />
        </Link>

        {/* Mobile menu button */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              Menu
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {navigation.map((item) => (
              <DropdownMenuItem key={item.href} asChild>
                <Link href={item.href} className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Main content */}
      <main className="flex-1 md:ml-64">
        <div className="min-h-dvh pt-16 md:pt-0">{children}</div>
      </main>
    </div>
  );
}
