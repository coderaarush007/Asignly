import { createClient } from "@/lib/supabase/server";
import type { AssignmentWithRelations } from "@/lib/types";

export interface AssignmentFilters {
  search?: string;
  subjectId?: string;
  priority?: string;
  status?: string;
}

function withRelationsQuery(supabase: Awaited<ReturnType<typeof createClient>>) {
  return supabase
    .from("assignments")
    .select("*, subject:subjects(*), tasks:assignment_tasks(*)");
}

export async function getAssignments(filters: AssignmentFilters = {}): Promise<AssignmentWithRelations[]> {
  const supabase = await createClient();
  let query = withRelationsQuery(supabase).order("due_at", { ascending: true, nullsFirst: false });

  if (filters.subjectId) query = query.eq("subject_id", filters.subjectId);
  if (filters.priority) query = query.eq("priority", filters.priority);
  if (filters.status) query = query.eq("status", filters.status);
  if (filters.search) query = query.ilike("title", `%${filters.search}%`);

  const { data, error } = await query;
  if (error) throw error;

  return (data as AssignmentWithRelations[]).map((a) => ({
    ...a,
    tasks: (a.tasks ?? []).sort((x, y) => x.position - y.position),
  }));
}

export async function getAssignment(id: string): Promise<AssignmentWithRelations | null> {
  const supabase = await createClient();
  const { data, error } = await withRelationsQuery(supabase).eq("id", id).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const assignment = data as AssignmentWithRelations;
  return { ...assignment, tasks: (assignment.tasks ?? []).sort((x, y) => x.position - y.position) };
}
