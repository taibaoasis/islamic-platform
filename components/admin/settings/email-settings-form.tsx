"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { SettingsSection, SettingsField } from "@/components/admin/settings/settings-section";
import { SettingsSaveButton } from "@/components/admin/settings/settings-save-button";
import { Alert } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { initialEmailSettings } from "@/lib/mock/settings";

export function EmailSettingsForm() {
  const t = useTranslations("admin.settings");
  const tEmail = useTranslations("admin.settings.email");
  const [settings, setSettings] = useState(initialEmailSettings);

  return (
    <div className="space-y-6">
      <Alert variant="info">{t("noIntegrationNotice")}</Alert>

      <SettingsSection title={tEmail("title")} description={tEmail("description")}>
        <SettingsField label={tEmail("smtpHost")} htmlFor="smtp-host">
          <Input id="smtp-host" dir="ltr" value={settings.smtpHost} onChange={(e) => setSettings((s) => ({ ...s, smtpHost: e.target.value }))} />
        </SettingsField>
        <SettingsField label={tEmail("smtpPort")} htmlFor="smtp-port">
          <Input id="smtp-port" type="number" dir="ltr" value={settings.smtpPort} onChange={(e) => setSettings((s) => ({ ...s, smtpPort: Number(e.target.value) }))} className="max-w-32" />
        </SettingsField>
        <SettingsField label={tEmail("username")} htmlFor="smtp-user">
          <Input id="smtp-user" dir="ltr" value={settings.username} onChange={(e) => setSettings((s) => ({ ...s, username: e.target.value }))} />
        </SettingsField>
        <SettingsField label={tEmail("encryption")}>
          <Select value={settings.encryption} onValueChange={(v) => setSettings((s) => ({ ...s, encryption: v as typeof s.encryption }))}>
            <SelectTrigger className="max-w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NONE">NONE</SelectItem>
              <SelectItem value="SSL">SSL</SelectItem>
              <SelectItem value="TLS">TLS</SelectItem>
            </SelectContent>
          </Select>
        </SettingsField>
        <SettingsField label={tEmail("senderName")} htmlFor="sender-name">
          <Input id="sender-name" value={settings.senderName} onChange={(e) => setSettings((s) => ({ ...s, senderName: e.target.value }))} />
        </SettingsField>
        <SettingsField label={tEmail("senderEmail")} htmlFor="sender-email">
          <Input id="sender-email" type="email" dir="ltr" value={settings.senderEmail} onChange={(e) => setSettings((s) => ({ ...s, senderEmail: e.target.value }))} />
        </SettingsField>
      </SettingsSection>

      <SettingsSaveButton />
    </div>
  );
}
