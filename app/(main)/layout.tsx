import { AppShell } from "@/shared/components/layout/AppShell";
import { getCurrentUser } from "@/features/auth/actions/auth";
import { getJamBalance } from "@/features/jam/actions/jam";
import { getServerLocale } from "@/shared/i18n/server";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, locale] = await Promise.all([
    getCurrentUser(),
    getServerLocale(),
  ]);
  const jamBalance = user ? await getJamBalance() : null;

  return (
    <AppShell
      locale={locale}
      userEmail={user?.email}
      jamBalance={jamBalance}
    >
      {children}
    </AppShell>
  );
}
