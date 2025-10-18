// "use client"

// import { useState } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Camera } from "lucide-react"

// export function ProfileSettings() {
//   const [loading, setLoading] = useState(false)

//   return (
//     <div className="space-y-6">
//       <Card>
//         <CardHeader>
//           <CardTitle>Profile Information</CardTitle>
//           <CardDescription>Update your personal information and profile picture</CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           <div className="flex items-center gap-6">
//             <Avatar className="h-24 w-24">
//               <AvatarImage src="/placeholder.svg?height=96&width=96" />
//               <AvatarFallback>JD</AvatarFallback>
//             </Avatar>
//             <div>
//               <Button variant="outline" size="sm">
//                 <Camera className="h-4 w-4 mr-2" />
//                 Change Photo
//               </Button>
//               <p className="text-xs text-muted-foreground mt-2">JPG, PNG or GIF. Max size 2MB.</p>
//             </div>
//           </div>

//           <div className="grid gap-4 md:grid-cols-2">
//             <div className="space-y-2">
//               <Label htmlFor="firstName">First Name</Label>
//               <Input id="firstName" defaultValue="John" />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="lastName">Last Name</Label>
//               <Input id="lastName" defaultValue="Doe" />
//             </div>
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="email">Email</Label>
//             <Input id="email" type="email" defaultValue="john@example.com" />
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="company">Company</Label>
//             <Input id="company" defaultValue="Acme Inc." />
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="bio">Bio</Label>
//             <Textarea id="bio" placeholder="Tell us about yourself" rows={4} />
//           </div>

//           <Button disabled={loading}>Save Changes</Button>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader>
//           <CardTitle>Delete Account</CardTitle>
//           <CardDescription>Permanently delete your account and all associated data</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <p className="text-sm text-muted-foreground mb-4">
//             Once you delete your account, there is no going back. Please be certain.
//           </p>
//           <Button variant="destructive">Delete Account</Button>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

// "use client"

// import type React from "react"

// import { useState, useEffect } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Camera, Loader2 } from "lucide-react"
// import { updateProfile, getUser } from "@/lib/actions/settings"
// import { useUser } from "@clerk/nextjs"

// export function ProfileSettings() {
//   const [loading, setLoading] = useState(false)
//   const { user: clerkUser } = useUser()
//   const [userData, setUserData] = useState<any>(null)

//   useEffect(() => {
//     getUser().then(setUserData).catch(console.error)
//   }, [])

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault()
//     setLoading(true)

//     try {
//       const formData = new FormData(e.currentTarget)
//       await updateProfile(formData)
//       alert("Profile updated successfully!")
//     } catch (error) {
//       alert("Failed to update profile")
//     } finally {
//       setLoading(false)
//     }
//   }

//   if (!userData) {
//     return (
//       <Card>
//         <CardContent className="p-12 text-center">
//           <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
//         </CardContent>
//       </Card>
//     )
//   }

//   return (
//     <div className="space-y-6">
//       <Card>
//         <CardHeader>
//           <CardTitle>Profile Information</CardTitle>
//           <CardDescription>Update your personal information and profile picture</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div className="flex items-center gap-6">
//               <Avatar className="h-24 w-24">
//                 <AvatarImage src={clerkUser?.imageUrl || "/placeholder.svg"} />
//                 <AvatarFallback>
//                   {userData.firstName?.[0]}
//                   {userData.lastName?.[0]}
//                 </AvatarFallback>
//               </Avatar>
//               <div>
//                 <Button type="button" variant="outline" size="sm">
//                   <Camera className="h-4 w-4 mr-2" />
//                   Change Photo
//                 </Button>
//                 <p className="text-xs text-muted-foreground mt-2">JPG, PNG or GIF. Max size 2MB.</p>
//               </div>
//             </div>

//             <div className="grid gap-4 md:grid-cols-2">
//               <div className="space-y-2">
//                 <Label htmlFor="firstName">First Name</Label>
//                 <Input id="firstName" name="firstName" defaultValue={userData.firstName || ""} required />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="lastName">Last Name</Label>
//                 <Input id="lastName" name="lastName" defaultValue={userData.lastName || ""} required />
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="email">Email</Label>
//               <Input id="email" type="email" value={userData.email} disabled />
//               <p className="text-xs text-muted-foreground">Email cannot be changed</p>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="timezone">Timezone</Label>
//               <Input id="timezone" name="timezone" defaultValue={userData.timezone} />
//             </div>

//             <Button type="submit" disabled={loading}>
//               {loading ? (
//                 <>
//                   <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                   Saving...
//                 </>
//               ) : (
//                 "Save Changes"
//               )}
//             </Button>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Loader2 } from "lucide-react"
import { updateProfile, getUser } from "@/lib/actions/settings"
import { useUser } from "@clerk/nextjs"

interface ProfileSettingsProps {
  user: {
    id: string
    email: string
    name: string | null
    firstName: string | null
    lastName: string | null
    imageUrl: string | null
    timezone: string
  }
}

export function ProfileSettings({ user: initialUser }: ProfileSettingsProps) {
  const [loading, setLoading] = useState(false)
  const { user: clerkUser } = useUser()
  const [userData, setUserData] = useState(initialUser)

  useEffect(() => {
    getUser().then(setUserData).catch(console.error)
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      await updateProfile(formData)
      alert("Profile updated successfully!")
    } catch (error) {
      alert("Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  if (!userData) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your personal information and profile picture</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={clerkUser?.imageUrl || "/placeholder.svg"} />
                <AvatarFallback>
                  {userData.firstName?.[0]}
                  {userData.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <Button type="button" variant="outline" size="sm">
                  <Camera className="h-4 w-4 mr-2" />
                  Change Photo
                </Button>
                <p className="text-xs text-muted-foreground mt-2">JPG, PNG or GIF. Max size 2MB.</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" name="firstName" defaultValue={userData.firstName || ""} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" name="lastName" defaultValue={userData.lastName || ""} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={userData.email} disabled />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Input id="timezone" name="timezone" defaultValue={userData.timezone} />
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
