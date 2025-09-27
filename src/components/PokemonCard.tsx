import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { usePokemonApi } from "../hooks/usePokemonApi";
import { api } from "../lib/api";

interface PokemonCardProps {
  name: string;
}

interface PokemonDetails {
  sprites: {
    front_default: string;
  };
}

export default function PokemonCard({ name }: PokemonCardProps) {
  const [imageUrl, setImageUrl,] = useState<string | null>(null);
  const { data: pokemonDetails, loading } = usePokemonApi<PokemonDetails>(`pokemon/${name}`);


  useEffect(() => {
    async function fetchPokemonImage() {
      try {
        const response = await api.get<PokemonDetails>(`pokemon/${name}`);
        setImageUrl(response.data.sprites.front_default);
      } catch (error) {
        console.error(`Failed to fetch image for ${name}:`, error);
      }
    }
    fetchPokemonImage();
  }, [name]);

  return (
    <Link to={`/pokemon/${name}`} className="p-4 border rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col items-center">
      {loading || !pokemonDetails ? (
        <div className="w-24 h-24 bg-gray-200 rounded animate-pulse" />
      ) : (
        <img src={pokemonDetails.sprites.front_default} alt={name} className="w-24 h-24" />
      )}
      <p className="capitalize mt-2 font-semibold">{name}</p>
    </Link>
  );
}