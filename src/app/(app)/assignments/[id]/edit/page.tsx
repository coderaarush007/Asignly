import { notFound } from "next/navigation";
import { getAssignment } from "@/lib/db/assignments.queries";
import { getSubjects } from "@/lib/db/subjects.queries";
import { updateAssignmentAction } from "@/lib/db/assignments.actions";
import { AssignmentForm } from "@/components/assignments/assignment-form";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Edit assignment — Asignly" };

interface PageProps {
  params: Promise<{ id: string }>;
}

function toDateInput(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toISOString().slice(0, 10);
}

function toTimeInput(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default async function EditAssignmentPage({ params }: PageProps) {
  const { id } = await params;
  const [assignment, subjects] = await Promise.all([getAssignment(id), getSubjects()]);
  if (!assignment) notFound();

  const boundUpdate = updateAssignmentAction.bind(null, id);

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text">Edit assignment</h1>
        <p className="mt-1 text-sm text-text-secondary">Update the details for &quot;{assignment.title}&quot;.</p>
      </div>
      <AssignmentForm
        subjects={subjects}
        defaultValues={{
          title: assignment.title,
          subjectId: assignment.subject_id ?? subjects[0]?.id ?? "",
          description: assignment.description ?? "",
          dueDate: toDateInput(assignment.due_at),
          dueTime: toTimeInput(assignment.due_at),
          priority: assignment.priority,
          estimatedMinutes: assignment.estimated_minutes ?? "",
        }}
        submitLabel="Save changes"
        successMessage="Assignment updated."
        onCancelHref={`/assignments/${id}`}
        onSubmit={boundUpdate}
      />
    </div>
  );
}
