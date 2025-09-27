
interface TypeBadgeProps {
  typeName: string;
}


const typeColorMap: { [key: string]: string } = {
  normal: "bg-gray-400 text-black",
  fire: "bg-red-500 text-white",
  water: "bg-blue-500 text-white",
  electric: "bg-yellow-400 text-black",
  grass: "bg-green-500 text-white",
  ice: "bg-cyan-300 text-black",
  fighting: "bg-orange-700 text-white",
  poison: "bg-purple-600 text-white",
  ground: "bg-yellow-600 text-white",
  flying: "bg-indigo-400 text-white",
  psychic: "bg-pink-500 text-white",
  bug: "bg-lime-500 text-black",
  rock: "bg-yellow-700 text-white",
  ghost: "bg-indigo-800 text-white",
  dragon: "bg-indigo-600 text-white",
  dark: "bg-gray-800 text-white",
  steel: "bg-gray-500 text-white",
  fairy: "bg-pink-300 text-black",
};

export default function TypeBadge({ typeName }: TypeBadgeProps) {
  const colorClass = typeColorMap[typeName] || "bg-gray-200 text-black";

  return (
    <span className={`px-3 py-1 text-sm font-semibold rounded-full capitalize ${colorClass}`}>
      {typeName}
    </span>
  );
}