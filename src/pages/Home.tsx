// src/pages/Home.tsx

import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PokemonCard from "../components/PokemonCard";
import PokemonCardSkeleton from "../components/PokemonCardSkeleton";
import Pagination from "../components/Pagination";
import TypeFilter from "../components/TypeFilter";
import { api } from "../lib/api";
import type { TypeDetailResponse, PokemonSlot, PokemonListItem, PokemonSpecies } from "../types/pokemon";

export default function Home() {
  // --- Estados ---
  const [allPokemons, setAllPokemons] = useState<PokemonListItem[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const limit = 20;


  const [fullPokemonList, setFullPokemonList] = useState<PokemonListItem[]>([]); 
  const [suggestions, setSuggestions] = useState<PokemonListItem[]>([]);

  // Efeito para buscar a lista completa (nome e url) uma única vez
  useEffect(() => {
    const fetchAllPokemon = async () => {
      try {
        const response = await api.get('pokemon?limit=1302&offset=0');
        // Armazena a lista completa de resultados
        setFullPokemonList(response.data.results);
      } catch (error) {
        console.error("Falha ao buscar a lista de Pokémon:", error);
      }
    };
    fetchAllPokemon();
  }, []);
  
  // Efeito para buscar os Pokémon com base nos filtros de tipo
  useEffect(() => {
    const fetchPokemons = async () => {
      setLoading(true);
      setCurrentPage(1); 
      
      if (selectedTypes.length === 0) {
        const response = await api.get(`pokemon?limit=1025&offset=0`);
        setAllPokemons(response.data.results);
      } 
      else if (selectedTypes.length === 1) {
        const response = await api.get<TypeDetailResponse>(`type/${selectedTypes[0]}`);
        const pokemonsFromType = response.data.pokemon.map((p: PokemonSlot) => p.pokemon);
        setAllPokemons(pokemonsFromType);
      }
      else if (selectedTypes.length === 2) {
        const [res1, res2] = await Promise.all([
          api.get<TypeDetailResponse>(`type/${selectedTypes[0]}`),
          api.get<TypeDetailResponse>(`type/${selectedTypes[1]}`)
        ]);
        
        const pokemons1 = res1.data.pokemon.map(p => p.pokemon);
        const pokemons2 = res2.data.pokemon.map(p => p.pokemon);

        const pokemons1Names = new Set(pokemons1.map(p => p.name));
        const intersection = pokemons2.filter(p => pokemons1Names.has(p.name));
        
        setAllPokemons(intersection);
      }
      
      setLoading(false);
    };

    fetchPokemons();
  }, [selectedTypes]);

  // Lógica de Paginação
  const totalPokemons = allPokemons.length;
  const totalPages = Math.ceil(totalPokemons / limit);
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
  
  // Lógica de busca inteligente (lida com espécies vs. formas)
  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    const searchTermClean = searchTerm.trim().toLowerCase();
    if (!searchTermClean) return;
    setSuggestions([]); // Esconde as sugestões ao submeter

    try {
      await api.get(`pokemon/${searchTermClean}`);
      navigate(`/pokemon/${searchTermClean}`);
    } catch (error) {
      try {
        const speciesResponse = await api.get<PokemonSpecies>(`pokemon-species/${searchTermClean}`);
        const defaultVariety = speciesResponse.data.varieties.find(v => v.is_default) || speciesResponse.data.varieties[0];
        if (defaultVariety) {
          navigate(`/pokemon/${defaultVariety.pokemon.name}`);
        } else {
          throw new Error("Espécie encontrada, mas sem variações válidas.");
        }
      } catch (finalError) {
        alert(`Pokémon "${searchTerm}" não encontrado!`);
      }
    }
  };

  // --- MUDANÇA: Handler para atualizar o campo de busca e as sugestões ---
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.length > 1) {
      // Filtra a lista completa de objetos PokemonListItem
      const filteredSuggestions = fullPokemonList
        .filter(pokemon => pokemon.name.includes(value.toLowerCase()))
        .slice(0, 5);
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  // --- MUDANÇA: Handler para clicar em uma sugestão ---
  const handleSuggestionClick = (name: string) => {
    setSearchTerm(name);
    setSuggestions([]);
    navigate(`/pokemon/${name}`);
  };
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage, selectedTypes]);

  return (
    <div className="animate-fade-in">
      <div className="text-center my-8 md:my-12">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight">
          Explore o Mundo Pokémon
        </h1>
        <p className="text-gray-400 mt-2">
          Busque, filtre e descubra seus Pokémon favoritos.
        </p>
        
        <div className="relative max-w-lg mx-auto">
          <form onSubmit={handleSearch} className="mt-6 flex justify-center">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              onBlur={() => setTimeout(() => setSuggestions([]), 150)}
              placeholder="Busque por nome ou número..."
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-l-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="submit" className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-r-lg hover:bg-blue-700 transition-colors">
              Buscar
            </button>
          </form>

          {/* --- MUDANÇA: Container das Sugestões com Imagens --- */}
          {suggestions.length > 0 && (
            <ul className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden">
              {suggestions.map(suggestion => {
                // Extrai o ID da URL do Pokémon
                const id = suggestion.url.split('/').filter(Boolean).pop();
                const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

                return (
                  <li key={suggestion.name}>
                    <button
                      onMouseDown={() => handleSuggestionClick(suggestion.name)}
                      className="w-full text-left px-4 py-2 text-white hover:bg-gray-700 flex items-center gap-4"
                    >
                      <img src={spriteUrl} alt={suggestion.name} className="w-10 h-10" />
                      <span className="capitalize">{suggestion.name.replace('-', ' ')}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      <TypeFilter selectedTypes={selectedTypes} onTypeSelect={handleTypeSelect} />

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: limit }).map((_, index) => (
            <PokemonCardSkeleton key={index} />
          ))}
        </div>
      ) : (
        <>
          <div className="min-h-[50vh]">
            {pokemonsToShow.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {pokemonsToShow.map((pokemon) => (
                  <PokemonCard key={pokemon.name} name={pokemon.name} />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-400 mt-10">Nenhum Pokémon encontrado com os tipos selecionados.</p>
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