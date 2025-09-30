// src/hooks/usePokemonApi.ts
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

// A função de busca de dados agora é separada
const fetchData = async <T>(endpoint: string): Promise<T> => {
  const { data } = await api.get<T>(endpoint);
  return data;
};

export function usePokemonApi<T>(endpoint: string) {

  return useQuery<T, Error>({
    queryKey: [endpoint],
    queryFn: () => fetchData<T>(endpoint),
    staleTime: 1000 * 60 * 5,
  });
}