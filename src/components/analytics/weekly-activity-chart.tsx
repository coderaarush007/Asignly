import { Card } from "@/components/ui/card";
import type { WeeklyActivityPoint } from "@/lib/analytics";

export function WeeklyActivityChart({ points }: { points: WeeklyActivityPoint[] }) {
  const max = Math.max(1, ...points.map((p) => p.completed));
  const total = points.reduce((sum, p) => sum + p.completed, 0);

  return (
    <Card className="p-5">
      <div className="mb-4">
        <h2 className="text-sm font-bold text-text">Weekly activity</h2>
        <p className="text-xs text-text-secondary">Assignments completed per day, last 7 days.</p>
      </div>
      {total === 0 ? (
        <p className="py-8 text-center text-sm text-text-secondary">Not enough activity yet.</p>
      ) : (
        <div className="flex h-40 items-end justify-between gap-2">
          {points.map((point) => (
            <div key={point.date.toISOString()} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex h-32 w-full items-end justify-center">
                <div
                  className="w-full max-w-8 rounded-t-md bg-primary transition-all"
                  style={{ height: `${(point.completed / max) * 100}%`, minHeight: point.completed > 0 ? 4 : 0 }}
                  title={`${point.completed} completed`}
                />
              </div>
              <span className="text-[11px] font-medium text-text-muted">{point.label}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
