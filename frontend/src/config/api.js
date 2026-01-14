// Configuración de endpoints de API
// SIEMPRE usa el backend como proxy para mantener seguridad (rate limiting, logs, etc.)

// URL del backend - en producción debe configurarse en variables de entorno de Vercel
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

export const API_BASE = BACKEND_URL;

export const endpoints = {
  weather: `${API_BASE}/api/weather`,
  weatherByCode: (code) => `${API_BASE}/api/weather/${code}`,
  earthquakes: `${API_BASE}/api/earthquakes`,
  holidays: `${API_BASE}/api/holidays`,
  indicators: `${API_BASE}/api/indicators`,
};
