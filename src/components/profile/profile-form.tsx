"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Input, Label, FieldError } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { updateProfileAction } from "@/lib/db/profile.actions";

export function ProfileForm({ fullName, email }: { fullName: string; email: string }) {
  const router = useRouter();
  const [name, setName] = useState(fullName);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const result = await updateProfileAction({ fullName: name });
    setPending(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    toast.success("Profile updated.");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <Label htmlFor="fullName">Full name</Label>
        <Input id="fullName" value={name} onChange={(e) => setName(e.target.value)} required />
        <FieldError>{error ?? undefined}</FieldError>
      </div>
      <div>
        <Label htmlFor="accountEmail">Account email</Label>
        <Input id="accountEmail" value={email} disabled readOnly />
      </div>
      <Button type="submit" loading={pending}>
        Save changes
      </Button>
    </form>
  );
}
