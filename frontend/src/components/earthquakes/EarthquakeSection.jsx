import { useEarthquakes } from '../../hooks/useEarthquakes';

const getMagnitudeColor = (magnitude) => {
  const mag = parseFloat(magnitude);
  if (isNaN(mag)) return '#9e9e9e';
  if (mag >= 7) return '#ff1744';
  if (mag >= 6) return '#ff5722';
  if (mag >= 5) return '#ff9800';
  if (mag >= 4) return '#ffc107';
  if (mag >= 3) return '#8bc34a';
  return '#4caf50';
};

const getSeverityLabel = (magnitude) => {
  const mag = parseFloat(magnitude);
  if (isNaN(mag)) return 'N/D';
  if (mag >= 7) return 'Mayor';
  if (mag >= 6) return 'Fuerte';
  if (mag >= 5) return 'Moderado';
  if (mag >= 4) return 'Leve';
  return 'Menor';
};

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
      <div className="earthquakes-section">
        <h3 className="section-title">Sismos Recientes</h3>
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="earthquakes-section">
        <h3 className="section-title">Sismos Recientes</h3>
        <p className="error-text">{error}</p>
      </div>
    );
  }

  return (
    <div className="earthquakes-section">
      <h3 className="section-title">Sismos Recientes</h3>
      <div className="earthquakes-list">
        {earthquakes.slice(0, 6).map((eq, index) => (
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
                <span>{eq.depth} km</span>
                <span>{formatDate(eq.date || eq.time)}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
      {earthquakes.length === 0 && (
        <p className="no-data-text">No hay datos disponibles</p>
      )}
    </div>
  );
}

export default EarthquakeSection;
