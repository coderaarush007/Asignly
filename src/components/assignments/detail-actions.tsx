"use client";

import { useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PencilLine, Trash2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import type { DialogHandle } from "@/components/ui/dialog";
import { setAssignmentStatusAction, deleteAssignmentAction } from "@/lib/db/assignments.actions";

export function DetailActions({
  assignmentId,
  status,
}: {
  assignmentId: string;
  status: "todo" | "in_progress" | "completed";
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const deleteDialogRef = useRef<DialogHandle>(null);

  function markComplete() {
    startTransition(async () => {
      const result = await setAssignmentStatusAction(assignmentId, "completed");
      if (result.error) toast.error(result.error);
      else {
        toast.success("Assignment completed.");
        router.refresh();
      }
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {status !== "completed" && (
        <Button onClick={markComplete} loading={pending}>
          <CheckCircle2 className="size-4" aria-hidden />
          Mark complete
        </Button>
      )}
      <Button variant="secondary" onClick={() => router.push(`/assignments/${assignmentId}/edit`)}>
        <PencilLine className="size-4" aria-hidden />
        Edit
      </Button>
      <Button variant="secondary" onClick={() => deleteDialogRef.current?.show()}>
        <Trash2 className="size-4" aria-hidden />
        Delete
      </Button>

      <ConfirmDialog
        ref={deleteDialogRef}
        title="Delete assignment?"
        description="This will permanently remove the assignment and its tasks."
        confirmLabel="Delete"
        destructive
        onConfirm={async () => {
          const result = await deleteAssignmentAction(assignmentId);
          if (result.error) toast.error(result.error);
          else {
            toast.success("Assignment deleted.");
            router.push("/assignments");
            router.refresh();
          }
        }}
      />
    </div>
  );
}
