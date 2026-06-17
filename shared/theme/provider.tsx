"use client";

import { useEffect } from "react";
import {
  DEFAULT_ACCENT,
  DEFAULT_THEME_MODE,
  type AccentColor,
  type ThemeMode,
} from "@/shared/config/theme";
import { applyThemeToDocument } from "@/shared/theme/apply-theme";
import { useThemeStore } from "@/shared/theme/store";

type ThemeProviderProps = {
  initialMode?: ThemeMode;
  initialAccent?: AccentColor;
  children: React.ReactNode;
};

export function ThemeProvider({
  initialMode = DEFAULT_THEME_MODE,
  initialAccent = DEFAULT_ACCENT,
  children,
}: ThemeProviderProps) {
  useEffect(() => {
    applyThemeToDocument(initialMode, initialAccent);
    useThemeStore.setState({ mode: initialMode, accent: initialAccent });
  }, [initialMode, initialAccent]);

  return <>{children}</>;
}
