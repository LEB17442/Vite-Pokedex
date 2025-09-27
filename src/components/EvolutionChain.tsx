// src/components/EvolutionChain.tsx
import { useEffect, useState } from "react";
import { api } from "../lib/api";
import type { PokemonSpecies, EvolutionChainResponse, EvolutionNode } from "../types/pokemon";
import PokemonCard from "./PokemonCard";

interface EvolutionChainProps {
  speciesUrl: string;
}

export default function EvolutionChain({ speciesUrl }: EvolutionChainProps) {
  const [evolutionChain, setEvolutionChain] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvolutionChain() {
      if (!speciesUrl) return;

      setLoading(true);
      try {
        // 1. Busca a espécie para obter a URL da cadeia de evolução
        const speciesResponse = await api.get<PokemonSpecies>(speciesUrl);
        const evolutionChainUrl = speciesResponse.data.evolution_chain.url;

        // 2. Busca a cadeia de evolução
        const evolutionResponse = await api.get<EvolutionChainResponse>(evolutionChainUrl);

        // 3. Processa os dados da cadeia de evolução
        const chain: string[] = [];
        let currentNode: EvolutionNode | undefined = evolutionResponse.data.chain;

        while (currentNode) {
          chain.push(currentNode.species.name);
          currentNode = currentNode.evolves_to[0];
        }
        setEvolutionChain(chain);

      } catch (error) {
        console.error("Failed to fetch evolution chain:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchEvolutionChain();
  }, [speciesUrl]);

  if (loading) {
    return <p className="text-center">Carregando evoluções...</p>;
  }

  if (evolutionChain.length <= 1) {
    return null;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4 text-center">Cadeia de Evolução</h2>
      <div className="flex justify-center items-center gap-2 md:gap-4 flex-wrap">
        {evolutionChain.map((pokemonName, index) => (
          <div key={pokemonName} className="flex items-center">
            <div className="w-28 md:w-32">
                <PokemonCard name={pokemonName} />
            </div>
            {index < evolutionChain.length - 1 && (
              <span className="text-2xl font-bold mx-2">&rarr;</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}