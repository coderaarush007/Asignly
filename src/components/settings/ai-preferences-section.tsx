"use client";

import { Sparkles } from "lucide-react";
import { SettingsSection, SettingsRow } from "@/components/settings/settings-section";
import { Select } from "@/components/ui/field";
import { useLocalSetting } from "@/lib/hooks/use-local-setting";

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
            onChange={(e) => setDefaultPriority(e.target.value as "low" | "medium" | "high")}
            className="w-32"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </Select>
        }
      />
    </SettingsSection>
  );
}
