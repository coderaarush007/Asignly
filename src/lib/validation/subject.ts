import { z } from "zod";

export const subjectFormSchema = z.object({
  name: z.string().trim().min(1, "Subject name is required").max(80),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Pick a valid color"),
});

export type SubjectFormValues = z.infer<typeof subjectFormSchema>;
