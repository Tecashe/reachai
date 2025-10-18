// "use client"

// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Plus, MoreVertical } from "lucide-react"

// const teamMembers = [
//   { id: "1", name: "John Doe", email: "john@acme.com", role: "Owner", avatar: "/placeholder.svg?height=40&width=40" },
//   { id: "2", name: "Jane Smith", email: "jane@acme.com", role: "Admin", avatar: "/placeholder.svg?height=40&width=40" },
//   {
//     id: "3",
//     name: "Mike Johnson",
//     email: "mike@acme.com",
//     role: "Member",
//     avatar: "/placeholder.svg?height=40&width=40",
//   },
// ]

// export function TeamSettings() {
//   return (
//     <div className="space-y-6">
//       <Card>
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <div>
//               <CardTitle>Team Members</CardTitle>
//               <CardDescription>Manage your team members and their permissions</CardDescription>
//             </div>
//             <Button>
//               <Plus className="h-4 w-4 mr-2" />
//               Invite Member
//             </Button>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             {teamMembers.map((member) => (
//               <div key={member.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
//                 <div className="flex items-center gap-4">
//                   <Avatar>
//                     <AvatarImage src={member.avatar || "/placeholder.svg"} />
//                     <AvatarFallback>
//                       {member.name
//                         .split(" ")
//                         .map((n) => n[0])
//                         .join("")}
//                     </AvatarFallback>
//                   </Avatar>
//                   <div>
//                     <p className="font-medium">{member.name}</p>
//                     <p className="text-sm text-muted-foreground">{member.email}</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Badge variant="secondary">{member.role}</Badge>
//                   <Button variant="ghost" size="icon">
//                     <MoreVertical className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader>
//           <CardTitle>Pending Invitations</CardTitle>
//           <CardDescription>Team members who haven't accepted their invitation yet</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <p className="text-sm text-muted-foreground">No pending invitations</p>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

// "use client"

// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Plus, MoreVertical } from "lucide-react"
// import { useState } from "react"
// import { toast } from "sonner"

// interface TeamSettingsProps {
//   teamMembers: Array<{
//     id: string
//     name: string
//     email: string
//     role: string
//     avatar?: string
//   }>
//   onInviteMember?: () => void
// }

// export function TeamSettings({ teamMembers, onInviteMember }: TeamSettingsProps) {
//   const [isInviting, setIsInviting] = useState(false)

//   const handleInvite = async () => {
//     setIsInviting(true)
//     try {
//       if (onInviteMember) {
//         await onInviteMember()
//       }
//       toast.success("Invitation sent successfully")
//     } catch (error) {
//       toast.error("Failed to send invitation")
//     } finally {
//       setIsInviting(false)
//     }
//   }

//   return (
//     <div className="space-y-6">
//       <Card>
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <div>
//               <CardTitle>Team Members</CardTitle>
//               <CardDescription>Manage your team members and their permissions</CardDescription>
//             </div>
//             <Button onClick={handleInvite} disabled={isInviting}>
//               <Plus className="h-4 w-4 mr-2" />
//               Invite Member
//             </Button>
//           </div>
//         </CardHeader>
//         <CardContent>
//           {teamMembers.length === 0 ? (
//             <p className="text-sm text-muted-foreground text-center py-8">No team members yet</p>
//           ) : (
//             <div className="space-y-4">
//               {teamMembers.map((member) => (
//                 <div key={member.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
//                   <div className="flex items-center gap-4">
//                     <Avatar>
//                       <AvatarImage src={member.avatar || "/placeholder.svg"} />
//                       <AvatarFallback>
//                         {member.name
//                           .split(" ")
//                           .map((n) => n[0])
//                           .join("")}
//                       </AvatarFallback>
//                     </Avatar>
//                     <div>
//                       <p className="font-medium">{member.name}</p>
//                       <p className="text-sm text-muted-foreground">{member.email}</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <Badge variant="secondary">{member.role}</Badge>
//                     <Button variant="ghost" size="icon">
//                       <MoreVertical className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader>
//           <CardTitle>Pending Invitations</CardTitle>
//           <CardDescription>Team members who haven't accepted their invitation yet</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <p className="text-sm text-muted-foreground">No pending invitations</p>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }


// "use client"

// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Plus, MoreVertical } from "lucide-react"
// import { useState } from "react"
// import { toast } from "sonner"

// interface TeamSettingsProps {
//   members: Array<{
//     id: string
//     email: string
//     role: string
//     status: string
//     invitedAt: Date
//     acceptedAt: Date | null
//   }>
//   onInviteMember?: () => void
// }

// export function TeamSettings({ members, onInviteMember }: TeamSettingsProps) {
//   const [isInviting, setIsInviting] = useState(false)

//   const handleInvite = async () => {
//     setIsInviting(true)
//     try {
//       if (onInviteMember) {
//         await onInviteMember()
//       }
//       toast.success("Invitation sent successfully")
//     } catch (error) {
//       toast.error("Failed to send invitation")
//     } finally {
//       setIsInviting(false)
//     }
//   }

//   return (
//     <div className="space-y-6">
//       <Card>
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <div>
//               <CardTitle>Team Members</CardTitle>
//               <CardDescription>Manage your team members and their permissions</CardDescription>
//             </div>
//             <Button onClick={handleInvite} disabled={isInviting}>
//               <Plus className="h-4 w-4 mr-2" />
//               Invite Member
//             </Button>
//           </div>
//         </CardHeader>
//         <CardContent>
//           {members.length === 0 ? (
//             <p className="text-sm text-muted-foreground text-center py-8">No team members yet</p>
//           ) : (
//             <div className="space-y-4">
//               {members.map((member) => (
//                 <div key={member.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
//                   <div className="flex items-center gap-4">
//                     <Avatar>
//                       <AvatarImage src={member.avatar || "/placeholder.svg"} />
//                       <AvatarFallback>{member.email.substring(0, 2).toUpperCase()}</AvatarFallback>
//                     </Avatar>
//                     <div>
//                       <p className="font-medium">{member.email}</p>
//                       <p className="text-sm text-muted-foreground">
//                         {member.status === "ACCEPTED" ? "Active" : "Pending"}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <Badge variant="secondary">{member.role.toLowerCase()}</Badge>
//                     <Button variant="ghost" size="icon">
//                       <MoreVertical className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader>
//           <CardTitle>Pending Invitations</CardTitle>
//           <CardDescription>Team members who haven't accepted their invitation yet</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <p className="text-sm text-muted-foreground">No pending invitations</p>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, MoreVertical } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface TeamSettingsProps {
  members: Array<{
    id: string
    email: string
    role: string
    status: string
    invitedAt: Date
    acceptedAt: Date | null
  }>
  onInviteMember?: () => void
}

export function TeamSettings({ members, onInviteMember }: TeamSettingsProps) {
  const [isInviting, setIsInviting] = useState(false)

  const handleInvite = async () => {
    setIsInviting(true)
    try {
      if (onInviteMember) {
        await onInviteMember()
      }
      toast.success("Invitation sent successfully")
    } catch (error) {
      toast.error("Failed to send invitation")
    } finally {
      setIsInviting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>Manage your team members and their permissions</CardDescription>
            </div>
            <Button onClick={handleInvite} disabled={isInviting}>
              <Plus className="h-4 w-4 mr-2" />
              Invite Member
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {members.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No team members yet</p>
          ) : (
            <div className="space-y-4">
              {members.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>{member.email.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.email}</p>
                      <p className="text-sm text-muted-foreground">
                        {member.status === "ACCEPTED" ? "Active" : "Pending"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{member.role.toLowerCase()}</Badge>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pending Invitations</CardTitle>
          <CardDescription>Team members who haven't accepted their invitation yet</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No pending invitations</p>
        </CardContent>
      </Card>
    </div>
  )
}
