import { useState, useEffect, useCallback } from 'react';
import { endpoints } from '../config/api';

export function useIndicators() {
  const [indicators, setIndicators] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchIndicators = useCallback(async (signal) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(endpoints.indicators, { signal });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data.status === 'success') {
        setIndicators(data.data);
      } else {
        setError(data.message || 'Error al obtener indicadores');
      }
    } catch (err) {
      // Ignorar errores de abort (cleanup)
      if (err.name === 'AbortError') return;
      setError('Error de conexión al servidor');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchIndicators(controller.signal);

    // Cleanup: cancelar fetch si el componente se desmonta
    return () => controller.abort();
  }, [fetchIndicators]);

  const refetch = useCallback(() => {
    const controller = new AbortController();
    fetchIndicators(controller.signal);
  }, [fetchIndicators]);

  return { indicators, loading, error, refetch };
}
