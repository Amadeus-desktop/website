import { cn } from "@/shared/lib/cn";
import { LAYOUT } from "@/shared/config/layout";

type ContentContainerProps = {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
};

export function ContentContainer({
  children,
  className,
  fullWidth,
}: ContentContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full",
        !fullWidth && "max-w-[var(--content-max-w)]",
        className,
      )}
      style={{ "--content-max-w": LAYOUT.contentMaxWidth } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
