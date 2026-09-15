"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";
import { mainNav, personalNav } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { signOutAction } from "@/lib/auth/actions";
import { useIsClient } from "@/lib/hooks/use-is-client";
import type { Profile } from "@/lib/types";

export function MobileNavSheet({ profile, email }: { profile: Profile | null; email: string }) {
  const [open, setOpen] = useState(false);
  const isClient = useIsClient();
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const displayName = profile?.full_name || email;
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Open navigation menu"
        onClick={() => setOpen(true)}
        className="flex size-9 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-surface-hover hover:text-text lg:hidden"
      >
        <Menu className="size-5" aria-hidden />
      </button>

      {isClient &&
        open &&
        createPortal(
          <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
            <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <div className="absolute inset-y-0 right-0 flex w-[85vw] max-w-xs flex-col bg-surface shadow-overlay">
              <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                    {initial}
                  </div>
                  <div className="min-w-0 leading-tight">
                    <p className="truncate text-sm font-bold text-text">{displayName}</p>
                    <p className="truncate text-xs text-text-muted">{email}</p>
                  </div>
                </div>
                <button
                  type="button"
                  aria-label="Close navigation menu"
                  onClick={() => setOpen(false)}
                  className="flex size-8 shrink-0 items-center justify-center rounded-lg text-text-secondary hover:bg-surface-hover hover:text-text"
                >
                  <X className="size-4" aria-hidden />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto p-3">
                <p className="mb-1 px-2 text-[11px] font-bold uppercase tracking-wider text-text-muted">Navigate</p>
                <div className="mb-4 space-y-0.5">
                  {mainNav.map((item) => {
                    const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                          active
                            ? "bg-primary-tint font-semibold text-primary"
                            : "text-text-secondary hover:bg-surface-hover hover:text-text",
                        )}
                      >
                        <Icon className="size-[18px]" aria-hidden />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>

                <p className="mb-1 px-2 text-[11px] font-bold uppercase tracking-wider text-text-muted">Account</p>
                <div className="space-y-0.5">
                  {personalNav.map((item) => {
                    const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                          active
                            ? "bg-primary-tint font-semibold text-primary"
                            : "text-text-secondary hover:bg-surface-hover hover:text-text",
                        )}
                      >
                        <Icon className="size-[18px]" aria-hidden />
                        {item.label}
                      </Link>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-text-secondary transition-colors hover:bg-surface-hover hover:text-text"
                  >
                    {resolvedTheme === "dark" ? (
                      <Sun className="size-[18px]" aria-hidden />
                    ) : (
                      <Moon className="size-[18px]" aria-hidden />
                    )}
                    {resolvedTheme === "dark" ? "Light mode" : "Dark mode"}
                  </button>
                </div>
              </nav>

              <form action={signOutAction} className="border-t border-border p-3">
                <button
                  type="submit"
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-danger transition-colors hover:bg-danger-tint"
                >
                  <LogOut className="size-[18px]" aria-hidden />
                  Sign out
                </button>
              </form>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
