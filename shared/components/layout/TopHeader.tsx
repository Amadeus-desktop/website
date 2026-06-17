"use client";

import { HiMagnifyingGlass } from "@/shared/components/icons";
import { APP_NAME } from "@/shared/config/app";
import { TYPO } from "@/shared/config/layout";
import { logout } from "@/features/auth/actions/auth";
import { useT } from "@/shared/i18n/use-translate";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type TopHeaderProps = {
  userEmail?: string;
};

export function TopHeader({ userEmail }: TopHeaderProps) {
  const t = useT();
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
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <div className="mx-auto flex h-[var(--header-h)] w-full max-w-[var(--content-max-w)] items-center justify-between gap-4 px-4 md:px-6">
        <Link
          href="/"
          className={`interactive-link font-bold tracking-tight text-primary ${TYPO.header}`}
        >
          {APP_NAME}
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          {searchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("common.search")}
                className="h-10 w-40 rounded-full border border-border bg-surface px-4 text-sm text-foreground outline-none focus:border-primary sm:w-56"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="text-sm text-muted hover:text-foreground"
              >
                {t("common.close")}
              </button>
            </form>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-foreground hover:bg-surface"
              aria-label={t("common.search")}
            >
              <HiMagnifyingGlass className="h-5 w-5" aria-hidden />
            </button>
          )}

          <Link
            href="/settings"
            className="hidden h-10 items-center rounded-full px-3 text-sm font-medium text-muted hover:bg-surface hover:text-foreground sm:inline-flex"
          >
            {t("nav.settings")}
          </Link>

          {userEmail ? (
            <div className="group relative">
              <button className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-surface-elevated text-sm font-bold text-primary">
                {userEmail[0]?.toUpperCase()}
              </button>
              <div className="invisible absolute right-0 top-full z-50 mt-2 w-44 rounded-xl border border-border bg-surface p-2 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100">
                <p className="truncate px-2 py-1 text-xs text-muted">{userEmail}</p>
                <Link
                  href="/settings"
                  className="interactive-link block rounded-lg px-2 py-2 text-sm text-foreground hover:bg-surface-elevated"
                >
                  {t("nav.settings")}
                </Link>
                <form action={logout}>
                  <button
                    type="submit"
                    className="w-full rounded-lg px-2 py-2 text-left text-sm text-foreground hover:bg-surface-elevated"
                  >
                    {t("common.logout")}
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="interactive-link inline-flex h-8 items-center rounded-full bg-primary px-3 text-xs font-semibold text-white hover:opacity-90"
            >
              {t("common.login")}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
