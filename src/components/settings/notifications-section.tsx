"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { toast } from "sonner";
import { SettingsSection, SettingsRow } from "@/components/settings/settings-section";
import { Switch } from "@/components/ui/switch";
import { useLocalSetting } from "@/lib/hooks/use-local-setting";

export function NotificationsSection() {
  const [enabled, setEnabled] = useLocalSetting<"true" | "false">("notifications-enabled", "false");
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">("default");

  useEffect(() => {
    // One-time read after mount: the Notification API isn't available during SSR.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (typeof Notification === "undefined") setPermission("unsupported");
    else setPermission(Notification.permission);
  }, []);

  async function handleToggle(next: boolean) {
    if (next && permission === "default") {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result !== "granted") {
        toast.error("Notifications were blocked in your browser.");
        return;
      }
    }
    if (next && permission === "denied") {
      toast.error("Notifications are blocked. Enable them in your browser settings.");
      return;
    }
    setEnabled(String(next) as "true" | "false");
  }

  return (
    <SettingsSection
      icon={Bell}
      title="Notifications"
      description="Get a browser reminder for what's due today."
    >
      <SettingsRow
        label="Due-today reminders"
        description={
          permission === "unsupported"
            ? "Not supported in this browser."
            : "Shown while Assignment. is open in a tab."
        }
        control={
          <Switch
            checked={enabled === "true" && permission === "granted"}
            onChange={handleToggle}
            label="Toggle due-today reminders"
            disabled={permission === "unsupported"}
          />
        }
      />
    </SettingsSection>
  );
}
