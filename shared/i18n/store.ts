"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  type Locale,
} from "@/shared/config/app";

type LocaleStore = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

export const useLocaleStore = create<LocaleStore>()(
  persist(
    (set) => ({
      locale: DEFAULT_LOCALE,
      setLocale: (locale) => {
        document.cookie = `${LOCALE_COOKIE}=${locale};path=/;max-age=31536000`;
        set({ locale });
      },
    }),
    { name: "ld-locale" },
  ),
);
