"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getStudentPracticeMaterials } from "@/lib/data-service"
import { PracticeMaterial } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"
import { FileIcon, FileTextIcon, FileImageIcon, FileAudioIcon, FileVideoIcon, PresentationIcon } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import { Button } from "@/components/ui/button"

// Extend the PracticeMaterial type to include groups
interface PracticeMaterialWithGroups extends PracticeMaterial {
  groups?: {
    id: string;
    name: string;
  }[];
}

export default function PracticeMediaPage() {
  const [materials, setMaterials] = useState<PracticeMaterialWithGroups[]>([])
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setLoading(true)
        const user = getCurrentUser()
        
        if (!user || !user.id) {
          console.error("No user found")
          setLoading(false)
          return
        }
        
        // This function will need to be updated to work with the user ID
        // For now, we'll use a placeholder student ID
        const practiceMaterials = await getStudentPracticeMaterials("example-student-id")
        setMaterials(practiceMaterials as PracticeMaterialWithGroups[])
      } catch (error) {
        console.error("Error fetching practice materials:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMaterials()
  }, [])

  const getFileIcon = (fileType: string | undefined) => {
    if (!fileType) return <FileIcon className="h-10 w-10 text-muted-foreground" />
    
    const type = fileType.toLowerCase()
    
    if (type.includes("image")) {
      return <FileImageIcon className="h-10 w-10 text-blue-500" />
    } else if (type.includes("audio")) {
      return <FileAudioIcon className="h-10 w-10 text-purple-500" />
    } else if (type.includes("video")) {
      return <FileVideoIcon className="h-10 w-10 text-red-500" />
    } else if (type.includes("pdf") || type.includes("document")) {
      return <FileTextIcon className="h-10 w-10 text-orange-500" />
    } else if (type.includes("presentation")) {
      return <PresentationIcon className="h-10 w-10 text-green-500" />
    } else {
      return <FileIcon className="h-10 w-10 text-muted-foreground" />
    }
  }

  const openFile = (url: string | undefined) => {
    if (url) {
      window.open(url, '_blank')
    }
  }

  const formatFileSize = (bytes: number | undefined) => {
    if (!bytes) return 'Unknown size'
    const units = ['B', 'KB', 'MB', 'GB']
    let size = bytes
    let unitIndex = 0

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Practice Media</h1>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Materials</TabsTrigger>
          <TabsTrigger value="recent">Recently Added</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          {loading ? (
            <div className="text-center py-10">
              <p>Loading practice materials...</p>
            </div>
          ) : materials.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500 dark:text-gray-400">No practice materials available.</p>
              <p className="text-sm mt-2">Your teacher hasn't shared any practice files with you yet.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {materials.map((material) => (
                <Card key={material.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="line-clamp-1">{material.title}</CardTitle>
                    <CardDescription>
                      Added {formatDistanceToNow(new Date(material.created_at), { addSuffix: true })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        {getFileIcon(material.file_type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        {material.description && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">
                            {material.description}
                          </p>
                        )}
                        <div className="flex flex-col space-y-1 text-xs text-gray-500 dark:text-gray-400">
                          {material.file_name && (
                            <p className="truncate">{material.file_name}</p>
                          )}
                          {material.file_size && (
                            <p>{formatFileSize(material.file_size)}</p>
                          )}
                          <div className="flex flex-wrap gap-1 mt-1">
                            {material.groups?.map((group) => (
                              <span key={group.id} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                                {group.name}
                              </span>
                            ))}
                          </div>
                        </div>
                        <Button 
                          variant="secondary" 
                          className="w-full mt-3"
                          onClick={() => openFile(material.file_url)}
                          disabled={!material.file_url}
                        >
                          Open File
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="recent">
          {loading ? (
            <div className="text-center py-10">
              <p>Loading recent materials...</p>
            </div>
          ) : materials.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500 dark:text-gray-400">No recent practice materials available.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {materials
                .filter(material => {
                  const addedDate = new Date(material.created_at)
                  const weekAgo = new Date()
                  weekAgo.setDate(weekAgo.getDate() - 7)
                  return addedDate >= weekAgo
                })
                .map((material) => (
                  <Card key={material.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="line-clamp-1">{material.title}</CardTitle>
                      <CardDescription>
                        Added {formatDistanceToNow(new Date(material.created_at), { addSuffix: true })}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          {getFileIcon(material.file_type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          {material.description && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">
                              {material.description}
                            </p>
                          )}
                          <div className="flex flex-col space-y-1 text-xs text-gray-500 dark:text-gray-400">
                            {material.file_name && (
                              <p className="truncate">{material.file_name}</p>
                            )}
                            {material.file_size && (
                              <p>{formatFileSize(material.file_size)}</p>
                            )}
                            <div className="flex flex-wrap gap-1 mt-1">
                              {material.groups?.map((group) => (
                                <span key={group.id} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                                  {group.name}
                                </span>
                              ))}
                            </div>
                          </div>
                          <Button 
                            variant="secondary" 
                            className="w-full mt-3"
                            onClick={() => openFile(material.file_url)}
                            disabled={!material.file_url}
                          >
                            Open File
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
} 