"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { primaryNav, intelligentNav, personalNav } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { signOutAction } from "@/lib/auth/actions";
import { LogOut } from "lucide-react";
import type { Profile } from "@/lib/types";

function NavSection({
  title,
  items,
  pathname,
}: {
  title: string;
  items: ReadonlyArray<{ href: string; label: string; icon: React.ComponentType<{ className?: string }> }>;
  pathname: string;
}) {
  return (
    <div className="px-3">
      <p className="mb-1 px-3 text-[11px] font-bold uppercase tracking-wider text-text-muted">{title}</p>
      <nav className="space-y-0.5">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-medium transition-colors",
                active
                  ? "bg-primary-tint text-primary font-semibold"
                  : "text-text-secondary hover:bg-surface-hover hover:text-text",
              )}
            >
              <Icon className="size-[18px]" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export function Sidebar({ profile, email }: { profile: Profile | null; email: string }) {
  const pathname = usePathname();
  const displayName = profile?.full_name || email;
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col justify-between overflow-y-auto border-r border-border bg-sidebar lg:flex">
      <div className="flex flex-col">
        <div className="flex h-16 shrink-0 items-center gap-2 px-5">
          <Image src="/icons/icon-192.png" alt="" width={30} height={30} className="rounded-[8px]" />
          <div className="leading-tight">
            <span className="block text-[15px] font-bold tracking-tight text-text">Assignment.</span>
          </div>
          <span className="ml-auto rounded-full bg-primary-tint px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
            Focus Desk
          </span>
        </div>
        <div className="mt-2 flex flex-col gap-5">
          <NavSection title="Workspace" items={primaryNav} pathname={pathname} />
          <NavSection title="Intelligent" items={intelligentNav} pathname={pathname} />
          <NavSection title="Personal" items={personalNav} pathname={pathname} />
        </div>
      </div>

      <div className="border-t border-border p-3">
        <div className="flex items-center gap-2 rounded-xl p-2">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
            {initial}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold text-text">{displayName}</p>
            <p className="truncate text-[11px] text-text-muted">{email}</p>
          </div>
          <form action={signOutAction}>
            <button
              type="submit"
              aria-label="Log out"
              className="flex size-8 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-danger-tint hover:text-danger"
            >
              <LogOut className="size-4" aria-hidden />
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
