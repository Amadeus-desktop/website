import { IconSidebar } from "@/shared/components/layout/IconSidebar";
import { MainTabs } from "@/shared/components/layout/MainTabs";
import { TopHeader } from "@/shared/components/layout/TopHeader";
import { getCurrentUser } from "@/features/auth/actions/auth";
import { getJamBalance } from "@/features/jam/actions/jam";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  const jamBalance = user ? await getJamBalance() : null;

  return (
    <div className="flex min-h-screen bg-background">
      <IconSidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <TopHeader userEmail={user?.email} jamBalance={jamBalance} />
        <MainTabs />
        <main className="flex-1 px-4 py-4 lg:px-6">{children}</main>
      </div>
    </div>
  );
}
