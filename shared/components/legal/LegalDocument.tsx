import Link from "next/link";
import { LEGAL_OPERATOR } from "@/shared/config/legal";
import { cn } from "@/shared/lib/cn";

export type LegalSection = {
  title: string;
  paragraphs?: string[];
  list?: string[];
  subsections?: {
    title: string;
    paragraphs?: string[];
    list?: string[];
  }[];
};

type LegalDocumentProps = {
  title: string;
  subtitle: string;
  sections: LegalSection[];
  className?: string;
};

export function LegalDocument({
  title,
  subtitle,
  sections,
  className,
}: LegalDocumentProps) {
  return (
    <article className={cn("max-w-3xl", className)}>
      <header className="mb-10 border-b border-border pb-8">
        <Link
          href="/"
          className="mb-4 inline-block text-sm text-muted transition-colors hover:text-foreground"
        >
          ← {LEGAL_OPERATOR.serviceName} 홈
        </Link>
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">
          {title}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">
          {subtitle}
        </p>
        <p className="mt-4 text-xs text-muted-2">
          시행일: {LEGAL_OPERATOR.effectiveDate} · 최종 개정일:{" "}
          {LEGAL_OPERATOR.lastUpdated}
        </p>
      </header>

      <div className="flex flex-col gap-10">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="mb-4 text-lg font-bold text-foreground md:text-xl">
              {section.title}
            </h2>

            {section.paragraphs?.map((paragraph) => (
              <p
                key={paragraph.slice(0, 48)}
                className="mb-3 text-sm leading-7 text-muted md:text-[15px]"
              >
                {paragraph}
              </p>
            ))}

            {section.list && (
              <ul className="mb-3 list-disc space-y-2 pl-5 text-sm leading-7 text-muted md:text-[15px]">
                {section.list.map((item) => (
                  <li key={item.slice(0, 48)}>{item}</li>
                ))}
              </ul>
            )}

            {section.subsections?.map((sub) => (
              <div key={sub.title} className="mt-5">
                <h3 className="mb-3 text-base font-semibold text-foreground">
                  {sub.title}
                </h3>
                {sub.paragraphs?.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 48)}
                    className="mb-3 text-sm leading-7 text-muted md:text-[15px]"
                  >
                    {paragraph}
                  </p>
                ))}
                {sub.list && (
                  <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-muted md:text-[15px]">
                    {sub.list.map((item) => (
                      <li key={item.slice(0, 48)}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        ))}
      </div>
    </article>
  );
}
