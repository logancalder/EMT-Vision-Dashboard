"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { User, Mail, Phone, Building, Shield, Bell, Key } from "lucide-react"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function ProfilePage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [editedUser, setEditedUser] = useState<any>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          const userData = {
            name: session.user.user_metadata.full_name || session.user.user_metadata.name || "User",
            email: session.user.email,
            role: session.user.user_metadata.role || "Medical Professional",
            department: session.user.user_metadata.department || "Emergency Department",
            phone: session.user.user_metadata.phone || "(408) 555-0123",
            avatar: session.user.user_metadata.avatar_url || session.user.user_metadata.picture || "",
            notifications: true,
            twoFactor: false,
          }
          setUser(userData)
          setEditedUser(userData)
        }
      } catch (error) {
        console.error("Error fetching user profile:", error)
        toast({
          title: "Error",
          description: "Failed to load user profile. Please try again.",
          variant: "destructive",
        })
      }
    }

    fetchUserProfile()
  }, [supabase, toast])

  const handleSaveProfile = async () => {
    setLoading(true)
    try {
      // Update user metadata in Supabase
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: editedUser.name,
          phone: editedUser.phone,
          department: editedUser.department,
        }
      })

      if (error) throw error

      setUser(editedUser)
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal information and profile settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.split(" ").map((n: string) => n[0]).join("")}</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.role}</p>
                  <Badge variant="outline">{user.department}</Badge>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="flex">
                      <User className="w-4 h-4 my-auto mr-2 text-muted-foreground" />
                      <Input 
                        id="name" 
                        value={editedUser.name} 
                        onChange={(e) => setEditedUser({...editedUser, name: e.target.value})} 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="flex">
                      <Mail className="w-4 h-4 my-auto mr-2 text-muted-foreground" />
                      <Input 
                        id="email" 
                        value={editedUser.email} 
                        disabled 
                        className="bg-muted"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="flex">
                      <Phone className="w-4 h-4 my-auto mr-2 text-muted-foreground" />
                      <Input 
                        id="phone" 
                        value={editedUser.phone} 
                        onChange={(e) => setEditedUser({...editedUser, phone: e.target.value})} 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <div className="flex">
                      <Building className="w-4 h-4 my-auto mr-2 text-muted-foreground" />
                      <Input 
                        id="department" 
                        value={editedUser.department} 
                        onChange={(e) => setEditedUser({...editedUser, department: e.target.value})} 
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveProfile} disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security and preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="font-medium">Two-Factor Authentication</h3>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <Button variant={user.twoFactor ? "destructive" : "default"}>
                    {user.twoFactor ? "Disable" : "Enable"}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="font-medium">Change Password</h3>
                    <p className="text-sm text-muted-foreground">Update your password regularly</p>
                  </div>
                  <Button variant="outline">Change</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage how you receive notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Button variant={user.notifications ? "default" : "outline"}>
                    {user.notifications ? "Enabled" : "Disabled"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 