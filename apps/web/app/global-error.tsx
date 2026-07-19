"use client";

export default function GlobalError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <html>
      <body className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-foreground">Something went wrong.</p>
          <button
            onClick={reset}
            className="mt-2 text-sm text-primary underline"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
