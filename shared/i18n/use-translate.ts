"use client";

import { useLocaleStore } from "@/shared/i18n/store";
import { translate } from "@/shared/i18n";
import type { Locale } from "@/shared/config/app";

export function useT() {
  const locale = useLocaleStore((s) => s.locale);

  return (key: string, params?: Record<string, string | number>) =>
    translate(locale, key, params);
}

export function useLocale(): Locale {
  return useLocaleStore((s) => s.locale);
}
