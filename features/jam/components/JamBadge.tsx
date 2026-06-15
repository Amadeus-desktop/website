"use client";

import { GiHoneyJar } from "@/shared/components/icons";
import { claimDailyJam } from "@/features/jam/actions/jam";
import { canClaimDaily } from "@/features/jam/lib/jam";
import { useT } from "@/shared/i18n/use-translate";
import { cn } from "@/shared/lib/cn";
import type { JamBalance } from "@/shared/types/database";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type JamBadgeProps = {
  balance: JamBalance | null;
  compact?: boolean;
};

export function JamBadge({ balance, compact }: JamBadgeProps) {
  const t = useT();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  if (!balance) return null;

  const canClaim = canClaimDaily(balance.last_daily_claim);

  function handleClaim() {
    setMessage(null);
    startTransition(async () => {
      const result = await claimDailyJam();
      if ("error" in result) {
        setMessage(result.error);
      } else {
        setMessage(`+${result.claimed}`);
        router.refresh();
      }
    });
  }

  return (
    <div className={cn("flex items-center gap-1.5", compact ? "text-xs" : "text-sm")}>
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full bg-surface-elevated px-2.5 py-1 font-semibold text-amber-400",
          compact && "px-2 py-0.5",
        )}
      >
        <GiHoneyJar className="h-3.5 w-3.5 shrink-0" aria-hidden />
        {balance.balance}
      </span>
      {canClaim && !compact && (
        <button
          onClick={handleClaim}
          disabled={isPending}
          className="rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary hover:bg-primary/30 disabled:opacity-50"
        >
          {isPending ? "..." : `+${t("jam.daily")}`}
        </button>
      )}
      {message && <span className="text-xs text-muted">{message}</span>}
    </div>
  );
}
