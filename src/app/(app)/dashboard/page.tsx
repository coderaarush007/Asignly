import Link from "next/link";
import { CalendarClock, CalendarRange, CheckCircle2, Gauge, ArrowRight, CalendarCheck } from "lucide-react";
import { getAssignments } from "@/lib/db/assignments.queries";
import { getCurrentProfile } from "@/lib/db/profile.queries";
import {
  getDashboardMetrics,
  getTodayAssignments,
  getTodayFocus,
  getTomorrowAssignments,
} from "@/lib/analytics";
import { MetricCard } from "@/components/dashboard/metric-card";
import { TodayFocus } from "@/components/dashboard/today-focus";
import { AssignmentCard } from "@/components/assignments/assignment-card";
import { AddAssignmentButton } from "@/components/assignments/add-assignment-button";
import { DueTodayNotifier } from "@/components/dashboard/due-today-notifier";
import { EmptyState } from "@/components/ui/empty-state";
import { SubjectBadge } from "@/components/ui/badge";
import { formatDueDate, greetingForTime, firstName } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard — Assignment." };

export default async function DashboardPage() {
  const [assignments, { profile }] = await Promise.all([getAssignments(), getCurrentProfile()]);

  const metrics = getDashboardMetrics(assignments);
  const today = getTodayAssignments(assignments);
  const tomorrow = getTomorrowAssignments(assignments);
  const focus = getTodayFocus(assignments);

  const name = firstName(profile?.full_name) ?? "there";
  const now = new Date();
  const dateLabel = now.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-8">
      <DueTodayNotifier dueTodayCount={metrics.dueToday} />
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-primary">{dateLabel}</p>
          <h1 className="text-2xl font-bold tracking-tight text-text sm:text-[28px]">
            {greetingForTime(now)}, {name}
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            {today.length > 0
              ? `You have ${today.length} assignment${today.length === 1 ? "" : "s"} due today.`
              : "Nothing due today — a good day to get ahead."}
          </p>
        </div>
        <div className="hidden md:block">
          <AddAssignmentButton />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard label="Due Today" value={metrics.dueToday} icon={CalendarClock} accent="danger" />
        <MetricCard label="Due This Week" value={metrics.dueThisWeek} icon={CalendarRange} accent="primary" />
        <MetricCard label="Completed" value={metrics.completed} icon={CheckCircle2} accent="success" />
        <MetricCard
          label="Overall Progress"
          value={metrics.overallProgress}
          suffix="%"
          icon={Gauge}
          accent="warning"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-text">Today&apos;s assignments</h2>
            <Link href="/assignments" className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
              View all
              <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          </div>

          {today.length === 0 ? (
            <EmptyState
              icon={CalendarCheck}
              title="Nothing due today"
              description="Assignments due today will show up here."
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {today.map((a) => (
                <AssignmentCard key={a.id} assignment={a} />
              ))}
            </div>
          )}

          {tomorrow.length > 0 && (
            <div className="pt-2">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-text-muted">
                Upcoming tomorrow
              </p>
              <div className="divide-y divide-border rounded-2xl border border-border bg-surface">
                {tomorrow.map((a) => (
                  <Link
                    key={a.id}
                    href={`/assignments/${a.id}`}
                    className="flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-surface-hover"
                  >
                    <div className="min-w-0">
                      <div className="mb-1 flex items-center gap-2">
                        {a.subject && <SubjectBadge name={a.subject.name} color={a.subject.color} />}
                        <span className="text-xs text-text-secondary">{formatDueDate(a.due_at)}</span>
                      </div>
                      <p className="truncate text-sm font-semibold text-text">{a.title}</p>
                    </div>
                    <ArrowRight className="size-4 shrink-0 text-text-muted" aria-hidden />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <TodayFocus assignment={focus} />
        </div>
      </div>
    </div>
  );
}
