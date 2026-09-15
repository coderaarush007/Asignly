"use client";

import { useRef } from "react";
import { LogOut, ShieldAlert, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { DialogHandle } from "@/components/ui/dialog";
import { DeleteAccountDialog } from "@/components/profile/delete-account-dialog";
import { signOutAction } from "@/lib/auth/actions";

export function AccountActions() {
  const deleteRef = useRef<DialogHandle>(null);

  return (
    <div className="space-y-4">
      <Card className="flex items-center justify-between gap-4 p-5">
        <div>
          <h2 className="text-sm font-bold text-text">Account</h2>
          <p className="text-xs text-text-secondary">Sign out of Assignment. on this device.</p>
        </div>
        <form action={signOutAction}>
          <Button type="submit" variant="secondary">
            <LogOut className="size-4" aria-hidden />
            Sign out
          </Button>
        </form>
      </Card>

      <Card className="border-danger/20 p-5">
        <div className="mb-3 flex items-center gap-2">
          <ShieldAlert className="size-[18px] text-danger" aria-hidden />
          <h2 className="text-sm font-bold text-danger">Danger zone</h2>
        </div>
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <p className="max-w-sm text-xs text-text-secondary">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          <Button type="button" variant="danger" className="shrink-0" onClick={() => deleteRef.current?.show()}>
            <Trash2 className="size-4" aria-hidden />
            Delete account
          </Button>
        </div>
      </Card>

      <DeleteAccountDialog ref={deleteRef} />
    </div>
  );
}
