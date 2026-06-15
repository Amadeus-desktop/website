"use client";

import Link from "next/link";
import { LEGAL_OPERATOR, LEGAL_ROUTES } from "@/shared/config/legal";
import { useT } from "@/shared/i18n/use-translate";

type SiteFooterProps = {
  className?: string;
};

export function SiteFooter({ className }: SiteFooterProps) {
  const t = useT();

  return (
    <footer
      className={`mt-auto border-t border-border pt-8 pb-6 ${className ?? ""}`}
    >
      <div className="flex flex-col gap-4 text-xs text-muted-2 md:flex-row md:items-center md:justify-between md:text-sm">
        <div className="flex flex-col gap-1">
          <p className="font-medium text-muted">
            {LEGAL_OPERATOR.companyName} · {LEGAL_OPERATOR.serviceName}
          </p>
          <p>
            {LEGAL_OPERATOR.representative} · {LEGAL_OPERATOR.businessRegistrationNumber}
          </p>
          <p>{LEGAL_OPERATOR.address}</p>
        </div>

        <nav
          aria-label={t("footer.legalNav")}
          className="flex flex-wrap items-center gap-x-4 gap-y-2"
        >
          <Link
            href={LEGAL_ROUTES.terms}
            className="text-muted transition-colors hover:text-foreground"
          >
            {t("footer.terms")}
          </Link>
          <span aria-hidden className="text-border">
            |
          </span>
          <Link
            href={LEGAL_ROUTES.privacy}
            className="text-muted transition-colors hover:text-foreground"
          >
            {t("footer.privacy")}
          </Link>
          <span aria-hidden className="text-border">
            |
          </span>
          <a
            href={`mailto:${LEGAL_OPERATOR.supportEmail}`}
            className="text-muted transition-colors hover:text-foreground"
          >
            {t("footer.contact")}
          </a>
        </nav>
      </div>

      <p className="mt-4 text-xs text-muted-2">
        © {new Date().getFullYear()} {LEGAL_OPERATOR.companyName}. All rights
        reserved.
      </p>
    </footer>
  );
}
