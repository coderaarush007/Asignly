"use client";

import { Toaster } from "sonner";
import { useTheme } from "next-themes";

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();

  return (
    <>
      {children}
      <Toaster
        position="bottom-right"
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        toastOptions={{
          style: {
            background: "var(--color-surface)",
            color: "var(--color-text)",
            border: "1px solid var(--color-border)",
          },
        }}
      />
    </>
  );
}
