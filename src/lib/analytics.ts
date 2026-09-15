import type { Assignment, AssignmentWithRelations, Subject } from "@/lib/types";
import { addDays, isOverdue, isSameDay, startOfDay } from "@/lib/utils";

export interface DashboardMetrics {
  dueToday: number;
  dueThisWeek: number;
  completed: number;
  overallProgress: number;
}

export function getDashboardMetrics(assignments: Assignment[]): DashboardMetrics {
  const now = new Date();
  const today = startOfDay(now);
  const weekEnd = addDays(today, 7);

  const active = assignments.filter((a) => a.status !== "completed");
  const dueToday = active.filter((a) => a.due_at && isSameDay(new Date(a.due_at), now)).length;
  const dueThisWeek = active.filter(
    (a) => a.due_at && new Date(a.due_at) >= today && new Date(a.due_at) < weekEnd,
  ).length;
  const completed = assignments.filter((a) => a.status === "completed").length;
  const overallProgress = assignments.length
    ? Math.round(assignments.reduce((sum, a) => sum + a.progress, 0) / assignments.length)
    : 0;

  return { dueToday, dueThisWeek, completed, overallProgress };
}

export function getTodayAssignments<T extends Assignment>(assignments: T[]): T[] {
  const now = new Date();
  return assignments
    .filter((a) => a.due_at && isSameDay(new Date(a.due_at), now) && a.status !== "completed")
    .sort((a, b) => new Date(a.due_at!).getTime() - new Date(b.due_at!).getTime());
}

export function getTomorrowAssignments<T extends Assignment>(assignments: T[]): T[] {
  const tomorrow = addDays(new Date(), 1);
  return assignments
    .filter((a) => a.due_at && isSameDay(new Date(a.due_at), tomorrow) && a.status !== "completed")
    .sort((a, b) => new Date(a.due_at!).getTime() - new Date(b.due_at!).getTime());
}

const priorityWeight: Record<Assignment["priority"], number> = { high: 0, medium: 1, low: 2 };

export function getTodayFocus<T extends Assignment>(assignments: T[]): T | null {
  const pending = assignments.filter((a) => a.status !== "completed" && a.due_at);
  if (pending.length === 0) return null;

  return [...pending].sort((a, b) => {
    const overdueDiff = Number(isOverdue(b)) - Number(isOverdue(a));
    if (overdueDiff !== 0) return overdueDiff;
    const priorityDiff = priorityWeight[a.priority] - priorityWeight[b.priority];
    if (priorityDiff !== 0) return priorityDiff;
    return new Date(a.due_at!).getTime() - new Date(b.due_at!).getTime();
  })[0];
}

export interface AnalyticsSummary {
  total: number;
  completed: number;
  pending: number;
  inProgress: number;
  overdue: number;
  completionRate: number;
}

export function getAnalyticsSummary(assignments: Assignment[]): AnalyticsSummary {
  const total = assignments.length;
  const completed = assignments.filter((a) => a.status === "completed").length;
  const inProgress = assignments.filter((a) => a.status === "in_progress").length;
  const overdue = assignments.filter((a) => isOverdue(a)).length;
  const pending = total - completed;

  return {
    total,
    completed,
    pending,
    inProgress,
    overdue,
    completionRate: total ? Math.round((completed / total) * 100) : 0,
  };
}

export interface WeeklyActivityPoint {
  label: string;
  date: Date;
  completed: number;
}

export function getWeeklyActivity(assignments: Assignment[]): WeeklyActivityPoint[] {
  const today = startOfDay(new Date());
  const days = Array.from({ length: 7 }, (_, i) => addDays(today, i - 6));

  return days.map((date) => ({
    label: date.toLocaleDateString(undefined, { weekday: "short" }),
    date,
    completed: assignments.filter(
      (a) => a.completed_at && isSameDay(new Date(a.completed_at), date),
    ).length,
  }));
}

export interface SubjectWorkload {
  subject: Subject;
  total: number;
  completed: number;
  onTimeRate: number | null;
}

export function getWorkloadBySubject(
  assignments: AssignmentWithRelations[],
  subjects: Subject[],
): SubjectWorkload[] {
  return subjects
    .map((subject) => {
      const related = assignments.filter((a) => a.subject_id === subject.id);
      const completed = related.filter((a) => a.status === "completed");
      const onTime = completed.filter(
        (a) => !a.due_at || !a.completed_at || new Date(a.completed_at) <= new Date(a.due_at),
      );
      return {
        subject,
        total: related.length,
        completed: completed.length,
        onTimeRate: completed.length ? Math.round((onTime.length / completed.length) * 100) : null,
      };
    })
    .filter((w) => w.total > 0)
    .sort((a, b) => b.total - a.total);
}
