"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SubjectBadge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { buildMonthGrid, isSameMonth } from "@/lib/calendar";
import { cn, formatDueDate, isOverdue, isSameDay } from "@/lib/utils";
import type { AssignmentWithRelations } from "@/lib/types";

type View = "month" | "agenda";

export function CalendarView({ assignments }: { assignments: AssignmentWithRelations[] }) {
  const today = useMemo(() => new Date(), []);
  const [view, setView] = useState<View>("month");
  const [monthCursor, setMonthCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState<Date>(today);

  const withDueDate = assignments.filter((a) => a.due_at);
  const grid = useMemo(() => buildMonthGrid(monthCursor), [monthCursor]);

  const assignmentsByDay = useMemo(() => {
    const map = new Map<string, AssignmentWithRelations[]>();
    for (const a of withDueDate) {
      const key = new Date(a.due_at!).toDateString();
      const list = map.get(key) ?? [];
      list.push(a);
      map.set(key, list);
    }
    return map;
  }, [withDueDate]);

  const selectedAssignments = (assignmentsByDay.get(selectedDate.toDateString()) ?? []).sort(
    (a, b) => new Date(a.due_at!).getTime() - new Date(b.due_at!).getTime(),
  );

  const agendaItems = withDueDate
    .filter((a) => a.status !== "completed")
    .sort((a, b) => new Date(a.due_at!).getTime() - new Date(b.due_at!).getTime());

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex overflow-hidden rounded-lg border border-border">
            <button
              type="button"
              onClick={() => setView("month")}
              className={cn(
                "px-3 py-1.5 text-[13px] font-semibold transition-colors",
                view === "month" ? "bg-primary text-white" : "bg-surface text-text-secondary hover:bg-surface-hover",
              )}
            >
              Month
            </button>
            <button
              type="button"
              onClick={() => setView("agenda")}
              className={cn(
                "px-3 py-1.5 text-[13px] font-semibold transition-colors",
                view === "agenda" ? "bg-primary text-white" : "bg-surface text-text-secondary hover:bg-surface-hover",
              )}
            >
              Agenda
            </button>
          </div>
          {view === "month" && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="Previous month"
                onClick={() => setMonthCursor(new Date(monthCursor.getFullYear(), monthCursor.getMonth() - 1, 1))}
                className="flex size-8 items-center justify-center rounded-lg text-text-secondary hover:bg-surface-hover"
              >
                <ChevronLeft className="size-4" aria-hidden />
              </button>
              <span className="min-w-32 text-center text-sm font-bold text-text">
                {monthCursor.toLocaleDateString(undefined, { month: "long", year: "numeric" })}
              </span>
              <button
                type="button"
                aria-label="Next month"
                onClick={() => setMonthCursor(new Date(monthCursor.getFullYear(), monthCursor.getMonth() + 1, 1))}
                className="flex size-8 items-center justify-center rounded-lg text-text-secondary hover:bg-surface-hover"
              >
                <ChevronRight className="size-4" aria-hidden />
              </button>
            </div>
          )}
        </div>
        {view === "month" && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setMonthCursor(new Date(today.getFullYear(), today.getMonth(), 1));
              setSelectedDate(today);
            }}
          >
            Today
          </Button>
        )}
      </div>

      {view === "month" ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="overflow-hidden lg:col-span-2">
            <div className="grid grid-cols-7 border-b border-border text-center text-[11px] font-bold uppercase tracking-wider text-text-muted">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                <div key={d} className="py-2">
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {grid.map((date) => {
                const inMonth = isSameMonth(date, monthCursor);
                const dayAssignments = assignmentsByDay.get(date.toDateString()) ?? [];
                const isToday = isSameDay(date, today);
                const isSelected = isSameDay(date, selectedDate);
                return (
                  <button
                    key={date.toISOString()}
                    type="button"
                    onClick={() => setSelectedDate(date)}
                    className={cn(
                      "flex min-h-20 flex-col items-start gap-1 border-b border-r border-border p-2 text-left transition-colors hover:bg-surface-hover",
                      !inMonth && "bg-surface-hover/50 text-text-muted",
                      isSelected && "bg-primary-tint",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-6 items-center justify-center rounded-full text-xs font-semibold",
                        isToday ? "bg-primary text-white" : inMonth ? "text-text" : "text-text-muted",
                      )}
                    >
                      {date.getDate()}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {dayAssignments.slice(0, 3).map((a) => (
                        <span
                          key={a.id}
                          className="size-1.5 rounded-full"
                          style={{ backgroundColor: a.subject?.color ?? "var(--color-primary)" }}
                        />
                      ))}
                      {dayAssignments.length > 3 && (
                        <span className="text-[10px] font-semibold text-text-muted">
                          +{dayAssignments.length - 3}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card className="p-4">
            <p className="mb-3 text-sm font-bold text-text">
              {selectedDate.toLocaleDateString(undefined, {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
            {selectedAssignments.length === 0 ? (
              <p className="text-sm text-text-secondary">Nothing due this day.</p>
            ) : (
              <div className="space-y-2">
                {selectedAssignments.map((a) => (
                  <Link
                    key={a.id}
                    href={`/assignments/${a.id}`}
                    className="block rounded-xl border border-border p-3 transition-colors hover:border-primary hover:bg-primary-tint"
                  >
                    <div className="mb-1 flex items-center justify-between">
                      {a.subject && <SubjectBadge name={a.subject.name} color={a.subject.color} />}
                      <span className="text-xs text-text-secondary">{formatDueDate(a.due_at)}</span>
                    </div>
                    <p className="text-sm font-semibold text-text">{a.title}</p>
                  </Link>
                ))}
              </div>
            )}
          </Card>
        </div>
      ) : agendaItems.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="Nothing upcoming"
          description="Assignments with a due date will show up here, soonest first."
        />
      ) : (
        <Card className="divide-y divide-border">
          {agendaItems.map((a) => (
            <Link
              key={a.id}
              href={`/assignments/${a.id}`}
              className="flex items-center justify-between gap-3 p-4 transition-colors hover:bg-surface-hover"
            >
              <div className="min-w-0">
                <div className="mb-1 flex items-center gap-2">
                  {a.subject && <SubjectBadge name={a.subject.name} color={a.subject.color} />}
                  <span
                    className={cn(
                      "text-xs font-semibold",
                      isOverdue(a) ? "text-danger" : "text-text-secondary",
                    )}
                  >
                    {formatDueDate(a.due_at)}
                  </span>
                </div>
                <p className="truncate text-sm font-semibold text-text">{a.title}</p>
              </div>
            </Link>
          ))}
        </Card>
      )}
    </div>
  );
}
