"use client";

import { cn } from "@/shared/lib/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";

const mainTabs = [
  { href: "/", label: "Character" },
  { href: "/feed", label: "Feed" },
];

export function MainTabs() {
  const pathname = usePathname();

  return (
    <div className="flex gap-6 border-b border-border px-4 lg:px-6">
      {mainTabs.map((tab) => {
        const isActive =
          tab.href === "/"
            ? pathname === "/" || pathname.startsWith("/characters")
            : pathname.startsWith(tab.href);

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "relative pb-3 pt-2 text-sm font-semibold transition-colors",
              isActive ? "text-foreground" : "text-muted hover:text-foreground",
            )}
          >
            {tab.label}
            {isActive && (
              <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-primary" />
            )}
          </Link>
        );
      })}
    </div>
  );
}
