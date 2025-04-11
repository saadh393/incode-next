"use client";

import type { Database } from "@/lib/supabase/database.types";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ArgumentsPanel from "./ArgumentsPanel";
import LessonList from "./LessonList";
import TypingArea from "./TypingArea";

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Game = Database["public"]["Tables"]["games"]["Row"];
type Lesson = Database["public"]["Tables"]["lessons"]["Row"] & {
  arguments: Database["public"]["Tables"]["arguments"]["Row"][];
};

interface TimingStats {
  wpm: number;
  accuracy: number;
  timeTaken: number;
  timestamp: number;
}

export default function GameBoard({ gameId }: { gameId: string }) {
  const router = useRouter();
  const [game, setGame] = useState<Game | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
  const [currentArgumentIndex, setCurrentArgumentIndex] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [previousStats, setPreviousStats] = useState<TimingStats | null>(null);

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

  const handleLessonComplete = (totalChars: number, correctChars: number) => {
    const stats: TimingStats = {
      wpm: calculateWPM(totalChars, elapsedTime),
      accuracy: (correctChars / totalChars) * 100,
      timeTaken: elapsedTime,
      timestamp: Date.now(),
    };
    setPreviousStats(stats);
    // Reset for next lesson
    setStartTime(null);
    setElapsedTime(0);
    setIsTyping(false);
  };

  const handleTypingStart = () => {
    if (!isTyping) {
      setIsTyping(true);
      setStartTime(Date.now());
    }
  };

  const calculateWPM = (totalChars: number, seconds: number) => {
    const minutes = seconds / 60;
    const words = totalChars / 5; // assuming average word length of 5 characters
    return Math.round(words / minutes);
  };

  useEffect(() => {
    async function fetchGameData() {
      try {
        const [gameResponse, lessonsResponse] = await Promise.all([
          supabase.from("games").select("*").eq("id", gameId).single(),
          supabase.from("lessons").select(`*, arguments(*)`).eq("game_id", gameId).order("order"),
        ]);

        if (gameResponse.error) throw gameResponse.error;
        if (lessonsResponse.error) throw lessonsResponse.error;

        setGame(gameResponse.data);
        setLessons(lessonsResponse.data as Lesson[]);

        if (lessonsResponse.data.length > 0) {
          setCurrentLessonId(lessonsResponse.data[0].id);
        }
      } catch (error) {
        console.error("Error fetching game data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchGameData();
  }, [gameId]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTyping && startTime) {
      timer = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTyping, startTime]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-300 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-300 p-8">
      <div className="container mx-auto">
        <div className="flex gap-8">
          <LessonList
            lessons={lessons}
            currentLessonId={currentLessonId || ""}
            currentArgumentIndex={currentArgumentIndex}
            onSelectLesson={handleLessonSelect}
          />
          <TypingArea
            lessons={lessons}
            currentLessonId={currentLessonId || ""}
            currentArgumentIndex={currentArgumentIndex}
            onArgumentComplete={handleArgumentComplete}
            onLessonComplete={handleLessonComplete}
            onTypingStart={handleTypingStart}
          />
          <ArgumentsPanel
            lessons={lessons}
            currentLessonId={currentLessonId || ""}
            currentArgumentIndex={currentArgumentIndex}
            onSelectArgument={handleArgumentSelect}
          />
        </div>
      </div>
    </div>
  );
}
