import { ensureUserPersonas } from "@/features/personas/actions/provision";
import {
  buildDesktopAuthCallbackUrl,
  isExplicitDesktopAuthCallback,
  shouldBridgeOAuthToDesktop,
} from "@/features/auth/lib/desktop-callback";
import { createClient } from "@/shared/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const { searchParams, origin } = url;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (isExplicitDesktopAuthCallback(searchParams)) {
    return NextResponse.redirect(buildDesktopAuthCallbackUrl(url.search), 302);
  }

  let exchangeFailed = false;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        await ensureUserPersonas(user.id);
      }

      const safeNext = next.startsWith("/") ? next : "/";
      return NextResponse.redirect(`${origin}${safeNext}`);
    }

    exchangeFailed = true;
  }

  if (shouldBridgeOAuthToDesktop(searchParams, exchangeFailed)) {
    return NextResponse.redirect(buildDesktopAuthCallbackUrl(url.search), 302);
  }

  return NextResponse.redirect(`${origin}/login`);
}
