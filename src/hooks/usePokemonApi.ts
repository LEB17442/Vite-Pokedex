import { useState, useEffect } from "react";
import { api } from "../lib/api";

export function usePokemonApi<T>(endpoint: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get<T>(endpoint);
        setData(response.data);
      } catch (err) {
        setError("Falha ao buscar os dados.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (endpoint) {
      fetchData();
    }
  }, [endpoint]);

  return { data, loading, error };
}