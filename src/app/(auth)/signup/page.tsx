import { SignUpForm } from "@/components/auth/signup-form";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Sign up — Asignly" };

export default function SignUpPage() {
  return (
    <div>
      <h2 className="mb-1 text-lg font-bold text-text">Create your account</h2>
      <p className="mb-6 text-sm text-text-secondary">
        One place to capture, track, and finish your coursework.
      </p>
      <SignUpForm />
      <p className="mt-6 text-center text-sm text-text-secondary">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
