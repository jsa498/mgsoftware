"use client"

import React, { useState, useRef } from 'react'
import { UploadIcon, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

interface FileUploadProps {
  onFileChange: (file: File | null) => void
  accept?: string
  maxSize?: number
  file: File | null
}

export function FileUpload({ onFileChange, accept = "*", maxSize, file }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    // Check file size if maxSize is provided
    if (maxSize && file.size > maxSize) {
      alert(`File size exceeds the maximum allowed size (${formatFileSize(maxSize)})`)
      return
    }

    // Simulate upload progress
    let progress = 0
    setUploadProgress(progress)
    
    const interval = setInterval(() => {
      progress += 5
      setUploadProgress(progress)
      
      if (progress >= 100) {
        clearInterval(interval)
        onFileChange(file)
      }
    }, 50)
  }

  const removeFile = () => {
    onFileChange(null)
    setUploadProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileTypeIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase() || ''
    
    // Return appropriate icon based on file extension
    // This is a simplified version, you can expand with more icons
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
      return '🖼️'
    } else if (['mp3', 'wav', 'ogg'].includes(extension)) {
      return '🎵'
    } else if (['mp4', 'webm', 'mov'].includes(extension)) {
      return '🎬'
    } else if (['pdf'].includes(extension)) {
      return '📄'
    } else if (['doc', 'docx'].includes(extension)) {
      return '📝'
    } else {
      return '📁'
    }
  }

  return (
    <div className="w-full">
      {!file ? (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 dark:border-gray-600'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <UploadIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-300" />
          <div className="mt-4 flex text-sm text-gray-500 dark:text-gray-400 justify-center">
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer rounded-md bg-white dark:bg-transparent font-medium text-primary dark:text-white hover:text-primary/80 dark:hover:text-white/80"
            >
              <span>Upload a file</span>
              <input
                ref={fileInputRef}
                id="file-upload"
                name="file-upload"
                type="file"
                accept={accept}
                className="sr-only"
                onChange={handleFileInputChange}
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Any file type</p>
        </div>
      ) : (
        <div className="border rounded-lg p-4 dark:border-gray-600">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{getFileTypeIcon(file.name)}</div>
              <div className="truncate">
                <p className="font-medium truncate">{file.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{formatFileSize(file.size)}</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={removeFile}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}
    </div>
  )
} 