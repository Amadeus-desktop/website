import { AccentColorPicker } from "@/shared/components/settings/AccentColorPicker";
import { ThemeModeSelector } from "@/shared/components/settings/ThemeModeSelector";
import { getServerLocale } from "@/shared/i18n/server";
import { translate } from "@/shared/i18n";

export default async function SettingsPage() {
  const locale = await getServerLocale();

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          {translate(locale, "settings.title")}
        </h1>
        <p className="mt-2 text-sm text-muted">
          {translate(locale, "settings.subtitle")}
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground">
          {translate(locale, "settings.theme.title")}
        </h2>
        <ThemeModeSelector />
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground">
          {translate(locale, "settings.accent.title")}
        </h2>
        <AccentColorPicker />
      </section>
    </div>
  );
}
