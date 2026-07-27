"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { SettingsSection, SettingsField } from "@/components/admin/settings/settings-section";
import { SettingsSaveButton } from "@/components/admin/settings/settings-save-button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { initialSecuritySettings } from "@/lib/mock/settings";

export function SecuritySettingsForm() {
  const t = useTranslations("admin.settings.security");
  const [settings, setSettings] = useState(initialSecuritySettings);

  return (
    <div className="space-y-6">
      <SettingsSection title={t("title")} description={t("description")}>
        <SettingsField label={t("sessionTimeout")} htmlFor="session-timeout">
          <Input
            id="session-timeout"
            type="number"
            dir="ltr"
            className="max-w-32"
            value={settings.sessionTimeoutMinutes}
            onChange={(e) => setSettings((s) => ({ ...s, sessionTimeoutMinutes: Number(e.target.value) }))}
          />
        </SettingsField>
        <SettingsField label={t("mfa")} description={t("mfaDescription")}>
          <Switch checked={settings.mfaEnabled} onCheckedChange={(v) => setSettings((s) => ({ ...s, mfaEnabled: v }))} aria-label={t("mfa")} />
        </SettingsField>
        <SettingsField label={t("auditLogging")} description={t("auditLoggingDescription")}>
          <Switch checked={settings.auditLoggingEnabled} onCheckedChange={(v) => setSettings((s) => ({ ...s, auditLoggingEnabled: v }))} aria-label={t("auditLogging")} />
        </SettingsField>
        <SettingsField label={t("maxLoginAttempts")} htmlFor="max-attempts">
          <Input
            id="max-attempts"
            type="number"
            dir="ltr"
            className="max-w-32"
            value={settings.maxLoginAttempts}
            onChange={(e) => setSettings((s) => ({ ...s, maxLoginAttempts: Number(e.target.value) }))}
          />
        </SettingsField>
      </SettingsSection>

      <SettingsSection title={t("passwordPolicy")}>
        <SettingsField label={t("passwordMinLength")} htmlFor="pw-min-length">
          <Input
            id="pw-min-length"
            type="number"
            dir="ltr"
            className="max-w-32"
            value={settings.passwordMinLength}
            onChange={(e) => setSettings((s) => ({ ...s, passwordMinLength: Number(e.target.value) }))}
          />
        </SettingsField>
        <SettingsField label={t("passwordRequireSymbols")}>
          <Switch checked={settings.passwordRequireSymbols} onCheckedChange={(v) => setSettings((s) => ({ ...s, passwordRequireSymbols: v }))} aria-label={t("passwordRequireSymbols")} />
        </SettingsField>
      </SettingsSection>

      <SettingsSaveButton />
    </div>
  );
}
