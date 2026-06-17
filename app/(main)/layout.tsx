import { AppShell } from "@/shared/components/layout/AppShell";
import { getCurrentUser } from "@/features/auth/actions/auth";
import { getServerLocale } from "@/shared/i18n/server";
import { getServerTheme } from "@/shared/theme/server";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, locale, theme] = await Promise.all([
    getCurrentUser(),
    getServerLocale(),
    getServerTheme(),
  ]);

  return (
    <AppShell
      locale={locale}
      themeMode={theme.mode}
      accent={theme.accent}
      userEmail={user?.email}
    >
      {children}
    </AppShell>
  );
}
