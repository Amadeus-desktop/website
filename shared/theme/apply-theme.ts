import {
  ACCENT_PRESETS,
  type AccentColor,
  THEME_PALETTES,
  type ThemeMode,
} from "@/shared/config/theme";

export function applyThemeToDocument(mode: ThemeMode, accent: AccentColor) {
  const palette = THEME_PALETTES[mode];
  const accentPreset = ACCENT_PRESETS[accent];
  const root = document.documentElement;

  root.dataset.theme = mode;
  root.dataset.accent = accent;
  root.style.setProperty("--background", palette.background);
  root.style.setProperty("--foreground", palette.foreground);
  root.style.setProperty("--surface", palette.surface);
  root.style.setProperty("--surface-elevated", palette.surfaceElevated);
  root.style.setProperty("--muted", palette.muted);
  root.style.setProperty("--muted-2", palette.muted2);
  root.style.setProperty("--border", palette.border);
  root.style.setProperty("--tag", palette.tag);
  root.style.setProperty("--primary", accentPreset.primary);
  root.style.setProperty("--primary-soft", accentPreset.soft);
}

export function getThemeInlineStyle(mode: ThemeMode, accent: AccentColor) {
  const palette = THEME_PALETTES[mode];
  const accentPreset = ACCENT_PRESETS[accent];

  return {
    "--background": palette.background,
    "--foreground": palette.foreground,
    "--surface": palette.surface,
    "--surface-elevated": palette.surfaceElevated,
    "--muted": palette.muted,
    "--muted-2": palette.muted2,
    "--border": palette.border,
    "--tag": palette.tag,
    "--primary": accentPreset.primary,
    "--primary-soft": accentPreset.soft,
  } as Record<string, string>;
}
