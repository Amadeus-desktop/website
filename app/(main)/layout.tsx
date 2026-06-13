import { getCurrentUser } from "@/features/auth/actions/auth";
import {
  BottomTabBar,
  Sidebar,
} from "@/shared/components/layout/AppNav";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-full flex-1">
      <Sidebar userEmail={user?.email} />
      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center border-b border-border bg-surface px-4 lg:hidden">
          <span className="text-lg font-bold text-primary">LoveyDovey</span>
        </header>
        <main className="flex-1 overflow-y-auto px-4 py-6 pb-20 lg:pb-6">
          {children}
        </main>
        <BottomTabBar />
      </div>
    </div>
  );
}
