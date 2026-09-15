"use server";

import { createClient } from "@/lib/supabase/server";
import { taskTitleSchema } from "@/lib/validation/assignment";
import { revalidatePath } from "next/cache";

export interface ActionResult {
  error: string | null;
}

function revalidateAssignment(id: string) {
  revalidatePath(`/assignments/${id}`);
  revalidatePath("/assignments");
  revalidatePath("/dashboard");
  revalidatePath("/subjects");
  revalidatePath("/analytics");
  revalidatePath("/calendar");
}

// Subtask-derived progress: when an assignment has tasks, its progress and
// status follow the completed/total ratio rather than manual input.
async function recomputeFromTasks(supabase: Awaited<ReturnType<typeof createClient>>, assignmentId: string) {
  const { data: tasks, error } = await supabase
    .from("assignment_tasks")
    .select("completed")
    .eq("assignment_id", assignmentId);
  if (error || !tasks || tasks.length === 0) return;

  const completed = tasks.filter((t) => t.completed).length;
  const progress = Math.round((completed / tasks.length) * 100);
  const status = progress === 100 ? "completed" : progress > 0 ? "in_progress" : "todo";

  await supabase
    .from("assignments")
    .update({
      progress,
      status,
      completed_at: status === "completed" ? new Date().toISOString() : null,
    })
    .eq("id", assignmentId);
}

export async function addTaskAction(assignmentId: string, title: string): Promise<ActionResult> {
  const parsed = taskTitleSchema.safeParse(title);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid task" };

  const supabase = await createClient();
  const { count } = await supabase
    .from("assignment_tasks")
    .select("id", { count: "exact", head: true })
    .eq("assignment_id", assignmentId);

  const { error } = await supabase.from("assignment_tasks").insert({
    assignment_id: assignmentId,
    title: parsed.data,
    position: count ?? 0,
  });

  if (error) return { error: error.message };
  await recomputeFromTasks(supabase, assignmentId);
  revalidateAssignment(assignmentId);
  return { error: null };
}

export async function toggleTaskAction(
  taskId: string,
  assignmentId: string,
  completed: boolean,
): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("assignment_tasks")
    .update({ completed })
    .eq("id", taskId);

  if (error) return { error: error.message };
  await recomputeFromTasks(supabase, assignmentId);
  revalidateAssignment(assignmentId);
  return { error: null };
}

export async function updateTaskTitleAction(
  taskId: string,
  assignmentId: string,
  title: string,
): Promise<ActionResult> {
  const parsed = taskTitleSchema.safeParse(title);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid task" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("assignment_tasks")
    .update({ title: parsed.data })
    .eq("id", taskId);

  if (error) return { error: error.message };
  revalidateAssignment(assignmentId);
  return { error: null };
}

export async function deleteTaskAction(taskId: string, assignmentId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("assignment_tasks").delete().eq("id", taskId);

  if (error) return { error: error.message };
  await recomputeFromTasks(supabase, assignmentId);
  revalidateAssignment(assignmentId);
  return { error: null };
}
