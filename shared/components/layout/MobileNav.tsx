"use client";

import { NAV_ICONS } from "@/shared/components/icons";
import { SIDEBAR_NAV } from "@/shared/config/navigation";
import { useT } from "@/shared/i18n/use-translate";
import { cn } from "@/shared/lib/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function MobileNav() {
  const pathname = usePathname();
  const t = useT();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-border bg-background md:hidden">
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
            className={cn(
              "interactive-link flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs font-medium transition-colors",
              isActive ? "text-primary" : "text-muted",
            )}
          >
            <Icon className="h-5 w-5" aria-hidden />
            {t(item.labelKey)}
          </Link>
        );
      })}
    </nav>
  );
}
