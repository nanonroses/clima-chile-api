import { useEarthquakes } from '../../hooks/useEarthquakes';

// Obtener color según magnitud
const getMagnitudeColor = (magnitude) => {
  const mag = parseFloat(magnitude);
  if (mag >= 7) return '#ff1744'; // Rojo - Mayor
  if (mag >= 6) return '#ff5722'; // Naranja oscuro
  if (mag >= 5) return '#ff9800'; // Naranja
  if (mag >= 4) return '#ffc107'; // Amarillo
  if (mag >= 3) return '#8bc34a'; // Verde claro
  return '#4caf50'; // Verde - Menor
};

// Obtener etiqueta de severidad
const getSeverityLabel = (magnitude) => {
  const mag = parseFloat(magnitude);
  if (mag >= 7) return 'Mayor';
  if (mag >= 6) return 'Fuerte';
  if (mag >= 5) return 'Moderado';
  if (mag >= 4) return 'Leve';
  return 'Menor';
};

// Formatear fecha
const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateString;
  }
};

export function EarthquakeSection() {
  const { earthquakes, loading, error } = useEarthquakes();

  if (loading) {
    return (
      <section className="earthquakes-section">
        <div className="section-glass">
          <h3 className="section-title">🌋 Sismos Recientes</h3>
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Cargando sismos...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="earthquakes-section">
        <div className="section-glass">
          <h3 className="section-title">🌋 Sismos Recientes</h3>
          <p className="error-text">⚠️ {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="earthquakes-section">
      <div className="section-glass">
        <h3 className="section-title">🌋 Últimos Sismos en Chile</h3>
        <p className="section-subtitle">Datos sísmicos en tiempo real</p>

        <div className="earthquakes-list">
          {earthquakes.slice(0, 8).map((eq, index) => (
            <div
              key={index}
              className="earthquake-item"
              style={{ '--mag-color': getMagnitudeColor(eq.magnitude) }}
            >
              <div className="earthquake-magnitude">
                <span className="magnitude-value">{eq.magnitude}</span>
                <span className="magnitude-label">{getSeverityLabel(eq.magnitude)}</span>
              </div>
              <div className="earthquake-info">
                <p className="earthquake-location">{eq.location || eq.place}</p>
                <p className="earthquake-details">
                  <span className="earthquake-depth">📍 {eq.depth} km prof.</span>
                  <span className="earthquake-date">{formatDate(eq.date || eq.time)}</span>
                </p>
              </div>
            </div>
          ))}
        </div>

        {earthquakes.length === 0 && (
          <p className="no-data-text">No hay datos de sismos disponibles</p>
        )}
      </div>
    </section>
  );
}

export default EarthquakeSection;
