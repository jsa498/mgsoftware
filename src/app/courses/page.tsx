"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { supabase } from "@/lib/supabase"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function CoursesPage() {
  const [thumbnailUrl, setThumbnailUrl] = useState<string>("")

  useEffect(() => {
    const { data }: { data: { publicUrl: string } } = supabase
      .storage
      .from("course-images")
      .getPublicUrl("cource-thumbnail/raags.png")
    if (data?.publicUrl) {
      setThumbnailUrl(data.publicUrl)
    }
  }, [])

  return (
    <div className="container mx-auto p-10 grid grid-cols-1 md:grid-cols-3 gap-6">
      <Link href="/courses/cource-raags">
        <Card className="cursor-pointer">
          {thumbnailUrl && (
            <Image
              src={thumbnailUrl}
              alt="Raags Thumbnail"
              width={400}
              height={200}
              className="rounded-t-xl object-cover"
            />
          )}
          <CardHeader>
            <CardTitle>Raags</CardTitle>
            <CardDescription>Explore the world of Raags and their nuances.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">What you'll learn:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Introduction to Raags</li>
              <li>Structure and mood</li>
              <li>Performance techniques</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button>Start Course</Button>
          </CardFooter>
        </Card>
      </Link>
    </div>
  )
} 