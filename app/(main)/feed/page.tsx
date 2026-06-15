import { getServerLocale } from "@/shared/i18n/server";
import { translate } from "@/shared/i18n";

export default async function FeedPage() {
  const locale = await getServerLocale();

  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <p className="text-xl font-semibold text-foreground md:text-2xl">
        {translate(locale, "tabs.feed")}
      </p>
      <p className="mt-3 text-base text-muted md:text-lg">
        {translate(locale, "feed.comingSoon")}
      </p>
    </div>
  );
}
