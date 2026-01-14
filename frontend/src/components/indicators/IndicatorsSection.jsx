import { useIndicators } from '../../hooks/useIndicators';

const INDICATOR_CONFIG = {
  dolar: { name: 'Dólar', icon: '💵', prefix: '$', suffix: '', decimals: 0 },
  euro: { name: 'Euro', icon: '💶', prefix: '$', suffix: '', decimals: 0 },
  uf: { name: 'UF', icon: '📊', prefix: '$', suffix: '', decimals: 2 },
  utm: { name: 'UTM', icon: '📈', prefix: '$', suffix: '', decimals: 0 },
  ipc: { name: 'IPC', icon: '📉', prefix: '', suffix: '%', decimals: 2 }
};

const formatValue = (value, config) => {
  if (value === undefined || value === null) return '--';
  const num = parseFloat(value);
  const formatted = num.toLocaleString('es-CL', {
    minimumFractionDigits: config.decimals,
    maximumFractionDigits: config.decimals
  });
  return `${config.prefix}${formatted}${config.suffix}`;
};

export function IndicatorsSection() {
  const { indicators, loading, error } = useIndicators();

  if (loading) {
    return (
      <div className="indicators-section">
        <h3 className="section-title">Indicadores Económicos</h3>
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="indicators-section">
        <h3 className="section-title">Indicadores Económicos</h3>
        <p className="error-text">{error}</p>
      </div>
    );
  }

  return (
    <div className="indicators-section">
      <h3 className="section-title">Indicadores Económicos</h3>
      <div className="indicators-grid">
        {Object.entries(INDICATOR_CONFIG).map(([key, config]) => {
          const data = indicators?.[key];
          return (
            <div key={key} className="indicator-card">
              <div className="indicator-icon">{config.icon}</div>
              <p className="indicator-name">{config.name}</p>
              <p className="indicator-value">
                {data ? formatValue(data.value, config) : '--'}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default IndicatorsSection;
