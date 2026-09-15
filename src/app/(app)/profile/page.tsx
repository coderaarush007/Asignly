import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/db/profile.queries";
import { getAssignments } from "@/lib/db/assignments.queries";
import { Card } from "@/components/ui/card";
import { MetricCard } from "@/components/dashboard/metric-card";
import { ProfileForm } from "@/components/profile/profile-form";
import { AccountActions } from "@/components/profile/account-actions";
import { isOverdue } from "@/lib/utils";
import { ClipboardList, Clock3, CheckCircle2, AlertTriangle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Profile — Asignly" };

export default async function ProfilePage() {
  const { profile, userId } = await getCurrentProfile();
  if (!userId || !profile) redirect("/login");

  const assignments = await getAssignments();
  const completed = assignments.filter((a) => a.status === "completed").length;
  const inProgress = assignments.filter((a) => a.status === "in_progress").length;
  const overdue = assignments.filter((a) => isOverdue(a)).length;
  const initial = (profile.full_name || profile.email).charAt(0).toUpperCase();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-primary">Account</p>
        <h1 className="text-2xl font-bold tracking-tight text-text sm:text-[28px]">Profile</h1>
        <p className="mt-1 text-sm text-text-secondary">Manage your details and account.</p>
      </div>

      <Card className="flex items-center gap-4 p-5">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary text-xl font-bold text-white">
          {initial}
        </div>
        <div className="min-w-0">
          <p className="truncate text-base font-bold text-text">{profile.full_name || "Add your name"}</p>
          <p className="truncate text-sm text-text-secondary">{profile.email}</p>
        </div>
      </Card>

      <div>
        <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-text-muted">Account statistics</p>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <MetricCard label="Total" value={assignments.length} icon={ClipboardList} accent="primary" />
          <MetricCard label="In Progress" value={inProgress} icon={Clock3} accent="warning" />
          <MetricCard label="Completed" value={completed} icon={CheckCircle2} accent="success" />
          <MetricCard label="Overdue" value={overdue} icon={AlertTriangle} accent="danger" />
        </div>
      </div>

      <Card className="p-5">
        <h2 className="mb-4 text-sm font-bold text-text">Personal information</h2>
        <ProfileForm fullName={profile.full_name ?? ""} email={profile.email} />
      </Card>

      <div>
        <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-text-muted">Account actions</p>
        <AccountActions />
      </div>
    </div>
  );
}
