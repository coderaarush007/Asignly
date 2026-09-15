import { getAssignments } from "@/lib/db/assignments.queries";
import { getSubjects } from "@/lib/db/subjects.queries";
import { FiltersBar } from "@/components/assignments/filters-bar";
import { StatusTabs } from "@/components/assignments/status-tabs";
import { AssignmentCard } from "@/components/assignments/assignment-card";
import { AddAssignmentButton } from "@/components/assignments/add-assignment-button";
import { EmptyState } from "@/components/ui/empty-state";
import { ListChecks } from "lucide-react";
import { isOverdue } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Assignments — Assignment." };

interface PageProps {
  searchParams: Promise<{ q?: string; subject?: string; priority?: string; status?: string }>;
}

export default async function AssignmentsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const [assignments, subjects] = await Promise.all([
    getAssignments({ search: params.q, subjectId: params.subject, priority: params.priority }),
    getSubjects(),
  ]);

  const counts = {
    all: assignments.length,
    todo: assignments.filter((a) => a.status === "todo").length,
    in_progress: assignments.filter((a) => a.status === "in_progress").length,
    completed: assignments.filter((a) => a.status === "completed").length,
    overdue: assignments.filter((a) => isOverdue(a)).length,
  };

  const activeTab = params.status ?? "all";
  const visible =
    activeTab === "all"
      ? assignments
      : activeTab === "overdue"
        ? assignments.filter((a) => isOverdue(a))
        : assignments.filter((a) => a.status === activeTab);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-primary">Your workload</p>
          <h1 className="text-2xl font-bold tracking-tight text-text sm:text-[28px]">Assignments</h1>
          <p className="mt-1 text-sm text-text-secondary">Everything you need to finish, in one view.</p>
        </div>
        <div className="hidden md:block">
          <AddAssignmentButton />
        </div>
      </div>

      <FiltersBar subjects={subjects} />
      <StatusTabs active={activeTab} counts={counts} searchParams={params} />

      {visible.length === 0 ? (
        <EmptyState
          icon={ListChecks}
          title="No assignments here"
          description="Try adjusting your filters, or add a new assignment to get started."
          action={<AddAssignmentButton />}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((a) => (
            <AssignmentCard key={a.id} assignment={a} />
          ))}
        </div>
      )}
    </div>
  );
}
