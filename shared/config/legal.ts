/** Legal / operator metadata — update before production launch. */
export const LEGAL_OPERATOR = {
  companyName: "주식회사 아마데우스랩",
  serviceName: "아마데우스",
  serviceNameEn: "Amadeus",
  representative: "대표이사",
  businessRegistrationNumber: "000-00-00000",
  telecommunicationSalesNumber: "해당 없음",
  address: "서울특별시 강남구 테헤란로 000, 0층",
  supportEmail: "support@amadeus.app",
  privacyEmail: "privacy@amadeus.app",
  privacyOfficer: "개인정보보호책임자",
  privacyDepartment: "개인정보보호팀",
  privacyPhone: "02-0000-0000",
  effectiveDate: "2025년 6월 15일",
  lastUpdated: "2025년 6월 15일",
} as const;

export const LEGAL_ROUTES = {
  privacy: "/privacy",
  terms: "/terms",
} as const;
