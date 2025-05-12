import { modules } from "../../data";
import { notFound } from "next/navigation";

interface LessonPageProps {
  params: { module: string; lesson: string };
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { module: moduleId, lesson: lessonId } = await params;
  const mod = modules.find((m) => m.id === moduleId);
  const lesson = mod?.lessons.find((l) => l.id === lessonId);
  if (!mod || !lesson) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">{lesson!.title}</h1>
      <div className="prose dark:prose-invert">
        <p>Content for {lesson!.title} coming soon.</p>
      </div>
    </div>
  );
} 