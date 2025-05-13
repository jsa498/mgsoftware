import { modules } from "../../data";
import { notFound } from "next/navigation";
import { Typography } from "@/components/ui/typography";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { raags } from "../../raagsData";
import { RaagPieChart } from "@/components/ui/RaagPieChart";

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

  // Render full UI for Lesson 2
  if (moduleId === "module-1" && lessonId === "lesson-2") {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold mb-8">{lesson!.title}</h1>
        <p className="text-lg mb-8">
          Raags are the melodic modes used in Gurbani Kirtan. They are an essential part of Sikh music and help in expressing the spiritual message of the Gurus. Each Raag has its own unique characteristics, time of day or season, and emotional impact.
        </p>

        <div className="mb-8 p-4 bg-muted rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Understanding Raags</h2>
          <p className="mb-4">
            Raags in Gurbani are divided into two main categories:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Sudh Raags:</strong> These are the pure, basic Raags that form the foundation of Indian classical music.</li>
            <li><strong>Mishrat Raags:</strong> These are mixed Raags, created by combining different Sudh Raags to create new melodic patterns.</li>
          </ul>
          <div className="mt-4">
            <h3 className="text-xl font-semibold mb-2">Musical Structure</h3>
            <p>Each Raag follows a specific pattern of notes (swaras) that create its unique character:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Sa (Shadaj) - The root note</li>
              <li>Re (Rishabh) - The second note</li>
              <li>Ga (Gandhar) - The third note</li>
              <li>Ma (Madhyam) - The fourth note</li>
              <li>Pa (Pancham) - The fifth note</li>
              <li>Dha (Dhaivat) - The sixth note</li>
              <li>Ni (Nishad) - The seventh note</li>
            </ul>
          </div>
        </div>

        <Tabs defaultValue="sudh" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sudh">Sudh Raags</TabsTrigger>
            <TabsTrigger value="mishrat">Mishrat Raags</TabsTrigger>
          </TabsList>

          <TabsContent value="sudh">
            <RaagPieChart data={raags.sudh} />
          </TabsContent>

          <TabsContent value="mishrat">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {raags.mishrat.map((raag) => (
                <Card key={raag.name} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>{raag.name}</CardTitle>
                    <CardDescription>{raag.time}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-2">{raag.description}</p>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p><strong>Mood:</strong> {raag.mood}</p>
                      <p><strong>Origin:</strong> {raag.origin}</p>
                      <p><strong>Notes:</strong> {raag.notes}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
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