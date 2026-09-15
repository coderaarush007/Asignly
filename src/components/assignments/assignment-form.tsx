"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { assignmentFormSchema, type AssignmentFormValues } from "@/lib/validation/assignment";
import { Input, Label, Select, Textarea, FieldError } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import type { Subject } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface AssignmentFormProps {
  subjects: Subject[];
  defaultValues?: Partial<AssignmentFormValues>;
  onSubmit: (values: AssignmentFormValues) => Promise<{ error: string | null; id?: string }>;
  submitLabel: string;
  successMessage: string;
  onCancelHref?: string;
}

export function AssignmentForm({
  subjects,
  defaultValues,
  onSubmit,
  submitLabel,
  successMessage,
  onCancelHref,
}: AssignmentFormProps) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AssignmentFormValues>({
    resolver: zodResolver(assignmentFormSchema),
    defaultValues: {
      title: "",
      subjectId: subjects[0]?.id ?? "",
      description: "",
      dueDate: "",
      dueTime: "",
      priority: "medium",
      estimatedMinutes: "",
      ...defaultValues,
    },
  });

  async function submit(values: AssignmentFormValues) {
    setFormError(null);
    const result = await onSubmit(values);
    if (result.error) {
      setFormError(result.error);
      return;
    }
    toast.success(successMessage);
    router.push(`/assignments/${result.id}`);
    router.refresh();
  }

  if (subjects.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-6 text-center">
        <p className="text-sm font-semibold text-text">Add a subject first</p>
        <p className="mt-1 text-sm text-text-secondary">
          Assignments need a subject. Create one, then come back here.
        </p>
        <Button className="mt-4" onClick={() => router.push("/subjects")}>
          Go to Subjects
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-5">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" placeholder="e.g. Chapter 5 Numericals" {...register("title")} />
        <FieldError>{errors.title?.message}</FieldError>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="subjectId">Subject</Label>
          <Select id="subjectId" {...register("subjectId")}>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </Select>
          <FieldError>{errors.subjectId?.message}</FieldError>
        </div>
        <div>
          <Label htmlFor="priority">Priority</Label>
          <Select id="priority" {...register("priority")}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" placeholder="What needs to get done?" {...register("description")} />
        <FieldError>{errors.description?.message}</FieldError>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="dueDate">Due date</Label>
          <Input id="dueDate" type="date" {...register("dueDate")} />
        </div>
        <div>
          <Label htmlFor="dueTime">Due time</Label>
          <Input id="dueTime" type="time" {...register("dueTime")} />
        </div>
        <div>
          <Label htmlFor="estimatedMinutes">Est. time (min)</Label>
          <Input
            id="estimatedMinutes"
            type="number"
            min={1}
            placeholder="60"
            {...register("estimatedMinutes")}
          />
          <FieldError>{errors.estimatedMinutes?.message as string | undefined}</FieldError>
        </div>
      </div>

      <FieldError>{formError ?? undefined}</FieldError>

      <div className="flex items-center justify-end gap-2 pt-2">
        {onCancelHref && (
          <Button type="button" variant="secondary" onClick={() => router.push(onCancelHref)}>
            Cancel
          </Button>
        )}
        <Button type="submit" loading={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
