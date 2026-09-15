"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-4 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-danger-tint text-danger">
        <AlertTriangle className="size-6" aria-hidden />
      </div>
      <p className="text-base font-bold text-text">Something went wrong</p>
      <p className="max-w-sm text-sm text-text-secondary">
        We couldn&apos;t load this page. This is usually temporary — try again.
      </p>
      <Button onClick={reset} className="mt-2">
        <RotateCcw className="size-4" aria-hidden />
        Try again
      </Button>
    </div>
  );
}
