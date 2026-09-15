"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ProgressBar } from "@/components/ui/progress-bar";
import { setAssignmentProgressAction } from "@/lib/db/assignments.actions";

export function ManualProgress({ assignmentId, progress }: { assignmentId: string; progress: number }) {
  const router = useRouter();
  const [value, setValue] = useState(progress);
  const [pending, startTransition] = useTransition();

  function commit(next: number) {
    startTransition(async () => {
      const result = await setAssignmentProgressAction(assignmentId, next);
      if (result.error) toast.error(result.error);
      else router.refresh();
    });
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-semibold text-text">Progress</span>
        <span className="font-bold text-text">{value}%</span>
      </div>
      <ProgressBar value={value} tone={value === 100 ? "success" : "primary"} className="mb-3" />
      <input
        type="range"
        min={0}
        max={100}
        step={5}
        value={value}
        disabled={pending}
        onChange={(e) => setValue(Number(e.target.value))}
        onMouseUp={(e) => commit(Number((e.target as HTMLInputElement).value))}
        onTouchEnd={(e) => commit(Number((e.target as HTMLInputElement).value))}
        className="w-full accent-[var(--color-primary)]"
        aria-label="Update progress"
      />
    </div>
  );
}
