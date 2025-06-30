import { useState, useEffect, useCallback } from 'react';
import { getData } from '../services/api-service';

export const useFetchData = <T>(endpoint: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getData(endpoint);
      setData(response);
    } catch (err) {
      setError(
        (err instanceof Error ? err.message : 'Error desconocido') ||
        'Error al obtener los datos.'
      );
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData }; 
};
