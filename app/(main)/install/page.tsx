import { InstallDownloadSection } from "@/features/install/components/InstallDownloadSection";
import { getDesktopRelease } from "@/features/install/lib/github-release";
import { getServerLocale } from "@/shared/i18n/server";
import { translate } from "@/shared/i18n";

export default async function InstallPage() {
  const locale = await getServerLocale();
  const release = await getDesktopRelease();

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center px-2 py-10 text-center md:py-16">
      <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl">
        {translate(locale, "install.page.headline1")}
      </h1>
      <p className="mt-2 text-3xl font-bold tracking-tight text-foreground md:text-5xl">
        <span className="bg-gradient-to-r from-sky-500 via-blue-500 to-violet-500 bg-clip-text text-transparent">
          macOS
        </span>
        {translate(locale, "install.page.headline2Suffix")}
      </p>
      <p className="mt-8 max-w-md text-base leading-relaxed text-muted md:text-lg">
        {translate(locale, "install.page.description")}
      </p>

      <InstallDownloadSection locale={locale} release={release} />
    </div>
  );
}
