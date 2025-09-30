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

  if (isPending) return <p className="text-center">Carregando filtros...</p>;

  return (
    <div className="mb-8 p-4 bg-gray-100 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-center flex-grow">Filtrar por Tipo (até 2)</h2>
        {selectedTypes.length > 0 && (
          <button 
            onClick={() => onTypeSelect('clear')} 
            className="text-sm text-blue-600 hover:underline"
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
              // Desabilita o botão se não estiver selecionado e já houver 2 tipos escolhidos
              disabled={!selectedTypes.includes(type.name) && selectedTypes.length >= 2}
              className={`transition-transform duration-200 disabled:opacity-25 disabled:cursor-not-allowed ${
                selectedTypes.length > 0 && !selectedTypes.includes(type.name) 
                ? 'opacity-50 scale-95' 
                : 'opacity-100'
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