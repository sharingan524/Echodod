import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get started with Echodod. Schedule a free consultation and learn how we can implement AWS communication services for your business.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-semibold tracking-tight">Let&apos;s Get Started</h1>
        <p className="text-muted-foreground mt-3">
          Tell us about your business and communication needs. We&apos;ll schedule a free
          consultation to design the right solution for you.
        </p>
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <form className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>
                <Input id="firstName" placeholder="Jane" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input id="lastName" placeholder="Smith" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Work email</Label>
              <Input id="email" type="email" placeholder="jane@company.com" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input id="company" placeholder="Acme Inc." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone number</Label>
              <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="employees">Number of employees</Label>
              <Input id="employees" placeholder="e.g. 25" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">What problems are you looking to solve?</Label>
              <Textarea
                id="message"
                placeholder="Tell us about your current communication setup and challenges..."
                rows={4}
              />
            </div>

            <Button type="submit" size="lg" className="w-full sm:w-auto">
              Request Consultation
            </Button>
          </form>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardContent className="flex items-start gap-4 pt-6">
              <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                <Phone className="text-primary h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Call us</p>
                <p className="text-muted-foreground mt-1 text-sm">
                  <a href="tel:+19729044446" className="hover:text-foreground transition-colors">
                    972-904-4446
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-start gap-4 pt-6">
              <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                <Mail className="text-primary h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Email us</p>
                <p className="text-muted-foreground mt-1 text-sm">
                  <a
                    href="mailto:echododconsulting@gmail.com"
                    className="hover:text-foreground transition-colors"
                  >
                    Echododconsulting@gmail.com
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-start gap-4 pt-6">
              <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                <Clock className="text-primary h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Response time</p>
                <p className="text-muted-foreground mt-1 text-sm">
                  We typically respond within 2 hours during business days.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
