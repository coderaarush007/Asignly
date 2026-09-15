import { getAssignments } from "@/lib/db/assignments.queries";
import { CalendarView } from "@/components/calendar/calendar-view";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Calendar — Asignly" };

export default async function CalendarPage() {
  const assignments = await getAssignments();

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-primary">Timeline &amp; schedule</p>
        <h1 className="text-2xl font-bold tracking-tight text-text sm:text-[28px]">Calendar</h1>
        <p className="mt-1 text-sm text-text-secondary">See what&apos;s due, day by day.</p>
      </div>
      <CalendarView assignments={assignments} />
    </div>
  );
}
