// ===== applicant.api.js =====
import { API_CONFIG } from "./config.js";
import { apiRequest } from "./utils.js";

export const ApplicantAPI = {
  // 지원자 등록
  async register(applicantData) {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.APPLICANT}`;
    return await apiRequest(url, {
      method: "POST",
      headers: API_CONFIG.HEADERS.JSON,
      body: JSON.stringify(applicantData),
    });
  },

  // 캠페인별 지원자 목록 조회
  async getByCampaign(campaignId) {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.APPLICANT}?campaignId=${campaignId}`;
    return await apiRequest(url);
  },
};

// ===== verification.api.js =====
import { API_CONFIG } from "./config.js";
import { apiRequest } from "./utils.js";

export const VerificationAPI = {
  // 인증 코드 발송
  async sendCode(email) {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SEND_CODE}?action=sendCode`;
    return await apiRequest(url, {
      method: "POST",
      headers: API_CONFIG.HEADERS.JSON,
      body: JSON.stringify({ email }),
    });
  },

  // 인증 코드 확인
  async checkCode(email, code) {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CHECK_CODE}?action=checkCode`;
    return await apiRequest(url, {
      method: "POST",
      headers: API_CONFIG.HEADERS.JSON,
      body: JSON.stringify({ email, code }),
    });
  },

  // 회원가입
  async registerUser(userData) {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.REGISTER_USER}?action=registerUser`;
    return await apiRequest(url, {
      method: "POST",
      headers: API_CONFIG.HEADERS.JSON,
      body: JSON.stringify(userData),
    });
  },
};
