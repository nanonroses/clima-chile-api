import { useState, useEffect } from 'react';
import { endpoints } from '../config/api';

export function useIndicators() {
  const [indicators, setIndicators] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchIndicators = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(endpoints.indicators);
      const data = await response.json();

      if (data.status === 'success') {
        setIndicators(data.data);
      } else {
        setError(data.message || 'Error al obtener indicadores');
      }
    } catch (err) {
      setError('Error de conexión al servidor');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIndicators();
  }, []);

  return { indicators, loading, error, refetch: fetchIndicators };
}
