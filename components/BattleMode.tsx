"use client";

import type { Lesson } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import TypingArea from "./TypingArea";

interface BattleModeProps {
  lessons: Lesson[];
}

interface Question {
  command: string;
  description: string;
}

export default function BattleMode({ lessons }: BattleModeProps) {
  const router = useRouter();
  const [countdown, setCountdown] = useState<number>(3);
  const [isStarted, setIsStarted] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [battleStats, setBattleStats] = useState({
    startTime: 0,
    wrongKeyPresses: 0,
    correctAnswers: 0,
    skippedQuestions: 0,
  });

  useEffect(() => {
    // Generate 3 random questions from the lessons
    const allQuestions: Question[] = lessons.flatMap((lesson) => [
      { command: lesson.command, description: lesson.title },
      ...lesson.arguments.map((arg) => ({
        command: `${lesson.command.split(" ")[0]} ${arg.flag}`,
        description: arg.description,
      })),
    ]);

    const randomQuestions = [...allQuestions].sort(() => Math.random() - 0.5).slice(0, 3);

    setQuestions(randomQuestions);
  }, [lessons]);

  useEffect(() => {
    if (countdown > 0 && !isStarted) {
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !isStarted) {
      setIsStarted(true);
      setBattleStats((prev) => ({ ...prev, startTime: Date.now() }));
    }
  }, [countdown, isStarted]);

  const handleWrongKeyPress = () => {
    setBattleStats((prev) => ({
      ...prev,
      wrongKeyPresses: prev.wrongKeyPresses + 1,
    }));
  };

  const handleQuestionComplete = () => {
    setBattleStats((prev) => ({
      ...prev,
      correctAnswers: prev.correctAnswers + 1,
    }));
    moveToNextQuestion();
  };

  const handleSkipQuestion = () => {
    setBattleStats((prev) => ({
      ...prev,
      skippedQuestions: prev.skippedQuestions + 1,
    }));
    moveToNextQuestion();
  };

  const moveToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Battle completed
      const timeTaken = Math.floor((Date.now() - battleStats.startTime) / 1000);
      const accuracy = (battleStats.correctAnswers / questions.length) * 100;

      // For now, just show an alert with the results
      alert(
        `Battle Complete!\nTime: ${timeTaken}s\nAccuracy: ${accuracy.toFixed(1)}%\nCorrect Answers: ${
          battleStats.correctAnswers
        }\nSkipped Questions: ${battleStats.skippedQuestions}`
      );
      router.push("/");
    }
  };

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-300 flex items-center justify-center">
        <div className="text-9xl font-bold text-amber-500">{countdown}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Battle Mode</h1>
        <p className="text-gray-400">
          Question {currentQuestionIndex + 1} of {questions.length}
        </p>
      </div>

      {questions[currentQuestionIndex] && (
        <div className="w-full max-w-3xl mx-auto">
          <TypingArea
            lessons={[
              {
                id: "battle",
                game_id: "battle",
                title: questions[currentQuestionIndex].description,
                command: questions[currentQuestionIndex].command,
                description: "",
                order: 0,
                arguments: [],
              },
            ]}
            currentLessonId="battle"
            currentArgumentIndex={0}
            onArgumentComplete={() => {}}
            onLessonComplete={handleQuestionComplete}
            onTypingStart={() => {}}
            onWrongKeyPress={handleWrongKeyPress}
          />
        </div>
      )}

      <div className="mt-8 text-center space-x-4">
        <button
          onClick={handleSkipQuestion}
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
        >
          Skip Question
        </button>
        <button
          onClick={() => {
            if (window.confirm("Are you sure you want to quit the battle?")) {
              router.push("/");
            }
          }}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Quit Battle
        </button>
      </div>
    </div>
  );
}
