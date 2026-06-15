import { RegisterForm } from "@/features/auth/components/RegisterForm";
import { APP_NAME } from "@/shared/config/app";
import { I18nProvider } from "@/shared/i18n/provider";
import { getServerLocale } from "@/shared/i18n/server";
import { translate } from "@/shared/i18n";
import Link from "next/link";

export default async function RegisterPage() {
  const locale = await getServerLocale();

  return (
    <I18nProvider initialLocale={locale}>
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
        <Link href="/" className="mb-8 text-2xl font-bold text-primary">
          {APP_NAME}
        </Link>
        <div className="w-full max-w-md rounded-2xl bg-surface p-6 md:p-8">
          <h1 className="text-xl font-bold text-foreground md:text-2xl">
            {translate(locale, "auth.registerTitle")}
          </h1>
          <p className="mt-2 mb-6 text-sm text-muted md:text-base">
            {translate(locale, "auth.registerSubtitle")}
          </p>
          <RegisterForm />
        </div>
      </div>
    </I18nProvider>
  );
}
