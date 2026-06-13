import { getLevelLabel } from "@/features/intimacy/lib/intimacy";
import type { IntimacyLevel } from "@/shared/types/database";

type IntimacyBarProps = {
  score: number;
  level: IntimacyLevel;
  compact?: boolean;
};

export function IntimacyBar({ score, level, compact }: IntimacyBarProps) {
  const label = getLevelLabel(level);

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-primary-soft">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${score}%` }}
          />
        </div>
        <span className="text-xs font-medium text-primary whitespace-nowrap">
          {label}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 rounded-xl bg-primary-soft/50 p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">친밀도</span>
        <span className="text-sm font-semibold text-primary">
          {label} · {score}%
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary/70 to-primary transition-all duration-500"
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
