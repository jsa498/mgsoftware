"use client"

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import { modules } from "./data";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default function CourceRaagsLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  // Compute previous and next lesson links
  const segments = pathname.split("/");
  const currentModuleId = segments[3];
  const currentLessonId = segments[4];
  const flatLessons = modules.flatMap((mod) =>
    mod.lessons.map((lsn) => ({
      moduleId: mod.id,
      lessonId: lsn.id,
      title: lsn.title,
    }))
  );
  const currentIndex = flatLessons.findIndex(
    (item) => item.moduleId === currentModuleId && item.lessonId === currentLessonId
  );
  const prevLesson = currentIndex > 0 ? flatLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < flatLessons.length - 1 ? flatLessons[currentIndex + 1] : null;

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="hidden md:block w-80 border-r">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Raags 101</h2>
            <Button variant="ghost" asChild>
              <Link href="/courses">
                <ChevronLeft size={16} /> Back
              </Link>
            </Button>
          </div>
          <Accordion type="multiple" defaultValue={modules.map((mod) => mod.id)}>
            {modules.map((mod) => (
              <AccordionItem key={mod.id} value={mod.id}>
                <AccordionTrigger className="px-0">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">{mod.title.split(': ')[0]}</Badge>
                      <span className="text-sm font-medium">{mod.title.split(': ')[1]}</span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-0">
                  <ul className="flex flex-col space-y-2">
                    {mod.lessons.map((lesson) => (
                      <li key={lesson.id}>
                        <Link
                          href={`/courses/cource-raags/${mod.id}/${lesson.id}`}
                          className={cn(
                            "flex items-center space-x-2 px-3 py-1 rounded-md transition-colors",
                            pathname === `/courses/cource-raags/${mod.id}/${lesson.id}`
                              ? "bg-muted text-primary"
                              : "text-muted-foreground hover:bg-muted"
                          )}
                        >
                          <BookOpen className="h-4 w-4 shrink-0" />
                          <span className="text-sm">{lesson.title}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </aside>

      {/* Mobile drawer */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button className="md:hidden m-4">Raags 101</Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <div className="flex items-center justify-between w-full">
              <SheetTitle>Raags 101</SheetTitle>
              <Button variant="ghost" asChild>
                <Link href="/courses">
                  <ChevronLeft size={16} /> Back
                </Link>
              </Button>
            </div>
          </SheetHeader>
          <div className="p-4">
            <Accordion type="multiple" defaultValue={modules.map((mod) => mod.id)}>
              {modules.map((mod) => (
                <AccordionItem key={mod.id} value={mod.id}>
                  <AccordionTrigger className="px-0">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">{mod.title.split(': ')[0]}</Badge>
                        <span className="text-sm font-medium">{mod.title.split(': ')[1]}</span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-0">
                    <ul className="flex flex-col space-y-2">
                      {mod.lessons.map((lesson) => (
                        <li key={lesson.id}>
                          <Link
                            href={`/courses/cource-raags/${mod.id}/${lesson.id}`}
                            onClick={() => setOpen(false)}
                            className={cn(
                              "flex items-center space-x-2 px-3 py-1 rounded-md transition-colors",
                              pathname === `/courses/cource-raags/${mod.id}/${lesson.id}`
                                ? "bg-muted text-primary"
                                : "text-muted-foreground hover:bg-muted"
                            )}
                          >
                            <BookOpen className="h-4 w-4 shrink-0" />
                            <span className="text-sm">{lesson.title}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </SheetContent>
      </Sheet>

      {/* Content pane */}
      <main className="flex-1 p-6">
        {children}
        <div className="flex items-center mt-8">
          {prevLesson && (
            <Button variant="outline" asChild>
              <Link href={`/courses/cource-raags/${prevLesson.moduleId}/${prevLesson.lessonId}`}>
                <ChevronLeft size={16} /> {prevLesson.title}
              </Link>
            </Button>
          )}
          <div className="flex-1" />
          {nextLesson && (
            <Button variant="outline" asChild>
              <Link href={`/courses/cource-raags/${nextLesson.moduleId}/${nextLesson.lessonId}`}>
                {nextLesson.title} <ChevronRight size={16} />
              </Link>
            </Button>
          )}
        </div>
      </main>
    </div>
  );
} 