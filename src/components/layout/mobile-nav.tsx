"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mobileNav } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { AddAssignmentButton } from "@/components/assignments/add-assignment-button";

export function MobileNav() {
  const pathname = usePathname();
  const left = mobileNav.slice(0, 2);
  const right = mobileNav.slice(2);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 backdrop-blur-xl lg:hidden">
      <div className="relative mx-auto flex max-w-lg items-center justify-between px-4 py-2">
        {left.map((item) => (
          <NavItem key={item.href} item={item} active={pathname.startsWith(item.href)} />
        ))}
        <div className="flex w-16 justify-center">
          <div className="absolute -top-7 left-1/2 -translate-x-1/2">
            <AddAssignmentButton fab />
          </div>
        </div>
        {right.map((item) => (
          <NavItem key={item.href} item={item} active={pathname.startsWith(item.href)} />
        ))}
      </div>
    </nav>
  );
}

function NavItem({
  item,
  active,
}: {
  item: { href: string; label: string; icon: React.ComponentType<{ className?: string }> };
  active: boolean;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex w-16 flex-col items-center gap-1 rounded-lg py-1.5 text-[11px] font-medium",
        active ? "text-primary" : "text-text-muted",
      )}
    >
      <Icon className="size-5" />
      {item.label}
    </Link>
  );
}
