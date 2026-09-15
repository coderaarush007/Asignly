import { notFound } from "next/navigation";
import { getAssignment } from "@/lib/db/assignments.queries";
import { Card } from "@/components/ui/card";
import { SubjectBadge, PriorityBadge, StatusBadge, OverdueBadge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { TaskList } from "@/components/assignments/task-list";
import { DetailActions } from "@/components/assignments/detail-actions";
import { ManualProgress } from "@/components/assignments/manual-progress";
import { Clock3, Hourglass, ListTodo } from "lucide-react";
import { formatDueDate, formatEstimatedMinutes, isOverdue } from "@/lib/utils";
import { SOURCE_LABELS } from "@/lib/constants";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const assignment = await getAssignment(id);
  return { title: assignment ? `${assignment.title} — Assignment.` : "Assignment not found" };
}

export default async function AssignmentDetailPage({ params }: PageProps) {
  const { id } = await params;
  const assignment = await getAssignment(id);
  if (!assignment) notFound();

  const overdue = isOverdue(assignment);
  const est = formatEstimatedMinutes(assignment.estimated_minutes);
  const hasTasks = assignment.tasks.length > 0;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {assignment.subject && (
            <SubjectBadge name={assignment.subject.name} color={assignment.subject.color} />
          )}
          <PriorityBadge priority={assignment.priority} />
          <StatusBadge status={assignment.status} />
          {overdue && <OverdueBadge />}
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-text sm:text-3xl">{assignment.title}</h1>
        <p className="text-xs font-medium text-text-muted">{SOURCE_LABELS[assignment.source]}</p>
      </div>

      <DetailActions assignmentId={assignment.id} status={assignment.status} />

      {assignment.description && (
        <Card className="p-5">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">
            {assignment.description}
          </p>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="flex items-center gap-3 p-4">
          <Clock3 className={"size-5 " + (overdue ? "text-danger" : "text-primary")} aria-hidden />
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted">Due</p>
            <p className={"text-sm font-semibold " + (overdue ? "text-danger" : "text-text")}>
              {formatDueDate(assignment.due_at)}
            </p>
          </div>
        </Card>
        <Card className="flex items-center gap-3 p-4">
          <Hourglass className="size-5 text-primary" aria-hidden />
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted">Estimated</p>
            <p className="text-sm font-semibold text-text">{est ?? "Not set"}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-3 p-4">
          <ListTodo className="size-5 text-primary" aria-hidden />
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted">Tasks</p>
            <p className="text-sm font-semibold text-text">
              {hasTasks
                ? `${assignment.tasks.filter((t) => t.completed).length}/${assignment.tasks.length} done`
                : "None yet"}
            </p>
          </div>
        </Card>
      </div>

      <Card className="p-5">
        {hasTasks ? (
          <>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-bold text-text">Progress</h2>
              <span className="text-sm font-bold text-text">{assignment.progress}%</span>
            </div>
            <ProgressBar
              value={assignment.progress}
              tone={assignment.progress === 100 ? "success" : "primary"}
              className="mb-5"
            />
            <TaskList assignmentId={assignment.id} tasks={assignment.tasks} />
          </>
        ) : (
          <>
            <ManualProgress assignmentId={assignment.id} progress={assignment.progress} />
            <div className="mt-5 border-t border-border pt-5">
              <p className="mb-2 text-sm font-bold text-text">Tasks</p>
              <TaskList assignmentId={assignment.id} tasks={assignment.tasks} />
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
