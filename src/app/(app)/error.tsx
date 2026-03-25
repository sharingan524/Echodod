"use client";

import Link from "next/link";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6">
      <div className="max-w-md text-center">
        <h1 className="mb-2 text-xl font-bold">Something went wrong</h1>
        <p className="text-muted-foreground mb-6 text-sm">
          An error occurred while loading this page. Please try again.
        </p>
        {error.digest && (
          <p className="text-muted-foreground mb-4 font-mono text-xs">Error ID: {error.digest}</p>
        )}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium"
          >
            Try again
          </button>
          <Link
            href="/dashboard"
            className="text-muted-foreground hover:text-foreground text-sm underline underline-offset-4"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
