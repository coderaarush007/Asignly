"use server";

import { createClient } from "@/lib/supabase/server";
import { subjectFormSchema } from "@/lib/validation/subject";
import { revalidatePath } from "next/cache";

export interface ActionResult {
  error: string | null;
}

export async function createSubjectAction(input: unknown): Promise<ActionResult> {
  const parsed = subjectFormSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid subject" };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase.from("subjects").insert({
    user_id: user.id,
    name: parsed.data.name,
    color: parsed.data.color,
  });

  if (error) return { error: error.message };
  revalidatePath("/subjects");
  revalidatePath("/dashboard");
  return { error: null };
}

export async function updateSubjectAction(id: string, input: unknown): Promise<ActionResult> {
  const parsed = subjectFormSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid subject" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("subjects")
    .update({ name: parsed.data.name, color: parsed.data.color })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/subjects");
  revalidatePath("/dashboard");
  return { error: null };
}

export async function deleteSubjectAction(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("subjects").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/subjects");
  revalidatePath("/assignments");
  revalidatePath("/dashboard");
  return { error: null };
}
