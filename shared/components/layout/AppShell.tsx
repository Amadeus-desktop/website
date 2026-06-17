"use client";

import { MobileNav } from "@/shared/components/layout/MobileNav";
import { IconSidebar } from "@/shared/components/layout/IconSidebar";
import { MainTabs } from "@/shared/components/layout/MainTabs";
import { TopHeader } from "@/shared/components/layout/TopHeader";
import { ContentContainer } from "@/shared/components/layout/ContentContainer";
import { SiteFooter } from "@/shared/components/layout/SiteFooter";
import { I18nProvider } from "@/shared/i18n/provider";
import { ThemeProvider } from "@/shared/theme/provider";
import type { Locale } from "@/shared/config/app";
import type { AccentColor, ThemeMode } from "@/shared/config/theme";

type AppShellProps = {
  children: React.ReactNode;
  locale: Locale;
  themeMode: ThemeMode;
  accent: AccentColor;
  userEmail?: string;
};

export function AppShell({
  children,
  locale,
  themeMode,
  accent,
  userEmail,
}: AppShellProps) {
  return (
    <ThemeProvider initialMode={themeMode} initialAccent={accent}>
      <I18nProvider initialLocale={locale}>
        <div className="flex min-h-screen bg-background">
          <IconSidebar />
          <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            <TopHeader userEmail={userEmail} />
            <MainTabs />
            <main className="flex-1 overflow-y-auto px-4 py-5 pb-20 md:px-6 md:py-6 md:pb-6">
              <ContentContainer className="flex min-h-full flex-col">
                {children}
                <SiteFooter className="mt-10" />
              </ContentContainer>
            </main>
            <MobileNav />
          </div>
        </div>
      </I18nProvider>
    </ThemeProvider>
  );
}
