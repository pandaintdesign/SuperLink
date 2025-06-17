import { API_CONFIG } from "./config.js";

// HTTP 요청 공통 함수
export async function apiRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
      },
    });

    // 응답이 텍스트인지 JSON인지 확인
    const contentType = response.headers.get("content-type");
    let data;

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      throw new Error(data.error || `HTTP ${response.status}`);
    }

    return { success: true, data, status: response.status };
  } catch (error) {
    console.error("API 요청 실패:", error);
    return { success: false, error: error.message };
  }
}

// 토큰 관리
export const TokenManager = {
  get() {
    return localStorage.getItem("authToken");
  },

  set(token) {
    localStorage.setItem("authToken", token);
  },

  remove() {
    localStorage.removeItem("authToken");
  },

  getAuthHeaders() {
    const token = this.get();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
};

// RSA 암호화 (실제로는 JSEncrypt 라이브러리 필요)
export async function encryptWithRSA(data, publicKey) {
  // 실제 구현에서는 JSEncrypt 사용
  // const encrypt = new JSEncrypt();
  // encrypt.setPublicKey(publicKey);
  // return encrypt.encrypt(data);
  return btoa(data); // 임시 구현
}
