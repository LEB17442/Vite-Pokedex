// src/components/PokemonCard.tsx
import { Link } from "react-router-dom";
import { usePokemonApi } from "../hooks/usePokemonApi";
import type { PokemonDetailData} from "../types/pokemon";
import PokemonCardSkeleton from "./PokemonCardSkeleton";
import { typeColorMap } from "./TypeBadge";
import TypeBadge from "./TypeBadge";

interface PokemonCardProps {
  name: string;
  displayName?: string;
}

export default function PokemonCard({ name, displayName }: PokemonCardProps) {
  const { data: pokemon, isPending } = usePokemonApi<PokemonDetailData>(`pokemon/${name}`);

  if (isPending || !pokemon) {
    return <PokemonCardSkeleton />;
  }

  const animatedSprite = pokemon.sprites.versions?.['generation-v']['black-white'].animated?.front_default;
  const staticSprite = pokemon.sprites.front_default;

  const primaryType = pokemon.types[0].type.name;
  const colors = typeColorMap[primaryType] || typeColorMap.normal;

  return (
    <Link
      to={`/pokemon/${name}`}
      className="group relative flex flex-col items-center text-center p-4 rounded-xl shadow-lg 
                 bg-gray-800/50 border border-gray-700
                 transition-all duration-300 ease-in-out 
                 hover:border-blue-500 hover:scale-105 hover:-translate-y-1"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
      <div
        className="absolute -inset-1 rounded-xl opacity-0 group-hover:opacity-25 blur-md transition-opacity duration-300"
        style={{ backgroundColor: colors.glow }}
      ></div>

      <div className="relative z-10">
        <span className="absolute -top-2 -left-2 text-xs font-bold text-gray-400">
          #{pokemon.id.toString().padStart(4, '0')}
        </span>
        <img
          src={staticSprite}
          alt={pokemon.name}
          className="w-24 h-24 drop-shadow-lg transition-opacity duration-300 group-hover:opacity-0"
        />
        {animatedSprite && (
          <img
            src={animatedSprite}
            alt={pokemon.name}
            className="w-24 h-24 drop-shadow-lg absolute top-0 left-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
        )}
      </div>
      <div className="relative z-10 mt-auto">
        <p className="capitalize text-lg font-bold text-white">{displayName || name}</p>
        <div className="flex justify-center gap-1 mt-1">
          {pokemon.types.map(t => <TypeBadge key={t.type.name} typeName={t.type.name} size="sm" />)}
        </div>
      </div>
    </Link>
  );
}