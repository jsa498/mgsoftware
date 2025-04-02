"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { getStudentProfileByUserId, updateStudentProfile, updateProfileImage } from "@/lib/data-service"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { Phone, User, UsersRound } from "lucide-react"
import { ProfileImageUpload } from "@/components/ProfileImageUpload"

export default function ProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<{
    id: string;
    first_name: string;
    last_name: string;
    phone?: string;
    profile_image_url?: string;
    groups?: Array<{
      id: string;
      name: string;
    }>;
  } | null>(null)
  const [phone, setPhone] = useState("")
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)

  // Get student profile data
  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true)
      const user = getCurrentUser()
      
      if (!user) {
        router.push("/auth/login")
        return
      }
      
      const profileData = await getStudentProfileByUserId(user.id)
      
      if (!profileData) {
        toast({
          title: "Error",
          description: "Could not fetch profile data. Please try again later.",
          variant: "destructive",
        })
        return
      }
      
      setProfile(profileData as {
        id: string;
        first_name: string;
        last_name: string;
        phone?: string;
        profile_image_url?: string;
        groups?: Array<{
          id: string;
          name: string;
        }>;
      })
      setPhone(profileData.phone as string || "")
      setPhotoUrl(profileData.profile_image_url as string || null)
    } catch (error) {
      console.error("Error fetching profile:", error)
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value)
  }

  const handlePhoneUpdate = async () => {
    try {
      if (!profile) return
      
      setSaving(true)
      const success = await updateStudentProfile(profile.id, { phone })
      
      if (success) {
        toast({
          title: "Success",
          description: "Phone number updated successfully",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to update phone number",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating phone:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleProfileImageChange = async (file: File) => {
    if (file && profile) {
      try {
        setSaving(true)
        const newImageUrl = await updateProfileImage(file)
        
        if (newImageUrl) {
          setPhotoUrl(newImageUrl)
          toast({
            title: "Success",
            description: "Profile picture updated successfully",
          })
        } else {
          toast({
            title: "Error",
            description: "Failed to update profile picture",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error updating profile image:", error)
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        })
      } finally {
        setSaving(false)
      }
    }
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="max-w-3xl mx-auto">
          <Skeleton className="h-12 w-1/3 mb-6" />
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-1/4 mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <Skeleton className="h-32 w-32 rounded-full" />
                <div className="space-y-4 flex-1">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
              <Separator />
              <div>
                <Skeleton className="h-6 w-1/4 mb-4" />
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-8 w-28" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return (
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Profile</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Student Profile</CardTitle>
            <CardDescription>
              View and manage your personal information
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div>
                <ProfileImageUpload 
                  imageUrl={photoUrl}
                  fullName={profile ? `${profile.first_name} ${profile.last_name}` : ""}
                  onImageSelect={handleProfileImageChange}
                />
              </div>
              
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="font-medium flex items-center gap-2 text-muted-foreground">
                    <User className="h-4 w-4" /> Full Name
                  </h3>
                  <p className="text-xl font-semibold">
                    {profile?.first_name} {profile?.last_name}
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="phone">Phone Number</Label>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      id="phone"
                      placeholder="Enter phone number"
                      value={phone}
                      onChange={handlePhoneChange}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handlePhoneUpdate}
                      disabled={saving}
                      size="sm"
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {profile?.groups && profile.groups.length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="font-medium flex items-center gap-2 mb-4 text-muted-foreground">
                    <UsersRound className="h-4 w-4" /> Groups
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.groups.map((group) => (
                      <Badge key={group.id} variant="secondary" className="text-sm py-1">
                        {group.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <DashboardLayout requireStudent={true}>
      {renderContent()}
    </DashboardLayout>
  )
} 