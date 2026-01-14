import { useState, useEffect } from 'react';

export function useHolidays() {
  const [holidays, setHolidays] = useState([]);
  const [todayHoliday, setTodayHoliday] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHolidays = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch próximos feriados y verificar si hoy es feriado
      const [upcomingRes, todayRes] = await Promise.all([
        fetch('/api/holidays/upcoming'),
        fetch('/api/holidays/today')
      ]);

      const upcomingData = await upcomingRes.json();
      const todayData = await todayRes.json();

      if (upcomingData.status === 'success') {
        setHolidays(upcomingData.data || []);
      }

      if (todayData.status === 'success' && todayData.data) {
        setTodayHoliday(todayData.data);
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
