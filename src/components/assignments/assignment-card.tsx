"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useTransition } from "react";
import { toast } from "sonner";
import { Clock3, Hourglass, CheckCircle2, PencilLine, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Button } from "@/components/ui/button";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import type { DialogHandle } from "@/components/ui/dialog";
import { SubjectBadge, PriorityBadge, OverdueBadge } from "@/components/ui/badge";
import type { AssignmentWithRelations } from "@/lib/types";
import { formatDueDate, formatEstimatedMinutes, isOverdue } from "@/lib/utils";
import { setAssignmentStatusAction, deleteAssignmentAction } from "@/lib/db/assignments.actions";

export function AssignmentCard({ assignment }: { assignment: AssignmentWithRelations }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const deleteDialogRef = useRef<DialogHandle>(null);
  const overdue = isOverdue(assignment);
  const est = formatEstimatedMinutes(assignment.estimated_minutes);
  const taskTotal = assignment.tasks.length;
  const taskDone = assignment.tasks.filter((t) => t.completed).length;

  function markComplete() {
    startTransition(async () => {
      const result = await setAssignmentStatusAction(assignment.id, "completed");
      if (result.error) toast.error(result.error);
      else {
        toast.success("Assignment completed.");
        router.refresh();
      }
    });
  }

  return (
    <Card className="flex flex-col transition-shadow hover:shadow-hover">
      <Link href={`/assignments/${assignment.id}`} className="flex-1 p-5 pb-3">
        <div className="mb-3 flex flex-wrap items-center gap-1.5">
          {assignment.subject && (
            <SubjectBadge name={assignment.subject.name} color={assignment.subject.color} />
          )}
          <PriorityBadge priority={assignment.priority} />
          {overdue ? (
            <OverdueBadge />
          ) : assignment.status === "completed" ? null : (
            <span className="text-xs font-semibold text-text-secondary capitalize">
              {assignment.status.replace("_", " ")}
            </span>
          )}
        </div>

        <h3
          className={
            "mb-1 text-[15px] font-bold text-text " +
            (assignment.status === "completed" ? "line-through decoration-2 opacity-60" : "")
          }
        >
          {assignment.title}
        </h3>
        {assignment.description && (
          <p className="mb-3 line-clamp-2 text-[13px] text-text-secondary">{assignment.description}</p>
        )}

        <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-secondary">
          <span className={"flex items-center gap-1 " + (overdue ? "font-semibold text-danger" : "")}>
            <Clock3 className="size-3.5" aria-hidden />
            {formatDueDate(assignment.due_at)}
          </span>
          {est && (
            <span className="flex items-center gap-1">
              <Hourglass className="size-3.5" aria-hidden />
              {est} est.
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-text-secondary">
          <span>{taskTotal > 0 ? `${taskDone}/${taskTotal} tasks` : "Progress"}</span>
          <span className="font-semibold text-text">{assignment.progress}%</span>
        </div>
        <ProgressBar
          value={assignment.progress}
          tone={assignment.progress === 100 ? "success" : "primary"}
          className="mt-1.5"
        />
      </Link>

      <div className="flex items-center gap-2 border-t border-border px-5 py-3">
        <Button variant="secondary" size="sm" className="flex-1" onClick={() => router.push(`/assignments/${assignment.id}`)}>
          {assignment.status === "completed"
            ? "Review"
            : assignment.status === "in_progress"
              ? "Continue"
              : "Start"}
        </Button>
        {assignment.status !== "completed" && (
          <Button
            variant="ghost"
            size="sm"
            loading={pending}
            onClick={markComplete}
            aria-label="Mark complete"
          >
            <CheckCircle2 className="size-4" aria-hidden />
          </Button>
        )}
        <DropdownMenu
          items={[
            {
              label: "Edit",
              icon: <PencilLine className="size-4" aria-hidden />,
              onClick: () => router.push(`/assignments/${assignment.id}/edit`),
            },
            {
              label: "Delete",
              icon: <Trash2 className="size-4" aria-hidden />,
              destructive: true,
              onClick: () => deleteDialogRef.current?.show(),
            },
          ]}
        />
      </div>

      <ConfirmDialog
        ref={deleteDialogRef}
        title="Delete assignment?"
        description={`"${assignment.title}" and its tasks will be permanently removed.`}
        confirmLabel="Delete"
        destructive
        onConfirm={async () => {
          const result = await deleteAssignmentAction(assignment.id);
          if (result.error) toast.error(result.error);
          else {
            toast.success("Assignment deleted.");
            router.refresh();
          }
        }}
      />
    </Card>
  );
}
