import axios from "axios";

// ---------------------------
// Base URL
// ---------------------------
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

// ---------------------------
// Create Axios Instance
// ---------------------------
const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds
});

// ---------------------------
// Request Interceptor
// ---------------------------
axiosClient.interceptors.request.use(
  (config) => {
    // Auto-inject token if available in localStorage or env
    const token = localStorage.getItem("adminToken") || process.env.NEXT_PUBLIC_ADMIN_JWT;

    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    console.log(
      "Axios Request →",
      config.method?.toUpperCase(),
      config.url,
      config.data ?? {}
    );
    return config;
  },
  (error) => {
    console.error("Request Error →", error);
    return Promise.reject(error);
  }
);

// ---------------------------
// Response Interceptor
// ---------------------------
axiosClient.interceptors.response.use(
  (response) => {
    console.log(
      "Axios Response ←",
      response.config.url,
      response.status,
      response.data
    );
    return response;
  },
  (error) => {
    if (!error.response) {
      // Network Error or CORS issue
      console.error("Axios Network Error ← No Response from server", error.message);
    } else {
      console.error(
        "Axios Response Error ←",
        error.response.status,
        error.response.data || error.message
      );
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
