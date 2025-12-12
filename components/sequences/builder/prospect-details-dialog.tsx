"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Mail,
  MousePointerClick,
  Reply,
  TrendingUp,
  User,
  Building,
  MapPin,
  Phone,
  Linkedin,
  Globe,
  AlertCircle,
} from "lucide-react"
import type { Prospect } from "@prisma/client"

interface ProspectDetailsDialogProps {
  prospectId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProspectDetailsDialog({ prospectId, open, onOpenChange }: ProspectDetailsDialogProps) {
  const [prospect, setProspect] = useState<Prospect | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (open && prospectId) {
      fetchProspectDetails()
    }
  }, [open, prospectId])

  async function fetchProspectDetails() {
    setLoading(true)
    try {
      const response = await fetch(`/api/prospects/${prospectId}`)
      if (response.ok) {
        const data = await response.json()
        setProspect(data)
      }
    } catch (error) {
      console.error("Failed to fetch prospect details:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (!prospect) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl">
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <AlertCircle className="h-5 w-5 mr-2" />
            Prospect not found
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh]">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-xl">
                  {prospect.firstName} {prospect.lastName}
                </DialogTitle>
                <DialogDescription>{prospect.email}</DialogDescription>
              </div>
            </div>
            <Badge variant={prospect.status === "ACTIVE" ? "default" : "secondary"}>{prospect.status}</Badge>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {prospect.company && (
                    <div className="flex items-center gap-2 text-sm">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Company:</span>
                      <span>{prospect.company}</span>
                    </div>
                  )}
                  {prospect.jobTitle && (
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Title:</span>
                      <span>{prospect.jobTitle}</span>
                    </div>
                  )}
                  {prospect.location && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Location:</span>
                      <span>{prospect.location}</span>
                    </div>
                  )}
                  {prospect.phoneNumber && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Phone:</span>
                      <span>{prospect.phoneNumber}</span>
                    </div>
                  )}
                  {prospect.linkedinUrl && (
                    <div className="flex items-center gap-2 text-sm">
                      <Linkedin className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={prospect.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        LinkedIn Profile
                      </a>
                    </div>
                  )}
                  {prospect.websiteUrl && (
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={prospect.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Website
                      </a>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4">
                  <h4 className="text-sm font-semibold mb-3">Engagement Stats</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                      <Mail className="h-5 w-5 text-muted-foreground mb-1" />
                      <span className="text-2xl font-bold">{prospect.emailsReceived}</span>
                      <span className="text-xs text-muted-foreground">Emails Sent</span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                      <MousePointerClick className="h-5 w-5 text-muted-foreground mb-1" />
                      <span className="text-2xl font-bold">{prospect.emailsOpened}</span>
                      <span className="text-xs text-muted-foreground">Opens</span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                      <Reply className="h-5 w-5 text-muted-foreground mb-1" />
                      <span className="text-2xl font-bold">{prospect.replyCount}</span>
                      <span className="text-xs text-muted-foreground">Replies</span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-3">
                <div className="text-sm text-muted-foreground">Activity timeline coming soon...</div>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="engagement" className="space-y-4">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                <div className="grid gap-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Total Emails Sent</span>
                    </div>
                    <span className="text-sm font-bold">{prospect.emailsReceived}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <MousePointerClick className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Total Opens</span>
                    </div>
                    <span className="text-sm font-bold">{prospect.emailsOpened}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Reply className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Total Replies</span>
                    </div>
                    <span className="text-sm font-bold">{prospect.replyCount}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Engagement Rate</span>
                    </div>
                    <span className="text-sm font-bold">
                      {prospect.emailsReceived > 0
                        ? Math.round((prospect.emailsOpened / prospect.emailsReceived) * 100)
                        : 0}
                      %
                    </span>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
