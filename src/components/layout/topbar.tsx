"use client";

import { usePathname } from "next/navigation";
import { OnlineStatus } from "@/components/layout/online-status";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { AddAssignmentButton } from "@/components/assignments/add-assignment-button";

const TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/assignments": "Assignments",
  "/calendar": "Calendar",
  "/subjects": "Subjects",
  "/analytics": "Analytics",
  "/ai-scanner": "AI Scanner",
  "/settings": "Settings",
  "/profile": "Profile",
};

function titleFor(pathname: string) {
  if (TITLES[pathname]) return TITLES[pathname];
  const base = "/" + pathname.split("/")[1];
  return TITLES[base] ?? "Assignment.";
}

export function Topbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border bg-bg/85 px-4 backdrop-blur-xl lg:px-8">
      <div className="flex items-center gap-2 text-[13px] text-text-secondary">
        <span className="hidden sm:inline">Workspace</span>
        <span className="hidden text-border-strong sm:inline">/</span>
        <span className="font-semibold text-text">{titleFor(pathname)}</span>
      </div>
      <div className="flex items-center gap-2">
        <OnlineStatus />
        <ThemeToggle />
        <div className="hidden sm:block">
          <AddAssignmentButton />
        </div>
      </div>
    </header>
  );
}
