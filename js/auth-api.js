// ===== auth.api.js =====
import { API_CONFIG } from "./config.js";
import { apiRequest, TokenManager, encryptWithRSA } from "./utils.js";

export const AuthAPI = {
  // 공개키 가져오기
  async getPublicKey() {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.API}?work=key`;
    return await apiRequest(url);
  },

  // 로그인
  async login(userId, password) {
    try {
      // 1. 공개키 가져오기
      const keyResult = await this.getPublicKey();
      if (!keyResult.success) {
        throw new Error("공개키 가져오기 실패");
      }

      // 2. 암호화
      const credentials = `userId=${userId}&password=${password}`;
      const encryptedData = await encryptWithRSA(credentials, keyResult.data);

      // 3. 로그인 요청
      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.API}?work=login`;
      const result = await apiRequest(url, {
        method: "POST",
        headers: API_CONFIG.HEADERS.TEXT,
        body: encryptedData,
      });

      if (result.success) {
        TokenManager.set(result.data.token);
      }

      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // 토큰 검증
  async verifyToken() {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.API}?work=verify`;
    return await apiRequest(url, {
      headers: TokenManager.getAuthHeaders(),
    });
  },

  // 로그아웃
  async logout() {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.API}?work=logout`;
    const result = await apiRequest(url, {
      headers: TokenManager.getAuthHeaders(),
    });

    if (result.success) {
      TokenManager.remove();
    }

    return result;
  },

  // 비밀번호 변경
  async changePassword(newPassword) {
    try {
      const keyResult = await this.getPublicKey();
      if (!keyResult.success) {
        throw new Error("공개키 가져오기 실패");
      }

      const encryptedPassword = await encryptWithRSA(
        `newPassword=${newPassword}`,
        keyResult.data
      );
      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.API}?work=changePassword`;

      return await apiRequest(url, {
        method: "POST",
        headers: {
          ...API_CONFIG.HEADERS.TEXT,
          ...TokenManager.getAuthHeaders(),
        },
        body: encryptedPassword,
      });
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};
