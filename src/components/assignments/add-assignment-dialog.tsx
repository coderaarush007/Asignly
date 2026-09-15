"use client";

import { Dialog, type DialogHandle } from "@/components/ui/dialog";
import { forwardRef } from "react";
import { useRouter } from "next/navigation";
import { PencilLine, ScanLine } from "lucide-react";

export const AddAssignmentDialog = forwardRef<DialogHandle>((_props, ref) => {
  const router = useRouter();

  function go(href: string) {
    (ref as React.RefObject<DialogHandle>).current?.close();
    router.push(href);
  }

  return (
    <Dialog ref={ref} title="Add assignment" description="Capture it manually, or scan a screenshot.">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => go("/assignments/new")}
          className="flex flex-col items-start gap-3 rounded-2xl border border-border p-5 text-left transition-colors hover:border-primary hover:bg-primary-tint"
        >
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary-tint text-primary">
            <PencilLine className="size-5" aria-hidden />
          </span>
          <span>
            <span className="block text-sm font-bold text-text">Add manually</span>
            <span className="block text-xs text-text-secondary">Fill in the details yourself.</span>
          </span>
        </button>
        <button
          type="button"
          onClick={() => go("/ai-scanner")}
          className="flex flex-col items-start gap-3 rounded-2xl border border-border p-5 text-left transition-colors hover:border-primary hover:bg-primary-tint"
        >
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary-tint text-primary">
            <ScanLine className="size-5" aria-hidden />
          </span>
          <span>
            <span className="block text-sm font-bold text-text">Scan screenshot</span>
            <span className="block text-xs text-text-secondary">Let AI read it, then you review.</span>
          </span>
        </button>
      </div>
    </Dialog>
  );
});
AddAssignmentDialog.displayName = "AddAssignmentDialog";
