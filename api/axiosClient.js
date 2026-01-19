import axios from "axios";

// ---------------------------
// Create Axios Instance
// ---------------------------
const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000", // Fallback to local dev
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds timeout
});

// ---------------------------
// Request Interceptor (Logging)
// ---------------------------
axiosClient.interceptors.request.use(
  (config) => {
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
// Response Interceptor (Logging + Error Handling)
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
    console.error(
      "Axios Response Error ←",
      error.response?.status,
      error.response?.data || error.message
    );
    return Promise.reject(error);
  }
);

export default axiosClient;
