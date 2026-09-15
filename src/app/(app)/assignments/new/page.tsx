import { getSubjects } from "@/lib/db/subjects.queries";
import { createAssignmentAction } from "@/lib/db/assignments.actions";
import { AssignmentForm } from "@/components/assignments/assignment-form";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Add assignment — Assignment." };

export default async function NewAssignmentPage() {
  const subjects = await getSubjects();

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text">Add assignment</h1>
        <p className="mt-1 text-sm text-text-secondary">Fill in the details for your new assignment.</p>
      </div>
      <AssignmentForm
        subjects={subjects}
        submitLabel="Create assignment"
        successMessage="Assignment created."
        onCancelHref="/assignments"
        onSubmit={createAssignmentAction}
      />
    </div>
  );
}
