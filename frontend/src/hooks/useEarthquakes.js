import { useState, useEffect, useCallback } from 'react';
import { endpoints } from '../config/api';

export function useEarthquakes() {
  const [earthquakes, setEarthquakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEarthquakes = useCallback(async (signal) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(endpoints.earthquakes, { signal });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data.status === 'success') {
        setEarthquakes(data.data || []);
      } else {
        setError(data.message || 'Error al obtener sismos');
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
    fetchEarthquakes(controller.signal);

    // Cleanup: cancelar fetch si el componente se desmonta
    return () => controller.abort();
  }, [fetchEarthquakes]);

  const refetch = useCallback(() => {
    const controller = new AbortController();
    fetchEarthquakes(controller.signal);
  }, [fetchEarthquakes]);

  return { earthquakes, loading, error, refetch };
}
