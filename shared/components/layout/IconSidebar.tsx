"use client";

import { cn } from "@/shared/lib/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  {
    href: "/",
    label: "Home",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3l9 8v10a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1V11l9-8z" />
      </svg>
    ),
  },
  {
    href: "/chat",
    label: "Chat",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4 4h16a2 2 0 012 2v9a2 2 0 01-2 2H8l-4 4V6a2 2 0 012-2z" />
      </svg>
    ),
  },
  {
    href: "/characters/new",
    label: "Create",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 4a1 1 0 011 1v6h6a1 1 0 110 2h-6v6a1 1 0 11-2 0v-6H5a1 1 0 110-2h6V5a1 1 0 011-1z" />
      </svg>
    ),
  },
];

export function IconSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-[var(--sidebar-w)] shrink-0 flex-col items-center gap-3 border-r border-border bg-background py-4">
      {items.map((item) => {
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            title={item.label}
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-2xl transition-colors",
              isActive
                ? "bg-surface-elevated text-foreground"
                : "text-muted hover:bg-surface hover:text-foreground",
            )}
          >
            {item.icon}
          </Link>
        );
      })}
    </aside>
  );
}
