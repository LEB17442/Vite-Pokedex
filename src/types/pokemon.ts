// --- Tipos para a Lista Principal (Home) ---
export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  results: PokemonListItem[];
  next: string | null;
  previous: string | null;
}

// --- Tipos para os Detalhes do Pokémon ---

export interface PokemonDetailData {
  id: number; // Adicione esta linha
  name: string;
}

export interface PokemonType {
  type: {
    name: string;
  };
}

export interface PokemonStat {
  base_stat: number;
  stat: {
    name: string;
  };
}

export interface PokemonSprites {
  front_default: string;
  front_shiny: string;
}

export interface PokemonDetailData {
  name: string;
  sprites: PokemonSprites;
  types: PokemonType[];
  height: number;
  weight: number;
  stats: PokemonStat[];
  species: {
    url: string;
  };
}

// --- Tipos para a Cadeia de Evolução ---

export interface FlavorTextEntry {
    flavor_text: string;
    language: {
        name: string;
    };
    version: {
        name: string;
    };
}

export interface PokemonSpecies {
    evolution_chain: {
        url: string;
    };
    flavor_text_entries: FlavorTextEntry[]; 
}

export interface EvolutionNode {
    species: {
        name: string;
    };
    evolves_to: EvolutionNode[];
}

export interface EvolutionChainResponse {
    chain: EvolutionNode;
}

// --- Tipos para o Filtro de Tipos ---
export interface TypeListItem {
    name: string;
    url: string;
}

export interface TypeListResponse {
    results: TypeListItem[];
}

// Esta é a interface que representa cada item na lista de um tipo
export interface PokemonSlot {
    pokemon: PokemonListItem;
    slot: number;
}

export interface TypeDetailResponse {
    pokemon: PokemonSlot[];
}
