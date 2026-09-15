import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export function MetricCard({
  label,
  value,
  suffix,
  icon: Icon,
  accent = "primary",
  hint,
}: {
  label: string;
  value: string | number;
  suffix?: string;
  icon: LucideIcon;
  accent?: "primary" | "danger" | "success" | "warning";
  hint?: string;
}) {
  const accentClasses = {
    primary: "bg-primary text-primary",
    danger: "bg-danger text-danger",
    success: "bg-success text-success",
    warning: "bg-warning text-warning",
  }[accent];

  return (
    <Card className="relative overflow-hidden p-5">
      <div className={cn("absolute left-0 top-0 h-full w-1", accentClasses.split(" ")[0])} />
      <div className="flex items-center justify-between pl-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">{label}</span>
        <Icon className={cn("size-[18px]", accentClasses.split(" ")[1])} aria-hidden />
      </div>
      <div className="mt-2 pl-2">
        <span className="text-4xl font-bold tracking-tight text-text">{value}</span>
        {suffix && <span className="ml-1 text-sm font-semibold text-text-secondary">{suffix}</span>}
      </div>
      {hint && <p className="mt-1 pl-2 text-xs text-text-secondary">{hint}</p>}
    </Card>
  );
}
