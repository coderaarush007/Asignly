"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useEffect, useImperativeHandle, useRef, forwardRef } from "react";

export interface DialogHandle {
  show: () => void;
  close: () => void;
}

interface DialogProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export const Dialog = forwardRef<DialogHandle, DialogProps>(
  ({ title, description, children, onClose, className }, ref) => {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useImperativeHandle(ref, () => ({
      show: () => dialogRef.current?.showModal(),
      close: () => dialogRef.current?.close(),
    }));

    useEffect(() => {
      const el = dialogRef.current;
      if (!el) return;
      const handleClose = () => onClose?.();
      el.addEventListener("close", handleClose);
      return () => el.removeEventListener("close", handleClose);
    }, [onClose]);

    return (
      <dialog
        ref={dialogRef}
        aria-labelledby="dialog-title"
        className={cn(
          "m-auto w-full max-w-lg rounded-[20px] border border-border bg-surface p-0 text-text shadow-overlay backdrop:bg-black/40 backdrop:backdrop-blur-sm",
          className,
        )}
        onClick={(e) => {
          if (e.target === dialogRef.current) dialogRef.current?.close();
        }}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-4">
          <div>
            <h2 id="dialog-title" className="text-base font-bold text-text">
              {title}
            </h2>
            {description && <p className="mt-0.5 text-sm text-text-secondary">{description}</p>}
          </div>
          <button
            type="button"
            aria-label="Close dialog"
            onClick={() => dialogRef.current?.close()}
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-surface-hover hover:text-text"
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </dialog>
    );
  },
);
Dialog.displayName = "Dialog";
