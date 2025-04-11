import { getGameData } from "@/app/actions/gameActions";
import GameBoard from "@/components/GameBoard";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function GameBoardPage({ params: { gameId } }: { params: { gameId: string } }) {
  const data = await getGameData(gameId);

  if (!data.game) {
    notFound();
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-900 text-gray-300 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-amber-500"></div>
        </div>
      }
    >
      <GameBoard initialGame={data.game} initialLessons={data.lessons} />
    </Suspense>
  );
}
