import type { Lesson } from "@/lib/types";

interface ArgumentsPanelProps {
  lessons: Lesson[];
  currentLessonId: string;
  currentArgumentIndex: number;
  onSelectArgument: (index: number) => void;
}

function ArgumentsPanel({ lessons, currentLessonId, currentArgumentIndex, onSelectArgument }: ArgumentsPanelProps) {
  const currentLesson = lessons.find((lesson) => lesson.id === currentLessonId) || lessons[0];
  const lessonArguments = currentLesson.arguments;

  return (
    <div className="w-1/4 rounded-lg border border-gray-800 bg-gray-900 p-4">
      <h2 className="mb-4 text-lg font-semibold text-white">Available Arguments</h2>
      <div className="space-y-4">
        {lessonArguments.map((arg, index) => (
          <button
            key={arg.id}
            className={`w-full text-left rounded-md p-4 transition-colors hover:bg-gray-700 ${
              index === currentArgumentIndex ? "bg-gray-800 border border-amber-500" : "bg-gray-800"
            }`}
            onClick={() => onSelectArgument(index)}
          >
            <code className="text-amber-500">{arg.flag}</code>
            <p className="mt-2 text-sm text-gray-400">{arg.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

export default ArgumentsPanel;
