"use client"

import { useState, useEffect } from 'react'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { getAllGroups } from '@/lib/data-service'
import { Group } from '@/lib/types'

interface GroupSelectProps {
  selectedGroups: string[]
  onGroupChange: (selectedIds: string[]) => void
}

export function GroupSelect({ selectedGroups, onGroupChange }: GroupSelectProps) {
  const [groups, setGroups] = useState<Group[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setIsLoading(true)
        const data = await getAllGroups()
        setGroups(data.filter(group => group.status === 'active'))
        setIsLoading(false)
      } catch (err) {
        console.error('Error fetching groups:', err)
        setError('Failed to load groups')
        setIsLoading(false)
      }
    }

    fetchGroups()
  }, [])

  const handleGroupToggle = (groupId: string, checked: boolean) => {
    let updatedGroups = [...selectedGroups]
    
    if (checked) {
      if (!updatedGroups.includes(groupId)) {
        updatedGroups.push(groupId)
      }
    } else {
      updatedGroups = updatedGroups.filter(id => id !== groupId)
    }
    
    onGroupChange(updatedGroups)
  }

  if (isLoading) {
    return <div className="text-sm text-gray-500">Loading groups...</div>
  }

  if (error) {
    return <div className="text-sm text-red-500">{error}</div>
  }

  if (groups.length === 0) {
    return <div className="text-sm text-gray-500">No active groups found</div>
  }

  return (
    <div className="space-y-3">
      <div className="text-sm font-medium">Share with these groups:</div>
      <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
        {groups.map((group) => (
          <div key={group.id} className="flex items-center space-x-2">
            <Checkbox 
              id={`group-${group.id}`} 
              checked={selectedGroups.includes(group.id)}
              onCheckedChange={(checked) => handleGroupToggle(group.id, checked === true)}
            />
            <Label htmlFor={`group-${group.id}`} className="cursor-pointer">
              {group.name}
            </Label>
          </div>
        ))}
      </div>
    </div>
  )
} 