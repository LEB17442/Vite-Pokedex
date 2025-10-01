
interface TypeBadgeProps {
  typeName: string;
  // Adicionamos uma prop para tamanho opcional
  size?: 'sm' | 'md'; 
}


// Mapa de cores mais completo e exportável
export const typeColorMap: { [key: string]: { bg: string; text: string; border: string; glow: string } } = {
  normal:   { bg: "bg-gray-300",    text: "text-gray-800",   border: "border-gray-400", glow: "#A0AEC0" }, // Cinza mais visível
  fire:     { bg: "bg-red-500",     text: "text-white",      border: "border-red-600",   glow: "#F56565" },
  water:    { bg: "bg-blue-500",    text: "text-white",      border: "border-blue-600",  glow: "#4299E1" },
  electric: { bg: "bg-yellow-400",  text: "text-gray-800",   border: "border-yellow-500",glow: "#F6E05E" },
  grass:    { bg: "bg-green-500",   text: "text-white",      border: "border-green-600", glow: "#48BB78" },
  ice:      { bg: "bg-cyan-300",    text: "text-gray-800",   border: "border-cyan-400",  glow: "#81E6D9" },
  fighting: { bg: "bg-orange-500",  text: "text-white",      border: "border-orange-600",glow: "#ED8936" },
  poison:   { bg: "bg-purple-500",  text: "text-white",      border: "border-purple-600",glow: "#9F7AEA" },
  ground:   { bg: "bg-yellow-600",  text: "text-white",      border: "border-yellow-700",glow: "#D69E2E" },
  flying:   { bg: "bg-indigo-400",  text: "text-white",      border: "border-indigo-500",glow: "#805AD5" },
  psychic:  { bg: "bg-pink-500",    text: "text-white",      border: "border-pink-600",  glow: "#ED64A6" },
  bug:      { bg: "bg-lime-500",    text: "text-white",      border: "border-lime-600",  glow: "#A8B820" },
  rock:     { bg: "bg-stone-500",   text: "text-white",      border: "border-stone-600", glow: "#718096" },
  ghost:    { bg: "bg-violet-600",  text: "text-white",      border: "border-violet-700",glow: "#805AD5" },
  dragon:   { bg: "bg-teal-500",    text: "text-white",      border: "border-teal-600",  glow: "#38B2AC" },
  dark:     { bg: "bg-gray-700",    text: "text-white",      border: "border-gray-800",  glow: "#4A5568" },
  steel:    { bg: "bg-slate-400",   text: "text-gray-800",   border: "border-slate-500", glow: "#B8B8D0" },
  fairy:    { bg: "bg-rose-400",    text: "text-white",      border: "border-rose-500",  glow: "#F56565" },
};

export default function TypeBadge({ typeName, size = 'md' }: TypeBadgeProps) {
  const colors = typeColorMap[typeName] || typeColorMap.normal;
  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span className={`font-semibold rounded-full capitalize ${padding} ${colors.bg} ${colors.text}`}>
      {typeName}
    </span>
  );
}