import { cn } from "@/shared/lib/cn";
import { type HTMLAttributes } from "react";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "primary" | "success";
};

const variantStyles = {
  default: "bg-surface-elevated text-muted",
  primary: "bg-primary-soft text-primary",
  success: "bg-emerald-50 text-emerald-600",
};

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className,
      )}
      {...props}
    />
  );
}
