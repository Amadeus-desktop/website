"use client";

import {
  DESKTOP_RELEASES_URL,
  formatDownloadSize,
  selectMacDownload,
  type DesktopReleaseInfo,
  type MacDownloadArch,
  type MacDownloadOption,
} from "@/features/install/lib/github-release";
import { detectMacArch } from "@/features/install/lib/detect-mac-arch";
import type { Locale } from "@/shared/config/app";
import { cn } from "@/shared/lib/cn";
import { translate } from "@/shared/i18n";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type InstallDownloadSectionProps = {
  locale: Locale;
  release: DesktopReleaseInfo | null;
};

const buttonClassName =
  "inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-base font-semibold text-white transition-colors hover:opacity-90";

function archLabel(
  locale: Locale,
  arch: MacDownloadArch,
): string {
  switch (arch) {
    case "aarch64":
      return translate(locale, "install.page.downloadAppleSilicon");
    case "x86_64":
      return translate(locale, "install.page.downloadIntel");
    default:
      return translate(locale, "install.page.downloadUniversal");
  }
}

export function InstallDownloadSection({
  locale,
  release,
}: InstallDownloadSectionProps) {
  const [detectedArch, setDetectedArch] = useState<MacDownloadArch | "unknown">(
    "unknown",
  );

  useEffect(() => {
    setDetectedArch(detectMacArch());
  }, []);

  const primaryDownload = useMemo(
    () =>
      release
        ? selectMacDownload(release.macDownloads, detectedArch)
        : null,
    [release, detectedArch],
  );

  const secondaryDownloads = useMemo(() => {
    if (!release || !primaryDownload) return [];
    return release.macDownloads.filter(
      (item) => item.fileName !== primaryDownload.fileName,
    );
  }, [release, primaryDownload]);

  if (!release || !primaryDownload) {
    return (
      <div className="mt-10 flex flex-col items-center gap-3">
        <a
          href={DESKTOP_RELEASES_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClassName}
        >
          {translate(locale, "install.page.viewReleases")}
        </a>
        <p className="text-sm text-muted">
          {translate(locale, "install.page.noRelease")}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-10 flex w-full max-w-md flex-col items-center gap-4">
      <p className="text-sm font-medium text-muted">
        {translate(locale, "install.page.latestVersion", {
          version: release.version,
        })}
      </p>

      <a
        href={primaryDownload.url}
        className={buttonClassName}
        download={primaryDownload.fileName}
      >
        {archLabel(locale, primaryDownload.arch)}
      </a>

      <p className="text-sm text-muted">
        {[
          primaryDownload.fileName,
          formatDownloadSize(primaryDownload.sizeBytes),
        ]
          .filter(Boolean)
          .join(" · ")}
      </p>

      {detectedArch !== "unknown" ? (
        <p className="text-xs text-muted">
          {translate(locale, "install.page.detectedMac", {
            arch:
              detectedArch === "aarch64"
                ? translate(locale, "install.page.archAppleSilicon")
                : translate(locale, "install.page.archIntel"),
          })}
        </p>
      ) : null}

      {secondaryDownloads.length > 0 ? (
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm">
          {secondaryDownloads.map((item) => (
            <DownloadLink
              key={item.fileName}
              locale={locale}
              item={item}
            />
          ))}
        </div>
      ) : null}

      <Link
        href={DESKTOP_RELEASES_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-muted underline-offset-4 hover:text-foreground hover:underline"
      >
        {translate(locale, "install.page.allReleases")}
      </Link>
    </div>
  );
}

function DownloadLink({
  locale,
  item,
}: {
  locale: Locale;
  item: MacDownloadOption;
}) {
  return (
    <a
      href={item.url}
      download={item.fileName}
      className={cn(
        "text-muted underline-offset-4 hover:text-foreground hover:underline",
      )}
    >
      {archLabel(locale, item.arch)}
      {item.sizeBytes > 0
        ? ` (${formatDownloadSize(item.sizeBytes)})`
        : ""}
    </a>
  );
}
