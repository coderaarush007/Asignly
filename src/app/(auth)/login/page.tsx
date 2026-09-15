import { LoginForm } from "@/components/auth/login-form";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Log in — Asignly" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;

  return (
    <div>
      <h2 className="mb-1 text-lg font-bold text-text">Welcome back</h2>
      <p className="mb-6 text-sm text-text-secondary">Log in to get back to your assignments.</p>
      <LoginForm redirectTo={redirect} />
      <p className="mt-6 text-center text-sm text-text-secondary">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-semibold text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
