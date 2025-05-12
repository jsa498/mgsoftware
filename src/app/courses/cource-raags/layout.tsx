"use client"

import * as React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, BookOpen } from "lucide-react";
import { modules } from "./data";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default function CourceRaagsLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="hidden md:block w-80 border-r">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Raags 101</h2>
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
            <SheetTitle>Raags 101</SheetTitle>
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
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ChevronLeft className="mr-2" size={16} /> Back
        </Button>
        {children}
      </main>
    </div>
  );
} 