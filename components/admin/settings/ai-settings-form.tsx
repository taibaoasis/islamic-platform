"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { SettingsSection, SettingsField } from "@/components/admin/settings/settings-section";
import { SettingsSaveButton } from "@/components/admin/settings/settings-save-button";
import { Alert } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { initialAiSettings } from "@/lib/mock/settings";

export function AiSettingsForm() {
  const t = useTranslations("admin.settings");
  const tAi = useTranslations("admin.settings.ai");
  const [settings, setSettings] = useState(initialAiSettings);

  return (
    <div className="space-y-6">
      <Alert variant="warning">{t("noIntegrationNotice")}</Alert>

      <SettingsSection title={tAi("title")} description={tAi("description")}>
        <SettingsField label={tAi("provider")}>
          <Select value={settings.provider} onValueChange={(v) => setSettings((s) => ({ ...s, provider: v as typeof s.provider }))}>
            <SelectTrigger className="max-w-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NONE">{tAi("providerNone")}</SelectItem>
              <SelectItem value="ANTHROPIC">Anthropic</SelectItem>
              <SelectItem value="OPENAI">OpenAI</SelectItem>
            </SelectContent>
          </Select>
        </SettingsField>
        <SettingsField label={tAi("embeddings")} description={tAi("embeddingsDescription")}>
          <Switch checked={settings.embeddingsEnabled} onCheckedChange={(v) => setSettings((s) => ({ ...s, embeddingsEnabled: v }))} aria-label={tAi("embeddings")} />
        </SettingsField>
        <SettingsField label={tAi("summarization")} description={tAi("summarizationDescription")}>
          <Switch checked={settings.summarizationEnabled} onCheckedChange={(v) => setSettings((s) => ({ ...s, summarizationEnabled: v }))} aria-label={tAi("summarization")} />
        </SettingsField>
        <SettingsField label={tAi("translationAssistance")} description={tAi("translationAssistanceDescription")}>
          <Switch
            checked={settings.translationAssistanceEnabled}
            onCheckedChange={(v) => setSettings((s) => ({ ...s, translationAssistanceEnabled: v }))}
            aria-label={tAi("translationAssistance")}
          />
        </SettingsField>
      </SettingsSection>

      <SettingsSaveButton />
    </div>
  );
}
