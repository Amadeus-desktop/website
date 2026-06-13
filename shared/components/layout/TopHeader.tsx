"use client";

import { JamBadge } from "@/features/jam/components/JamBadge";
import { logout } from "@/features/auth/actions/auth";
import type { JamBalance } from "@/shared/types/database";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type TopHeaderProps = {
  userEmail?: string;
  jamBalance?: JamBalance | null;
};

export function TopHeader({ userEmail, jamBalance }: TopHeaderProps) {
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    router.push(`/?${params.toString()}`);
    setSearchOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 flex h-[var(--header-h)] items-center justify-between border-b border-border bg-background px-4 lg:px-6">
      <Link href="/" className="text-xl font-bold tracking-tight text-primary">
        LoveyDovey
      </Link>

      <div className="flex items-center gap-2 sm:gap-4">
        {searchOpen ? (
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="캐릭터 검색..."
              className="h-9 w-36 rounded-full border border-border bg-surface px-3 text-sm text-foreground outline-none focus:border-primary sm:w-52"
            />
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="text-xs text-muted hover:text-foreground"
            >
              닫기
            </button>
          </form>
        ) : (
          <button
            onClick={() => setSearchOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-foreground hover:bg-surface"
            aria-label="검색"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3-3" />
            </svg>
          </button>
        )}

        {jamBalance && <JamBadge balance={jamBalance} compact />}

        {userEmail ? (
          <div className="group relative">
            <button className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-surface-elevated text-xs font-bold text-primary">
              {userEmail[0]?.toUpperCase()}
            </button>
            <div className="invisible absolute right-0 top-full z-50 mt-2 w-40 rounded-xl border border-border bg-surface p-2 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100">
              <p className="truncate px-2 py-1 text-xs text-muted">{userEmail}</p>
              <form action={logout}>
                <button
                  type="submit"
                  className="w-full rounded-lg px-2 py-1.5 text-left text-sm text-foreground hover:bg-surface-elevated"
                >
                  로그아웃
                </button>
              </form>
            </div>
          </div>
        ) : (
          <Link
            href="/login"
            className="rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-white hover:opacity-90"
          >
            로그인
          </Link>
        )}
      </div>
    </header>
  );
}
