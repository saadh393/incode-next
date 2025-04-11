import { getGameData } from "@/app/actions/gameActions";
import BattleMode from "@/components/BattleMode";

export const dynamic = "force-dynamic";

export default async function BattleModePage() {
  const data = await getGameData("1");

  if (!data.game) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-300 flex items-center justify-center">
        <p>Game not found</p>
      </div>
    );
  }

  if (!data.lessons || data.lessons.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-300 flex items-center justify-center">
        <p>No lessons available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <BattleMode lessons={data.lessons} />
    </div>
  );
}
