import {
  CHAT_MODE_DESCRIPTIONS,
  CHAT_MODE_LABELS,
  type ChatMode,
} from "@/features/jam/lib/jam";
import { cn } from "@/shared/lib/cn";

type ChatModeSelectorProps = {
  mode: ChatMode;
  onChange: (mode: ChatMode) => void;
  disabled?: boolean;
};

const modes: ChatMode[] = ["simple", "long", "exciting"];

export function ChatModeSelector({
  mode,
  onChange,
  disabled,
}: ChatModeSelectorProps) {
  return (
    <div className="flex gap-1 rounded-xl bg-surface-elevated p-1">
      {modes.map((m) => (
        <button
          key={m}
          type="button"
          disabled={disabled}
          onClick={() => onChange(m)}
          title={CHAT_MODE_DESCRIPTIONS[m]}
          className={cn(
            "rounded-lg px-2.5 py-1 text-xs font-medium transition-colors disabled:opacity-50",
            mode === m
              ? "bg-primary text-white shadow-sm"
              : "text-muted hover:text-foreground",
          )}
        >
          {CHAT_MODE_LABELS[m]}
        </button>
      ))}
    </div>
  );
}
