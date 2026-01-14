import { useIndicators } from '../../hooks/useIndicators';

// Configuración de indicadores
const INDICATOR_CONFIG = {
  dolar: {
    name: 'Dólar',
    icon: '💵',
    prefix: '$',
    suffix: ' CLP',
    decimals: 2,
    color: '#4caf50'
  },
  euro: {
    name: 'Euro',
    icon: '💶',
    prefix: '$',
    suffix: ' CLP',
    decimals: 2,
    color: '#2196f3'
  },
  uf: {
    name: 'UF',
    icon: '📊',
    prefix: '$',
    suffix: '',
    decimals: 2,
    color: '#9c27b0'
  },
  utm: {
    name: 'UTM',
    icon: '📈',
    prefix: '$',
    suffix: '',
    decimals: 0,
    color: '#ff9800'
  },
  ipc: {
    name: 'IPC',
    icon: '📉',
    prefix: '',
    suffix: '%',
    decimals: 2,
    color: '#f44336'
  }
};

// Formatear valor numérico
const formatValue = (value, config) => {
  if (value === undefined || value === null) return '--';

  const num = parseFloat(value);
  const formatted = num.toLocaleString('es-CL', {
    minimumFractionDigits: config.decimals,
    maximumFractionDigits: config.decimals
  });

  return `${config.prefix}${formatted}${config.suffix}`;
};

// Formatear fecha
const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL', {
      day: 'numeric',
      month: 'short'
    });
  } catch {
    return dateString;
  }
};

export function IndicatorsSection() {
  const { indicators, loading, error } = useIndicators();

  if (loading) {
    return (
      <section className="indicators-section">
        <div className="section-glass">
          <h3 className="section-title">💰 Indicadores Económicos</h3>
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Cargando indicadores...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="indicators-section">
        <div className="section-glass">
          <h3 className="section-title">💰 Indicadores Económicos</h3>
          <p className="error-text">⚠️ {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="indicators-section">
      <div className="section-glass">
        <h3 className="section-title">💰 Indicadores Económicos de Chile</h3>
        <p className="section-subtitle">Valores actualizados del día</p>

        <div className="indicators-grid">
          {Object.entries(INDICATOR_CONFIG).map(([key, config]) => {
            const data = indicators?.[key];
            return (
              <div
                key={key}
                className="indicator-card"
                style={{ '--indicator-color': config.color }}
              >
                <div className="indicator-icon">{config.icon}</div>
                <div className="indicator-info">
                  <p className="indicator-name">{config.name}</p>
                  <p className="indicator-value">
                    {data ? formatValue(data.value, config) : '--'}
                  </p>
                  {data?.date && (
                    <p className="indicator-date">
                      Actualizado: {formatDate(data.date)}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default IndicatorsSection;
