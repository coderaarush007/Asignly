import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/db/profile.queries";
import { getAssignments } from "@/lib/db/assignments.queries";
import { Card } from "@/components/ui/card";
import { ProfileForm } from "@/components/profile/profile-form";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Profile — Assignment." };

export default async function ProfilePage() {
  const { profile, userId } = await getCurrentProfile();
  if (!userId || !profile) redirect("/login");

  const assignments = await getAssignments();
  const completed = assignments.filter((a) => a.status === "completed").length;
  const initial = (profile.full_name || profile.email).charAt(0).toUpperCase();

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text sm:text-[28px]">Profile</h1>
      </div>

      <Card className="flex items-center gap-4 p-5">
        <div className="flex size-14 items-center justify-center rounded-full bg-primary text-xl font-bold text-white">
          {initial}
        </div>
        <div className="min-w-0">
          <p className="truncate text-base font-bold text-text">{profile.full_name || "Add your name"}</p>
          <p className="truncate text-sm text-text-secondary">{profile.email}</p>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-text">{assignments.length}</p>
          <p className="text-xs text-text-secondary">Total assignments</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-text">{completed}</p>
          <p className="text-xs text-text-secondary">Completed</p>
        </Card>
      </div>

      <Card className="p-5">
        <h2 className="mb-4 text-sm font-bold text-text">Edit profile</h2>
        <ProfileForm fullName={profile.full_name ?? ""} />
      </Card>
    </div>
  );
}
