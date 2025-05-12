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
        <Card className="cursor-pointer !pt-0 overflow-hidden">
          {thumbnailUrl && (
            <div className="relative w-full h-48">
              <Image
                src={thumbnailUrl}
                alt="Raags Thumbnail"
                fill
                className="object-cover"
              />
            </div>
          )}
          <CardHeader>
            <CardTitle className="text-6xl md:text-2xl">Introduction To Raags 101</CardTitle>
            <CardDescription>Dive into the rich world of Raags, exploring their melodic structures, emotional expressions, and performance techniques.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">What you&apos;ll learn:</p>
            <ul className="list-disc list-inside space-y-1 text-sm font-normal text-muted-foreground">
              <li>Gain a foundational understanding of Raags, their history, and theoretical framework</li>
              <li>Explore the emotional mood and expressive nuances of key Raags</li>
              <li>Master practical performance techniques and improvisation approaches</li>
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