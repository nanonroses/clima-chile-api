import { useState, useEffect } from 'react';
import { endpoints } from '../config/api';

export function useEarthquakes() {
  const [earthquakes, setEarthquakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEarthquakes = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(endpoints.earthquakes);
      const data = await response.json();

      if (data.status === 'success') {
        setEarthquakes(data.data || []);
      } else {
        setError(data.message || 'Error al obtener sismos');
      }
    } catch (err) {
      setError('Error de conexión al servidor');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarthquakes();
  }, []);

  return { earthquakes, loading, error, refetch: fetchEarthquakes };
}
