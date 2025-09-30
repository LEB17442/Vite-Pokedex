import { Link } from "react-router-dom";
import { usePokemonApi } from "../hooks/usePokemonApi";
import type { PokemonDetailData } from "../types/pokemon";
import PokemonCardSkeleton from "./PokemonCardSkeleton";
import { typeColorMap } from "./TypeBadge";

interface PokemonCardProps {
  name: string;
}

export default function PokemonCard({ name }: PokemonCardProps) {
  const { data: pokemon, isPending } = usePokemonApi<PokemonDetailData>(`pokemon/${name}`);

  // Se estiver carregando, mostre o Skeleton
  if (isPending || !pokemon) {
    return <PokemonCardSkeleton />;
  }

  // Pega a cor do primeiro tipo do Pokémon
  const primaryType = pokemon.types[0].type.name;
  const colors = typeColorMap[primaryType] || typeColorMap.normal;

  return (
    <Link 
    to={`/pokemon/${name}`} 
    className={`group relative p-4 rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-all flex flex-col items-center text-center ${colors.bg}`}
    >
      <div className="bg-white/50 rounded-full p-2 mb-2">
        <img 
          src={pokemon.sprites.front_default} 
          alt={pokemon.name} 
          className="w-24 h-24" 
        />
      </div>
      <div className="mt-auto">
        <p className={`text-xs font-bold ${colors.text} opacity-60`}>Nº{pokemon.id.toString().padStart(4, '0')}</p>
        <p className={`capitalize font-semibold ${colors.text}`}>{pokemon.name}</p>
      </div>
    </Link>
  );
}