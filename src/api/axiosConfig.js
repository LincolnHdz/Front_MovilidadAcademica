import axios from "axios";

// Obtener la URL base desde las variables de entorno o usar una URL por defecto
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

console.log('Axios config - Base URL:', baseURL);

const api = axios.create({
  baseURL: baseURL
});

// Agregar un interceptor para incluir el token en todas las solicitudes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
