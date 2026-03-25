"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlassCard, GlassCardContent } from "@/components/ui/glass-card";
import { CheckCircle, AlertCircle } from "lucide-react";

function ResetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    // Validate password strength
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      setIsLoading(false);
      return;
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      setError("Password must contain uppercase, lowercase, and number");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();
      const errorMessage = data?.error?.message || data?.error || "Failed to reset password";

      if (!response.ok) {
        setError(errorMessage);
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      setIsLoading(false);

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/login");
      }, 2000);
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
              <h1 className="text-2xl font-bold tracking-tight">Password reset successfully</h1>
              <p className="text-muted-foreground mt-2 text-sm">
                Your password has been updated. Redirecting to login...
              </p>

              <Button asChild className="mt-6 w-full">
                <Link href="/login">Go to login</Link>
              </Button>
            </div>
          </GlassCardContent>
        </GlassCard>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="w-full max-w-md px-4">
        <GlassCard className="p-8">
          <GlassCardContent className="p-0">
            {/* Error State */}
            <div className="text-center">
              <div className="bg-destructive/20 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
                <AlertCircle className="text-destructive h-6 w-6" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">Invalid reset link</h1>
              <p className="text-muted-foreground mt-2 text-sm">
                This password reset link is invalid or has expired. Please request a new one.
              </p>

              <Button asChild className="mt-6 w-full">
                <Link href="/forgot-password">Request new reset link</Link>
              </Button>
            </div>
          </GlassCardContent>
        </GlassCard>
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
            <h1 className="text-2xl font-bold tracking-tight">Set new password</h1>
            <p className="text-muted-foreground mt-2 text-sm">Enter your new password below</p>
          </div>

          {/* Error Message */}
          {error && error !== "Invalid or missing reset token" && (
            <div className="bg-destructive/10 text-destructive mb-4 rounded-md px-3 py-2 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                autoComplete="new-password"
                disabled={isLoading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className="text-muted-foreground text-xs">
                Must be 8+ characters with uppercase, lowercase, and number
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                required
                autoComplete="new-password"
                disabled={isLoading}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Resetting password..." : "Reset password"}
            </Button>
          </form>

          {/* Back to login link */}
          <Button asChild variant="ghost" className="mt-6 w-full" disabled={isLoading}>
            <Link href="/login">Back to login</Link>
          </Button>
        </GlassCardContent>
      </GlassCard>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-md px-4">
          <GlassCard className="p-8">
            <GlassCardContent className="p-0">
              <div className="text-center">Loading...</div>
            </GlassCardContent>
          </GlassCard>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
