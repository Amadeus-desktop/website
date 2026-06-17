export const DESKTOP_RELEASES_URL =
  "https://github.com/Amadeus-desktop/desktop/releases";

export const DESKTOP_REPO = "Amadeus-desktop/desktop";

const GITHUB_API_BASE = "https://api.github.com/repos/Amadeus-desktop/desktop";

type GithubAsset = {
  name: string;
  browser_download_url: string;
  size: number;
};

type GithubRelease = {
  tag_name: string;
  name: string;
  html_url: string;
  assets: GithubAsset[];
  published_at: string;
  draft: boolean;
  prerelease: boolean;
};

export type MacDownloadArch = "aarch64" | "x86_64" | "universal";

export type MacDownloadOption = {
  arch: MacDownloadArch;
  url: string;
  fileName: string;
  sizeBytes: number;
};

export type DesktopReleaseInfo = {
  version: string;
  tagName: string;
  releaseUrl: string;
  publishedAt: string;
  macDownloads: MacDownloadOption[];
};

function classifyMacDmgAsset(fileName: string): MacDownloadArch | null {
  const lower = fileName.toLowerCase();
  if (!lower.endsWith(".dmg")) return null;

  if (/(universal)/.test(lower)) return "universal";
  if (/(aarch64|arm64|apple[-_]?silicon)/.test(lower)) return "aarch64";
  if (/(x86_64|x64|intel)/.test(lower)) return "x86_64";

  return null;
}

function normalizeVersion(tagName: string): string {
  return tagName.replace(/^v/i, "");
}

export function pickMacDownloads(assets: GithubAsset[]): MacDownloadOption[] {
  const byArch = new Map<MacDownloadArch, MacDownloadOption>();

  for (const asset of assets) {
    const arch = classifyMacDmgAsset(asset.name);
    if (!arch || byArch.has(arch)) continue;

    byArch.set(arch, {
      arch,
      url: asset.browser_download_url,
      fileName: asset.name,
      sizeBytes: asset.size,
    });
  }

  const order: MacDownloadArch[] = ["aarch64", "x86_64", "universal"];
  const specific = order.flatMap((arch) => {
    const option = byArch.get(arch);
    return option ? [option] : [];
  });

  if (specific.length > 0) return specific;

  const genericDmg = assets.find((asset) =>
    asset.name.toLowerCase().endsWith(".dmg"),
  );

  if (!genericDmg) return [];

  return [
    {
      arch: "universal",
      url: genericDmg.browser_download_url,
      fileName: genericDmg.name,
      sizeBytes: genericDmg.size,
    },
  ];
}

export function selectMacDownload(
  downloads: MacDownloadOption[],
  preferredArch: MacDownloadArch | "unknown" = "unknown",
): MacDownloadOption | null {
  if (downloads.length === 0) return null;

  if (preferredArch === "aarch64") {
    return (
      downloads.find((item) => item.arch === "aarch64") ??
      downloads.find((item) => item.arch === "universal") ??
      downloads[0]
    );
  }

  if (preferredArch === "x86_64") {
    return (
      downloads.find((item) => item.arch === "x86_64") ??
      downloads.find((item) => item.arch === "universal") ??
      downloads[0]
    );
  }

  return (
    downloads.find((item) => item.arch === "universal") ??
    downloads.find((item) => item.arch === "aarch64") ??
    downloads[0]
  );
}

export function formatDownloadSize(bytes: number): string {
  if (bytes <= 0) return "";
  const mb = bytes / (1024 * 1024);
  if (mb >= 100) return `${Math.round(mb)} MB`;
  if (mb >= 10) return `${mb.toFixed(0)} MB`;
  return `${mb.toFixed(1)} MB`;
}

function toReleaseInfo(release: GithubRelease): DesktopReleaseInfo {
  return {
    version: normalizeVersion(release.tag_name),
    tagName: release.tag_name,
    releaseUrl: release.html_url,
    publishedAt: release.published_at,
    macDownloads: pickMacDownloads(release.assets),
  };
}

async function fetchGithubRelease(url: string): Promise<GithubRelease | null> {
  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "Amadeus-web",
    },
    next: { revalidate: 300 },
  });

  if (!response.ok) return null;
  return (await response.json()) as GithubRelease;
}

export async function getDesktopRelease(): Promise<DesktopReleaseInfo | null> {
  const latest = await fetchGithubRelease(`${GITHUB_API_BASE}/releases/latest`);
  if (latest && !latest.draft) {
    const info = toReleaseInfo(latest);
    if (info.macDownloads.length > 0) return info;
  }

  const response = await fetch(`${GITHUB_API_BASE}/releases?per_page=10`, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "Amadeus-web",
    },
    next: { revalidate: 300 },
  });

  if (!response.ok) return null;

  const releases = (await response.json()) as GithubRelease[];
  for (const release of releases) {
    if (release.draft) continue;
    const info = toReleaseInfo(release);
    if (info.macDownloads.length > 0) return info;
  }

  return null;
}
