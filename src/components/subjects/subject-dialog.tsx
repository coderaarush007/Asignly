"use client";

import { forwardRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, type DialogHandle } from "@/components/ui/dialog";
import { Input, Label, FieldError } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { subjectFormSchema, type SubjectFormValues } from "@/lib/validation/subject";
import { SUBJECT_COLORS, DEFAULT_SUBJECT_COLOR } from "@/lib/constants";
import { createSubjectAction, updateSubjectAction } from "@/lib/db/subjects.actions";
import { cn } from "@/lib/utils";
import type { Subject } from "@/lib/types";

interface SubjectDialogProps {
  subject?: Subject;
  onCreated?: (subject: Subject) => void;
}

export const SubjectDialog = forwardRef<DialogHandle, SubjectDialogProps>(({ subject, onCreated }, ref) => {
  const router = useRouter();
  const isEdit = Boolean(subject);
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SubjectFormValues>({
    resolver: zodResolver(subjectFormSchema),
    defaultValues: { name: subject?.name ?? "", color: subject?.color ?? DEFAULT_SUBJECT_COLOR },
  });
  const color = watch("color");

  async function submit(values: SubjectFormValues) {
    setFormError(null);
    const result = isEdit
      ? await updateSubjectAction(subject!.id, values)
      : await createSubjectAction(values);
    if (result.error) {
      setFormError(result.error);
      return;
    }
    toast.success(isEdit ? "Subject updated." : "Subject created.");
    (ref as React.RefObject<DialogHandle>).current?.close();
    if (!isEdit) {
      reset({ name: "", color: DEFAULT_SUBJECT_COLOR });
      if (result.subject) onCreated?.(result.subject);
    }
    router.refresh();
  }

  return (
    <Dialog ref={ref} title={isEdit ? "Edit subject" : "New subject"} className="max-w-md">
      <form onSubmit={handleSubmit(submit)} className="space-y-4">
        <div>
          <Label htmlFor="subject-name">Name</Label>
          <Input id="subject-name" placeholder="e.g. Physics" {...register("name")} />
          <FieldError>{errors.name?.message}</FieldError>
        </div>
        <div>
          <Label>Color</Label>
          <div className="flex flex-wrap gap-2">
            {SUBJECT_COLORS.map((c) => (
              <button
                key={c.value}
                type="button"
                aria-label={c.name}
                onClick={() => setValue("color", c.value, { shouldValidate: true })}
                className={cn(
                  "size-8 rounded-full border-2 transition-transform",
                  color === c.value ? "scale-110 border-text" : "border-transparent",
                )}
                style={{ backgroundColor: c.value }}
              />
            ))}
          </div>
          <FieldError>{errors.color?.message}</FieldError>
        </div>
        <FieldError>{formError ?? undefined}</FieldError>
        <div className="flex justify-end gap-2 pt-1">
          <Button
            type="button"
            variant="secondary"
            onClick={() => (ref as React.RefObject<DialogHandle>).current?.close()}
          >
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting}>
            {isEdit ? "Save changes" : "Create subject"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
});
SubjectDialog.displayName = "SubjectDialog";
