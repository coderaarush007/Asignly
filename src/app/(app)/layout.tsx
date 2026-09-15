import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/db/profile.queries";
import { Navbar } from "@/components/layout/navbar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { profile, userId } = await getCurrentProfile();
  if (!userId) redirect("/login");

  return (
    <div className="min-h-screen bg-bg">
      <Navbar profile={profile} email={profile?.email ?? ""} />
      <main className="mx-auto max-w-[1400px] px-4 pb-10 pt-6 lg:px-8">{children}</main>
    </div>
  );
}
