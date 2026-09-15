"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { mainNav } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { OnlineStatus } from "@/components/layout/online-status";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { ProfileMenu } from "@/components/layout/profile-menu";
import { MobileNavSheet } from "@/components/layout/mobile-nav-sheet";
import { AddAssignmentButton } from "@/components/assignments/add-assignment-button";
import type { Profile } from "@/lib/types";

export function Navbar({ profile, email }: { profile: Profile | null; email: string }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 pb-2 sm:px-4 lg:px-6 lg:pt-4">
      <div className="mx-auto flex h-14 max-w-[1400px] items-center gap-2 rounded-full border border-glass-border bg-glass-surface px-3 shadow-glass backdrop-blur-2xl backdrop-saturate-150 lg:h-[60px] lg:gap-4 lg:px-4">
        <Link href="/dashboard" className="flex shrink-0 items-center gap-2 pl-1">
          <Image src="/icons/icon-192.png" alt="" width={30} height={30} className="rounded-[8px]" />
          <span className="hidden text-[15px] font-bold tracking-tight text-text sm:inline">Asignly</span>
          <span className="hidden rounded-full bg-primary-tint px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary xl:inline">
            Focus Desk
          </span>
        </Link>

        <nav aria-label="Main" className="hidden flex-1 items-center justify-center gap-0.5 lg:flex xl:gap-1">
          {mainNav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-full px-2.5 py-2 text-[13px] font-semibold whitespace-nowrap transition-all duration-200 ease-out xl:px-3.5",
                  active
                    ? "bg-primary/10 text-primary ring-1 ring-inset ring-primary/15"
                    : "text-text-secondary hover:-translate-y-px hover:bg-glass-hover hover:text-text",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1.5 lg:ml-0 xl:gap-2">
          <div className="hidden items-center gap-1.5 lg:flex xl:gap-2">
            <div className="hidden xl:block">
              <OnlineStatus />
            </div>
            <ThemeToggle />
            <div className="xl:hidden">
              <AddAssignmentButton iconOnly />
            </div>
            <div className="hidden xl:block">
              <AddAssignmentButton />
            </div>
          </div>
          <div className="flex items-center gap-1.5 lg:hidden">
            <ThemeToggle />
            <AddAssignmentButton iconOnly />
            <MobileNavSheet profile={profile} email={email} />
          </div>
          <div className="hidden lg:block">
            <ProfileMenu profile={profile} email={email} />
          </div>
        </div>
      </div>
    </header>
  );
}
