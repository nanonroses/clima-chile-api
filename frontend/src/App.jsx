import { useState, useEffect, useMemo } from 'react';

// Import new sections
import EarthquakeSection from './components/earthquakes/EarthquakeSection';
import HolidaysSection from './components/holidays/HolidaysSection';
import IndicatorsSection from './components/indicators/IndicatorsSection';

// Weather condition to icon mapping
const getWeatherIcon = (condition) => {
  if (!condition) return '🌡️';
  const c = condition.toLowerCase();

  if (c.includes('despejado') || c.includes('soleado') || c.includes('claro')) return '☀️';
  if (c.includes('parcial') || c.includes('algo')) return '⛅';
  if (c.includes('nublado') || c.includes('cubierto') || c.includes('nuboso')) return '☁️';
  if (c.includes('lluvia') || c.includes('llovizna') || c.includes('precipit')) return '🌧️';
  if (c.includes('tormenta') || c.includes('trueno')) return '⛈️';
  if (c.includes('nieve') || c.includes('nevada')) return '❄️';
  if (c.includes('niebla') || c.includes('neblina') || c.includes('bruma')) return '🌫️';
  if (c.includes('viento')) return '💨';

  return '🌤️';
};

// Get weather icon CSS class for animations
const getWeatherClass = (condition) => {
  if (!condition) return '';
  const c = condition.toLowerCase();

  if (c.includes('despejado') || c.includes('soleado') || c.includes('claro')) return 'sunny';
  if (c.includes('lluvia') || c.includes('llovizna') || c.includes('precipit')) return 'rainy';
  if (c.includes('tormenta')) return 'stormy';

  return '';
};

// Generate random stars for night mode
const generateStars = (count = 50) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 3}s`,
    size: Math.random() * 2 + 1
  }));
};

// List of Chilean weather stations
const STATIONS = [
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

function App() {
  // Determine initial theme based on time of day
  const getInitialTheme = () => {
    const hour = new Date().getHours();
    return (hour >= 7 && hour < 19) ? 'day' : 'night';
  };

  const [theme, setTheme] = useState(getInitialTheme);
  const [selectedStation, setSelectedStation] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [allWeatherData, setAllWeatherData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingAll, setLoadingAll] = useState(true);
  const [error, setError] = useState(null);

  // Generate stars once
  const stars = useMemo(() => generateStars(60), []);

  // Fetch all weather data on mount
  useEffect(() => {
    fetchAllWeather();
  }, []);

  const fetchAllWeather = async () => {
    setLoadingAll(true);
    try {
      const response = await fetch('/api/weather');
      const data = await response.json();

      if (data.status === 'success') {
        setAllWeatherData(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching all weather:', err);
    } finally {
      setLoadingAll(false);
    }
  };

  const fetchWeather = async (code) => {
    if (!code) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/weather/${code}`);
      const data = await response.json();

      if (data.status === 'success' && data.data?.length > 0) {
        const station = STATIONS.find(s => s.code === code);
        setWeatherData({
          ...data.data[0],
          region: station?.region || data.data[0].region
        });
      } else {
        setError('No se encontraron datos para esta estación');
        setWeatherData(null);
      }
    } catch (err) {
      setError('Error al conectar con el servidor. Verifica que el backend esté corriendo.');
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleConsult = () => {
    if (selectedStation) {
      fetchWeather(selectedStation);
    }
  };

  const handleStationClick = (stationData) => {
    // Usar los datos directamente del grid en lugar de hacer otra llamada API
    const stationInfo = STATIONS.find(s => s.code === stationData.code);
    setSelectedStation(stationData.code);
    setWeatherData({
      ...stationData,
      region: stationInfo?.region || stationData.region || 'Chile'
    });
    setError(null);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'day' ? 'night' : 'day');
  };

  return (
    <div className="app-container" data-theme={theme}>
      {/* Atmospheric Particles */}
      <div className="particles-container">
        {/* Floating Clouds */}
        <div className="cloud"></div>
        <div className="cloud"></div>
        <div className="cloud"></div>

        {/* Night Stars */}
        {stars.map(star => (
          <div
            key={star.id}
            className="star"
            style={{
              left: star.left,
              top: star.top,
              animationDelay: star.animationDelay,
              width: `${star.size}px`,
              height: `${star.size}px`
            }}
          />
        ))}
      </div>

      {/* Theme Toggle */}
      <div className="theme-toggle">
        <button onClick={toggleTheme} aria-label="Cambiar tema">
          {theme === 'day' ? '🌙' : '☀️'}
        </button>
      </div>

      {/* Main Content */}
      <main className="main-content">
        {/* Hero Section */}
        <section className="hero-section">
          <h1 className="hero-title">
            Clima Chile
            <span className="chile-flag">
              <span></span>
            </span>
          </h1>
          <p className="hero-subtitle">
            Consulta el estado del tiempo en tiempo real para las principales ciudades de Chile,
            desde Arica hasta la Antártica
          </p>
        </section>

        {/* Station Selector */}
        <section className="selector-section">
          <div className="selector-glass">
            <label className="selector-label" htmlFor="station-select">
              Selecciona una ciudad
            </label>
            <div className="selector-wrapper">
              <select
                id="station-select"
                className="station-select"
                value={selectedStation}
                onChange={(e) => setSelectedStation(e.target.value)}
              >
                <option value="">-- Elige una estación meteorológica --</option>
                {STATIONS.map(station => (
                  <option key={station.code} value={station.code}>
                    {station.city} - {station.region}
                  </option>
                ))}
              </select>
              <span className="selector-icon">📍</span>
            </div>
            <button
              className={`consult-button ${loading ? 'loading' : ''}`}
              onClick={handleConsult}
              disabled={!selectedStation || loading}
            >
              {loading ? 'Consultando...' : 'Consultar Clima'}
            </button>
          </div>
        </section>

        {/* Error Display */}
        {error && (
          <div className="error-message">
            <p>⚠️ {error}</p>
          </div>
        )}

        {/* Weather Display */}
        {weatherData && !loading && (
          <section className="weather-section">
            <div className="weather-card">
              <div className="weather-city">
                <h2>{weatherData.city}</h2>
                <p className="weather-region">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  {weatherData.region}
                </p>
              </div>

              <div className="weather-icon-container">
                <span className={`weather-icon ${getWeatherClass(weatherData.condition)}`}>
                  {getWeatherIcon(weatherData.condition)}
                </span>
              </div>

              <div className="weather-temperature">
                <span className="temp-value">
                  {weatherData.temperature}
                  <span className="temp-unit">°C</span>
                </span>
                <p className="weather-condition">{weatherData.condition || 'Sin datos'}</p>
              </div>

              <div className="weather-details">
                <div className="detail-item">
                  <div className="detail-icon">💧</div>
                  <div className="detail-label">Humedad</div>
                  <div className="detail-value">{weatherData.humidity || '--'}%</div>
                </div>
                <div className="detail-item">
                  <div className="detail-icon">🌡️</div>
                  <div className="detail-label">Sensación</div>
                  <div className="detail-value">{weatherData.temperature || '--'}°C</div>
                </div>
                <div className="detail-item">
                  <div className="detail-icon">📊</div>
                  <div className="detail-label">Código</div>
                  <div className="detail-value">{weatherData.code}</div>
                </div>
              </div>

              {weatherData.updated_at && (
                <p className="weather-updated">
                  Última actualización: {weatherData.updated_at}
                </p>
              )}
            </div>
          </section>
        )}

        {/* New Information Sections */}
        <div className="info-sections-grid">
          <EarthquakeSection />
          <HolidaysSection />
        </div>

        <IndicatorsSection />

        {/* All Stations Grid */}
        <section className="stations-grid-section">
          <h3 className="stations-grid-title">
            🗺️ Todas las estaciones disponibles
          </h3>

          {loadingAll ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p className="loading-text">Cargando estaciones...</p>
            </div>
          ) : (
            <div className="stations-grid">
              {allWeatherData.length > 0 ? (
                allWeatherData.map(station => {
                  const stationInfo = STATIONS.find(s => s.code === station.code);
                  return (
                    <div
                      key={station.code}
                      className="station-mini-card"
                      onClick={() => handleStationClick(station)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && handleStationClick(station)}
                    >
                      <span className="station-mini-icon">
                        {getWeatherIcon(station.condition)}
                      </span>
                      <div className="station-mini-info">
                        <div className="station-mini-city">{station.city}</div>
                        <div className="station-mini-region">
                          {stationInfo?.region || station.region || 'Chile'}
                        </div>
                      </div>
                      <div className="station-mini-temp">
                        {station.temperature}°
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="loading-container">
                  <p className="loading-text">
                    No se pudieron cargar las estaciones.
                    Verifica que el backend esté corriendo en el puerto 3001.
                  </p>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="app-footer">
          <p>
            Datos proporcionados por{' '}
            <a href="https://boostr.cl/clima" target="_blank" rel="noopener noreferrer">
              API Boostr Chile
            </a>
          </p>
          <p style={{ marginTop: '0.5rem', opacity: 0.7 }}>
            Desarrollado con ❤️ para Chile 🇨🇱
          </p>
        </footer>
      </main>
    </div>
  );
}

export default App;
