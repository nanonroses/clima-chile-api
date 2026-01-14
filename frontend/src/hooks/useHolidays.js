import { useState, useEffect } from 'react';
import { endpoints } from '../config/api';

export function useHolidays() {
  const [holidays, setHolidays] = useState([]);
  const [todayHoliday, setTodayHoliday] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHolidays = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(endpoints.holidays);
      const data = await response.json();

      if (data.status === 'success' && data.data) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayStr = today.toISOString().split('T')[0];

        // Filtrar próximos 5 feriados
        const upcoming = data.data
          .filter(holiday => new Date(holiday.date) >= today)
          .slice(0, 5);
        setHolidays(upcoming);

        // Verificar si hoy es feriado
        const todayMatch = data.data.find(h => h.date === todayStr);
        if (todayMatch) {
          setTodayHoliday({ is_holiday: true, ...todayMatch });
        }
      }
    } catch (err) {
      setError('Error al obtener feriados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, []);

  return { holidays, todayHoliday, loading, error, refetch: fetchHolidays };
}
