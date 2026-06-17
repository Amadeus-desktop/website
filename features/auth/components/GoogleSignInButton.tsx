"use client";

import { createClient } from "@/shared/lib/supabase/client";
import { Button } from "@/shared/components/ui/Button";

type GoogleSignInButtonProps = {
  redirectTo?: string;
};

export function GoogleSignInButton({ redirectTo = "/" }: GoogleSignInButtonProps) {
  async function handleGoogleSignIn() {
    const supabase = createClient();
    const next = redirectTo.startsWith("/") ? redirectTo : "/";

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
  }

  return (
    <Button
      type="button"
      variant="secondary"
      className="w-full"
      onClick={handleGoogleSignIn}
    >
      Google로 계속하기
    </Button>
  );
}
