// src/components/PokemonCard.tsx

import { Link } from "react-router-dom";
import { usePokemonApi } from "../hooks/usePokemonApi";
import type { PokemonDetailData } from "../types/pokemon";
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

  const primaryType = pokemon.types[0].type.name;
  const colors = typeColorMap[primaryType] || typeColorMap.normal;

  const animatedSprite = pokemon.sprites.versions?.['generation-v']['black-white'].animated?.front_default;
  const staticSprite = pokemon.sprites.front_default;

  return (
    <Link
      to={`/pokemon/${name}`}
      className="group relative flex flex-col items-center text-center p-4 rounded-xl shadow-lg 
                 bg-gray-800/50 border border-gray-700
                 transition-all duration-300 ease-in-out 
                 hover:border-blue-500 hover:scale-105 hover:-translate-y-1"
    >
      {/* Elementos de fundo e brilho */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
      <div
        className="absolute -inset-1 rounded-xl opacity-0 group-hover:opacity-25 blur-md transition-opacity duration-300"
        style={{ backgroundColor: colors.glow }}
      ></div>

      {/* --- CORREÇÃO AQUI --- */}
      {/* O ID agora é um filho direto do Link e está posicionado em relação a ele */}
      <span className="absolute top-3 left-3 text-xs font-bold text-gray-500 z-20">
        #{pokemon.id.toString().padStart(4, '0')}
      </span>

      {/* Container das imagens */}
      <div className="relative mt-2 h-24 w-24">
        {/* Imagem Estática */}
        <img
          src={staticSprite}
          alt={displayName || name}
          className="w-full h-full drop-shadow-lg transition-opacity duration-300 group-hover:opacity-0"
          style={{ imageRendering: 'pixelated' }}
        />
        {/* Imagem Animada */}
        {animatedSprite && (
          <img
            src={animatedSprite}
            alt={displayName || name}
            className="w-full h-full drop-shadow-lg absolute top-0 left-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{ imageRendering: 'pixelated' }}
          />
        )}
      </div>
      
      {/* Container do nome e tipos */}
      <div className="relative mt-auto z-10">
        <p className="capitalize text-lg font-bold text-white">{displayName || name.replace('-', ' ')}</p>
        <div className="flex justify-center gap-1 mt-1">
          {pokemon.types.map(t => <TypeBadge key={t.type.name} typeName={t.type.name} size="sm" />)}
        </div>
      </div>
    </Link>
  );
}