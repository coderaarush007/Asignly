"use server";

import { createClient } from "@/lib/supabase/server";
import { assignmentFormSchema, type AssignmentFormValues } from "@/lib/validation/assignment";
import { revalidatePath } from "next/cache";
import type { AssignmentSource } from "@/lib/types";

export interface ActionResult {
  error: string | null;
  id?: string;
}

function combineDueAt(dueDate?: string, dueTime?: string): string | null {
  if (!dueDate) return null;
  const time = dueTime && dueTime.length > 0 ? dueTime : "23:59";
  const date = new Date(`${dueDate}T${time}:00`);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

function revalidateAssignmentPaths(id?: string) {
  revalidatePath("/dashboard");
  revalidatePath("/assignments");
  revalidatePath("/calendar");
  revalidatePath("/subjects");
  revalidatePath("/analytics");
  if (id) revalidatePath(`/assignments/${id}`);
}

export async function createAssignmentAction(
  input: AssignmentFormValues,
  source: AssignmentSource = "manual",
  sourceMetadata: Record<string, unknown> | null = null,
): Promise<ActionResult> {
  const parsed = assignmentFormSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid assignment" };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data, error } = await supabase
    .from("assignments")
    .insert({
      user_id: user.id,
      subject_id: parsed.data.subjectId,
      title: parsed.data.title,
      description: parsed.data.description || null,
      due_at: combineDueAt(parsed.data.dueDate, parsed.data.dueTime),
      priority: parsed.data.priority,
      estimated_minutes: parsed.data.estimatedMinutes || null,
      source,
      source_metadata: sourceMetadata,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };
  revalidateAssignmentPaths(data.id);
  return { error: null, id: data.id };
}

export async function updateAssignmentAction(
  id: string,
  input: AssignmentFormValues,
): Promise<ActionResult> {
  const parsed = assignmentFormSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid assignment" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("assignments")
    .update({
      subject_id: parsed.data.subjectId,
      title: parsed.data.title,
      description: parsed.data.description || null,
      due_at: combineDueAt(parsed.data.dueDate, parsed.data.dueTime),
      priority: parsed.data.priority,
      estimated_minutes: parsed.data.estimatedMinutes || null,
    })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidateAssignmentPaths(id);
  return { error: null, id };
}

export async function deleteAssignmentAction(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("assignments").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidateAssignmentPaths();
  return { error: null };
}

export async function setAssignmentStatusAction(
  id: string,
  status: "todo" | "in_progress" | "completed",
): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("assignments")
    .update({
      status,
      progress: status === "completed" ? 100 : undefined,
      completed_at: status === "completed" ? new Date().toISOString() : null,
    })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidateAssignmentPaths(id);
  return { error: null };
}

export async function setAssignmentProgressAction(id: string, progress: number): Promise<ActionResult> {
  const clamped = Math.max(0, Math.min(100, Math.round(progress)));
  const supabase = await createClient();
  const { error } = await supabase
    .from("assignments")
    .update({
      progress: clamped,
      status: clamped === 100 ? "completed" : clamped > 0 ? "in_progress" : "todo",
      completed_at: clamped === 100 ? new Date().toISOString() : null,
    })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidateAssignmentPaths(id);
  return { error: null };
}
