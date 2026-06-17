import { ensureUserPersonas } from "@/features/personas/actions/provision";
import {
  buildDesktopAuthCallbackUrl,
  isExplicitDesktopAuthCallback,
  shouldBridgeOAuthToDesktop,
} from "@/features/auth/lib/desktop-callback";
import { desktopAuthBridgeResponse } from "@/features/auth/lib/desktop-callback-bridge";
import { createClient } from "@/shared/lib/supabase/server";
import { NextResponse } from "next/server";

function bridgeToDesktopApp(search: string): Response {
  const deepLink = buildDesktopAuthCallbackUrl(search);
  return desktopAuthBridgeResponse(deepLink);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const { searchParams, origin } = url;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (isExplicitDesktopAuthCallback(searchParams)) {
    return bridgeToDesktopApp(url.search);
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
    return bridgeToDesktopApp(url.search);
  }

  return NextResponse.redirect(`${origin}/login`);
}
