import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import App from "./App"; // Importe o App
import Home from "./pages/Home";
import About from "./pages/About";
import PokemonDetail from "./pages/PokemonDetail";
import "./index.css";

const queryClient = new QueryClient();

const router = createBrowserRouter([
{
    path: "/",
    element: <App />, // App é o elemento principal
    children: [ // As páginas são filhas do App
      { path: "/", element: <Home /> },
      { path: "/about", element: <About /> },
      { path: "/pokemon/:name", element: <PokemonDetail /> },
      // { path: "*", element: <NotFound /> }, // Rota para 404
    ],
  },
]);


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);