// Servicio centralizado para llamadas a la API de Boostr
const API_BASE = 'https://api.boostr.cl';

// ============ SISTEMA DE CACHÉ EN MEMORIA ============
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos en milisegundos

function getCached(key) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log(`[CACHE HIT] ${key}`);
    return cached.data;
  }
  return null;
}

function setCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
  console.log(`[CACHE SET] ${key} - expira en 5 minutos`);
}

// Lista de estaciones meteorológicas de Chile
export const STATIONS = [
  { code: 'SCAR', city: 'Arica', region: 'Arica y Parinacota' },
  { code: 'SCDA', city: 'Iquique', region: 'Tarapacá' },
  { code: 'SCFA', city: 'Antofagasta', region: 'Antofagasta' },
  { code: 'SCCF', city: 'Calama', region: 'Antofagasta' },
  { code: 'SCSE', city: 'La Serena', region: 'Coquimbo' },
  { code: 'SCQN', city: 'Santiago', region: 'Metropolitana' },
  { code: 'SCEL', city: 'Santiago (Aeropuerto)', region: 'Metropolitana' },
  { code: 'SCVM', city: 'Viña del Mar', region: 'Valparaíso' },
  { code: 'SCRD', city: 'Rancagua', region: "O'Higgins" },
  { code: 'SCTL', city: 'Talca', region: 'Maule' },
  { code: 'SCCH', city: 'Chillán', region: 'Ñuble' },
  { code: 'SCIE', city: 'Concepción', region: 'Biobío' },
  { code: 'SCGE', city: 'Los Ángeles', region: 'Biobío' },
  { code: 'SCTO', city: 'Temuco', region: 'La Araucanía' },
  { code: 'SCVD', city: 'Valdivia', region: 'Los Ríos' },
  { code: 'SCJO', city: 'Osorno', region: 'Los Lagos' },
  { code: 'SCTE', city: 'Puerto Montt', region: 'Los Lagos' },
  { code: 'SCCY', city: 'Coyhaique', region: 'Aysén' },
  { code: 'SCBA', city: 'Balmaceda', region: 'Aysén' },
  { code: 'SCCI', city: 'Punta Arenas', region: 'Magallanes' },
  { code: 'SCFM', city: 'Porvenir', region: 'Magallanes' },
  { code: 'SCGZ', city: 'Puerto Williams', region: 'Magallanes' },
  { code: 'SCIR', city: 'Isla Robinson Crusoe', region: 'Juan Fernández' },
  { code: 'SCIP', city: 'Isla de Pascua', region: 'Rapa Nui' },
  { code: 'SCRM', city: 'Base Antártica', region: 'Antártica Chilena' }
];

// Helper para hacer fetch con timeout y validación HTTP
async function fetchWithTimeout(url, timeout = 10000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    // Validar que la respuesta HTTP sea exitosa
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response;
  } catch (error) {
    clearTimeout(timeoutId);

    // Distinguir entre timeout y otros errores
    if (error.name === 'AbortError') {
      throw new Error(`Request timeout: La API no respondió en ${timeout / 1000}s`);
    }

    throw error;
  }
}

// ============ WEATHER API ============

export async function getAllWeather() {
  const cacheKey = 'weather_all';
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const response = await fetchWithTimeout(`${API_BASE}/weather.json`);
  const data = await response.json();

  if (data.status === 'success' && data.data) {
    data.data = data.data.map(item => {
      const station = STATIONS.find(s => s.code === item.code);
      return {
        ...item,
        region: station?.region || 'Desconocida'
      };
    });
  }

  setCache(cacheKey, data);
  return data;
}

export async function getWeatherByCode(code) {
  const upperCode = code.toUpperCase();
  const cacheKey = `weather_${upperCode}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    // Primero intentar obtener de la caché global de todas las estaciones
    const allCached = getCached('weather_all');
    if (allCached && allCached.status === 'success' && allCached.data) {
      const found = allCached.data.find(item => item.code === upperCode);
      if (found) {
        const result = { status: 'success', data: [found] };
        setCache(cacheKey, result);
        return result;
      }
    }

    const response = await fetchWithTimeout(`${API_BASE}/weather/${upperCode}.json`);
    const data = await response.json();

    if (data.status === 'success' && data.data) {
      const items = Array.isArray(data.data) ? data.data : [data.data];
      const station = STATIONS.find(s => s.code === upperCode);

      const result = {
        status: 'success',
        data: items.map(item => ({
          ...item,
          region: station?.region || 'Chile'
        }))
      };
      setCache(cacheKey, result);
      return result;
    }

    // Fallback: buscar en todas las estaciones
    const allData = await getAllWeather();
    if (allData.status === 'success' && allData.data) {
      const found = allData.data.find(item => item.code === upperCode);
      if (found) {
        const result = { status: 'success', data: [found] };
        setCache(cacheKey, result);
        return result;
      }
    }

    return { status: 'error', message: 'Estación no encontrada' };
  } catch (error) {
    throw new Error(`Error al obtener clima: ${error.message}`);
  }
}

// ============ EARTHQUAKES API ============

export async function getRecentEarthquakes() {
  const cacheKey = 'earthquakes_recent';
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const response = await fetchWithTimeout(`${API_BASE}/earthquakes/recent.json`);
  const data = await response.json();
  setCache(cacheKey, data);
  return data;
}

// ============ HOLIDAYS API ============

export async function getAllHolidays(year = null) {
  const cacheKey = year ? `holidays_${year}` : 'holidays_all';
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const url = year
    ? `${API_BASE}/holidays/${year}.json`
    : `${API_BASE}/holidays.json`;

  const response = await fetchWithTimeout(url);
  const data = await response.json();
  setCache(cacheKey, data);
  return data;
}

export async function checkIfHoliday(date) {
  const cacheKey = `holiday_check_${date}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const response = await fetchWithTimeout(`${API_BASE}/holidays/is/${date}.json`);
  const data = await response.json();
  setCache(cacheKey, data);
  return data;
}

// ============ ECONOMIC INDICATORS API ============

export async function getAllIndicators() {
  const cacheKey = 'indicators_all';
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const response = await fetchWithTimeout(`${API_BASE}/economy/indicators.json`);
  const data = await response.json();
  setCache(cacheKey, data);
  return data;
}

export async function getIndicatorByType(type) {
  const cacheKey = `indicator_${type.toLowerCase()}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const response = await fetchWithTimeout(`${API_BASE}/economy/indicator/${type.toLowerCase()}.json`);
  const data = await response.json();
  setCache(cacheKey, data);
  return data;
}

export async function getIndicatorHistory(type, year) {
  const cacheKey = `indicator_${type.toLowerCase()}_${year}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const response = await fetchWithTimeout(`${API_BASE}/economy/indicator/${type.toLowerCase()}/${year}.json`);
  const data = await response.json();
  setCache(cacheKey, data);
  return data;
}
