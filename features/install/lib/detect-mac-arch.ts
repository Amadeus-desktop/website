import type { MacDownloadArch } from "@/features/install/lib/github-release";

export function detectMacArch(): MacDownloadArch | "unknown" {
  if (typeof navigator === "undefined") return "unknown";

  const uaData = (
    navigator as Navigator & {
      userAgentData?: {
        platform?: string;
        architecture?: string;
      };
    }
  ).userAgentData;

  if (uaData?.platform === "macOS") {
    if (uaData.architecture === "arm") return "aarch64";
    if (uaData.architecture === "x86") return "x86_64";
  }

  const ua = navigator.userAgent.toLowerCase();
  if (!ua.includes("mac")) return "unknown";

  return "unknown";
}
