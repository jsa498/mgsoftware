export interface Lesson { id: string; title: string; }
export interface Module { id: string; title: string; lessons: Lesson[]; }

export const modules: Module[] = [
  {
    id: "module-1",
    title: "Module 1: Introduction to Raags",
    lessons: [
      { id: "lesson-1", title: "What are Raags?" },
      { id: "lesson-2", title: "History of Raags" },
      { id: "lesson-3", title: "Basic Structures" },
    ],
  },
  {
    id: "module-2",
    title: "Module 2: Performance Techniques",
    lessons: [
      { id: "lesson-1", title: "Improvisation" },
      { id: "lesson-2", title: "Ornamentation" },
      { id: "lesson-3", title: "Rhythm and Tala" },
    ],
  },
]; 