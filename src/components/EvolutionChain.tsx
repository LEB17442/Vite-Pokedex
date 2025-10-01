// src/components/EvolutionChain.tsx

import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { PokemonSpecies, EvolutionChainResponse, EvolutionNode, EvolutionDetail } from "../types/pokemon";
import PokemonCard from "./PokemonCard";

// --- Tipagens ---
interface EvolutionChainProps {
  speciesUrl: string;
}
interface EvolutionStageProps {
  node: EvolutionNode;
}

// --- Helper para formatar detalhes ---
function formatEvolutionDetails(details: EvolutionDetail[] | undefined): string | null {
  if (!details || details.length === 0) return null;
  const detail = details[0];
  const trigger = detail.trigger.name.replace('-', ' ');
  const conditions: string[] = [];
  if (detail.min_level) conditions.push(`Nível ${detail.min_level}`);
  if (detail.item) conditions.push(`Usar ${detail.item.name.replace('-', ' ')}`);
  if (detail.held_item) conditions.push(`Segurar ${detail.held_item.name.replace('-', ' ')}`);
  if (detail.known_move) conditions.push(`Saber ${detail.known_move.name.replace('-', ' ')}`);
  if (detail.time_of_day) conditions.push(detail.time_of_day === 'day' ? 'Durante o Dia' : 'Durante a Noite');
  if (detail.min_happiness) conditions.push('Felicidade Alta');
  if (trigger === 'trade') conditions.push('Troca');
  if (conditions.length === 0 && trigger === 'level up') return 'Sobe de Nível';
  return conditions.join(' + ') || trigger;
}

// --- Componente de Renderização Recursivo (Simplificado) ---
function EvolutionStage({ node }: EvolutionStageProps) {
  return (
    <div className="flex items-center">
      <div className="w-32 md:w-40 flex-shrink-0">
        <PokemonCard name={node.species.name} displayName={node.species.name.replace('-', ' ')} />
      </div>

      {node.evolves_to.length > 0 && (
        <div className="flex flex-col justify-center">
          {node.evolves_to.map((nextNode, index) => (
            <div key={`${nextNode.species.name}-${index}`} className="flex items-center my-2">
              <div className="flex flex-col items-center mx-2 md:mx-4 text-center w-24 flex-shrink-0">
                {formatEvolutionDetails(nextNode.evolution_details) && (
                  <span className="text-xs font-bold text-blue-400 bg-blue-900/50 px-2 py-1 rounded mb-1 capitalize">
                    {formatEvolutionDetails(nextNode.evolution_details)}
                  </span>
                )}
                <span className="text-2xl font-bold text-gray-500">&rarr;</span>
              </div>
              <EvolutionStage node={nextNode} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// --- Componente Principal ---
export default function EvolutionChain({ speciesUrl }: EvolutionChainProps) {
  const { data: chainResponse, isLoading } = useQuery<EvolutionChainResponse>({
    queryKey: ['evolution-chain', speciesUrl],
    queryFn: async () => {
      const speciesResponse = await api.get<PokemonSpecies>(speciesUrl);
      const evolutionChainUrl = speciesResponse.data.evolution_chain.url;
      return (await api.get<EvolutionChainResponse>(evolutionChainUrl)).data;
    },
    enabled: !!speciesUrl,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const evolutionRoot = chainResponse?.chain;

  if (isLoading) return <p className="text-center text-gray-400">Carregando evoluções...</p>;
  // Corrigido: Agora usa !evolutionRoot para checar se a cadeia existe
  if (!evolutionRoot || evolutionRoot.evolves_to.length === 0) {
    return <p className="text-center text-gray-400">Este Pokémon não possui evoluções.</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-center text-white">Cadeia de Evolução</h2>
      <div className="flex justify-center p-4 overflow-x-auto">
        <EvolutionStage node={evolutionRoot} />
      </div>
    </div>
  );
}