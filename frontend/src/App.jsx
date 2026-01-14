import { useState, useEffect, useMemo } from 'react';
import { endpoints } from './config/api';
import EarthquakeSection from './components/earthquakes/EarthquakeSection';
import HolidaysSection from './components/holidays/HolidaysSection';
import IndicatorsSection from './components/indicators/IndicatorsSection';

// Weather data
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

// Get weather type for animations
const getWeatherType = (condition) => {
  if (!condition) return 'clear';
  const c = condition.toLowerCase();
  if (c.includes('lluvia') || c.includes('llovizna') || c.includes('precipit')) return 'rain';
  if (c.includes('tormenta') || c.includes('trueno')) return 'storm';
  if (c.includes('nieve') || c.includes('nevada')) return 'snow';
  if (c.includes('nublado') || c.includes('cubierto') || c.includes('nuboso')) return 'cloudy';
  if (c.includes('niebla') || c.includes('neblina') || c.includes('bruma')) return 'fog';
  if (c.includes('despejado') || c.includes('soleado') || c.includes('claro')) return 'sunny';
  if (c.includes('parcial')) return 'partly';
  return 'clear';
};

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
  return '🌤️';
};

function App() {
  const [selectedStation, setSelectedStation] = useState('SCQN');
  const [weatherData, setWeatherData] = useState(null);
  const [allWeatherData, setAllWeatherData] = useState([]);
  const [loadingAll, setLoadingAll] = useState(true);
  const [showPanel, setShowPanel] = useState(false);

  const weatherType = useMemo(() =>
    getWeatherType(weatherData?.condition),
    [weatherData?.condition]
  );

  useEffect(() => {
    fetchAllWeather();
    const interval = setInterval(fetchAllWeather, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (allWeatherData.length > 0 && !weatherData) {
      selectCity('SCQN');
    }
  }, [allWeatherData]);

  const fetchAllWeather = async () => {
    setLoadingAll(true);
    try {
      const response = await fetch(endpoints.weather);
      const data = await response.json();
      if (data.status === 'success') {
        setAllWeatherData(data.data || []);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoadingAll(false);
    }
  };

  const selectCity = (code) => {
    setSelectedStation(code);
    const cached = allWeatherData.find(s => s.code === code);
    if (cached) {
      const stationInfo = STATIONS.find(s => s.code === code);
      setWeatherData({
        ...cached,
        region: stationInfo?.region || cached.region || 'Chile'
      });
    }
    setShowPanel(false);
  };

  const currentTime = new Date().toLocaleTimeString('es-CL', {
    hour: '2-digit',
    minute: '2-digit'
  });

  // Generate rain drops
  const rainDrops = useMemo(() =>
    Array.from({ length: 100 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 0.5 + Math.random() * 0.5
    })), []
  );

  // Generate snow flakes
  const snowFlakes = useMemo(() =>
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4,
      size: 4 + Math.random() * 8
    })), []
  );

  // Generate clouds
  const clouds = useMemo(() =>
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      top: 10 + Math.random() * 30,
      duration: 30 + Math.random() * 40,
      delay: Math.random() * 20,
      scale: 0.8 + Math.random() * 0.6
    })), []
  );

  return (
    <div className={`immersive-app weather-${weatherType}`}>
      {/* Animated Background */}
      <div className="weather-bg">
        {/* Sun rays for sunny weather */}
        {(weatherType === 'sunny' || weatherType === 'clear') && (
          <div className="sun-container">
            <div className="sun"></div>
            <div className="sun-rays"></div>
          </div>
        )}

        {/* Clouds */}
        {(weatherType === 'cloudy' || weatherType === 'partly' || weatherType === 'rain') && (
          <div className="clouds-container">
            {clouds.map(cloud => (
              <div
                key={cloud.id}
                className="cloud"
                style={{
                  top: `${cloud.top}%`,
                  animationDuration: `${cloud.duration}s`,
                  animationDelay: `${cloud.delay}s`,
                  transform: `scale(${cloud.scale})`
                }}
              />
            ))}
          </div>
        )}

        {/* Rain */}
        {(weatherType === 'rain' || weatherType === 'storm') && (
          <div className="rain-container">
            {rainDrops.map(drop => (
              <div
                key={drop.id}
                className="rain-drop"
                style={{
                  left: `${drop.left}%`,
                  animationDelay: `${drop.delay}s`,
                  animationDuration: `${drop.duration}s`
                }}
              />
            ))}
          </div>
        )}

        {/* Lightning for storms */}
        {weatherType === 'storm' && <div className="lightning"></div>}

        {/* Snow */}
        {weatherType === 'snow' && (
          <div className="snow-container">
            {snowFlakes.map(flake => (
              <div
                key={flake.id}
                className="snow-flake"
                style={{
                  left: `${flake.left}%`,
                  animationDelay: `${flake.delay}s`,
                  animationDuration: `${flake.duration}s`,
                  width: flake.size,
                  height: flake.size
                }}
              />
            ))}
          </div>
        )}

        {/* Fog */}
        {weatherType === 'fog' && (
          <div className="fog-container">
            <div className="fog-layer fog-1"></div>
            <div className="fog-layer fog-2"></div>
            <div className="fog-layer fog-3"></div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="immersive-content">
        {/* Header */}
        <header className="immersive-header">
          <div className="header-location" onClick={() => setShowPanel(true)}>
            <span className="location-icon">📍</span>
            <span className="location-name">{weatherData?.city || 'Cargando...'}</span>
            <span className="location-arrow">▼</span>
          </div>
          <div className="header-time">{currentTime}</div>
        </header>

        {/* Hero Weather */}
        <main className="weather-hero">
          {weatherData ? (
            <>
              <div className="hero-icon">{getWeatherIcon(weatherData.condition)}</div>
              <div className="hero-temp">
                <span className="temp-number">{weatherData.temperature}</span>
                <span className="temp-deg">°</span>
              </div>
              <p className="hero-condition">{weatherData.condition || 'Sin datos'}</p>
              <div className="hero-details">
                <div className="detail">
                  <span className="detail-value">{weatherData.humidity || '--'}%</span>
                  <span className="detail-label">Humedad</span>
                </div>
                <div className="detail-separator"></div>
                <div className="detail">
                  <span className="detail-value">{weatherData.region}</span>
                  <span className="detail-label">Región</span>
                </div>
              </div>
            </>
          ) : (
            <div className="hero-loading">
              <div className="spinner"></div>
              <p>Cargando clima...</p>
            </div>
          )}
        </main>

        {/* Info Cards */}
        <section className="info-cards">
          <div className="glass-card">
            <EarthquakeSection />
          </div>
          <div className="glass-card">
            <HolidaysSection />
          </div>
          <div className="glass-card wide">
            <IndicatorsSection />
          </div>
        </section>

        {/* Quick Cities Bar */}
        <section className="cities-bar">
          {allWeatherData.slice(0, 8).map(station => (
            <button
              key={station.code}
              className={`city-btn ${selectedStation === station.code ? 'active' : ''}`}
              onClick={() => selectCity(station.code)}
            >
              <span className="city-icon">{getWeatherIcon(station.condition)}</span>
              <span className="city-name">{station.city}</span>
              <span className="city-temp">{station.temperature}°</span>
            </button>
          ))}
        </section>
      </div>

      {/* City Selection Panel */}
      {showPanel && (
        <div className="city-panel-overlay" onClick={() => setShowPanel(false)}>
          <div className="city-panel" onClick={e => e.stopPropagation()}>
            <div className="panel-header">
              <h2>Seleccionar Ciudad</h2>
              <button className="close-btn" onClick={() => setShowPanel(false)}>✕</button>
            </div>
            <div className="panel-cities">
              {allWeatherData.map(station => {
                const info = STATIONS.find(s => s.code === station.code);
                return (
                  <button
                    key={station.code}
                    className={`panel-city ${selectedStation === station.code ? 'active' : ''}`}
                    onClick={() => selectCity(station.code)}
                  >
                    <span className="panel-city-icon">{getWeatherIcon(station.condition)}</span>
                    <div className="panel-city-info">
                      <span className="panel-city-name">{station.city}</span>
                      <span className="panel-city-region">{info?.region}</span>
                    </div>
                    <span className="panel-city-temp">{station.temperature}°</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="immersive-footer">
        <p>Datos de <a href="https://boostr.cl" target="_blank" rel="noopener noreferrer">Boostr API</a></p>
      </footer>
    </div>
  );
}

export default App;
