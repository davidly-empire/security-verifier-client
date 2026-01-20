import axios from "axios";

// ---------------------------
// Base URL
// ---------------------------
// Explicitly pointing to your backend to avoid "Network Error"
const BASE_URL = "http://127.0.0.1:8000"; 

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
    // -------------------------------------------------------
    // FIX: Removed Token logic completely
    // We don't use JWT anymore, so no Authorization header.
    // -------------------------------------------------------
    
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
      // Network Error (Server down, wrong URL, or CORS)
      console.error("Axios Network Error:", error.message);
    } else {
      // Server returned an error (400, 500, etc)
      console.error(
        "Axios Response Error:",
        error.response.status,
        error.response.data || error.message
      );
    }
    return Promise.reject(error);
  }
);

export default axiosClient;