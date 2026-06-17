"use client";

import {
  LOCALE_LABELS,
  LOCALES,
  type Locale,
} from "@/shared/config/app";
import { useLocaleStore } from "@/shared/i18n/store";
import { useT } from "@/shared/i18n/use-translate";
import { cn } from "@/shared/lib/cn";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function LanguageSelector() {
  const t = useT();
  const router = useRouter();
  const locale = useLocaleStore((s) => s.locale);
  const setLocale = useLocaleStore((s) => s.setLocale);
  const [isPending, startTransition] = useTransition();

  function handleSelect(next: Locale) {
    if (next === locale) return;

    startTransition(() => {
      setLocale(next);
      router.refresh();
    });
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {LOCALES.map((code) => {
          const selected = locale === code;

          return (
            <button
              key={code}
              type="button"
              disabled={isPending}
              onClick={() => handleSelect(code)}
              className={cn(
                "interactive-link rounded-2xl border bg-surface px-4 py-4 text-left transition-all disabled:opacity-60",
                selected
                  ? "border-primary bg-primary-soft"
                  : "border-border hover:border-muted hover:bg-surface-elevated",
              )}
            >
              <span className="block text-sm font-semibold text-foreground">
                {LOCALE_LABELS[code]}
              </span>
              <span className="mt-1 block text-xs text-muted">
                {code.toUpperCase()}
              </span>
            </button>
          );
        })}
      </div>
      {isPending && (
        <p className="text-xs text-muted">{t("settings.language.applying")}</p>
      )}
    </div>
  );
}
