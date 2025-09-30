
interface TypeBadgeProps {
  typeName: string;
  // Adicionamos uma prop para tamanho opcional
  size?: 'sm' | 'md'; 
}


// Mapa de cores mais completo e exportável
export const typeColorMap: { [key: string]: { bg: string; text: string; border: string } } = {
  normal:   { bg: "bg-gray-200",    text: "text-black",   border: "border-gray-400" },
  fire:     { bg: "bg-red-200",     text: "text-red-900",   border: "border-red-400" },
  water:    { bg: "bg-blue-200",    text: "text-blue-900",  border: "border-blue-400" },
  electric: { bg: "bg-yellow-200",  text: "text-yellow-900",border: "border-yellow-400" },
  grass:    { bg: "bg-green-200",   text: "text-green-900", border: "border-green-400" },
  ice:      { bg: "bg-cyan-200",    text: "text-cyan-900",  border: "border-cyan-400" },
  fighting: { bg: "bg-orange-300",  text: "text-orange-900",border: "border-orange-500" },
  poison:   { bg: "bg-purple-200",  text: "text-purple-900",border: "border-purple-400" },
  ground:   { bg: "bg-yellow-300",  text: "text-yellow-900",border: "border-yellow-500" },
  flying:   { bg: "bg-indigo-200",  text: "text-indigo-900",border: "border-indigo-400" },
  psychic:  { bg: "bg-pink-200",    text: "text-pink-900",  border: "border-pink-400" },
  bug:      { bg: "bg-lime-200",    text: "text-lime-900",  border: "border-lime-400" },
  rock:     { bg: "bg-yellow-600",  text: "text-yellow-100",border: "border-yellow-800" },
  ghost:    { bg: "bg-indigo-300",  text: "text-indigo-900",border: "border-indigo-500" },
  dragon:   { bg: "bg-indigo-400",  text: "text-indigo-900",border: "border-indigo-600" },
  dark:     { bg: "bg-gray-500",    text: "text-white",     border: "border-gray-700" },
  steel:    { bg: "bg-gray-300",    text: "text-gray-900",  border: "border-gray-500" },
  fairy:    { bg: "bg-pink-200",    text: "text-pink-900",  border: "border-pink-400" },
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