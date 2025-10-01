// src/components/PokemonDetailSkeleton.tsx

export default function PokemonDetailSkeleton() {
  return (
    <div className="min-h-screen w-full p-4 animate-pulse bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="h-6 w-24 bg-gray-700 rounded-md mx-auto mb-2"></div>
          <div className="h-16 w-3/5 bg-gray-700 rounded-lg mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-8">
            <div className="panel h-80 bg-gray-800"></div>
            <div className="panel h-24 bg-gray-800"></div>
          </div>
          <div className="lg:col-span-3 flex flex-col gap-8">
            <div className="panel h-32 bg-gray-800"></div>
            <div className="panel h-64 bg-gray-800"></div>
          </div>
        </div>
      </div>
    </div>
  );
}