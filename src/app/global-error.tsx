"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en" className="dark">
      <body className="bg-background text-foreground flex min-h-dvh items-center justify-center font-sans antialiased">
        <div className="mx-auto max-w-md px-6 text-center">
          <h1 className="mb-2 text-2xl font-bold">Something went wrong</h1>
          <p className="text-muted-foreground mb-6 text-sm">
            An unexpected error occurred. Please try again.
          </p>
          {error.digest && (
            <p className="text-muted-foreground mb-4 font-mono text-xs">Error ID: {error.digest}</p>
          )}
          <button
            onClick={reset}
            className="bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
