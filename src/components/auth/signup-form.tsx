"use client";

import { signUpAction, type AuthState } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { Input, Label, FieldError, HelpText } from "@/components/ui/field";
import { useActionState } from "react";
import { MailCheck } from "lucide-react";

const initialState: AuthState = { error: null };

export function SignUpForm() {
  const [state, formAction, pending] = useActionState(signUpAction, initialState);

  if (state.message) {
    return (
      <div className="flex flex-col items-center gap-3 py-2 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-success-tint text-success">
          <MailCheck className="size-6" aria-hidden />
        </div>
        <p className="text-sm font-semibold text-text">Check your email</p>
        <p className="text-sm text-text-secondary">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <Label htmlFor="fullName">Full name</Label>
        <Input id="fullName" name="fullName" type="text" autoComplete="name" required />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
        <HelpText>At least 8 characters.</HelpText>
      </div>
      <FieldError>{state.error ?? undefined}</FieldError>
      <Button type="submit" loading={pending} className="w-full">
        Create account
      </Button>
    </form>
  );
}
