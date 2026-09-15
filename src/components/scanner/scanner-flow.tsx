"use client";

import { useState } from "react";
import Image from "next/image";
import { Loader2, ScanLine, RotateCcw, XCircle } from "lucide-react";
import { UploadArea } from "@/components/scanner/upload-area";
import { AssignmentForm } from "@/components/assignments/assignment-form";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createAssignmentAction } from "@/lib/db/assignments.actions";
import { useLocalSetting } from "@/lib/hooks/use-local-setting";
import type { ExtractionResult } from "@/lib/ai/schema";
import type { Subject } from "@/lib/types";
import type { AssignmentFormValues } from "@/lib/validation/assignment";

type Stage = "upload" | "scanning" | "review" | "error";

function matchSubject(subjects: Subject[], guess: string | null | undefined): string {
  if (!guess) return subjects[0]?.id ?? "";
  const lower = guess.toLowerCase();
  const exact = subjects.find((s) => s.name.toLowerCase() === lower);
  if (exact) return exact.id;
  const partial = subjects.find(
    (s) => lower.includes(s.name.toLowerCase()) || s.name.toLowerCase().includes(lower),
  );
  return partial?.id ?? subjects[0]?.id ?? "";
}

export function ScannerFlow({ subjects }: { subjects: Subject[] }) {
  const [defaultPriority] = useLocalSetting<"low" | "medium" | "high">("ai-default-priority", "medium");
  const [stage, setStage] = useState<Stage>("upload");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [result, setResult] = useState<ExtractionResult | null>(null);

  async function scan(file: File) {
    setPreviewUrl(URL.createObjectURL(file));
    setStage("scanning");

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/ai/extract", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error ?? "Couldn't read that screenshot.");
        setStage("error");
        return;
      }

      setResult(data.result);
      setStage("review");
    } catch {
      setErrorMessage("Couldn't reach the AI service. Check your connection and try again.");
      setStage("error");
    }
  }

  function reset() {
    setStage("upload");
    setResult(null);
    setPreviewUrl(null);
  }

  if (stage === "upload") {
    return <UploadArea onFileSelected={scan} />;
  }

  if (stage === "scanning") {
    return (
      <Card className="flex flex-col items-center justify-center gap-3 p-14 text-center">
        <Loader2 className="size-8 animate-spin text-primary" aria-hidden />
        <p className="text-sm font-semibold text-text">Reading your screenshot...</p>
        <p className="text-xs text-text-secondary">This usually takes a few seconds.</p>
      </Card>
    );
  }

  if (stage === "error") {
    return (
      <Card className="flex flex-col items-center justify-center gap-3 p-14 text-center">
        <XCircle className="size-8 text-danger" aria-hidden />
        <p className="text-sm font-semibold text-text">Couldn&apos;t read that screenshot.</p>
        <p className="max-w-xs text-xs text-text-secondary">{errorMessage || "Try uploading a clearer image."}</p>
        <Button className="mt-2" onClick={reset}>
          <RotateCcw className="size-4" aria-hidden />
          Try again
        </Button>
      </Card>
    );
  }

  // stage === "review"
  const defaultValues: Partial<AssignmentFormValues> = {
    title: result?.title ?? "",
    subjectId: matchSubject(subjects, result?.subjectGuess),
    description: result?.description ?? "",
    dueDate: result?.dueDate ?? "",
    dueTime: result?.dueTime ?? "",
    priority: result?.priority ?? defaultPriority,
    estimatedMinutes: result?.estimatedMinutes ?? "",
  };

  return (
    <div className="space-y-4">
      {previewUrl && (
        <Card className="flex items-center gap-3 p-3">
          <div className="relative size-14 shrink-0 overflow-hidden rounded-lg border border-border">
            <Image src={previewUrl} alt="Uploaded screenshot" fill className="object-cover" unoptimized />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-text">Review extracted details</p>
            <p className="text-xs text-text-secondary">Edit anything before adding it.</p>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={reset}>
            <ScanLine className="size-4" aria-hidden />
            Re-scan
          </Button>
        </Card>
      )}
      <AssignmentForm
        subjects={subjects}
        defaultValues={defaultValues}
        submitLabel="Add assignment"
        successMessage="Assignment created from screenshot."
        onCancelHref="/assignments"
        onSubmit={(values) =>
          createAssignmentAction(values, "ai_scan", result as unknown as Record<string, unknown>)
        }
      />
    </div>
  );
}
