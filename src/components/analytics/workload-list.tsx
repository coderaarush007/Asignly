import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import type { SubjectWorkload } from "@/lib/analytics";

export function WorkloadList({ items }: { items: SubjectWorkload[] }) {
  return (
    <Card className="p-5">
      <div className="mb-4">
        <h2 className="text-sm font-bold text-text">Workload by subject</h2>
        <p className="text-xs text-text-secondary">Assignments and completion, per subject.</p>
      </div>
      {items.length === 0 ? (
        <p className="py-8 text-center text-sm text-text-secondary">Not enough activity yet.</p>
      ) : (
        <div className="space-y-4">
          {items.map(({ subject, total, completed, onTimeRate }) => (
            <div key={subject.id}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 font-semibold text-text">
                  <span className="size-2 rounded-full" style={{ backgroundColor: subject.color }} />
                  {subject.name}
                </span>
                <span className="text-xs text-text-secondary">
                  {completed}/{total} done
                  {onTimeRate !== null && ` · ${onTimeRate}% on-time`}
                </span>
              </div>
              <ProgressBar
                value={total ? Math.round((completed / total) * 100) : 0}
                tone={completed === total ? "success" : "primary"}
              />
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
