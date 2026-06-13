import { cn } from "@/shared/lib/cn";
import Image from "next/image";

type AvatarProps = {
  src?: string | null;
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
};

const sizeMap = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
  xl: "h-20 w-20 text-lg",
};

const imageSizeMap = {
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80,
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function Avatar({ src, name, size = "md", className }: AvatarProps) {
  const initials = getInitials(name);

  if (src) {
    return (
      <Image
        src={src}
        alt={name}
        width={imageSizeMap[size]}
        height={imageSizeMap[size]}
        className={cn(
          "rounded-full object-cover ring-2 ring-primary/20",
          sizeMap[size],
          className,
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-primary-soft font-semibold text-primary ring-2 ring-primary/20",
        sizeMap[size],
        className,
      )}
      aria-label={name}
    >
      {initials}
    </div>
  );
}
