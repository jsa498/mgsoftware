"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { searchGurbani, GurbaniSearchResult } from "@/lib/gurbani-service"
import { useToast } from "@/components/ui/use-toast"
import { fetchIgurbaniIndex, IgurbaniIndexEntry } from "@/lib/igurbani-index-service"

export default function GurbaniPage() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<GurbaniSearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [indexEntries, setIndexEntries] = useState<IgurbaniIndexEntry[]>([])
  const { toast } = useToast()

  useEffect(() => {
    fetchIgurbaniIndex().then(setIndexEntries).catch(console.error)
  }, [])

  const doSearch = async (q: string) => {
    if (!q.trim()) return
    setQuery(q)
    setIsLoading(true)
    setError(null)
    try {
      const searchResults = await searchGurbani(q)
      setResults(searchResults)
      if (searchResults.length === 0) {
        toast({ title: "No results found", description: "Try a different search term" })
      }
    } catch (err) {
      console.error('doSearch error for query:', q, err)
      setError("Failed to fetch Gurbani search results. Please try again.")
      toast({ variant: "destructive", title: "Error", description: "Failed to fetch Gurbani search results" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    doSearch(query)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gurbani Searcher</h1>
      </div>

      <form onSubmit={handleSearch} className="space-y-4">
        <div className="flex gap-4">
          <Input
            placeholder="Search in Gurbani..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? "Searching..." : "Search"}
          </button>
        </div>
      </form>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>
            {error}<br />
            If the problem persists, please visit <a href="https://www.sikhitothemax.org/" target="_blank" rel="noopener noreferrer" className="underline text-primary">SikhiToTheMax.org</a> directly.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-1/3" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))
        ) : (
          // Search results
          results.map((result) => (
            <Card key={result.shabad_id}>
              <CardHeader>
                <CardTitle className="text-lg">
                  {result.shabad_name} (Page {result.page_no})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="font-gurmukhi text-xl">
                  {result.gurmukhi}
                </div>
                <div className="text-muted-foreground">
                  {result.transliteration}
                </div>
                <div className="text-sm">
                  {result.translation}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {indexEntries.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">Raag Index</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {indexEntries.map((entry) => (
              <Card
                key={entry.id}
                className="cursor-pointer hover:shadow-lg"
                onClick={() => doSearch(entry.raagKey)}
              >
                <CardContent>
                  <div className="font-medium">{entry.raagKey}</div>
                  <div className="text-sm text-muted-foreground">Page {entry.pageRef}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 