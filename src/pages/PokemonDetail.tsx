// src/pages/PokemonDetail.tsx
import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { usePokemonApi } from "../hooks/usePokemonApi";
import TypeBadge, { typeColorMap } from "../components/TypeBadge";
import EvolutionChain from "../components/EvolutionChain";
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

  const { data: species, isPending: isSpeciesPending } = 
    usePokemonApi<PokemonSpecies>(name ? `pokemon-species/${name}` : "");

  const pokedexDescription = useMemo(() => {
    if (!species) return "";
    const englishEntry = species.flavor_text_entries.find(entry => entry.language.name === 'en');
    return englishEntry ? englishEntry.flavor_text.replace(/[\n\f\r]/g, " ") : "";
  }, [species]);

  const isPending = isPokemonPending || isSpeciesPending;

  if (isPending) {
    return <div className="w-full h-screen flex justify-center items-center">Carregando...</div>;
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

 const primaryType = pokemon.types[0].type.name;
  const colors = typeColorMap[primaryType] || typeColorMap.normal;

  return (
    <div className={`min-h-screen w-full p-4 ${colors.bg}`}>
      <Link to="/" className="absolute top-4 left-4 z-20 bg-white/80 hover:bg-white text-blue-600 font-bold py-2 px-4 rounded-lg shadow-md transition-transform hover:scale-105 backdrop-blur-sm">
        &larr; Voltar à Pokédex
      </Link>

      {/* --- CONTAINER ÚNICO E CENTRALIZADO --- */}
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-8 py-12">

        {/* --- Seção de Identidade --- */}
        <section className="flex flex-col items-center text-center">
            <span className={`text-4xl font-bold ${colors.text} opacity-60`}>Nº{pokemon.id.toString().padStart(4, '0')}</span>
            <h1 className={`text-7xl font-bold capitalize ${colors.text}`}>{pokemon.name}</h1>
            <div className="flex gap-2 my-4">
                {pokemon.types.map(t => <TypeBadge key={t.type.name} typeName={t.type.name} />)}
            </div>
            <div className="relative">
                <img 
                    src={showShiny ? pokemon.sprites.front_shiny : pokemon.sprites.front_default} 
                    alt={pokemon.name} 
                    className="w-64 h-64 drop-shadow-xl" 
                />
                <button 
                    onClick={() => setShowShiny(!showShiny)}
                    className="absolute top-0 right-0 px-3 py-1 bg-yellow-400 text-black text-xs font-bold rounded-full shadow hover:bg-yellow-300 transition-transform hover:scale-105"
                >
                    ✨ Shiny
                </button>
            </div>
        </section>

        {/* --- Seção Sobre --- */}
        <section className="w-full flex flex-col items-center gap-4">
            <h2 className={`text-3xl font-bold ${colors.text}`}>Sobre</h2>
            <p className={`italic ${colors.text} text-center max-w-2xl`}>{pokedexDescription}</p>
            <div className="flex justify-around text-center bg-white/50 p-4 rounded-lg w-full max-w-md">
                <p><strong>Altura:</strong><br/> {pokemon.height / 10} m</p>
                <p><strong>Peso:</strong><br/> {pokemon.weight / 10} kg</p>
            </div>
        </section>

        {/* --- Seção Status Base --- */}
        <section className="w-full max-w-2xl">
            <h2 className={`text-3xl font-bold mb-4 text-center ${colors.text}`}>Status Base</h2>
            <div className="space-y-3 bg-white/50 p-6 rounded-lg">
                {pokemon.stats.map(stat => (
                    <div key={stat.stat.name}>
                        <div className="flex justify-between font-semibold capitalize">
                            <span>{statNameMapping[stat.stat.name] || stat.stat.name}</span>
                            <span>{stat.base_stat}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                                className={`h-3 rounded-full ${getStatColor(stat.base_stat)}`}
                                style={{ width: `${Math.min(stat.base_stat, 255) / 255 * 100}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        </section>

        {/* --- Seção Evolução --- */}
        <section className="w-full">
            {pokemon.species.url && <EvolutionChain speciesUrl={pokemon.species.url} />}
        </section>

      </div>
    </div>
  );
}