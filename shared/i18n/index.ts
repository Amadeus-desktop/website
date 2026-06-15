import type { Locale } from "@/shared/config/app";
import type { Messages } from "@/shared/config/navigation";
import { en } from "@/shared/i18n/messages/en";
import { ja } from "@/shared/i18n/messages/ja";
import { ko } from "@/shared/i18n/messages/ko";

const dictionaries: Record<Locale, Messages> = { ko, en, ja };

export function getDictionary(locale: Locale): Messages {
  return dictionaries[locale] ?? dictionaries.ko;
}

export function translate(
  locale: Locale,
  key: string,
  params?: Record<string, string | number>,
): string {
  const dict = getDictionary(locale);
  let text = dict[key] ?? dictionaries.ko[key] ?? key;

  if (params) {
    for (const [k, v] of Object.entries(params)) {
      text = text.replace(`{${k}}`, String(v));
    }
  }

  return text;
}

export function isLocale(value: string): value is Locale {
  return value === "ko" || value === "en" || value === "ja";
}
