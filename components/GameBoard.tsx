"use client";

import type { Game, Lesson } from "@/app/actions/gameActions";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ArgumentsPanel from "./ArgumentsPanel";
import Header from "./Header";
import LessonList from "./LessonList";
import TypingArea from "./TypingArea";

interface TimingStats {
  wpm: number;
  accuracy: number;
  timeTaken: number;
  timestamp: number;
  wrongKeyPresses: number;
}

interface GameBoardProps {
  initialGame: Game;
  initialLessons: Lesson[];
}

export default function GameBoard({ initialGame, initialLessons }: GameBoardProps) {
  const router = useRouter();
  const [game] = useState<Game>(initialGame);
  const [lessons] = useState<Lesson[]>(initialLessons);
  const [currentLessonId, setCurrentLessonId] = useState<string>(initialLessons[0]?.id || "");
  const [currentArgumentIndex, setCurrentArgumentIndex] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [wrongKeyPresses, setWrongKeyPresses] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [finalStats, setFinalStats] = useState<TimingStats | null>(null);

  const handleLessonSelect = (lessonId: string) => {
    setCurrentLessonId(lessonId);
    setCurrentArgumentIndex(0);
  };

  const handleArgumentSelect = (index: number) => {
    setCurrentArgumentIndex(index);
  };

  const handleArgumentComplete = (index: number) => {
    setCurrentArgumentIndex(index);
  };

  const handleWrongKeyPress = () => {
    setWrongKeyPresses((prev) => prev + 1);
  };

  const handleStopTimer = () => {
    setIsTyping(false);
    calculateAndShowResults();
  };

  const calculateAndShowResults = () => {
    if (!startTime) return;

    const totalTime = Math.floor((Date.now() - startTime) / 1000);
    const stats: TimingStats = {
      wpm: calculateWPM(getTotalCharacters(), totalTime),
      accuracy: calculateAccuracy(),
      timeTaken: totalTime,
      timestamp: Date.now(),
      wrongKeyPresses,
    };

    setFinalStats(stats);
    setShowResults(true);
    setStartTime(null);
    setElapsedTime(0);
  };

  const getTotalCharacters = () => {
    return lessons.reduce((total, lesson) => {
      return total + lesson.command.length + lesson.arguments.reduce((argTotal, arg) => argTotal + arg.flag.length, 0);
    }, 0);
  };

  const calculateAccuracy = () => {
    const totalChars = getTotalCharacters();
    return ((totalChars - wrongKeyPresses) / totalChars) * 100;
  };

  const handleLessonComplete = (totalChars: number, correctChars: number) => {
    calculateAndShowResults();
  };

  const handleTypingStart = () => {
    if (!isTyping) {
      setIsTyping(true);
      setStartTime(Date.now());
      setShowResults(false);
    }
  };

  const calculateWPM = (totalChars: number, seconds: number) => {
    const minutes = seconds / 60;
    const words = totalChars / 5;
    return Math.round(words / minutes);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTyping && startTime) {
      timer = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTyping, startTime]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-300">
      <Header isTimerRunning={isTyping} elapsedTime={elapsedTime} onStopTimer={handleStopTimer} />

      <div className="container mx-auto p-8">
        {showResults && finalStats && (
          <div className="mb-8 rounded-lg border border-amber-500 bg-gray-800 p-6">
            <h2 className="mb-4 text-2xl font-bold text-amber-500">Results</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div>
                <p className="text-sm text-gray-400">Time Taken</p>
                <p className="text-2xl font-bold">{finalStats.timeTaken}s</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Words Per Minute</p>
                <p className="text-2xl font-bold">{finalStats.wpm}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Accuracy</p>
                <p className="text-2xl font-bold">{finalStats.accuracy.toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Wrong Key Presses</p>
                <p className="text-2xl font-bold">{finalStats.wrongKeyPresses}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-8">
          <LessonList
            lessons={lessons}
            currentLessonId={currentLessonId}
            currentArgumentIndex={currentArgumentIndex}
            onSelectLesson={handleLessonSelect}
          />
          <TypingArea
            lessons={lessons}
            currentLessonId={currentLessonId}
            currentArgumentIndex={currentArgumentIndex}
            onArgumentComplete={handleArgumentComplete}
            onLessonComplete={handleLessonComplete}
            onTypingStart={handleTypingStart}
            onWrongKeyPress={handleWrongKeyPress}
          />
          <ArgumentsPanel
            lessons={lessons}
            currentLessonId={currentLessonId}
            currentArgumentIndex={currentArgumentIndex}
            onSelectArgument={handleArgumentSelect}
          />
        </div>
      </div>
    </div>
  );
}
