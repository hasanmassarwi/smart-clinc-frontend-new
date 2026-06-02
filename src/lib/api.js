import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api/v1",
  withCredentials: true,
  timeout: 10000
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  if (typeof FormData !== "undefined" && config.data instanceof FormData) {
    if (config.headers) {
      delete config.headers["Content-Type"];
      delete config.headers["content-type"];
    }
  }
  return config;
});

// Response interceptor to handle 401 and refresh access token using refresh token
let isRefreshing = false;
let refreshSubscribers = [];

function onRefreshed(token) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

function addRefreshSubscriber(cb) {
  refreshSubscribers.push(cb);
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (!originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (error.response && error.response.status === 401) {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        // No refresh token — force logout
        window.dispatchEvent(new CustomEvent("auth:logout"));
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Queue the request until refresh completes
        return new Promise((resolve, reject) => {
          addRefreshSubscriber((token) => {
            if (!token) return reject(error);
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call refresh endpoint without interceptors to avoid loops
        const refreshResponse = await axios.post(
          `${api.defaults.baseURL}/auth/refresh`,
          { refreshToken },
          { withCredentials: true }
        );
        const newAccessToken = refreshResponse.data.accessToken;
        if (newAccessToken) {
          localStorage.setItem("accessToken", newAccessToken);
          // notify other listeners (AuthContext)
          window.dispatchEvent(new CustomEvent("auth:tokenRefreshed", { detail: { accessToken: newAccessToken } }));
          onRefreshed(newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed — force logout
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.dispatchEvent(new CustomEvent("auth:logout"));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
