import { z } from "zod";

// What we ask Gemini to return. Never trusted as-is — always parsed through
// this schema before it reaches the review form or the database.
export const extractionResultSchema = z.object({
  title: z.string().trim().min(1).max(200),
  subjectGuess: z.string().trim().max(80).nullable().optional(),
  description: z.string().trim().max(1000).nullable().optional(),
  dueDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "must be YYYY-MM-DD")
    .nullable()
    .optional(),
  dueTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "must be HH:MM")
    .nullable()
    .optional(),
  priority: z.enum(["low", "medium", "high"]).nullable().optional(),
  estimatedMinutes: z.number().int().positive().max(10000).nullable().optional(),
});

export type ExtractionResult = z.infer<typeof extractionResultSchema>;

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
export const ACCEPTED_MIME_TYPES = ["image/png", "image/jpeg", "image/jpg"];
