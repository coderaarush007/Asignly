import Link from "next/link";
import { cn } from "@/lib/utils";

const TABS = [
  { key: "all", label: "All" },
  { key: "todo", label: "To Do" },
  { key: "in_progress", label: "In Progress" },
  { key: "completed", label: "Completed" },
  { key: "overdue", label: "Overdue" },
] as const;

export function StatusTabs({
  active,
  counts,
  searchParams,
}: {
  active: string;
  counts: Record<string, number>;
  searchParams: Record<string, string | undefined>;
}) {
  function hrefFor(tab: string) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams)) {
      if (value && key !== "status") params.set(key, value);
    }
    if (tab !== "all") params.set("status", tab);
    const qs = params.toString();
    return qs ? `/assignments?${qs}` : "/assignments";
  }

  return (
    <div className="flex flex-wrap gap-1.5 border-b border-border pb-3">
      {TABS.map((tab) => {
        const isActive = active === tab.key;
        return (
          <Link
            key={tab.key}
            href={hrefFor(tab.key)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors",
              isActive
                ? "bg-primary text-white"
                : tab.key === "overdue" && counts[tab.key] > 0
                  ? "bg-danger-tint text-danger hover:opacity-80"
                  : "text-text-secondary hover:bg-surface-hover",
            )}
          >
            {tab.label} ({counts[tab.key] ?? 0})
          </Link>
        );
      })}
    </div>
  );
}
