import { useHolidays } from '../../hooks/useHolidays';

const formatDate = (dateString) => {
  try {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('es-CL', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  } catch {
    return dateString;
  }
};

const getDaysUntil = (dateString) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const holidayDate = new Date(dateString + 'T00:00:00');
  const diffTime = holidayDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Hoy';
  if (diffDays === 1) return 'Mañana';
  return `${diffDays} días`;
};

const getHolidayIcon = (type, title) => {
  const titleLower = (title || '').toLowerCase();
  if (titleLower.includes('navidad')) return '🎄';
  if (titleLower.includes('año nuevo')) return '🎆';
  if (titleLower.includes('pascua') || titleLower.includes('semana santa')) return '✝️';
  if (titleLower.includes('patrias') || titleLower.includes('independencia')) return '🇨🇱';
  if (titleLower.includes('trabajo')) return '👷';
  if (titleLower.includes('virgen') || titleLower.includes('carmen')) return '🙏';
  if (titleLower.includes('muertos') || titleLower.includes('santos')) return '🕯️';
  return type === 'Religioso' ? '⛪' : '📅';
};

export function HolidaysSection() {
  const { holidays, todayHoliday, loading, error } = useHolidays();

  if (loading) {
    return (
      <div className="holidays-section">
        <h3 className="section-title">Próximos Feriados</h3>
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="holidays-section">
        <h3 className="section-title">Próximos Feriados</h3>
        <p className="error-text">{error}</p>
      </div>
    );
  }

  return (
    <div className="holidays-section">
      <h3 className="section-title">Próximos Feriados</h3>

      {todayHoliday && todayHoliday.is_holiday && (
        <div className="today-holiday-banner">
          <span className="banner-icon">✦</span>
          <div className="banner-content">
            <p className="banner-title">Hoy es feriado</p>
            <p className="banner-name">{todayHoliday.title || todayHoliday.name}</p>
          </div>
        </div>
      )}

      <div className="holidays-list">
        {holidays.slice(0, 5).map((holiday, index) => (
          <div key={index} className="holiday-item">
            <div className="holiday-icon">
              {getHolidayIcon(holiday.type, holiday.title)}
            </div>
            <div className="holiday-info">
              <p className="holiday-name">{holiday.title}</p>
              <p className="holiday-date">{formatDate(holiday.date)}</p>
            </div>
            <div className="holiday-countdown">
              <span className="countdown-days">{getDaysUntil(holiday.date)}</span>
              {holiday.inalienable && (
                <span className="holiday-badge">Irrenunciable</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {holidays.length === 0 && (
        <p className="no-data-text">No hay feriados próximos</p>
      )}
    </div>
  );
}

export default HolidaysSection;
