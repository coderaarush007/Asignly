"use client";

import { forwardRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { Dialog, type DialogHandle } from "@/components/ui/dialog";
import { Input, Label, FieldError } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { deleteAccountAction } from "@/lib/db/account.actions";

const CONFIRM_PHRASE = "DELETE";

export const DeleteAccountDialog = forwardRef<DialogHandle>((_props, ref) => {
  const router = useRouter();
  const [confirmText, setConfirmText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const canConfirm = confirmText.trim().toUpperCase() === CONFIRM_PHRASE;

  function reset() {
    setConfirmText("");
    setError(null);
    setLoading(false);
  }

  async function handleDelete() {
    if (!canConfirm) return;
    setError(null);
    setLoading(true);
    const result = await deleteAccountAction();
    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }
    router.push("/login");
    router.refresh();
  }

  return (
    <Dialog
      ref={ref}
      title="Delete account"
      className="max-w-sm"
      onClose={reset}
    >
      <div className="space-y-4">
        <div className="flex gap-3 rounded-xl border border-danger/20 bg-danger-tint p-3.5">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-danger" aria-hidden />
          <p className="text-sm text-danger">
            This permanently deletes your account and all of your data — profile, subjects, assignments, and
            tasks. This cannot be undone.
          </p>
        </div>

        <div>
          <Label htmlFor="confirm-delete">
            Type <span className="font-mono font-bold">{CONFIRM_PHRASE}</span> to confirm
          </Label>
          <Input
            id="confirm-delete"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={CONFIRM_PHRASE}
            autoComplete="off"
            disabled={loading}
          />
          <FieldError>{error ?? undefined}</FieldError>
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <Button
            type="button"
            variant="secondary"
            disabled={loading}
            onClick={() => (ref as React.RefObject<DialogHandle>).current?.close()}
          >
            Cancel
          </Button>
          <Button type="button" variant="danger" disabled={!canConfirm} loading={loading} onClick={handleDelete}>
            Delete my account
          </Button>
        </div>
      </div>
    </Dialog>
  );
});
DeleteAccountDialog.displayName = "DeleteAccountDialog";
