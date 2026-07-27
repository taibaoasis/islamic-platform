import { mockMediaAssets } from "@/lib/mock/media";
import { locales } from "@/config/site";

/**
 * بيانات وهمية لإعدادات النظام (Phase 11, Module 7) — لا اتصال حقيقي
 * بـSMTP أو S3 أو OpenSearch أو أي خدمة ذكاء اصطناعي، ولا حفظ حقيقي لأي
 * قيمة. **استخدام تخزين "Local" مُشتَقّ من `mockMediaAssets` الحقيقية**
 * (Module 4) بدل رقم Mock معزول، حيثما أمكن.
 *
 * Mock data for system settings (Phase 11, Module 7) — no real
 * connection to SMTP, S3, OpenSearch, or any AI service, and no real
 * persistence of any value. **"Local" storage usage is derived from the
 * real `mockMediaAssets`** (Module 4) instead of an isolated mock
 * number, wherever possible.
 */

export interface GeneralSettings {
  siteName: string;
  description: string;
  logoPlaceholder: boolean;
  defaultLanguage: string;
  timezone: string;
  dateFormat: string;
  maintenanceMode: boolean;
}

export const initialGeneralSettings: GeneralSettings = {
  siteName: "المنصة العالمية للتعريف بالإسلام",
  description: "منصة عالمية تجمع القرآن الكريم والسنة النبوية والفقه والتعليم الإسلامي بمصداقية علمية.",
  logoPlaceholder: true,
  defaultLanguage: "ar",
  timezone: "Asia/Riyadh",
  dateFormat: "DD/MM/YYYY",
  maintenanceMode: false,
};

export const timezoneOptions = ["Asia/Riyadh", "Asia/Dubai", "Europe/London", "America/New_York", "Asia/Jakarta"];
export const dateFormatOptions = ["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"];
export const availableLanguageCodes = [...locales, "ur", "fr", "id"];

export interface SeoSettings {
  metaTitle: string;
  metaDescription: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
  canonicalBase: string;
  ogTitle: string;
  ogDescription: string;
  twitterCard: "summary" | "summary_large_image";
  twitterHandle: string;
  sitemapEnabled: boolean;
}

export const initialSeoSettings: SeoSettings = {
  metaTitle: "المنصة العالمية للتعريف بالإسلام",
  metaDescription: "مرجعك الموثوق للتعرّف على الإسلام وتعلّم علومه — القرآن، الحديث، الفقه، والتعليم الإسلامي.",
  robotsIndex: true,
  robotsFollow: true,
  canonicalBase: "https://example.com",
  ogTitle: "المنصة العالمية للتعريف بالإسلام",
  ogDescription: "منصة عالمية للتعرّف على الإسلام وتعلّم علومه.",
  twitterCard: "summary_large_image",
  twitterHandle: "@islamic_platform",
  sitemapEnabled: true,
};

export interface EmailSettings {
  smtpHost: string;
  smtpPort: number;
  username: string;
  encryption: "NONE" | "SSL" | "TLS";
  senderName: string;
  senderEmail: string;
}

export const initialEmailSettings: EmailSettings = {
  smtpHost: "smtp.example.com",
  smtpPort: 587,
  username: "no-reply@example.com",
  encryption: "TLS",
  senderName: "المنصة العالمية للتعريف بالإسلام",
  senderEmail: "no-reply@example.com",
};

export interface StorageProvider {
  id: "local" | "s3" | "backblaze" | "r2";
  name: string;
  usedBytes: number;
  totalBytes: number;
  isActive: boolean;
}

const localUsedBytes = mockMediaAssets.reduce((sum, a) => sum + a.fileSizeBytes, 0);

export const storageProviders: StorageProvider[] = [
  { id: "local", name: "Local", usedBytes: localUsedBytes, totalBytes: 5 * 1024 * 1024 * 1024, isActive: true },
  { id: "s3", name: "Amazon S3", usedBytes: 0, totalBytes: 100 * 1024 * 1024 * 1024, isActive: false },
  { id: "backblaze", name: "Backblaze B2", usedBytes: 0, totalBytes: 50 * 1024 * 1024 * 1024, isActive: false },
  { id: "r2", name: "Cloudflare R2", usedBytes: 0, totalBytes: 50 * 1024 * 1024 * 1024, isActive: false },
];

export interface SearchSettings {
  fullTextEnabled: boolean;
  facetedSearchEnabled: boolean;
  openSearchEnabled: boolean;
  openSearchEndpoint: string;
}

export const initialSearchSettings: SearchSettings = {
  fullTextEnabled: true,
  facetedSearchEnabled: true,
  openSearchEnabled: false,
  openSearchEndpoint: "https://search.example.com:9200",
};

export interface AiSettings {
  provider: "NONE" | "ANTHROPIC" | "OPENAI";
  embeddingsEnabled: boolean;
  summarizationEnabled: boolean;
  translationAssistanceEnabled: boolean;
}

export const initialAiSettings: AiSettings = {
  provider: "NONE",
  embeddingsEnabled: false,
  summarizationEnabled: false,
  translationAssistanceEnabled: false,
};

export interface SecuritySettings {
  sessionTimeoutMinutes: number;
  passwordMinLength: number;
  passwordRequireSymbols: boolean;
  mfaEnabled: boolean;
  auditLoggingEnabled: boolean;
  maxLoginAttempts: number;
}

export const initialSecuritySettings: SecuritySettings = {
  sessionTimeoutMinutes: 60,
  passwordMinLength: 10,
  passwordRequireSymbols: true,
  mfaEnabled: false,
  auditLoggingEnabled: true,
  maxLoginAttempts: 5,
};

export function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}
