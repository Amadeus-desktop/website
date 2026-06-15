import type { Metadata } from "next";
import { LegalDocument } from "@/shared/components/legal/LegalDocument";
import {
  privacyPolicySections,
  privacyPolicySubtitle,
} from "@/shared/content/legal/privacy-policy";
import { LEGAL_OPERATOR } from "@/shared/config/legal";

export const metadata: Metadata = {
  title: `개인정보처리방침 | ${LEGAL_OPERATOR.serviceName}`,
  description: `${LEGAL_OPERATOR.companyName} ${LEGAL_OPERATOR.serviceName} 개인정보처리방침`,
};

export default function PrivacyPolicyPage() {
  return (
    <LegalDocument
      title="개인정보처리방침"
      subtitle={privacyPolicySubtitle}
      sections={privacyPolicySections}
    />
  );
}
