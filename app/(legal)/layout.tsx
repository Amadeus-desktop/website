import { ContentContainer } from "@/shared/components/layout/ContentContainer";
import { SiteFooter } from "@/shared/components/layout/SiteFooter";
import { I18nProvider } from "@/shared/i18n/provider";
import { getServerLocale } from "@/shared/i18n/server";

export default async function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getServerLocale();

  return (
    <I18nProvider initialLocale={locale}>
      <div className="flex min-h-screen flex-col bg-background">
        <main className="flex-1 px-4 py-8 md:px-6 md:py-12">
          <ContentContainer>{children}</ContentContainer>
        </main>
        <ContentContainer className="pb-8">
          <SiteFooter />
        </ContentContainer>
      </div>
    </I18nProvider>
  );
}
