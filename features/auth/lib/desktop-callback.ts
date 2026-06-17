/** Custom URL scheme for Tauri desktop auth callback. */
export const DESKTOP_AUTH_SCHEME =
  process.env.NEXT_PUBLIC_DESKTOP_AUTH_SCHEME?.trim() || "amadeus";

export const DESKTOP_AUTH_CALLBACK_PATH = "/auth/callback";

export function buildDesktopAuthCallbackUrl(search: string): string {
  const query = search.startsWith("?") ? search : search ? `?${search}` : "";
  return `${DESKTOP_AUTH_SCHEME}://${DESKTOP_AUTH_CALLBACK_PATH.replace(/^\//, "")}${query}`;
}

export function isExplicitDesktopAuthCallback(
  searchParams: URLSearchParams,
): boolean {
  const client = searchParams.get("client")?.toLowerCase();
  const protocol = searchParams.get("protocol")?.toLowerCase();
  const next = searchParams.get("next");

  return (
    client === "desktop" ||
    client === "app" ||
    protocol === DESKTOP_AUTH_SCHEME.toLowerCase() ||
    next?.startsWith(`${DESKTOP_AUTH_SCHEME}://`) === true
  );
}

/** OAuth authorization code handoff to the desktop app (PKCE verifier lives in Tauri). */
export function shouldBridgeOAuthToDesktop(
  searchParams: URLSearchParams,
  exchangeFailed: boolean,
): boolean {
  if (isExplicitDesktopAuthCallback(searchParams)) {
    return true;
  }

  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (!code || !state) {
    return false;
  }

  return exchangeFailed;
}
