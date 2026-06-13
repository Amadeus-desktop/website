"use client";

import { cn } from "@/shared/lib/cn";
import { useRouter, useSearchParams } from "next/navigation";

const sorts = [
  { id: "trending", label: "Trending" },
  { id: "best", label: "Best" },
  { id: "new", label: "New" },
];

export function SortTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = searchParams.get("sort") ?? "trending";

  function setSort(id: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (id === "trending") params.delete("sort");
    else params.set("sort", id);
    router.replace(`/?${params.toString()}`);
  }

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex gap-5">
        {sorts.map((sort) => (
          <button
            key={sort.id}
            onClick={() => setSort(sort.id)}
            className={cn(
              "text-sm font-semibold transition-colors",
              active === sort.id
                ? "text-foreground"
                : "text-muted hover:text-foreground",
            )}
          >
            {sort.label}
          </button>
        ))}
      </div>
    </div>
  );
}
