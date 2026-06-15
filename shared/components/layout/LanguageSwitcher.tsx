"use client";

import {
  LOCALES,
  LOCALE_LABELS,
  type Locale,
} from "@/shared/config/app";
import { useLocaleStore } from "@/shared/i18n/store";
import { useT } from "@/shared/i18n/use-translate";
import { cn } from "@/shared/lib/cn";
import { useRouter } from "next/navigation";

export function LanguageSwitcher({ compact }: { compact?: boolean }) {
  const t = useT();
  const router = useRouter();
  const locale = useLocaleStore((s) => s.locale);
  const setLocale = useLocaleStore((s) => s.setLocale);

  function handleChange(next: Locale) {
    setLocale(next);
    router.refresh();
  }

  return (
    <div className={cn("flex items-center gap-1", compact && "scale-90")}>
      {!compact && (
        <span className="mr-1 text-xs text-muted">{t("language.label")}</span>
      )}
      {LOCALES.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => handleChange(l)}
          className={cn(
            "rounded-full px-2 py-0.5 text-xs font-medium transition-colors",
            locale === l
              ? "bg-primary text-white"
              : "text-muted hover:bg-surface hover:text-foreground",
          )}
          title={LOCALE_LABELS[l]}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
