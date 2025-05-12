import { modules } from "../../data";
import { notFound } from "next/navigation";
import { Typography } from "@/components/ui/typography";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";

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

  // Render formatted content for Lesson 1
  if (moduleId === "module-1" && lessonId === "lesson-1") {
    return (
      <div>
        <Typography.H1>{lesson!.title}</Typography.H1>
        <div className="mt-2 mb-6 w-24 h-1 rounded bg-muted-foreground" />

        <Typography.H3 className="mt-8 border-l-4 border-primary pl-3">
          Raags in Gurbani
        </Typography.H3>
        <Card className="mt-2 mb-8">
          <CardContent className="space-y-3">
            <Typography.P>Raag (rāga) literally means &quot;colour&quot; or &quot;mood.&quot; In music it is a melodic framework that evokes a specific emotion.</Typography.P>
            <Typography.P>Sri Guru Granth Sahib Ji is arranged almost entirely by raag; this ensures the shabad is sung exactly in the spirit the Gurus intended.</Typography.P>
            <Typography.P>Thirty-one primary raags appear in the scripture; with their related sub-forms and mixtures there are about sixty melodic modes in total.</Typography.P>
          </CardContent>
        </Card>

        <Typography.H3 className="mt-8 border-l-4 border-primary pl-3">
          Why are Raags important in Sikhi?
        </Typography.H3>
        <Card className="mt-2 mb-8">
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reason</TableHead>
                  <TableHead>What it means for the learner</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Spiritual focus</TableCell>
                  <TableCell>Melody anchors the mind so the shabad (word) can penetrate deeper.</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Preservation</TableCell>
                  <TableCell>A fixed raag prevents lyrical drift over centuries.</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Emotional guidance</TableCell>
                  <TableCell>Each raag carries its own <Typography.Code>rasa</Typography.Code> (flavour) that matches the message.</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Typography.H3 className="mt-8 border-l-4 border-primary pl-3">
          Categories you&apos;ll hear about
        </Typography.H3>
        <Card className="mt-2 mb-8">
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Punjabi term</TableHead>
                  <TableHead>Quick note</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Pure / basic</TableCell>
                  <TableCell><Typography.Code>Sudh Raag</Typography.Code></TableCell>
                  <TableCell>Original frameworks, 31 in total.</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Mixed / compound</TableCell>
                  <TableCell><Typography.Code>Mishrat Raag</Typography.Code></TableCell>
                  <TableCell>Created by blending two or more pure raags to widen the palette.</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Typography.H3 className="mt-8 border-l-4 border-primary pl-3">
          Building blocks (Sargam)
        </Typography.H3>
        <Card className="mt-2 mb-8">
          <CardContent className="space-y-3">
            <Typography.P>
              <strong>Sa Re Ga Ma Pa Dha Ni Sa&apos;</strong> &ndash; the seven swaras common to all North-Indian music. Raags decide which notes are emphasised, skipped, or bent (<Typography.Code>meend</Typography.Code>), creating identity.
            </Typography.P>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render formatted content for Lesson 2 with underline styling
  if (moduleId === "module-1" && lessonId === "lesson-2") {
    return (
      <div>
        <Typography.H1>{lesson!.title}</Typography.H1>
        <div className="mt-2 mb-6 w-24 h-1 rounded bg-muted-foreground" />
        <div className="prose dark:prose-invert">
          <Typography.P>Content for {lesson!.title} coming soon.</Typography.P>
        </div>
      </div>
    );
  }

  // Fallback for other lessons
  return (
    <div>
      <Typography.H1>{lesson!.title}</Typography.H1>
      <div className="prose dark:prose-invert">
        <Typography.P>Content for {lesson!.title} coming soon.</Typography.P>
      </div>
    </div>
  );
}