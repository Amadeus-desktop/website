import { cookies } from "next/headers";
import {
  ACCENT_COOKIE,
  DEFAULT_ACCENT,
  DEFAULT_THEME_MODE,
  THEME_COOKIE,
  isAccentColor,
  isThemeMode,
  type AccentColor,
  type ThemeMode,
} from "@/shared/config/theme";

export async function getServerTheme(): Promise<{
  mode: ThemeMode;
  accent: AccentColor;
}> {
  const cookieStore = await cookies();
  const modeValue = cookieStore.get(THEME_COOKIE)?.value;
  const accentValue = cookieStore.get(ACCENT_COOKIE)?.value;

  return {
    mode: modeValue && isThemeMode(modeValue) ? modeValue : DEFAULT_THEME_MODE,
    accent:
      accentValue && isAccentColor(accentValue) ? accentValue : DEFAULT_ACCENT,
  };
}
