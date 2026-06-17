"use client";

import { THEME_MODES, type ThemeMode } from "@/shared/config/theme";
import { useThemeStore } from "@/shared/theme/store";
import { useT } from "@/shared/i18n/use-translate";
import { cn } from "@/shared/lib/cn";

export function ThemeModeSelector() {
  const t = useT();
  const mode = useThemeStore((s) => s.mode);
  const setMode = useThemeStore((s) => s.setMode);

  const options: { id: ThemeMode; labelKey: string }[] = [
    { id: "dark", labelKey: "settings.theme.dark" },
    { id: "light", labelKey: "settings.theme.light" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {options.map((option) => {
        const selected = mode === option.id;

        return (
          <button
            key={option.id}
            type="button"
            onClick={() => setMode(option.id)}
            className={cn(
              "rounded-2xl border px-4 py-4 text-left transition-all",
              selected
                ? "border-primary bg-primary-soft"
                : "border-border bg-surface hover:border-muted hover:bg-surface-elevated",
            )}
          >
            <span className="block text-sm font-semibold text-foreground">
              {t(option.labelKey)}
            </span>
            <span
              className={cn(
                "mt-3 block h-12 rounded-xl border",
                option.id === "dark"
                  ? "border-[#333] bg-[#191919]"
                  : "border-[#ddd] bg-[#f5f5f7]",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
