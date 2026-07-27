import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";

import { routing } from "@/i18n/routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  // الرسائل مجمّعة حسب اللغة في مجلد locales/ على مستوى الجذر.
  // Messages are grouped by locale under the root-level locales/ folder.
  return {
    locale,
    messages: (await import(`@/locales/${locale}/common.json`)).default,
  };
});
