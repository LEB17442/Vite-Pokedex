// src/pages/PokemonDetail.tsx

import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import EvolutionChain from "../components/EvolutionChain";
import FormSwitcher from "../components/FormSwitcher";
import PokemonDetailSkeleton from "../components/PokemonDetailSkeleton";
import TypeBadge from "../components/TypeBadge";
import { usePokemonApi } from "../hooks/usePokemonApi";
import type { PokemonDetailData, PokemonSpecies } from "../types/pokemon";

const getStatColor = (statValue: number): string => {
    if (statValue < 60) return "bg-red-500";
    if (statValue < 90) return "bg-yellow-500";
    return "bg-green-500";
};

const statNameMapping: { [key: string]: string } = {
  "hp": "HP", "attack": "Ataque", "defense": "Defesa",
  "special-attack": "Ataque Especial", "special-defense": "Defesa Especial", "speed": "Velocidade",
};

export default function PokemonDetail() {
  const { name } = useParams<{ name: string }>();
  const [showShiny, setShowShiny] = useState(false);

  const { data: pokemon, isPending: isPokemonPending, error: pokemonError } = 
    usePokemonApi<PokemonDetailData>(name ? `pokemon/${name}` : "");

  const speciesUrl = pokemon?.species.url;

  const { data: species, isPending: isSpeciesPending } = 
    usePokemonApi<PokemonSpecies>(speciesUrl || "", {
      enabled: !!speciesUrl,
    });

  const pokedexDescription = useMemo(() => {
    if (!species) return "";
    const englishEntry = species.flavor_text_entries.find(entry => entry.language.name === 'en');
    return englishEntry ? englishEntry.flavor_text.replace(/[\n\f\r]/g, " ") : "Nenhuma descrição encontrada.";
  }, [species]);

  const isPending = isPokemonPending || (!!speciesUrl && !species);

  if (isPending) {
    return <PokemonDetailSkeleton />;
  }

  if (pokemonError || !pokemon) {
    return (
      <div className="text-center mt-10">
        <p>Pokémon não encontrado!</p>
        <Link to="/" className="mt-6 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Voltar
        </Link>
      </div>
    );
  }

// --- LÓGICA DE SPRITES ATUALIZADA ---
  // Sprites Padrão
  const animatedDefault = pokemon.sprites.versions?.['generation-v']['black-white'].animated?.front_default;
  const officialArtDefault = pokemon.sprites.other?.['official-artwork']?.front_default;
  const pixelDefault = pokemon.sprites.front_default;
  
  // Sprites Shiny
  const animatedShiny = pokemon.sprites.versions?.['generation-v']['black-white'].animated?.front_shiny;
  const officialArtShiny = pokemon.sprites.other?.['official-artwork']?.front_shiny; // <-- Nova variável
  const pixelShiny = pokemon.sprites.front_shiny;

  // Define a prioridade de exibição
  const defaultSpriteToShow = animatedDefault || officialArtDefault || pixelDefault;
  const shinySpriteToShow = animatedShiny || officialArtShiny || pixelShiny; // <-- Prioriza a artwork oficial shiny

  const displaySprite = showShiny ? shinySpriteToShow : defaultSpriteToShow;

  return (
    <div className="min-h-screen w-full p-4 animate-fade-in bg-gray-900">
      <Link to="/" className="fixed top-24 lg:top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 bg-gray-900/60 hover:bg-gray-800 text-white font-bold rounded-full shadow-lg transition-all hover:scale-105 backdrop-blur-sm">
          &larr; Voltar
      </Link>

      <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
              <p className="text-2xl font-bold text-white/50">Nº{pokemon.id.toString().padStart(4, '0')}</p>
              <h1 className="text-6xl font-extrabold capitalize text-white drop-shadow-lg">{pokemon.name.replace('-', ' ')}</h1>
              <div className="flex justify-center gap-2 mt-4">
                  {pokemon.types.map(t => <TypeBadge key={t.type.name} typeName={t.type.name} />)}
              </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-2 flex flex-col gap-8">
                  <div className="relative panel p-4">
                      <img 
                          src={displaySprite}
                          alt={pokemon.name} 
                          className="w-full h-auto drop-shadow-2xl"
                          style={{ imageRendering: 'pixelated' }}
                      />
                      <button 
                          onClick={() => setShowShiny(!showShiny)}
                          className={`absolute top-4 right-4 flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold transition-all ${showShiny ? 'bg-yellow-400/20 text-yellow-300 border border-yellow-400' : 'bg-gray-700/50 text-gray-300 border border-gray-600 hover:bg-gray-600'}`}
                      >
                          <span className={`w-2 h-2 rounded-full transition-colors ${showShiny ? 'bg-yellow-400' : 'bg-gray-400'}`}></span>
                          Shiny
                      </button>
                  </div>
                  <div className="panel p-4 text-center">
                      <h3 className="font-bold text-xl text-white mb-2">Informações Básicas</h3>
                      <div className="flex justify-around text-white">
                          <div>
                              <p className="text-gray-400 text-sm">Altura</p>
                              <p className="font-bold text-lg">{pokemon.height / 10} m</p>
                          </div>
                          <div>
                              <p className="text-gray-400 text-sm">Peso</p>
                              <p className="font-bold text-lg">{pokemon.weight / 10} kg</p>
                          </div>
                      </div>
                  </div>
                  
                  {species && pokemon && (
                    <FormSwitcher 
                      currentPokemonName={pokemon.name} 
                      varieties={species.varieties} 
                    />
                  )}
              </div>

              <div className="lg:col-span-3 flex flex-col gap-8">
                  <div className="panel p-6">
                      <h3 className="font-bold text-xl text-white mb-2">Descrição da Pokédex</h3>
                      <p className="italic text-gray-300">{pokedexDescription}</p>
                  </div>
                  <div className="panel p-6">
                      <h3 className="font-bold text-xl text-white mb-4">Status Base</h3>
                      <div className="space-y-3">
                          {pokemon.stats.map(stat => (
                              <div key={stat.stat.name}>
                                  <div className="flex justify-between font-semibold capitalize text-white">
                                      <span>{statNameMapping[stat.stat.name] || stat.stat.name}</span>
                                      <span>{stat.base_stat}</span>
                                  </div>
                                  <div className="w-full bg-gray-700 rounded-full h-3 mt-1">
                                      <div
                                          className={`h-3 rounded-full ${getStatColor(stat.base_stat)}`}
                                          style={{ width: `${Math.min(stat.base_stat, 255) / 255 * 100}%` }}
                                      ></div>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          </div>

          <div className="mt-8 panel p-6">
              {speciesUrl && <EvolutionChain speciesUrl={speciesUrl} />}
          </div>
      </div>
    </div>
  );
}