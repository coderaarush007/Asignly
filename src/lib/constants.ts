import type { AssignmentPriority, AssignmentStatus } from "@/lib/types";

export const SUBJECT_COLORS = [
  { name: "Indigo", value: "#6366f1" },
  { name: "Cyan", value: "#06b6d4" },
  { name: "Emerald", value: "#10b981" },
  { name: "Violet", value: "#8b5cf6" },
  { name: "Amber", value: "#f59e0b" },
  { name: "Pink", value: "#ec4899" },
  { name: "Rose", value: "#f43f5e" },
  { name: "Teal", value: "#14b8a6" },
] as const;

export const DEFAULT_SUBJECT_COLOR = SUBJECT_COLORS[0].value;

export const PRIORITY_LABELS: Record<AssignmentPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export const PRIORITY_ORDER: Record<AssignmentPriority, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

export const STATUS_LABELS: Record<AssignmentStatus, string> = {
  todo: "To Do",
  in_progress: "In Progress",
  completed: "Completed",
};

export const SOURCE_LABELS: Record<string, string> = {
  manual: "Added manually",
  ai_scan: "AI scanned",
};

export const SEED_SUBJECTS = [
  { name: "Physics", color: "#6366f1" },
  { name: "Mathematics", color: "#06b6d4" },
  { name: "Chemistry", color: "#10b981" },
  { name: "Programming", color: "#8b5cf6" },
  { name: "BEEE", color: "#f59e0b" },
  { name: "English", color: "#ec4899" },
] as const;
