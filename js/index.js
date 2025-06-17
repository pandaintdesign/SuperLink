// ===== index.js (통합 관리) =====
export { AuthAPI } from "./auth.api.js";
export { CampaignAPI } from "./campaign.api.js";
export { ApplicantAPI } from "./applicant.api.js";
export { VerificationAPI } from "./verification.api.js";
export { TokenManager } from "./utils.js";

// 전체 API 객체로 내보내기
export const SuperLinkAPI = {
  auth: AuthAPI,
  campaign: CampaignAPI,
  applicant: ApplicantAPI,
  verification: VerificationAPI,
};
