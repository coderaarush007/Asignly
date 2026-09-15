"use client";

import { useRef } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddAssignmentDialog } from "@/components/assignments/add-assignment-dialog";
import type { DialogHandle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export function AddAssignmentButton({ fab, className }: { fab?: boolean; className?: string }) {
  const dialogRef = useRef<DialogHandle>(null);

  return (
    <>
      {fab ? (
        <button
          type="button"
          aria-label="Add assignment"
          onClick={() => dialogRef.current?.show()}
          className={cn(
            "flex size-14 items-center justify-center rounded-full bg-primary text-white shadow-overlay transition-transform hover:bg-primary-hover active:scale-95",
            className,
          )}
        >
          <Plus className="size-6" aria-hidden />
        </button>
      ) : (
        <Button onClick={() => dialogRef.current?.show()} className={className}>
          <Plus className="size-4" aria-hidden />
          Add assignment
        </Button>
      )}
      <AddAssignmentDialog ref={dialogRef} />
    </>
  );
}
