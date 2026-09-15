import { createClient } from "@/lib/supabase/server";
import type { Subject, SubjectWithStats } from "@/lib/types";

export async function getSubjects(): Promise<Subject[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("subjects")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw error;
  return data;
}

export async function getSubjectsWithStats(): Promise<SubjectWithStats[]> {
  const supabase = await createClient();
  const [{ data: subjects, error: subjectsError }, { data: assignments, error: assignmentsError }] =
    await Promise.all([
      supabase.from("subjects").select("*").order("name", { ascending: true }),
      supabase.from("assignments").select("subject_id, status"),
    ]);

  if (subjectsError) throw subjectsError;
  if (assignmentsError) throw assignmentsError;

  return (subjects ?? []).map((subject) => {
    const related = (assignments ?? []).filter((a) => a.subject_id === subject.id);
    const completed = related.filter((a) => a.status === "completed").length;
    const pending = related.length - completed;
    return {
      ...subject,
      assignment_count: related.length,
      pending_count: pending,
      completed_count: completed,
      completion_rate: related.length ? Math.round((completed / related.length) * 100) : 0,
    };
  });
}

export async function getSubject(id: string): Promise<Subject | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("subjects").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}
