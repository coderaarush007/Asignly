"use client";

import { Download, CheckCircle2 } from "lucide-react";
import { SettingsSection } from "@/components/settings/settings-section";
import { Button } from "@/components/ui/button";
import { useInstallPrompt } from "@/lib/hooks/use-install-prompt";

export function PwaSection() {
  const { canInstall, installed, promptInstall } = useInstallPrompt();

  return (
    <SettingsSection
      icon={Download}
      title="Install app"
      description="Add Asignly to your device for quick, full-screen access."
    >
      {installed ? (
        <div className="flex items-center gap-2 text-sm font-semibold text-success">
          <CheckCircle2 className="size-4" aria-hidden />
          Installed
        </div>
      ) : canInstall ? (
        <Button onClick={promptInstall}>
          <Download className="size-4" aria-hidden />
          Install Asignly
        </Button>
      ) : (
        <p className="text-xs text-text-secondary">
          On iPhone/iPad: open the Share menu in Safari and choose &quot;Add to Home Screen.&quot; On
          Android/desktop Chrome, use the install icon in the address bar if it doesn&apos;t appear here.
        </p>
      )}
    </SettingsSection>
  );
}
