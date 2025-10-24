"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, MoreVertical, Mail, Trash2, Clock, CheckCircle2 } from "lucide-react"
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

  const activeMembers = members.filter((m) => m.status === "ACCEPTED")
  const pendingInvitations = members.filter((m) => m.status === "PENDING")

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
            {activeMembers.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-sm text-muted-foreground mb-4">No team members yet</p>
                <Button onClick={() => setInviteDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Invite Your First Team Member
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {activeMembers.map((member) => (
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
                        <div className="flex items-center gap-2 mt-1">
                          <CheckCircle2 className="h-3 w-3 text-green-600" />
                          <p className="text-sm text-muted-foreground">Active</p>
                        </div>
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

        {pendingInvitations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Pending Invitations</CardTitle>
              <CardDescription>Team members who haven't accepted their invitation yet</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingInvitations.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback>{member.email.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="h-3 w-3 text-amber-600" />
                          <p className="text-sm text-muted-foreground">
                            Invited {new Date(member.invitedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="border-amber-600 text-amber-600">
                        Pending
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleResend(member.id)}>
                            <Mail className="h-4 w-4 mr-2" />
                            Resend Invitation
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => {
                              setMemberToRemove(member.id)
                              setRemoveDialogOpen(true)
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Cancel Invitation
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
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
                  <SelectItem value="MEMBER">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">Member</span>
                      <span className="text-xs text-muted-foreground">Can create and edit campaigns</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="ADMIN">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">Admin</span>
                      <span className="text-xs text-muted-foreground">Full access except billing</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <div className="rounded-lg bg-muted p-3 text-xs space-y-2">
                <p className="font-medium">Role Permissions:</p>
                {role === "MEMBER" ? (
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Create and edit campaigns</li>
                    <li>Add and manage prospects</li>
                    <li>Generate AI emails</li>
                    <li>View analytics</li>
                  </ul>
                ) : (
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>All Member permissions</li>
                    <li>Delete campaigns and prospects</li>
                    <li>Invite team members</li>
                    <li>Configure integrations</li>
                  </ul>
                )}
              </div>
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
