// src/components/Header.tsx
import { Link } from "react-router-dom";

// Você pode baixar um ícone de Pokebola em SVG e colocar na pasta `public`
const PokeballIcon = () => (
  <img src="/pokeball.svg" alt="Pokeball Icon" className="w-8 h-8" />
);

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-gray-900/70 backdrop-blur-lg border-b border-gray-800">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 text-2xl font-bold text-white">
          <PokeballIcon />
          <span>Pokédex</span>
        </Link>
        <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
          Sobre
        </Link>
      </nav>
    </header>
  );
}