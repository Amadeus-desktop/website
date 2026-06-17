"use client";

import { NAV_ICONS } from "@/shared/components/icons";
import { SIDEBAR_NAV } from "@/shared/config/navigation";
import { useT } from "@/shared/i18n/use-translate";
import { cn } from "@/shared/lib/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function IconSidebar() {
  const pathname = usePathname();
  const t = useT();

  return (
    <aside className="hidden md:flex w-[var(--sidebar-w)] shrink-0 flex-col items-center gap-3 border-r border-border bg-background py-5">
      {SIDEBAR_NAV.map((item) => {
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);
        const Icon = NAV_ICONS[item.icon];

        return (
          <Link
            key={item.href}
            href={item.href}
            title={t(item.labelKey)}
            className={cn(
              "interactive-link flex h-12 w-12 items-center justify-center rounded-2xl transition-colors",
              isActive
                ? "bg-surface-elevated text-foreground"
                : "text-muted hover:bg-surface hover:text-foreground",
            )}
          >
            <Icon className="h-6 w-6" aria-hidden />
          </Link>
        );
      })}
    </aside>
  );
}
