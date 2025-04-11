import GameCard from "@/components/GameCard";
import { createClient } from "@supabase/supabase-js";
import { Code } from "lucide-react";

export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  const { data: games } = await supabase.from("games").select("*").order("title");

  return (
    <div className="min-h-screen bg-gray-900 text-gray-300">
      <header className="border-b border-gray-800 p-4">
        <div className="container mx-auto flex items-center space-x-2">
          <Code className="text-amber-500" />
          <span className="text-xl font-bold">
            <span className="text-white">IN</span>
            <span className="text-amber-500">CODE</span>
          </span>
        </div>
      </header>

      <main className="container mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold text-center mb-12">
          Choose Your <span className="text-amber-500">Learning Path</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {games?.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </main>
    </div>
  );
}
