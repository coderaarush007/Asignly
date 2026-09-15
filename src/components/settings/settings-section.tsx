import { Card } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

export function SettingsSection({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="p-5">
      <div className="mb-4 flex items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary-tint text-primary">
          <Icon className="size-[18px]" aria-hidden />
        </div>
        <div>
          <h2 className="text-sm font-bold text-text">{title}</h2>
          <p className="text-xs text-text-secondary">{description}</p>
        </div>
      </div>
      {children}
    </Card>
  );
}

export function SettingsRow({
  label,
  description,
  control,
}: {
  label: string;
  description?: string;
  control: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5 first:pt-0 last:pb-0">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-text">{label}</p>
        {description && <p className="text-xs text-text-secondary">{description}</p>}
      </div>
      {control}
    </div>
  );
}
