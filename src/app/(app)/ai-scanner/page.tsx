import { getSubjects } from "@/lib/db/subjects.queries";
import { ScannerFlow } from "@/components/scanner/scanner-flow";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "AI Scanner — Assignment." };

export default async function AiScannerPage() {
  const subjects = await getSubjects();

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-primary">Intelligent workflow</p>
        <h1 className="text-2xl font-bold tracking-tight text-text sm:text-[28px]">AI Assignment Scanner</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Upload a screenshot of an assignment. Review what the AI found, then add it yourself.
        </p>
      </div>
      <ScannerFlow subjects={subjects} />
    </div>
  );
}
