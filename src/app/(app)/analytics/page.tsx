import { getAssignments } from "@/lib/db/assignments.queries";
import { getSubjects } from "@/lib/db/subjects.queries";
import { getAnalyticsSummary, getWeeklyActivity, getWorkloadBySubject } from "@/lib/analytics";
import { MetricCard } from "@/components/dashboard/metric-card";
import { WeeklyActivityChart } from "@/components/analytics/weekly-activity-chart";
import { WorkloadList } from "@/components/analytics/workload-list";
import { EmptyState } from "@/components/ui/empty-state";
import { TrendingUp, CheckCircle2, Hourglass, Loader, AlertTriangle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Analytics — Asignly" };

export default async function AnalyticsPage() {
  const [assignments, subjects] = await Promise.all([getAssignments(), getSubjects()]);
  const summary = getAnalyticsSummary(assignments);
  const weekly = getWeeklyActivity(assignments);
  const workload = getWorkloadBySubject(assignments, subjects);

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-primary">Performance insights</p>
        <h1 className="text-2xl font-bold tracking-tight text-text sm:text-[28px]">Analytics</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Completion trends and subject workload, from your real activity.
        </p>
      </div>

      {summary.total === 0 ? (
        <EmptyState
          icon={TrendingUp}
          title="Not enough activity yet"
          description="Add and complete a few assignments to see your analytics here."
        />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
            <MetricCard
              label="Completion Rate"
              value={summary.completionRate}
              suffix="%"
              icon={TrendingUp}
              accent="primary"
            />
            <MetricCard label="Completed" value={summary.completed} icon={CheckCircle2} accent="success" />
            <MetricCard label="Pending" value={summary.pending} icon={Hourglass} accent="warning" />
            <MetricCard label="In Progress" value={summary.inProgress} icon={Loader} accent="primary" />
            <MetricCard label="Overdue" value={summary.overdue} icon={AlertTriangle} accent="danger" />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <WeeklyActivityChart points={weekly} />
            <WorkloadList items={workload} />
          </div>
        </>
      )}
    </div>
  );
}
