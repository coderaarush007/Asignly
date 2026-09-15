"use client";

import { useOnlineStatus } from "@/lib/hooks/use-online-status";
import { cn } from "@/lib/utils";

export function OnlineStatus() {
  const online = useOnlineStatus();

  return (
    <div
      className={cn(
        "hidden items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold sm:flex",
        online ? "bg-success-tint text-success" : "bg-danger-tint text-danger",
      )}
    >
      <span className={cn("size-1.5 rounded-full", online ? "bg-success" : "bg-danger animate-pulse")} />
      {online ? "Online" : "Offline"}
    </div>
  );
}
