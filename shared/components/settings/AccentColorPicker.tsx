"use client";

import {
  ACCENT_COLORS,
  ACCENT_PRESETS,
  type AccentColor,
} from "@/shared/config/theme";
import { useThemeStore } from "@/shared/theme/store";
import { useT } from "@/shared/i18n/use-translate";
import { cn } from "@/shared/lib/cn";

export function AccentColorPicker() {
  const t = useT();
  const accent = useThemeStore((s) => s.accent);
  const setAccent = useThemeStore((s) => s.setAccent);

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
      {ACCENT_COLORS.map((color) => {
        const preset = ACCENT_PRESETS[color];
        const selected = accent === color;

        return (
          <button
            key={color}
            type="button"
            onClick={() => setAccent(color)}
            className={cn(
              "flex flex-col items-center gap-3 rounded-2xl border bg-surface px-3 py-4 transition-all",
              selected
                ? "border-[var(--primary)] shadow-[0_0_0_1px_var(--primary),0_0_24px_color-mix(in_srgb,var(--primary)_35%,transparent)]"
                : "border-border hover:border-muted hover:bg-surface-elevated",
            )}
          >
            <span
              className={cn(
                "h-10 w-10 rounded-xl transition-shadow",
                selected && "shadow-[0_0_20px_color-mix(in_srgb,var(--primary)_45%,transparent)]",
              )}
              style={{ backgroundColor: preset.primary }}
            />
            <span className="text-sm font-medium text-foreground">
              {t(preset.labelKey)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
