"use client";

import { useEffect } from "react";
import { useLocalSetting } from "@/lib/hooks/use-local-setting";

// Fires a single local browser notification per tab session when the user
// has opted in and permission is already granted. There is no server-side
// push in v1 — this only fires while the app is open, which the Settings
// copy states plainly.
export function DueTodayNotifier({ dueTodayCount }: { dueTodayCount: number }) {
  const [enabled] = useLocalSetting<"true" | "false">("notifications-enabled", "false");

  useEffect(() => {
    if (enabled !== "true" || dueTodayCount === 0) return;
    if (typeof Notification === "undefined" || Notification.permission !== "granted") return;
    if (sessionStorage.getItem("due-today-notified")) return;

    new Notification("Assignment.", {
      body: `You have ${dueTodayCount} assignment${dueTodayCount === 1 ? "" : "s"} due today.`,
      icon: "/icons/icon-192.png",
    });
    sessionStorage.setItem("due-today-notified", "1");
  }, [enabled, dueTodayCount]);

  return null;
}
