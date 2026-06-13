"use client";

import { logout } from "@/features/auth/actions/auth";
import { cn } from "@/shared/lib/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "홈", icon: "🏠" },
  { href: "/characters", label: "캐릭터", icon: "✨" },
  { href: "/chat", label: "대화", icon: "💬" },
];

type SidebarProps = {
  userEmail?: string;
};

export function Sidebar({ userEmail }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:w-60 lg:shrink-0 lg:flex-col lg:border-r lg:border-border lg:bg-surface">
      <div className="flex h-16 items-center px-6">
        <Link href="/" className="text-xl font-bold text-primary">
          LoveyDovey
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary-soft text-primary"
                  : "text-muted hover:bg-surface-elevated hover:text-foreground",
              )}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-4">
        {userEmail && (
          <p className="mb-2 truncate text-xs text-muted">{userEmail}</p>
        )}
        <form action={logout}>
          <button
            type="submit"
            className="w-full rounded-xl px-3 py-2 text-left text-sm text-muted transition-colors hover:bg-surface-elevated hover:text-foreground"
          >
            로그아웃
          </button>
        </form>
      </div>
    </aside>
  );
}

export function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-border bg-surface lg:hidden">
      {navItems.map((item) => {
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-1 flex-col items-center gap-0.5 py-2 text-xs transition-colors",
              isActive ? "text-primary" : "text-muted",
            )}
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
