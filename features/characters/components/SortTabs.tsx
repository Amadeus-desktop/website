"use client";

import { SORT_OPTIONS } from "@/shared/config/navigation";
import { TYPO } from "@/shared/config/layout";
import { useT } from "@/shared/i18n/use-translate";
import { cn } from "@/shared/lib/cn";
import { useRouter, useSearchParams } from "next/navigation";

export function SortTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = searchParams.get("sort") ?? "trending";
  const t = useT();

  function setSort(id: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (id === "trending") params.delete("sort");
    else params.set("sort", id);
    router.replace(`/?${params.toString()}`);
  }

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex gap-5 md:gap-6">
        {SORT_OPTIONS.map((sort) => (
          <button
            key={sort.id}
            onClick={() => setSort(sort.id)}
            className={cn(
              "font-semibold transition-colors",
              TYPO.tab,
              active === sort.id
                ? "text-foreground"
                : "text-muted hover:text-foreground",
            )}
          >
            {t(sort.labelKey)}
          </button>
        ))}
      </div>
    </div>
  );
}
