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
//                       <AvatarImage src="/placeholder.svg" />
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
import { Plus, MoreVertical, Mail, Trash2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { inviteTeamMember, removeTeamMember, resendInvitation } from "@/lib/actions/team"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface TeamSettingsProps {
  members: Array<{
    id: string
    email: string
    role: string
    status: string
    invitedAt: Date
    acceptedAt: Date | null
  }>
}

export function TeamSettings({ members }: TeamSettingsProps) {
  const router = useRouter()
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [isInviting, setIsInviting] = useState(false)
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<"MEMBER" | "ADMIN">("MEMBER")
  const [memberToRemove, setMemberToRemove] = useState<string | null>(null)
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false)

  const handleInvite = async () => {
    if (!email) {
      toast.error("Please enter an email address")
      return
    }

    setIsInviting(true)
    try {
      const result = await inviteTeamMember(email, role)
      if (result.success) {
        toast.success("Invitation sent successfully")
        setInviteDialogOpen(false)
        setEmail("")
        setRole("MEMBER")
        router.refresh()
      } else {
        toast.error(result.error || "Failed to send invitation")
      }
    } catch (error) {
      toast.error("Failed to send invitation")
    } finally {
      setIsInviting(false)
    }
  }

  const handleRemove = async () => {
    if (!memberToRemove) return

    try {
      const result = await removeTeamMember(memberToRemove)
      if (result.success) {
        toast.success("Team member removed")
        setRemoveDialogOpen(false)
        setMemberToRemove(null)
        router.refresh()
      } else {
        toast.error(result.error || "Failed to remove team member")
      }
    } catch (error) {
      toast.error("Failed to remove team member")
    }
  }

  const handleResend = async (memberId: string) => {
    try {
      const result = await resendInvitation(memberId)
      if (result.success) {
        toast.success("Invitation resent")
      } else {
        toast.error(result.error || "Failed to resend invitation")
      }
    } catch (error) {
      toast.error("Failed to resend invitation")
    }
  }

  return (
    <>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>Manage your team members and their permissions</CardDescription>
              </div>
              <Button onClick={() => setInviteDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Invite Member
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {members.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-sm text-muted-foreground mb-4">No team members yet</p>
                <Button onClick={() => setInviteDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Invite Your First Team Member
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback>{member.email.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.email}</p>
                        <p className="text-sm text-muted-foreground">
                          {member.status === "ACCEPTED" ? "Active" : "Pending invitation"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{member.role.toLowerCase()}</Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {member.status === "PENDING" && (
                            <DropdownMenuItem onClick={() => handleResend(member.id)}>
                              <Mail className="h-4 w-4 mr-2" />
                              Resend Invitation
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => {
                              setMemberToRemove(member.id)
                              setRemoveDialogOpen(true)
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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

      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription>Send an invitation to join your team</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="colleague@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={(value: "MEMBER" | "ADMIN") => setRole(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MEMBER">Member</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Members can view and edit campaigns. Admins have full access to settings.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleInvite} disabled={isInviting}>
              {isInviting ? "Sending..." : "Send Invitation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Team Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this team member? They will lose access to all campaigns and data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemove}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
