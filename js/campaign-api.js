// ===== campaign.api.js =====
import { API_CONFIG } from "./config.js";
import { apiRequest } from "./utils.js";

export const CampaignAPI = {
  // 캠페인 생성
  async create(campaignData) {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CAMPAIGN}`;
    return await apiRequest(url, {
      method: "POST",
      headers: API_CONFIG.HEADERS.JSON,
      body: JSON.stringify(campaignData),
    });
  },

  // 캠페인 목록 조회
  async getList() {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CAMPAIGN}`;
    return await apiRequest(url);
  },

  // 캠페인 상세 조회 (필요시 추가)
  async getById(id) {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CAMPAIGN}/${id}`;
    return await apiRequest(url);
  },
};
