// src/hooks/usePokemonApi.ts
import { useQuery, type UseQueryResult, type UseQueryOptions } from "@tanstack/react-query";
import { api } from "../lib/api";

// A função de busca de dados agora é separada
const fetchData = async <T>(endpoint: string): Promise<T> => {
  if (!endpoint || endpoint.endsWith('undefined') || endpoint.endsWith('null')) {
    return Promise.reject(new Error('Endpoint inválido'));
  }
  const { data } = await api.get<T>(endpoint);
  return data;
};

// --- FUNÇÃO MODIFICADA ---
export function usePokemonApi<T>(
  endpoint: string, 
  // Adicionamos um segundo argumento opcional para as opções do React Query
  options?: Omit<UseQueryOptions<T, Error>, 'queryKey' | 'queryFn'>
): UseQueryResult<T, Error> {

  return useQuery<T, Error>({
    queryKey: [endpoint],
    queryFn: () => fetchData<T>(endpoint),
    staleTime: 1000 * 60 * 5, // 5 minutos de cache
    refetchOnWindowFocus: false,
    ...options, // Repassamos as opções extras (como 'enabled') para o useQuery
  });
}