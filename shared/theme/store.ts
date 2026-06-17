"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  ACCENT_COOKIE,
  DEFAULT_ACCENT,
  DEFAULT_THEME_MODE,
  THEME_COOKIE,
  type AccentColor,
  type ThemeMode,
} from "@/shared/config/theme";
import { applyThemeToDocument } from "@/shared/theme/apply-theme";

type ThemeStore = {
  mode: ThemeMode;
  accent: AccentColor;
  setMode: (mode: ThemeMode) => void;
  setAccent: (accent: AccentColor) => void;
};

function persistTheme(mode: ThemeMode, accent: AccentColor) {
  document.cookie = `${THEME_COOKIE}=${mode};path=/;max-age=31536000`;
  document.cookie = `${ACCENT_COOKIE}=${accent};path=/;max-age=31536000`;
  applyThemeToDocument(mode, accent);
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      mode: DEFAULT_THEME_MODE,
      accent: DEFAULT_ACCENT,
      setMode: (mode) =>
        set((state) => {
          persistTheme(mode, state.accent);
          return { mode };
        }),
      setAccent: (accent) =>
        set((state) => {
          persistTheme(state.mode, accent);
          return { accent };
        }),
    }),
    { name: "amadeus-theme" },
  ),
);
