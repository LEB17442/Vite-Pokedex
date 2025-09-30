// src/pages/Home.tsx
import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PokemonCard from "../components/PokemonCard";
import PokemonCardSkeleton from "../components/PokemonCardSkeleton";
import Pagination from "../components/Pagination";
import TypeFilter from "../components/TypeFilter";
import { api } from "../lib/api";
import type { TypeDetailResponse, PokemonSlot, PokemonListItem } from "../types/pokemon";

export default function Home() {
  // --- Estados ---
  const [allPokemons, setAllPokemons] = useState<PokemonListItem[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const limit = 20;

  // --- Efeito para buscar dados ---
  useEffect(() => {
    const fetchPokemons = async () => {
      setLoading(true);
      setCurrentPage(1); 
      
      // CASO 1: Nenhum filtro selecionado
      if (selectedTypes.length === 0) {
        const response = await api.get(`pokemon?limit=1025&offset=0`);
        setAllPokemons(response.data.results);
      } 
      // CASO 2: UM filtro selecionado
      else if (selectedTypes.length === 1) {
        const response = await api.get<TypeDetailResponse>(`type/${selectedTypes[0]}`);
        const pokemonsFromType = response.data.pokemon.map((p: PokemonSlot) => p.pokemon);
        setAllPokemons(pokemonsFromType);
      }
      // CASO 3: DOIS filtros selecionados
      else if (selectedTypes.length === 2) {
        // Busca as duas listas em paralelo
        const [res1, res2] = await Promise.all([
          api.get<TypeDetailResponse>(`type/${selectedTypes[0]}`),
          api.get<TypeDetailResponse>(`type/${selectedTypes[1]}`)
        ]);
        
        const pokemons1 = res1.data.pokemon.map(p => p.pokemon);
        const pokemons2 = res2.data.pokemon.map(p => p.pokemon);

        // Encontra a intersecção (Pokémon que estão em ambas as listas)
        const pokemons1Names = new Set(pokemons1.map(p => p.name));
        const intersection = pokemons2.filter(p => pokemons1Names.has(p.name));
        
        setAllPokemons(intersection);
      }
      
      setLoading(false);
    };

    fetchPokemons();
  }, [selectedTypes]); // Refaz a busca quando o tipo selecionado muda

  // --- Lógica de Paginação ---
  const totalPokemons = allPokemons.length;
  const totalPages = Math.ceil(totalPokemons / limit);
  // 'pokemonsToShow' agora é uma fatia da lista completa
  const pokemonsToShow = useMemo(() => {
    const offset = (currentPage - 1) * limit;
    return allPokemons.slice(offset, offset + limit);
  }, [currentPage, allPokemons, limit]);

  // --- Handlers ---
 const handleTypeSelect = (typeName: string) => {
    if (typeName === 'clear') {
      setSelectedTypes([]);
      return;
    }

    setSelectedTypes(currentTypes => {
      if (currentTypes.includes(typeName)) {
        return currentTypes.filter(t => t !== typeName);
      }
      if (currentTypes.length < 2) {
        return [...currentTypes, typeName];
      }
      return currentTypes;
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    const searchTermClean = searchTerm.trim().toLowerCase();
    if (!searchTermClean) return;
    try {
      await api.get(`pokemon/${searchTermClean}`);
      navigate(`/pokemon/${searchTermClean}`);
    } catch (error) {
      alert(`Pokémon "${searchTerm}" não encontrado!`);
    }
  };
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage, selectedTypes]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Pokédex</h1>

      <form onSubmit={handleSearch} className="mb-8 flex justify-center">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar Pokémon por nome..."
          className="px-4 py-2 border rounded-l-lg text-black w-full max-w-xs"
        />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600">
          Buscar
        </button>
      </form>

      <TypeFilter selectedTypes={selectedTypes} onTypeSelect={handleTypeSelect} />

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: limit }).map((_, index) => (
            <PokemonCardSkeleton key={index} />
          ))}
        </div>
      ) : (
        <>
          <div className="min-h-[50vh]">
            {pokemonsToShow.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {pokemonsToShow.map((pokemon) => (
                  <PokemonCard key={pokemon.name} name={pokemon.name} />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 mt-10">Nenhum Pokémon encontrado com os tipos selecionados.</p>
            )}
          </div>
          
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              isLoading={loading}
            />
          )}
        </>
      )}
    </div>
  );
 }