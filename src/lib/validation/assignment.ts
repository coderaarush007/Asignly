import { z } from "zod";

export const assignmentFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  subjectId: z.string().uuid("Choose a subject"),
  description: z.string().trim().max(2000).optional().or(z.literal("")),
  dueDate: z.string().optional().or(z.literal("")),
  dueTime: z.string().optional().or(z.literal("")),
  priority: z.enum(["low", "medium", "high"]),
  estimatedMinutes: z
    .union([z.literal(""), z.coerce.number().int().positive().max(10000)])
    .optional(),
});

export type AssignmentFormValues = z.infer<typeof assignmentFormSchema>;

export const taskTitleSchema = z.string().trim().min(1, "Task title is required").max(200);
