"use client";

import { Dialog, type DialogHandle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { forwardRef, useState } from "react";

interface ConfirmDialogProps {
  title: string;
  description: string;
  confirmLabel?: string;
  destructive?: boolean;
  onConfirm: () => Promise<void> | void;
}

export const ConfirmDialog = forwardRef<DialogHandle, ConfirmDialogProps>(
  ({ title, description, confirmLabel = "Confirm", destructive, onConfirm }, ref) => {
    const [loading, setLoading] = useState(false);

    return (
      <Dialog ref={ref} title={title} description={description} className="max-w-sm">
        <div className="flex justify-end gap-2">
          <Button
            variant="secondary"
            type="button"
            onClick={() => (ref as React.RefObject<DialogHandle>).current?.close()}
          >
            Cancel
          </Button>
          <Button
            variant={destructive ? "danger" : "primary"}
            type="button"
            loading={loading}
            onClick={async () => {
              setLoading(true);
              try {
                await onConfirm();
                (ref as React.RefObject<DialogHandle>).current?.close();
              } finally {
                setLoading(false);
              }
            }}
          >
            {confirmLabel}
          </Button>
        </div>
      </Dialog>
    );
  },
);
ConfirmDialog.displayName = "ConfirmDialog";
