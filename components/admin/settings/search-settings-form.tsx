"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { SettingsSection, SettingsField } from "@/components/admin/settings/settings-section";
import { SettingsSaveButton } from "@/components/admin/settings/settings-save-button";
import { Alert } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { initialSearchSettings } from "@/lib/mock/settings";

export function SearchSettingsForm() {
  const t = useTranslations("admin.settings");
  const tSearch = useTranslations("admin.settings.search");
  const [settings, setSettings] = useState(initialSearchSettings);

  return (
    <div className="space-y-6">
      <Alert variant="info">{t("noIntegrationNotice")}</Alert>

      <SettingsSection title={tSearch("title")} description={tSearch("description")}>
        <SettingsField label={tSearch("fullText")} description={tSearch("fullTextDescription")}>
          <Switch checked={settings.fullTextEnabled} onCheckedChange={(v) => setSettings((s) => ({ ...s, fullTextEnabled: v }))} aria-label={tSearch("fullText")} />
        </SettingsField>
        <SettingsField label={tSearch("faceted")} description={tSearch("facetedDescription")}>
          <Switch checked={settings.facetedSearchEnabled} onCheckedChange={(v) => setSettings((s) => ({ ...s, facetedSearchEnabled: v }))} aria-label={tSearch("faceted")} />
        </SettingsField>
        <SettingsField label={tSearch("openSearch")} description={tSearch("openSearchDescription")}>
          <Switch checked={settings.openSearchEnabled} onCheckedChange={(v) => setSettings((s) => ({ ...s, openSearchEnabled: v }))} aria-label={tSearch("openSearch")} />
        </SettingsField>
        {settings.openSearchEnabled && (
          <SettingsField label={tSearch("endpoint")} htmlFor="opensearch-endpoint">
            <Input id="opensearch-endpoint" dir="ltr" value={settings.openSearchEndpoint} onChange={(e) => setSettings((s) => ({ ...s, openSearchEndpoint: e.target.value }))} />
          </SettingsField>
        )}
      </SettingsSection>

      <SettingsSaveButton />
    </div>
  );
}
