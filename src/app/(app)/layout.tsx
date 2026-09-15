import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/db/profile.queries";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { MobileNav } from "@/components/layout/mobile-nav";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { profile, userId } = await getCurrentProfile();
  if (!userId) redirect("/login");

  return (
    <div className="min-h-screen bg-bg">
      <Sidebar profile={profile} email={profile?.email ?? ""} />
      <div className="lg:pl-64">
        <Topbar />
        <main className="mx-auto max-w-[1400px] px-4 pb-24 pt-6 lg:px-8 lg:pb-10">{children}</main>
      </div>
      <MobileNav />
    </div>
  );
}
