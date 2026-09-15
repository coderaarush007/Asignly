import { cn } from "@/lib/utils";
import type { AssignmentPriority, AssignmentStatus } from "@/lib/types";
import { PRIORITY_LABELS, STATUS_LABELS } from "@/lib/constants";

export function Badge({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export function SubjectBadge({ name, color }: { name: string; color: string }) {
  return (
    <Badge
      style={{ backgroundColor: `${color}1a`, color }}
      className="max-w-[10rem] truncate"
    >
      {name}
    </Badge>
  );
}

const priorityDotColor: Record<AssignmentPriority, string> = {
  high: "bg-danger",
  medium: "bg-warning",
  low: "bg-text-muted",
};

export function PriorityBadge({ priority }: { priority: AssignmentPriority }) {
  return (
    <Badge className="bg-surface-hover text-text-secondary border border-border">
      <span className={cn("size-1.5 rounded-full", priorityDotColor[priority])} />
      {PRIORITY_LABELS[priority]}
    </Badge>
  );
}

const statusClasses: Record<AssignmentStatus, string> = {
  todo: "bg-surface-hover text-text-secondary border border-border",
  in_progress: "bg-primary-tint text-primary",
  completed: "bg-success-tint text-success",
};

export function StatusBadge({ status }: { status: AssignmentStatus }) {
  return <Badge className={statusClasses[status]}>{STATUS_LABELS[status]}</Badge>;
}

export function OverdueBadge() {
  return (
    <Badge className="bg-danger-tint text-danger">
      <span className="size-1.5 rounded-full bg-danger animate-pulse" />
      Overdue
    </Badge>
  );
}
