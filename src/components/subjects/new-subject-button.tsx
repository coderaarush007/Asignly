"use client";

import { useRef } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SubjectDialog } from "@/components/subjects/subject-dialog";
import type { DialogHandle } from "@/components/ui/dialog";

export function NewSubjectButton() {
  const dialogRef = useRef<DialogHandle>(null);

  return (
    <>
      <Button onClick={() => dialogRef.current?.show()}>
        <Plus className="size-4" aria-hidden />
        New Subject
      </Button>
      <SubjectDialog ref={dialogRef} />
    </>
  );
}
