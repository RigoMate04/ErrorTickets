import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001",
});

// REQUEST interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE interceptor (opcionális, de hasznos)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized – token expired or invalid");
      // ide később mehet logout / redirect
    }
    return Promise.reject(error);
  }
);

export default api;
