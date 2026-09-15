import { cn } from "@/lib/utils";

export function ProgressBar({
  value,
  className,
  trackClassName,
  tone = "primary",
}: {
  value: number;
  className?: string;
  trackClassName?: string;
  tone?: "primary" | "success";
}) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn("h-1.5 w-full overflow-hidden rounded-full bg-surface-hover", trackClassName)}
    >
      <div
        className={cn(
          "h-full rounded-full transition-[width] duration-300",
          tone === "success" ? "bg-success" : "bg-primary",
          className,
        )}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
