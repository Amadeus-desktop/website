import type { Metadata } from "next";
import { LegalDocument } from "@/shared/components/legal/LegalDocument";
import {
  termsOfServiceSections,
  termsOfServiceSubtitle,
} from "@/shared/content/legal/terms-of-service";
import { LEGAL_OPERATOR } from "@/shared/config/legal";

export const metadata: Metadata = {
  title: `서비스 이용약관 | ${LEGAL_OPERATOR.serviceName}`,
  description: `${LEGAL_OPERATOR.companyName} ${LEGAL_OPERATOR.serviceName} 서비스 이용약관`,
};

export default function TermsOfServicePage() {
  return (
    <LegalDocument
      title="서비스 이용약관"
      subtitle={termsOfServiceSubtitle}
      sections={termsOfServiceSections}
    />
  );
}
