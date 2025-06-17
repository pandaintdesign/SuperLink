export const API_CONFIG = {
  BASE_URL: "https://lifezip.co.kr:11443/superlink",
  ENDPOINTS: {
    API: "/api",
    APPLICANT: "/api/applicant",
    CAMPAIGN: "/api/campaign",
    SEND_CODE: "/api/sendCode",
    CHECK_CODE: "/api/checkCode",
    REGISTER_USER: "/api/registerUser",
  },
  HEADERS: {
    JSON: { "Content-Type": "application/json" },
    TEXT: { "Content-Type": "text/plain" },
  },
};
