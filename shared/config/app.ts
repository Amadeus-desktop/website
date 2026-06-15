export const APP_NAME = "LoveyDovey";
export const APP_TAGLINE = "Beyond Simple Chat, My Dream Talk";

export const DEFAULT_LOCALE = "ko" as const;
export const LOCALES = ["ko", "en", "ja"] as const;

export type Locale = (typeof LOCALES)[number];

export const LOCALE_LABELS: Record<Locale, string> = {
  ko: "한국어",
  en: "English",
  ja: "日本語",
};

export const LOCALE_COOKIE = "ld_locale";
