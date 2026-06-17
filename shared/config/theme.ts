export const THEME_COOKIE = "amadeus_theme";
export const ACCENT_COOKIE = "amadeus_accent";

export const THEME_MODES = ["dark", "light"] as const;
export type ThemeMode = (typeof THEME_MODES)[number];

export const ACCENT_COLORS = [
  "rose",
  "lavender",
  "sky",
  "mint",
  "peach",
] as const;
export type AccentColor = (typeof ACCENT_COLORS)[number];

export const DEFAULT_THEME_MODE: ThemeMode = "dark";
export const DEFAULT_ACCENT: AccentColor = "sky";

export const ACCENT_PRESETS: Record<
  AccentColor,
  { labelKey: string; primary: string; soft: string }
> = {
  rose: {
    labelKey: "settings.accent.rose",
    primary: "#ff6b9d",
    soft: "rgba(255, 107, 157, 0.18)",
  },
  lavender: {
    labelKey: "settings.accent.lavender",
    primary: "#a78bfa",
    soft: "rgba(167, 139, 250, 0.18)",
  },
  sky: {
    labelKey: "settings.accent.sky",
    primary: "#38bdf8",
    soft: "rgba(56, 189, 248, 0.18)",
  },
  mint: {
    labelKey: "settings.accent.mint",
    primary: "#34d399",
    soft: "rgba(52, 211, 153, 0.18)",
  },
  peach: {
    labelKey: "settings.accent.peach",
    primary: "#fb923c",
    soft: "rgba(251, 146, 60, 0.18)",
  },
};

export const THEME_PALETTES: Record<
  ThemeMode,
  {
    background: string;
    foreground: string;
    surface: string;
    surfaceElevated: string;
    muted: string;
    muted2: string;
    border: string;
    tag: string;
  }
> = {
  dark: {
    background: "#191919",
    foreground: "#ffffff",
    surface: "#252525",
    surfaceElevated: "#303030",
    muted: "#999999",
    muted2: "#666666",
    border: "#333333",
    tag: "#6b8cce",
  },
  light: {
    background: "#f5f5f7",
    foreground: "#111111",
    surface: "#ffffff",
    surfaceElevated: "#ececf0",
    muted: "#666666",
    muted2: "#888888",
    border: "#e0e0e5",
    tag: "#4b6cb7",
  },
};

export function isThemeMode(value: string | undefined): value is ThemeMode {
  return THEME_MODES.includes(value as ThemeMode);
}

export function isAccentColor(value: string | undefined): value is AccentColor {
  return ACCENT_COLORS.includes(value as AccentColor);
}
