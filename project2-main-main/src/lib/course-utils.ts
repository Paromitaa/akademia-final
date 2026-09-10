import { courses } from '@/lib/mock-data';
import type { Course, Lesson } from '@/types';

export function getCourseBySlug(slug: string): Course | undefined {
  return courses.find((c) => c.slug === slug);
}

export function getAllLessons(course: Course) {
  return course.modules.flatMap((m) =>
    m.lessons.map((l) => ({ ...l, moduleTitle: m.title }))
  );
}

export function getLessonById(course: Course, lessonId: string) {
  for (const mod of course.modules) {
    const lesson = mod.lessons.find((l) => l.id === lessonId);
    if (lesson) return { lesson, module: mod };
  }
  return undefined;
}

export function isLessonUnlocked(
  allLessons: Lesson[],
  lessonId: string,
  completedSet: Set<string>
): boolean {
  const idx = allLessons.findIndex((l) => l.id === lessonId);
  if (idx <= 0) return true;
  const prevLesson = allLessons[idx - 1];
  return completedSet.has(prevLesson.id);
}

export function getFirstUnlockedLesson(
  allLessons: Lesson[],
  completedSet: Set<string>
): Lesson | undefined {
  return allLessons.find((l) => !completedSet.has(l.id)) ?? allLessons[0];
}

export function getCourseProgress(
  allLessons: Lesson[],
  completedSet: Set<string>
): { completed: number; total: number; pct: number } {
  const total = allLessons.length;
  const completed = allLessons.filter((l) => completedSet.has(l.id)).length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { completed, total, pct };
}
