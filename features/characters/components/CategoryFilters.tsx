"use client";

import { cn } from "@/shared/lib/cn";
import { useRouter, useSearchParams } from "next/navigation";

const categories = [
  { id: "all", label: "All" },
  { id: "romance", label: "Modern Romance" },
  { id: "fantasy", label: "Romance Fantasy" },
  { id: "school", label: "School" },
  { id: "fantasy2", label: "Fantasy" },
  { id: "slice", label: "Slice of Life" },
  { id: "other", label: "Other" },
];

export function CategoryFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = searchParams.get("category") ?? "all";

  function setCategory(id: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (id === "all") params.delete("category");
    else params.set("category", id);
    router.replace(`/?${params.toString()}`);
  }

  return (
    <div className="hide-scrollbar flex gap-2 overflow-x-auto pb-1">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => setCategory(cat.id)}
          className={cn(
            "shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
            active === cat.id
              ? "border-primary bg-surface text-primary"
              : "border-border bg-surface-elevated text-muted hover:text-foreground",
          )}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
