import { usePokemonApi } from "../hooks/usePokemonApi";
import type { TypeListResponse } from "../types/pokemon";
import TypeBadge from "./TypeBadge";

interface TypeFilterProps {
  selectedTypes: string[];
  onTypeSelect: (typeName: string) => void;
}

export default function TypeFilter({ selectedTypes, onTypeSelect }: TypeFilterProps) {
  const { data: typesData, isPending } = usePokemonApi<TypeListResponse>("type");

  const handleSelect = (typeName: string) => {
    onTypeSelect(typeName);
  };

  if (isPending) return <p className="text-center text-gray-400">Carregando filtros...</p>;

  return (
    // Aplicando nosso estilo de painel!
    <div className="panel p-4 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white flex-grow text-center">Filtrar por Tipo (até 2)</h2>
        {selectedTypes.length > 0 && (
          <button 
            onClick={() => onTypeSelect('clear')} 
            className="text-sm text-blue-400 hover:underline"
          >
            Limpar Filtro
          </button>
        )}
      </div>
      <div className="flex justify-center flex-wrap gap-2">
        {typesData?.results.map(type => (
          !['unknown', 'shadow'].includes(type.name) && (
            <button
              key={type.name}
              onClick={() => handleSelect(type.name)}
              disabled={!selectedTypes.includes(type.name) && selectedTypes.length >= 2}
              // Estilos ajustados para o tema escuro
              className={`transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed ${
                selectedTypes.includes(type.name)
                ? 'scale-105 opacity-100'
                : 'scale-100 opacity-60 hover:opacity-100'
              }`}
            >
              <TypeBadge typeName={type.name} />
            </button>
          )
        ))}
      </div>
    </div>
  );
}