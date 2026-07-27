"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { SettingsSection, SettingsField } from "@/components/admin/settings/settings-section";
import { SettingsSaveButton } from "@/components/admin/settings/settings-save-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { initialSeoSettings } from "@/lib/mock/settings";

export function SeoSettingsForm() {
  const t = useTranslations("admin.settings.seo");
  const [settings, setSettings] = useState(initialSeoSettings);

  return (
    <div className="space-y-6">
      <SettingsSection title={t("title")} description={t("description")}>
        <SettingsField label={t("metaTitle")} htmlFor="meta-title">
          <Input id="meta-title" value={settings.metaTitle} onChange={(e) => setSettings((s) => ({ ...s, metaTitle: e.target.value }))} maxLength={60} />
        </SettingsField>
        <SettingsField label={t("metaDescription")} htmlFor="meta-desc">
          <Textarea id="meta-desc" rows={3} value={settings.metaDescription} onChange={(e) => setSettings((s) => ({ ...s, metaDescription: e.target.value }))} maxLength={160} />
        </SettingsField>
        <SettingsField label={t("canonical")} htmlFor="canonical">
          <Input id="canonical" dir="ltr" value={settings.canonicalBase} onChange={(e) => setSettings((s) => ({ ...s, canonicalBase: e.target.value }))} />
        </SettingsField>
      </SettingsSection>

      <SettingsSection title={t("robotsTitle")}>
        <SettingsField label={t("robotsIndex")}>
          <Switch checked={settings.robotsIndex} onCheckedChange={(v) => setSettings((s) => ({ ...s, robotsIndex: v }))} aria-label={t("robotsIndex")} />
        </SettingsField>
        <SettingsField label={t("robotsFollow")}>
          <Switch checked={settings.robotsFollow} onCheckedChange={(v) => setSettings((s) => ({ ...s, robotsFollow: v }))} aria-label={t("robotsFollow")} />
        </SettingsField>
      </SettingsSection>

      <SettingsSection title="Open Graph">
        <SettingsField label={t("ogTitle")} htmlFor="og-title">
          <Input id="og-title" value={settings.ogTitle} onChange={(e) => setSettings((s) => ({ ...s, ogTitle: e.target.value }))} />
        </SettingsField>
        <SettingsField label={t("ogDescription")} htmlFor="og-desc">
          <Textarea id="og-desc" rows={2} value={settings.ogDescription} onChange={(e) => setSettings((s) => ({ ...s, ogDescription: e.target.value }))} />
        </SettingsField>
      </SettingsSection>

      <SettingsSection title="Twitter">
        <SettingsField label={t("twitterCard")}>
          <Select value={settings.twitterCard} onValueChange={(v) => setSettings((s) => ({ ...s, twitterCard: v as typeof s.twitterCard }))}>
            <SelectTrigger className="max-w-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="summary">summary</SelectItem>
              <SelectItem value="summary_large_image">summary_large_image</SelectItem>
            </SelectContent>
          </Select>
        </SettingsField>
        <SettingsField label={t("twitterHandle")} htmlFor="twitter-handle">
          <Input id="twitter-handle" dir="ltr" value={settings.twitterHandle} onChange={(e) => setSettings((s) => ({ ...s, twitterHandle: e.target.value }))} />
        </SettingsField>
      </SettingsSection>

      <SettingsSection title={t("sitemapTitle")}>
        <SettingsField label={t("sitemapEnabled")}>
          <Switch checked={settings.sitemapEnabled} onCheckedChange={(v) => setSettings((s) => ({ ...s, sitemapEnabled: v }))} aria-label={t("sitemapEnabled")} />
        </SettingsField>
      </SettingsSection>

      <SettingsSaveButton />
    </div>
  );
}
