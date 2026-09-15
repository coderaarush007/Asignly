"use client";

import { useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PencilLine, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { SubjectDialog } from "@/components/subjects/subject-dialog";
import type { DialogHandle } from "@/components/ui/dialog";
import type { SubjectWithStats } from "@/lib/types";
import { deleteSubjectAction } from "@/lib/db/subjects.actions";

export function SubjectCard({ subject }: { subject: SubjectWithStats }) {
  const router = useRouter();
  const editRef = useRef<DialogHandle>(null);
  const deleteRef = useRef<DialogHandle>(null);

  return (
    <Card className="flex flex-col gap-4 p-5">
      <div className="flex items-start justify-between gap-2">
        <Link href={`/assignments?subject=${subject.id}`} className="min-w-0 flex-1">
          <span
            className="mb-2 inline-flex size-9 items-center justify-center rounded-xl text-sm font-bold"
            style={{ backgroundColor: `${subject.color}1a`, color: subject.color }}
          >
            {subject.name.charAt(0).toUpperCase()}
          </span>
          <h3 className="truncate text-base font-bold text-text">{subject.name}</h3>
        </Link>
        <DropdownMenu
          items={[
            {
              label: "Edit",
              icon: <PencilLine className="size-4" aria-hidden />,
              onClick: () => editRef.current?.show(),
            },
            {
              label: "Delete",
              icon: <Trash2 className="size-4" aria-hidden />,
              destructive: true,
              onClick: () => deleteRef.current?.show(),
            },
          ]}
        />
      </div>

      <div className="flex items-center gap-4 text-xs text-text-secondary">
        <span>
          <span className="font-bold text-text">{subject.assignment_count}</span> total
        </span>
        <span>
          <span className="font-bold text-text">{subject.pending_count}</span> pending
        </span>
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="text-text-secondary">Completion</span>
          <span className="font-bold text-text">{subject.completion_rate}%</span>
        </div>
        <ProgressBar
          value={subject.completion_rate}
          tone={subject.completion_rate === 100 ? "success" : "primary"}
        />
      </div>

      <Link
        href={`/assignments?subject=${subject.id}`}
        className="text-xs font-semibold text-primary hover:underline"
      >
        View assignments
      </Link>

      <SubjectDialog ref={editRef} subject={subject} />
      <ConfirmDialog
        ref={deleteRef}
        title="Delete subject?"
        description={
          subject.assignment_count > 0
            ? `"${subject.name}" has ${subject.assignment_count} assignment(s). They will be kept but unassigned from this subject.`
            : `"${subject.name}" will be permanently removed.`
        }
        confirmLabel="Delete"
        destructive
        onConfirm={async () => {
          const result = await deleteSubjectAction(subject.id);
          if (result.error) toast.error(result.error);
          else {
            toast.success("Subject deleted.");
            router.refresh();
          }
        }}
      />
    </Card>
  );
}
