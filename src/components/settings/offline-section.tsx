"use client";

import { WifiOff } from "lucide-react";
import { SettingsSection, SettingsRow } from "@/components/settings/settings-section";
import { useOnlineStatus } from "@/lib/hooks/use-online-status";
import { cn } from "@/lib/utils";

export function OfflineSection() {
  const online = useOnlineStatus();

  return (
    <SettingsSection icon={WifiOff} title="Offline mode" description="How Assignment. behaves without a connection.">
      <SettingsRow
        label="Connection status"
        control={
          <span
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-semibold",
              online ? "bg-success-tint text-success" : "bg-danger-tint text-danger",
            )}
          >
            {online ? "Online" : "Offline"}
          </span>
        }
      />
      <p className="mt-2 text-xs leading-relaxed text-text-secondary">
        Assignment. caches its app shell so it opens quickly and shows a clear offline page when you have
        no connection. Reading and editing assignments requires a connection — changes made offline are
        not queued or synced in this version.
      </p>
    </SettingsSection>
  );
}
