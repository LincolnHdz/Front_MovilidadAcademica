import axios from "axios";

// Obtener la URL base desde las variables de entorno o usar una URL por defecto
const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

console.log('Axios config - Base URL:', baseURL);

const api = axios.create({
  baseURL: baseURL,
  withCredentials: false,
});

// request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;

  // evitar cache para rutas de filtros para que no recibas 304 sin body
  if (config.url && config.url.includes("/filters")) {
    config.headers["Cache-Control"] = "no-cache";
    // añadir param cache-buster
    config.params = { ...(config.params || {}), _ : Date.now() };
  }

  return config;
});

// response interceptor igual que antes
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const msg = error.response.data?.message;
      if (msg === "token_expired") {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
