"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlassCard, GlassCardContent } from "@/components/ui/glass-card";
import { ArrowLeft, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [resetUrl, setResetUrl] = useState<string | null>(null);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      const payload = data?.data ?? data;
      const errorMessage = data?.error?.message || data?.error || "Failed to process request";

      if (!response.ok) {
        setError(errorMessage);
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      if (payload.resetUrl) {
        setResetUrl(payload.resetUrl);
      }
      setIsLoading(false);
    } catch {
      setError("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-md px-4">
        <GlassCard className="p-8">
          <GlassCardContent className="p-0">
            {/* Success State */}
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20">
                <CheckCircle className="h-6 w-6 text-emerald-500" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">Check your email</h1>
              <p className="text-muted-foreground mt-2 text-sm">
                If an account exists with <strong>{email}</strong>, you will receive a password
                reset link shortly.
              </p>

              {/* Development mode: Show reset link */}
              {resetUrl && process.env.NODE_ENV === "development" && (
                <div className="mt-6 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
                  <p className="mb-2 text-sm font-medium text-amber-500">Development Mode</p>
                  <Link href={resetUrl} className="text-primary text-sm hover:underline">
                    Click here to reset password →
                  </Link>
                </div>
              )}

              <Button asChild className="mt-6 w-full">
                <Link href="/login">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to login
                </Link>
              </Button>
            </div>
          </GlassCardContent>
        </GlassCard>

        {/* Footer text */}
        <p className="text-muted-foreground mt-8 text-center text-xs">
          Didn&apos;t receive the email? Check your spam folder or{" "}
          <button onClick={() => setSuccess(false)} className="text-primary hover:underline">
            try again
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md px-4">
      <GlassCard className="p-8">
        <GlassCardContent className="p-0">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="bg-primary/20 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
              <span className="bg-primary h-4 w-4 rounded-full" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Reset your password</h1>
            <p className="text-muted-foreground mt-2 text-sm">
              Enter your email and we&apos;ll send you a link to reset your password
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-destructive/10 text-destructive mb-4 rounded-md px-3 py-2 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@company.com"
                required
                autoComplete="email"
                disabled={isLoading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send reset link"}
            </Button>
          </form>

          {/* Back to login link */}
          <Button asChild variant="ghost" className="mt-6 w-full" disabled={isLoading}>
            <Link href="/login">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to login
            </Link>
          </Button>
        </GlassCardContent>
      </GlassCard>
    </div>
  );
}
