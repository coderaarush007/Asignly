"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { assignmentFormSchema, type AssignmentFormValues } from "@/lib/validation/assignment";
import { Input, Label, Textarea, FieldError } from "@/components/ui/field";
import { Select } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { TimePicker } from "@/components/ui/time-picker";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { SubjectDialog } from "@/components/subjects/subject-dialog";
import type { DialogHandle } from "@/components/ui/dialog";
import type { Subject } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { BookOpen, Plus } from "lucide-react";

interface AssignmentFormProps {
  subjects: Subject[];
  defaultValues?: Partial<AssignmentFormValues>;
  onSubmit: (values: AssignmentFormValues) => Promise<{ error: string | null; id?: string }>;
  submitLabel: string;
  successMessage: string;
  onCancelHref?: string;
}

const PRIORITY_OPTIONS = [
  { value: "low", label: "Low", swatch: "var(--color-text-muted)" },
  { value: "medium", label: "Medium", swatch: "var(--color-warning)" },
  { value: "high", label: "High", swatch: "var(--color-danger)" },
];

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
  const [localSubjects, setLocalSubjects] = useState(subjects);
  const subjectDialogRef = useRef<DialogHandle>(null);
  const {
    register,
    handleSubmit,
    control,
    setValue,
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

  const subjectOptions = localSubjects.map((s) => ({ value: s.id, label: s.name, swatch: s.color }));

  function handleSubjectCreated(subject: Subject) {
    setLocalSubjects((prev) => [...prev, subject]);
    setValue("subjectId", subject.id, { shouldValidate: true });
  }

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

  if (localSubjects.length === 0) {
    return (
      <>
        <EmptyState
          icon={BookOpen}
          title="No subjects yet"
          description="Assignments need a subject. Create one, then come back here."
          action={<Button onClick={() => subjectDialogRef.current?.show()}>Create a subject</Button>}
        />
        <SubjectDialog ref={subjectDialogRef} onCreated={handleSubjectCreated} />
      </>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit(submit)} className="space-y-5">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" placeholder="e.g. Chapter 5 Numericals" {...register("title")} />
          <FieldError>{errors.title?.message}</FieldError>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="subjectId" className="block text-[13px] font-semibold text-text">
                Subject
              </label>
              <button
                type="button"
                onClick={() => subjectDialogRef.current?.show()}
                className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80"
              >
                <Plus className="size-3.5" aria-hidden />
                New subject
              </button>
            </div>
            <Controller
              name="subjectId"
              control={control}
              render={({ field }) => (
                <Select
                  id="subjectId"
                  aria-label="Subject"
                  value={field.value}
                  onChange={field.onChange}
                  options={subjectOptions}
                  placeholder="Choose a subject"
                />
              )}
            />
            <FieldError>{errors.subjectId?.message}</FieldError>
          </div>
          <div>
            <Label htmlFor="priority">Priority</Label>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <Select
                  id="priority"
                  aria-label="Priority"
                  value={field.value}
                  onChange={field.onChange}
                  options={PRIORITY_OPTIONS}
                />
              )}
            />
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
            <Controller
              name="dueDate"
              control={control}
              render={({ field }) => (
                <DatePicker id="dueDate" aria-label="Due date" value={field.value ?? ""} onChange={field.onChange} />
              )}
            />
          </div>
          <div>
            <Label htmlFor="dueTime">Due time</Label>
            <Controller
              name="dueTime"
              control={control}
              render={({ field }) => (
                <TimePicker id="dueTime" aria-label="Due time" value={field.value ?? ""} onChange={field.onChange} />
              )}
            />
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
      <SubjectDialog ref={subjectDialogRef} onCreated={handleSubjectCreated} />
    </>
  );
}
