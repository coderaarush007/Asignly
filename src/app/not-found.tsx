import Link from "next/link";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-bg px-4 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-primary-tint text-primary">
        <FileQuestion className="size-6" aria-hidden />
      </div>
      <p className="text-base font-bold text-text">Page not found</p>
      <p className="max-w-sm text-sm text-text-secondary">
        That page doesn&apos;t exist, or you don&apos;t have access to it.
      </p>
      <Link
        href="/dashboard"
        className="mt-2 rounded-[10px] bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
