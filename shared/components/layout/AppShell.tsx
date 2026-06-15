"use client";

import { MobileNav } from "@/shared/components/layout/MobileNav";
import { IconSidebar } from "@/shared/components/layout/IconSidebar";
import { MainTabs } from "@/shared/components/layout/MainTabs";
import { TopHeader } from "@/shared/components/layout/TopHeader";
import { ContentContainer } from "@/shared/components/layout/ContentContainer";
import { I18nProvider } from "@/shared/i18n/provider";
import type { Locale } from "@/shared/config/app";
import type { JamBalance } from "@/shared/types/database";

/**
 * Persistent client shell — sidebar/header stay mounted across route changes (SPA feel).
 * Server layout passes initial data once; chrome does not remount on navigation.
 */
type AppShellProps = {
  children: React.ReactNode;
  locale: Locale;
  userEmail?: string;
  jamBalance?: JamBalance | null;
};

export function AppShell({
  children,
  locale,
  userEmail,
  jamBalance,
}: AppShellProps) {
  return (
    <I18nProvider initialLocale={locale}>
      <div className="flex min-h-screen bg-background">
        <IconSidebar />
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <TopHeader userEmail={userEmail} jamBalance={jamBalance} />
          <MainTabs />
          <main className="flex-1 overflow-y-auto px-4 py-5 pb-20 md:px-6 md:py-6 md:pb-6">
            <ContentContainer>{children}</ContentContainer>
          </main>
          <MobileNav />
        </div>
      </div>
    </I18nProvider>
  );
}
