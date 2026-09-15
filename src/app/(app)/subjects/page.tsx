import { getSubjectsWithStats } from "@/lib/db/subjects.queries";
import { SubjectCard } from "@/components/subjects/subject-card";
import { NewSubjectButton } from "@/components/subjects/new-subject-button";
import { EmptyState } from "@/components/ui/empty-state";
import { BookOpen } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Subjects — Asignly" };

export default async function SubjectsPage() {
  const subjects = await getSubjectsWithStats();

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-primary">Coursework overview</p>
          <h1 className="text-2xl font-bold tracking-tight text-text sm:text-[28px]">Subjects</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Track active coursework and completion per subject.
          </p>
        </div>
        <div>
          <NewSubjectButton />
        </div>
      </div>

      {subjects.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No subjects yet"
          description="Add your first subject to start organizing assignments."
          action={<NewSubjectButton />}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {subjects.map((s) => (
            <SubjectCard key={s.id} subject={s} />
          ))}
        </div>
      )}
    </div>
  );
}
