import { AppearanceSection } from "@/components/settings/appearance-section";
import { NotificationsSection } from "@/components/settings/notifications-section";
import { AiPreferencesSection } from "@/components/settings/ai-preferences-section";
import { PrivacySection } from "@/components/settings/privacy-section";
import { OfflineSection } from "@/components/settings/offline-section";
import { PwaSection } from "@/components/settings/pwa-section";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Settings — Asignly" };

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text sm:text-[28px]">Settings</h1>
        <p className="mt-1 text-sm text-text-secondary">Manage how Asignly looks and behaves.</p>
      </div>
      <AppearanceSection />
      <NotificationsSection />
      <AiPreferencesSection />
      <PrivacySection />
      <OfflineSection />
      <PwaSection />
    </div>
  );
}
