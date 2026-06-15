import { LoginForm } from "@/features/auth/components/LoginForm";
import { APP_NAME } from "@/shared/config/app";
import { SiteFooter } from "@/shared/components/layout/SiteFooter";
import { I18nProvider } from "@/shared/i18n/provider";
import { getServerLocale } from "@/shared/i18n/server";
import { translate } from "@/shared/i18n";
import Link from "next/link";

type LoginPageProps = {
  searchParams: Promise<{ redirect?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { redirect: redirectTo } = await searchParams;
  const locale = await getServerLocale();

  return (
    <I18nProvider initialLocale={locale}>
      <div className="flex min-h-screen flex-col bg-background px-4">
        <div className="flex flex-1 flex-col items-center justify-center">
          <Link href="/" className="mb-8 text-2xl font-bold text-primary">
            {APP_NAME}
          </Link>
          <div className="w-full max-w-md rounded-2xl bg-surface p-6 md:p-8">
            <h1 className="text-xl font-bold text-foreground md:text-2xl">
              {translate(locale, "auth.loginTitle")}
            </h1>
            <p className="mt-2 mb-6 text-sm text-muted md:text-base">
              {translate(locale, "auth.loginSubtitle")}
            </p>
            <LoginForm redirectTo={redirectTo} />
          </div>
        </div>
        <div className="mx-auto w-full max-w-md pb-8">
          <SiteFooter />
        </div>
      </div>
    </I18nProvider>
  );
}
