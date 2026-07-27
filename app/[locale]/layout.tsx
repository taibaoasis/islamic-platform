import type { ReactNode } from "react";
import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";

import { routing } from "@/i18n/routing";
import { getDirection, siteConfig } from "@/config/site";
import { fontVariables } from "@/config/fonts";
import { Providers } from "@/components/providers";

import "@/styles/globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = hasLocale(routing.locales, rawLocale) ? rawLocale : routing.defaultLocale;
  return {
    title: siteConfig.name,
    description: siteConfig.description[locale] ?? siteConfig.description.en,
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  // بعد هذا السطر يُضيَّق نوع locale تلقائيًا إلى Locale عبر type guard في next-intl.
  // From here, next-intl's type guard narrows `locale` to Locale automatically.

  const messages = await getMessages();
  const direction = getDirection(locale);

  return (
    <html lang={locale} dir={direction} className={fontVariables} suppressHydrationWarning>
      <body className={direction === "rtl" ? "font-arabic" : "font-sans"}>
        <NextIntlClientProvider messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
