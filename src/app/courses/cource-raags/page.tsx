import { redirect } from "next/navigation";
import { modules } from "./data";

export default function CourceRaagsPage() {
  const firstModule = modules[0];
  const firstLesson = firstModule.lessons[0];
  redirect(`/courses/cource-raags/${firstModule.id}/${firstLesson.id}`);
} 