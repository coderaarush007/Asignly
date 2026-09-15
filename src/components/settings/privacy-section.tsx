import { ShieldCheck } from "lucide-react";
import { SettingsSection } from "@/components/settings/settings-section";

export function PrivacySection() {
  return (
    <SettingsSection icon={ShieldCheck} title="Privacy" description="What we store, and what we don't.">
      <ul className="space-y-2 text-sm text-text-secondary">
        <li>• Your assignments, subjects, and tasks are protected by row-level security — only you can read or write them.</li>
        <li>• Screenshots you scan are sent to Google&apos;s Gemini API to extract details, then discarded. They are not saved to your account.</li>
        <li>• Nothing from a scanned screenshot is saved until you review it and press &quot;Add assignment.&quot;</li>
      </ul>
    </SettingsSection>
  );
}
