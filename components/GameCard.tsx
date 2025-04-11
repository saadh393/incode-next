"use client";
import * as Icons from "lucide-react";
import { useRouter } from "next/navigation";

interface GameCardProps {
  game: any;
}

function GameCard({ game }: GameCardProps) {
  const router = useRouter();
  const Icon = Icons[game.icon as keyof typeof Icons] as React.ElementType | undefined;

  const colorClasses = {
    blue: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
    yellow: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
    green: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
  };

  return (
    <button
      onClick={() => router.push(`/game-board/${game.id}`)}
      className={`flex flex-col items-center justify-center p-8 rounded-xl transition-all ${
        colorClasses[game.color as keyof typeof colorClasses]
      }`}
    >
      {Icon && <Icon size={48} className="mb-4" />}
      <h2 className="text-xl font-bold mb-2">{game.title}</h2>
      <p className="text-center text-gray-400">{game.description}</p>
    </button>
  );
}

export default GameCard;
