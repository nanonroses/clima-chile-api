// En desarrollo usa el proxy local, en producción usa Boostr directamente
const isDev = import.meta.env.DEV;

export const API_BASE = isDev ? '' : 'https://api.boostr.cl';

export const endpoints = {
  weather: isDev ? '/api/weather' : `${API_BASE}/weather.json`,
  weatherByCode: (code) => isDev ? `/api/weather/${code}` : `${API_BASE}/weather/${code}.json`,
  earthquakes: isDev ? '/api/earthquakes' : `${API_BASE}/earthquakes/recent.json`,
  holidays: isDev ? '/api/holidays' : `${API_BASE}/holidays.json`,
  indicators: isDev ? '/api/indicators' : `${API_BASE}/economy/indicators.json`,
};
