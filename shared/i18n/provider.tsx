"use client";

import { useEffect } from "react";
import { DEFAULT_LOCALE, type Locale } from "@/shared/config/app";
import { useLocaleStore } from "@/shared/i18n/store";

type I18nProviderProps = {
  initialLocale?: Locale;
  children: React.ReactNode;
};

export function I18nProvider({
  initialLocale = DEFAULT_LOCALE,
  children,
}: I18nProviderProps) {
  const setLocale = useLocaleStore((s) => s.setLocale);

  useEffect(() => {
    setLocale(initialLocale);
  }, [initialLocale, setLocale]);

  return <>{children}</>;
}
