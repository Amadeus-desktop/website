"use client";

import { CATEGORIES } from "@/shared/config/navigation";
import { TYPO } from "@/shared/config/layout";
import { useT } from "@/shared/i18n/use-translate";
import { cn } from "@/shared/lib/cn";
import { useRouter, useSearchParams } from "next/navigation";

export function CategoryFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = searchParams.get("category") ?? "all";
  const t = useT();

  function setCategory(id: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (id === "all") params.delete("category");
    else params.set("category", id);
    router.replace(`/?${params.toString()}`);
  }

  return (
    <div className="hide-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          onClick={() => setCategory(cat.id)}
          className={cn(
            "shrink-0 rounded-full border px-4 py-2 font-medium transition-colors md:px-5 md:py-2.5",
            TYPO.tab,
            active === cat.id
              ? "border-primary bg-surface text-primary"
              : "border-border bg-surface-elevated text-muted hover:text-foreground",
          )}
        >
          {t(cat.labelKey)}
        </button>
      ))}
    </div>
  );
}
