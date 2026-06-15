"use client";

import { MAIN_TABS } from "@/shared/config/navigation";
import { TYPO } from "@/shared/config/layout";
import { useT } from "@/shared/i18n/use-translate";
import { cn } from "@/shared/lib/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function MainTabs() {
  const pathname = usePathname();
  const t = useT();

  return (
    <div className="border-b border-border">
      <div className="mx-auto flex w-full max-w-[var(--content-max-w)] gap-6 px-4 md:px-6">
        {MAIN_TABS.map((tab) => {
          const isActive = tab.match.some((m) =>
            m === "/" ? pathname === "/" : pathname.startsWith(m),
          );

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "relative pb-3 pt-3 font-semibold transition-colors",
                TYPO.tab,
                isActive ? "text-foreground" : "text-muted hover:text-foreground",
              )}
            >
              {t(tab.labelKey)}
              {isActive && (
                <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
