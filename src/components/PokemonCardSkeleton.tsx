export default function PokemonCardSkeleton() {
  return (
    <div className="p-4 border rounded-lg shadow-md animate-pulse">
      <div className="w-24 h-24 bg-gray-300 rounded-lg mx-auto" />
      <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto mt-3" />
    </div>
  );
}