import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { SubjectBadge } from "@/components/ui/badge";
import { Sparkles, ArrowRight } from "lucide-react";
import type { AssignmentWithRelations } from "@/lib/types";
import { formatDueDate, isOverdue } from "@/lib/utils";

export function TodayFocus({ assignment }: { assignment: AssignmentWithRelations | null }) {
  if (!assignment) {
    return (
      <Card className="p-5">
        <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-text-muted">
          <Sparkles className="size-4 text-primary" aria-hidden />
          Today&apos;s Focus
        </div>
        <p className="text-sm text-text-secondary">Nothing urgent right now. Nice.</p>
      </Card>
    );
  }

  const overdue = isOverdue(assignment);

  return (
    <Card className="p-5">
      <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-text-muted">
        <Sparkles className="size-4 text-primary" aria-hidden />
        Today&apos;s Focus
      </div>
      {assignment.subject && (
        <div className="mb-2">
          <SubjectBadge name={assignment.subject.name} color={assignment.subject.color} />
        </div>
      )}
      <h3 className="mb-1 text-base font-bold text-text">{assignment.title}</h3>
      <p className={"mb-4 text-xs font-semibold " + (overdue ? "text-danger" : "text-text-secondary")}>
        {formatDueDate(assignment.due_at)}
      </p>
      <ProgressBar value={assignment.progress} className="mb-4" />
      <Link
        href={`/assignments/${assignment.id}`}
        className="flex items-center justify-center gap-1.5 rounded-[10px] bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
      >
        {assignment.status === "todo" ? "Start now" : "Continue"}
        <ArrowRight className="size-4" aria-hidden />
      </Link>
    </Card>
  );
}
