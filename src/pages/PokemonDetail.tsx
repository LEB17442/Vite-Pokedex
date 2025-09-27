import { useParams, Link } from "react-router-dom";
import { usePokemonApi } from "../hooks/usePokemonApi";
import TypeBadge from "../components/TypeBadge";
import EvolutionChain from "../components/EvolutionChain";
import type { PokemonDetailData } from "../types/pokemon";

export default function PokemonDetail() {
  const { name } = useParams<{ name: string }>();
    const { data: pokemon, loading, error } = usePokemonApi<PokemonDetailData>(name ? `pokemon/${name}` : "");

    if (loading) {
    return <p className="text-center mt-10">Carregando detalhes do Pokémon...</p>;
  }

  if (error || !pokemon) {
    return (
        <div className="text-center mt-10">
            <p>Pokémon não encontrado!</p>
            <Link to="/" className="mt-6 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Voltar para a Pokédex
            </Link>
        </div>
    );
  }


  const statNameMapping: { [key: string]: string } = {
    "hp": "HP",
    "attack": "Ataque",
    "defense": "Defesa",
    "special-attack": "Ataque Especial",
    "special-defense": "Defesa Especial",
    "speed": "Velocidade",
  };

    return (
    <div className="container mx-auto p-4 flex flex-col items-center">
      <div className="p-6 border rounded-lg shadow-xl max-w-2xl w-full bg-white text-black">
        <h1 className="text-4xl font-bold capitalize mb-2 text-center">{pokemon.name}</h1>

        <div className="flex justify-center gap-2 mb-4">
          {pokemon.types.map(t => (
            <TypeBadge key={t.type.name} typeName={t.type.name} />
          ))}
        </div>

        <img src={pokemon.sprites.front_default} alt={pokemon.name} className="mx-auto w-48 h-48 bg-gray-100 rounded-full" />

        <div className="text-center mt-4">
          <h2 className="text-2xl font-semibold mb-2">Detalhes</h2>
          <p><strong>Altura:</strong> {pokemon.height / 10} m</p>
          <p><strong>Peso:</strong> {pokemon.weight / 10} kg</p>
        </div>

        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-3 text-center">Status Base</h2>
          <div className="space-y-2">
            {pokemon.stats.map(stat => (
              <div key={stat.stat.name}>
                <span className="font-semibold capitalize">{statNameMapping[stat.stat.name] || stat.stat.name}</span>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-blue-500 h-4 rounded-full flex items-center justify-end pr-2 text-white text-xs font-bold"
                    style={{ width: `${Math.min(stat.base_stat, 255) / 255 * 100}%` }}
                  >
                    {stat.base_stat}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {pokemon.species.url && <EvolutionChain speciesUrl={pokemon.species.url} />}
      </div>

      <Link to="/" className="mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Voltar para a Pokédex
      </Link>
    </div>
  );
}
