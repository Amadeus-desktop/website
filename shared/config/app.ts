export const APP_NAME = "Amadeus";
export const APP_TAGLINE = "상상 속 캐릭터와 특별한 대화";

export const DEFAULT_LOCALE = "ko" as const;
export const LOCALES = ["ko", "en", "ja"] as const;

export type Locale = (typeof LOCALES)[number];

export const LOCALE_LABELS: Record<Locale, string> = {
  ko: "한국어",
  en: "English",
  ja: "日本語",
};

export const LOCALE_COOKIE = "amadeus_locale";
