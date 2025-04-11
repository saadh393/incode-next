import { Square, Terminal, Timer } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface HeaderProps {
  isTimerRunning: boolean;
  elapsedTime: number;
  onStopTimer: () => void;
}

export default function Header({ isTimerRunning, elapsedTime, onStopTimer }: HeaderProps) {
  const [showBattleModal, setShowBattleModal] = useState(false);
  const router = useRouter();

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="border-b border-gray-800 bg-gray-900 p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal size={32} className="text-amber-500" />
          <h1 className="text-xl font-bold text-white">CLI Master</h1>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowBattleModal(true)}
            className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-white hover:bg-amber-600 transition-colors"
          >
            Battle Mode
          </button>

          <div className="flex items-center gap-2 rounded-lg bg-gray-800 px-4 py-2">
            <Timer size={20} className="text-amber-500" />
            <span className="font-mono text-xl text-white">{formatTime(elapsedTime)}</span>
          </div>

          {isTimerRunning && (
            <button
              onClick={onStopTimer}
              className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600 transition-colors"
            >
              <Square size={20} />
              Stop
            </button>
          )}
        </div>
      </div>

      {/* Battle Mode Modal */}
      {showBattleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold text-white mb-4">Battle Mode</h2>
            <p className="text-gray-300 mb-6">
              In Battle Mode, you&apos;ll be tested with random questions from your lessons. Your performance will be
              evaluated based on:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Time taken to complete each command</li>
                <li>Accuracy of your answers</li>
                <li>Total number of correct responses</li>
              </ul>
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowBattleModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowBattleModal(false);
                  router.push(`/battle-mode`);
                }}
                className="px-4 py-2 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-colors"
              >
                Start Battle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
