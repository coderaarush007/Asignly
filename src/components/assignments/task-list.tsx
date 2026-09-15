"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Trash2, PencilLine, Check, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AssignmentTask } from "@/lib/types";
import {
  addTaskAction,
  toggleTaskAction,
  updateTaskTitleAction,
  deleteTaskAction,
} from "@/lib/db/tasks.actions";

export function TaskList({ assignmentId, tasks }: { assignmentId: string; tasks: AssignmentTask[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [newTitle, setNewTitle] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  function addTask() {
    const title = newTitle.trim();
    if (!title) return;
    setNewTitle("");
    startTransition(async () => {
      const result = await addTaskAction(assignmentId, title);
      if (result.error) toast.error(result.error);
      else router.refresh();
    });
  }

  function toggle(task: AssignmentTask) {
    startTransition(async () => {
      const result = await toggleTaskAction(task.id, assignmentId, !task.completed);
      if (result.error) toast.error(result.error);
      else router.refresh();
    });
  }

  function saveEdit(taskId: string) {
    const title = editValue.trim();
    setEditingId(null);
    if (!title) return;
    startTransition(async () => {
      const result = await updateTaskTitleAction(taskId, assignmentId, title);
      if (result.error) toast.error(result.error);
      else router.refresh();
    });
  }

  function remove(taskId: string) {
    startTransition(async () => {
      const result = await deleteTaskAction(taskId, assignmentId);
      if (result.error) toast.error(result.error);
      else router.refresh();
    });
  }

  return (
    <div className="space-y-1.5">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="group flex items-center gap-3 rounded-xl border border-border px-3 py-2.5"
        >
          <Checkbox checked={task.completed} onChange={() => toggle(task)} disabled={pending} />
          {editingId === task.id ? (
            <div className="flex flex-1 items-center gap-1.5">
              <Input
                autoFocus
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveEdit(task.id);
                  if (e.key === "Escape") setEditingId(null);
                }}
                className="h-8 py-1"
              />
              <button
                type="button"
                onClick={() => saveEdit(task.id)}
                className="flex size-7 items-center justify-center rounded-lg text-success hover:bg-success-tint"
                aria-label="Save task"
              >
                <Check className="size-4" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => setEditingId(null)}
                className="flex size-7 items-center justify-center rounded-lg text-text-muted hover:bg-surface-hover"
                aria-label="Cancel edit"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>
          ) : (
            <>
              <span
                className={cn(
                  "flex-1 text-sm",
                  task.completed ? "text-text-muted line-through" : "text-text",
                )}
              >
                {task.title}
              </span>
              <button
                type="button"
                onClick={() => {
                  setEditingId(task.id);
                  setEditValue(task.title);
                }}
                className="flex size-7 items-center justify-center rounded-lg text-text-muted opacity-0 transition-opacity hover:bg-surface-hover hover:text-text group-hover:opacity-100"
                aria-label="Edit task"
              >
                <PencilLine className="size-3.5" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => remove(task.id)}
                className="flex size-7 items-center justify-center rounded-lg text-text-muted opacity-0 transition-opacity hover:bg-danger-tint hover:text-danger group-hover:opacity-100"
                aria-label="Delete task"
              >
                <Trash2 className="size-3.5" aria-hidden />
              </button>
            </>
          )}
        </div>
      ))}

      <div className="flex items-center gap-1.5 pt-1">
        <Input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          placeholder="Add a task..."
          className="h-9"
        />
        <Button type="button" size="sm" variant="secondary" onClick={addTask} loading={pending}>
          <Plus className="size-4" aria-hidden />
          Add
        </Button>
      </div>
    </div>
  );
}
