import axios from "axios";

// ---------------------------
// Base URL
// ---------------------------
const BASE_URL = "http://127.0.0.1:8000"; 

// ---------------------------
// Create Axios Instance
// ---------------------------
const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // ⚠️ Explicitly false since we aren't using Auth Cookies
  timeout: 10000, // 10 seconds
});

// ---------------------------
// Request Interceptor
// ---------------------------
axiosClient.interceptors.request.use(
  (config) => {
    console.log(
      `🚀 [${config.method?.toUpperCase()}] Requesting →`,
      `${config.baseURL}${config.url}`
    );
    return config;
  },
  (error) => {
    console.error("❌ Request Error →", error);
    return Promise.reject(error);
  }
);

// ---------------------------
// Response Interceptor
// ---------------------------
axiosClient.interceptors.response.use(
  (response) => {
    console.log(
      `✅ [${response.status}] Response ←`,
      response.config.url,
      response.data
    );
    return response;
  },
  (error) => {
    if (!error.response) {
      // Network Error (Server down, wrong URL, or CORS)
      console.error(
        "🔥 NETWORK ERROR: Cannot reach backend at",
        BASE_URL,
        "\nIs your FastAPI server running?"
      );
    } else {
      // Server returned an error (400, 500, 404, etc)
      console.error(
        `🚨 STATUS ${error.response.status} ERROR:`,
        error.response.data?.detail || error.response.data || error.message
      );
    }
    return Promise.reject(error);
  }
);

// ---------------------------
// Helper: Check if Backend is Alive
// ---------------------------
export const pingBackend = async () => {
  try {
    // Try to hit the root or docs endpoint
    await axiosClient.get("/");
    return true;
  } catch (e) {
    return false;
  }
};

export default axiosClient;