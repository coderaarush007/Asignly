"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Monitor, Palette } from "lucide-react";
import { SettingsSection } from "@/components/settings/settings-section";
import { cn } from "@/lib/utils";

const OPTIONS = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

export function AppearanceSection() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  // Deferred to after mount to avoid a hydration mismatch with the server's theme-less render.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  return (
    <SettingsSection icon={Palette} title="Appearance" description="Choose how Asignly looks.">
      <div className="grid grid-cols-3 gap-2">
        {OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const active = mounted && theme === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => setTheme(opt.value)}
              className={cn(
                "flex flex-col items-center gap-1.5 rounded-xl border p-3 text-xs font-semibold transition-colors",
                active
                  ? "border-primary bg-primary-tint text-primary"
                  : "border-border text-text-secondary hover:bg-surface-hover",
              )}
            >
              <Icon className="size-4" aria-hidden />
              {opt.label}
            </button>
          );
        })}
      </div>
    </SettingsSection>
  );
}
