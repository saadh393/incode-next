import { useEffect, useState } from "react";
import type { Database } from "../src/lib/database.types";

type Lesson = Database["public"]["Tables"]["lessons"]["Row"] & {
  arguments: Database["public"]["Tables"]["arguments"]["Row"][];
};

interface TypingAreaProps {
  lessons: Lesson[];
  currentLessonId: string;
  currentArgumentIndex: number;
  onArgumentComplete: (index: number) => void;
  onLessonComplete: (totalChars: number, correctChars: number) => void;
  onTypingStart: () => void;
}

function TypingArea({
  lessons,
  currentLessonId,
  currentArgumentIndex,
  onArgumentComplete,
  onLessonComplete,
  onTypingStart,
}: TypingAreaProps) {
  const currentLesson = lessons.find((lesson) => lesson.id === currentLessonId) || lessons[0];
  const [typedText, setTypedText] = useState("");
  const [showTabBadge, setShowTabBadge] = useState(false);
  const [totalCharacters, setTotalCharacters] = useState(0);
  const [correctCharacters, setCorrectCharacters] = useState(0);
  const [currentCommand, setCurrentCommand] = useState<{
    command: string;
    description: string;
  }>({
    command: currentLesson.command,
    description: currentLesson.title,
  });

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Tab") {
        event.preventDefault();

        if (showTabBadge) {
          if (currentArgumentIndex < currentLesson.arguments.length) {
            const nextArg = currentLesson.arguments[currentArgumentIndex];
            setCurrentCommand({
              command: `${currentLesson.command.split(" ")[0]} ${nextArg.flag}`,
              description: nextArg.description,
            });
            onArgumentComplete(currentArgumentIndex + 1);
            setTypedText("");
            setShowTabBadge(false);
          } else {
            // Move to next lesson
            onLessonComplete(totalCharacters, correctCharacters);
            setTotalCharacters(0);
            setCorrectCharacters(0);
          }
        }
      } else if (event.key === "Backspace") {
        setTypedText((prev) => prev.slice(0, -1));
      } else if (event.key.length === 1) {
        onTypingStart();
        setTypedText((prev) => prev + event.key);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [
    showTabBadge,
    currentArgumentIndex,
    currentLesson,
    onArgumentComplete,
    onLessonComplete,
    totalCharacters,
    correctCharacters,
  ]);

  useEffect(() => {
    if (typedText === currentCommand.command) {
      setShowTabBadge(true);
      setTotalCharacters((prev) => prev + currentCommand.command.length);
      const correct = [...typedText].filter((char, i) => char === currentCommand.command[i]).length;
      setCorrectCharacters((prev) => prev + correct);
    } else {
      setShowTabBadge(false);
    }
  }, [typedText, currentCommand.command]);

  useEffect(() => {
    setTypedText("");
    setShowTabBadge(false);
    if (currentArgumentIndex < currentLesson.arguments.length) {
      const arg = currentLesson.arguments[currentArgumentIndex];
      setCurrentCommand({
        command: `${currentLesson.command.split(" ")[0]} ${arg.flag}`,
        description: arg.description,
      });
    } else {
      setCurrentCommand({
        command: currentLesson.command,
        description: currentLesson.title,
      });
    }
  }, [currentLessonId, currentArgumentIndex, currentLesson]);

  const getCharacterClass = (index: number) => {
    if (index >= typedText.length) return "text-gray-500";
    if (typedText[index] === currentCommand.command[index]) return "text-amber-500";
    return "text-[#F2027A]";
  };

  return (
    <div className="flex-1 rounded-lg border border-gray-800 bg-gray-900 p-8">
      <h1 className="mb-4 text-center text-2xl font-bold text-white">{currentCommand.description}</h1>

      <div className="flex min-h-[200px] items-center justify-center relative">
        <div className="text-3xl font-mono">
          {currentCommand.command.split("").map((char, index) => (
            <span key={index} className={getCharacterClass(index)}>
              {char}
            </span>
          ))}
        </div>
        {showTabBadge && (
          <div className="absolute top-0 right-0 bg-amber-500 text-black px-3 py-1 rounded-md text-sm font-medium">
            Press Tab to continue
          </div>
        )}
      </div>
    </div>
  );
}

export default TypingArea;
