import GameBoard from "@/components/GameBoard";
import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function GameBoardPage({ params: { gameId } }: { params: { gameId: string } }) {
  const supabase = createClient();

  const { data: game } = await supabase.from("games").select("*").eq("id", gameId).single();

  if (!game) {
    return <div>Game not found</div>;
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-900 text-gray-300 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-amber-500"></div>
        </div>
      }
    >
      <GameBoard gameId={gameId} />
    </Suspense>
  );
}
