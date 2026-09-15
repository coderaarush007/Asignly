"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { UploadCloud, ClipboardPaste, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ACCEPTED_MIME_TYPES, MAX_UPLOAD_BYTES } from "@/lib/ai/schema";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function UploadArea({ onFileSelected }: { onFileSelected: (file: File) => void }) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function validateAndSelect(file: File) {
    if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
      toast.error("Only PNG and JPEG screenshots are supported.");
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      toast.error("That image is too large (max 8MB).");
      return;
    }
    onFileSelected(file);
  }

  const handlePaste = useCallback((e: ClipboardEvent) => {
    const item = Array.from(e.clipboardData?.items ?? []).find((i) => i.type.startsWith("image/"));
    const file = item?.getAsFile();
    if (file) validateAndSelect(file);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [handlePaste]);

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const file = e.dataTransfer.files[0];
          if (file) validateAndSelect(file);
        }}
        className={cn(
          "flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-14 text-center transition-colors",
          dragOver ? "border-primary bg-primary-tint" : "border-border",
        )}
      >
        <div className="flex size-12 items-center justify-center rounded-full bg-primary-tint text-primary">
          <UploadCloud className="size-6" aria-hidden />
        </div>
        <div>
          <p className="text-sm font-semibold text-text">Drop screenshot here</p>
          <p className="text-xs text-text-secondary">or choose a file from your device</p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) validateAndSelect(file);
          }}
        />
        <Button type="button" variant="secondary" size="sm" onClick={() => inputRef.current?.click()}>
          <ImageIcon className="size-4" aria-hidden />
          Choose from device
        </Button>
      </div>

      <div className="flex items-center gap-2 rounded-xl bg-surface-hover px-4 py-3 text-xs text-text-secondary">
        <ClipboardPaste className="size-4 shrink-0" aria-hidden />
        You can paste a screenshot directly with Ctrl/Cmd + V.
      </div>

      <p className="text-xs leading-relaxed text-text-muted">
        Your screenshot is sent to Google&apos;s Gemini API to extract assignment details. It is not
        stored after extraction, and nothing is saved until you review and confirm.
      </p>
    </div>
  );
}
