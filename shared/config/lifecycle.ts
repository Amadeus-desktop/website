/**
 * Amadeus request & UI lifecycle phases.
 * Used as shared vocabulary across server actions, layouts, and docs.
 */

export const REQUEST_LIFECYCLE = {
  /** Edge middleware: Supabase session refresh + route guards. */
  middleware: "middleware",
  /** Root layout: theme CSS vars from cookies. */
  rootLayout: "root-layout",
  /** Main layout: user, locale, theme shell props. */
  appShell: "app-shell",
  /** Route page / RSC data fetch. */
  pageRender: "page-render",
  /** Client hydration (ThemeProvider, I18nProvider, Zustand). */
  clientHydration: "client-hydration",
  /** Server Actions & Route Handlers (mutations, streaming). */
  mutation: "mutation",
} as const;

export const AUTH_LIFECYCLE = {
  anonymous: "anonymous",
  oauthRedirect: "oauth-redirect",
  callbackExchange: "callback-exchange",
  personaProvision: "persona-provision",
  authenticated: "authenticated",
} as const;

export const CHAT_LIFECYCLE = {
  idle: "idle",
  starting: "starting",
  loadingRoom: "loading-room",
  sending: "sending",
  streaming: "streaming",
  error: "error",
} as const;

export const CACHE_LIFECYCLE = {
  /** First request hits Supabase. */
  miss: "cache-miss",
  /** Served from unstable_cache / ISR revalidate window. */
  hit: "cache-hit",
  /** Search/filter bypasses catalog cache. */
  bypass: "cache-bypass",
} as const;

export type RequestLifecyclePhase =
  (typeof REQUEST_LIFECYCLE)[keyof typeof REQUEST_LIFECYCLE];

export type AuthLifecyclePhase =
  (typeof AUTH_LIFECYCLE)[keyof typeof AUTH_LIFECYCLE];

export type ChatLifecyclePhase =
  (typeof CHAT_LIFECYCLE)[keyof typeof CHAT_LIFECYCLE];

export type CacheLifecyclePhase =
  (typeof CACHE_LIFECYCLE)[keyof typeof CACHE_LIFECYCLE];
