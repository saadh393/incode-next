import { Terminal } from "lucide-react";
import type { Database } from "../src/lib/database.types";

type Lesson = Database["public"]["Tables"]["lessons"]["Row"] & {
  arguments: Database["public"]["Tables"]["arguments"]["Row"][];
};

interface LessonListProps {
  lessons: Lesson[];
  currentLessonId: string;
  currentArgumentIndex: number;
  onSelectLesson: (lessonId: string) => void;
}

function LessonList({ lessons, currentLessonId, onSelectLesson }: LessonListProps) {
  return (
    <div className="w-1/4 rounded-lg border border-gray-800 bg-gray-900 p-4">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
        <Terminal size={20} className="text-amber-500" />
        Lessons
      </h2>
      <div className="space-y-2">
        {lessons.map((lesson) => (
          <button
            key={lesson.id}
            className={`w-full rounded-md p-3 text-left transition-colors hover:bg-gray-800 ${
              currentLessonId === lesson.id ? "bg-gray-800 border border-amber-500" : ""
            }`}
            onClick={() => onSelectLesson(lesson.id)}
          >
            {lesson.title}
          </button>
        ))}
      </div>
    </div>
  );
}

export default LessonList;
