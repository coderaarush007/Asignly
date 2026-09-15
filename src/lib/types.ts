export type AssignmentStatus = "todo" | "in_progress" | "completed";
export type AssignmentPriority = "low" | "medium" | "high";
export type AssignmentSource = "manual" | "ai_scan";

export interface Profile {
  id: string;
  full_name: string | null;
  email: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Subject {
  id: string;
  user_id: string;
  name: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface AssignmentTask {
  id: string;
  assignment_id: string;
  title: string;
  completed: boolean;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface AssignmentAttachment {
  id: string;
  assignment_id: string;
  file_path: string;
  file_name: string;
  mime_type: string;
  created_at: string;
}

export interface Assignment {
  id: string;
  user_id: string;
  subject_id: string | null;
  title: string;
  description: string | null;
  due_at: string | null;
  priority: AssignmentPriority;
  status: AssignmentStatus;
  estimated_minutes: number | null;
  progress: number;
  source: AssignmentSource;
  source_metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

export interface AssignmentWithRelations extends Assignment {
  subject: Subject | null;
  tasks: AssignmentTask[];
}

export interface SubjectWithStats extends Subject {
  assignment_count: number;
  pending_count: number;
  completed_count: number;
  completion_rate: number;
}
