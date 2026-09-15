"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RootError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-bg px-4 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-danger-tint text-danger">
        <AlertTriangle className="size-6" aria-hidden />
      </div>
      <p className="text-base font-bold text-text">Something went wrong</p>
      <p className="max-w-sm text-sm text-text-secondary">Try again in a moment.</p>
      <Button onClick={reset} className="mt-2">
        <RotateCcw className="size-4" aria-hidden />
        Try again
      </Button>
    </div>
  );
}
