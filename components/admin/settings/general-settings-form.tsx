"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { SettingsSection, SettingsField } from "@/components/admin/settings/settings-section";
import { SettingsSaveButton } from "@/components/admin/settings/settings-save-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ImageIcon } from "@/components/icons";
import { initialGeneralSettings, timezoneOptions, dateFormatOptions, availableLanguageCodes } from "@/lib/mock/settings";

export function GeneralSettingsForm() {
  const t = useTranslations("admin.settings.general");
  const [settings, setSettings] = useState(initialGeneralSettings);

  return (
    <div className="space-y-6">
      <SettingsSection title={t("title")} description={t("description")}>
        <SettingsField label={t("siteName")} htmlFor="site-name">
          <Input id="site-name" value={settings.siteName} onChange={(e) => setSettings((s) => ({ ...s, siteName: e.target.value }))} />
        </SettingsField>
        <SettingsField label={t("siteDescription")} htmlFor="site-desc">
          <Textarea id="site-desc" rows={3} value={settings.description} onChange={(e) => setSettings((s) => ({ ...s, description: e.target.value }))} />
        </SettingsField>
        <SettingsField label={t("logo")}>
          <div className="flex items-center gap-3">
            <span className="flex size-12 items-center justify-center rounded-[var(--radius)] border border-dashed border-border text-muted-foreground">
              <ImageIcon className="size-5" aria-hidden="true" />
            </span>
            <Badge variant="neutral">{t("logoPlaceholder")}</Badge>
          </div>
        </SettingsField>
        <SettingsField label={t("defaultLanguage")}>
          <Select value={settings.defaultLanguage} onValueChange={(v) => setSettings((s) => ({ ...s, defaultLanguage: v }))}>
            <SelectTrigger className="max-w-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availableLanguageCodes.map((code) => (
                <SelectItem key={code} value={code}>
                  {code.toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </SettingsField>
        <SettingsField label={t("timezone")}>
          <Select value={settings.timezone} onValueChange={(v) => setSettings((s) => ({ ...s, timezone: v }))}>
            <SelectTrigger className="max-w-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timezoneOptions.map((tz) => (
                <SelectItem key={tz} value={tz}>
                  {tz}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </SettingsField>
        <SettingsField label={t("dateFormat")}>
          <Select value={settings.dateFormat} onValueChange={(v) => setSettings((s) => ({ ...s, dateFormat: v }))}>
            <SelectTrigger className="max-w-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {dateFormatOptions.map((f) => (
                <SelectItem key={f} value={f}>
                  {f}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </SettingsField>
        <SettingsField label={t("maintenanceMode")} description={t("maintenanceModeDescription")}>
          <Switch checked={settings.maintenanceMode} onCheckedChange={(v) => setSettings((s) => ({ ...s, maintenanceMode: v }))} aria-label={t("maintenanceMode")} />
        </SettingsField>
      </SettingsSection>

      <SettingsSaveButton />
    </div>
  );
}
