import type { Locale } from "@/shared/config/app";

export type NavItem = {
  href: string;
  labelKey: string;
  icon: "home" | "chat" | "create";
};

export const SIDEBAR_NAV: NavItem[] = [
  { href: "/", labelKey: "nav.home", icon: "home" },
  { href: "/chat", labelKey: "nav.chat", icon: "chat" },
  { href: "/characters/new", labelKey: "nav.create", icon: "create" },
];

export const MAIN_TABS = [
  { href: "/", labelKey: "tabs.character", match: ["/", "/characters"] },
  { href: "/feed", labelKey: "tabs.feed", match: ["/feed"] },
] as const;

export const CATEGORIES = [
  { id: "all", labelKey: "category.all" },
  { id: "romance", labelKey: "category.romance" },
  { id: "fantasy", labelKey: "category.fantasy" },
  { id: "school", labelKey: "category.school" },
  { id: "fantasy2", labelKey: "category.fantasy2" },
  { id: "slice", labelKey: "category.slice" },
  { id: "other", labelKey: "category.other" },
] as const;

export const SORT_OPTIONS = [
  { id: "trending", labelKey: "sort.trending" },
  { id: "best", labelKey: "sort.best" },
  { id: "new", labelKey: "sort.new" },
] as const;

export type MessageKey = string;

export type Messages = Record<MessageKey, string>;

export function createMessages(locale: Locale, dict: Messages): Messages {
  return dict;
}
