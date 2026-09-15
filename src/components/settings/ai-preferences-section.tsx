"use client";

import { Sparkles } from "lucide-react";
import { SettingsSection, SettingsRow } from "@/components/settings/settings-section";
import { Select } from "@/components/ui/select";
import { useLocalSetting } from "@/lib/hooks/use-local-setting";

const PRIORITY_OPTIONS = [
  { value: "low", label: "Low", swatch: "var(--color-text-muted)" },
  { value: "medium", label: "Medium", swatch: "var(--color-warning)" },
  { value: "high", label: "High", swatch: "var(--color-danger)" },
];

export function AiPreferencesSection() {
  const [defaultPriority, setDefaultPriority] = useLocalSetting<"low" | "medium" | "high">(
    "ai-default-priority",
    "medium",
  );

  return (
    <SettingsSection
      icon={Sparkles}
      title="AI preferences"
      description="Controls for the screenshot scanner."
    >
      <SettingsRow
        label="Default priority"
        description="Used when the AI can't tell priority from the screenshot."
        control={
          <Select
            value={defaultPriority}
            onChange={(value) => setDefaultPriority(value as "low" | "medium" | "high")}
            options={PRIORITY_OPTIONS}
            aria-label="Default priority"
            className="w-32"
          />
        }
      />
    </SettingsSection>
  );
}
