// src/components/FormSwitcher.tsx

import { Link } from "react-router-dom";
import type { PokemonSpecies } from "../types/pokemon";

interface FormSwitcherProps {
  currentPokemonName: string;
  varieties: PokemonSpecies['varieties'];
}

export default function FormSwitcher({ currentPokemonName, varieties }: FormSwitcherProps) {
  // Filtra a lista para mostrar apenas as outras formas, não a atual.
  const otherForms = varieties.filter(v => v.pokemon.name !== currentPokemonName);

  // Se não houver outras formas, não renderiza nada.
  if (otherForms.length === 0) {
    return null;
  }

  return (
    <div className="panel p-4 text-center">
      <h3 className="font-bold text-xl text-white mb-3">Outras Formas</h3>
      <div className="flex justify-center gap-4 flex-wrap">
        {otherForms.map(form => (
          <Link
            key={form.pokemon.name}
            to={`/pokemon/${form.pokemon.name}`}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-semibold capitalize"
          >
            {form.pokemon.name.replace('-', ' ')}
          </Link>
        ))}
      </div>
    </div>
  );
}