"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { LogOut, Settings, User } from "lucide-react";
import { Popover } from "@/components/ui/popover";
import { signOutAction } from "@/lib/auth/actions";
import { cn } from "@/lib/utils";
import type { Profile } from "@/lib/types";

export function ProfileMenu({ profile, email }: { profile: Profile | null; email: string }) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const displayName = profile?.full_name || email;
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Profile menu"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex size-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white transition-transform outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-focus-ring)]",
          open && "ring-2 ring-primary ring-offset-2 ring-offset-bg",
        )}
      >
        {initial}
      </button>

      <Popover open={open} anchorRef={buttonRef} onClose={() => setOpen(false)} align="end" className="w-60 p-1.5">
        <div className="mb-1 border-b border-border px-3 py-2.5">
          <p className="truncate text-sm font-bold text-text">{displayName}</p>
          <p className="truncate text-xs text-text-muted">{email}</p>
        </div>
        <nav role="menu" className="space-y-0.5 p-0.5">
          <Link
            href="/profile"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-text transition-colors hover:bg-surface-hover"
          >
            <User className="size-4 text-text-muted" aria-hidden />
            Profile
          </Link>
          <Link
            href="/settings"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-text transition-colors hover:bg-surface-hover"
          >
            <Settings className="size-4 text-text-muted" aria-hidden />
            Settings
          </Link>
        </nav>
        <form action={signOutAction} className="border-t border-border p-0.5 pt-1.5">
          <button
            type="submit"
            role="menuitem"
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium text-danger transition-colors hover:bg-danger-tint"
          >
            <LogOut className="size-4" aria-hidden />
            Sign out
          </button>
        </form>
      </Popover>
    </>
  );
}
