// src/App.tsx
import { Outlet } from "react-router-dom";
import Header from "./components/Header"; // Certifique-se de que o Header está sendo importado

export default function App() {
  return (
    <div className="w-full">
      <Header />
      <main className="container mx-auto p-4">
        <Outlet /> {/* O Outlet renderiza a página da rota atual (Home, About, etc.) */}
      </main>
    </div>
  );
}