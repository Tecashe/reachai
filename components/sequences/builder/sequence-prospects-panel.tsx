
"use client"

import * as React from "react"
import {
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Mail,
  Pause,
  Play,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  MessageSquare,
  UserPlus,
  Upload,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import type { Sequence, EnrollmentStatus } from "@/lib/types/sequence"
import {
  getEnrollments,
  pauseEnrollment,
  resumeEnrollment,
  removeEnrollment,
  bulkPauseEnrollments,
  bulkResumeEnrollments,
  bulkRemoveEnrollments,
  createEnrollment,
} from "@/lib/actions/sequence-actions"
import { ProspectDetailsDialog } from "./prospect-details-dialog"
import { WaveLoader } from "@/components/loader/wave-loader"

interface SequenceProspectsPanelProps {
  sequence: Sequence
  userId: string
}

interface Prospect {
  id: string
  prospectId: string
  firstName: string
  lastName: string
  email: string
  company: string
  jobTitle: string
  status: EnrollmentStatus
  currentStep: number
  enrolledAt: Date
  nextStepAt: Date | null
  emailsOpened: number
  replied: boolean
  imageUrl: string | null
}

const STATUS_CONFIG: Record<
  EnrollmentStatus,
  { label: string; icon: React.ElementType; className: string; iconClassName: string }
> = {
  ACTIVE: { label: "Active", icon: Clock, className: "bg-blue-500/10 text-blue-600", iconClassName: "text-blue-500" },
  PAUSED: {
    label: "Paused",
    icon: Pause,
    className: "bg-yellow-500/10 text-yellow-600",
    iconClassName: "text-yellow-500",
  },
  COMPLETED: {
    label: "Completed",
    icon: CheckCircle2,
    className: "bg-green-500/10 text-green-600",
    iconClassName: "text-green-500",
  },
  BOUNCED: { label: "Bounced", icon: XCircle, className: "bg-red-500/10 text-red-600", iconClassName: "text-red-500" },
  REPLIED: {
    label: "Replied",
    icon: MessageSquare,
    className: "bg-purple-500/10 text-purple-600",
    iconClassName: "text-purple-500",
  },
  UNSUBSCRIBED: {
    label: "Unsubscribed",
    icon: AlertCircle,
    className: "bg-orange-500/10 text-orange-600",
    iconClassName: "text-orange-500",
  },
  MANUALLY_REMOVED: {
    label: "Removed",
    icon: XCircle,
    className: "bg-muted text-muted-foreground",
    iconClassName: "text-muted-foreground",
  },
}

export function SequenceProspectsPanel({ sequence, userId }: SequenceProspectsPanelProps) {
  const { toast } = useToast()

  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<EnrollmentStatus | "all">("all")
  const [selectedProspects, setSelectedProspects] = React.useState<Set<string>>(new Set())
  const [prospects, setProspects] = React.useState<Prospect[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [isActioning, setIsActioning] = React.useState(false)
  const [showAddDialog, setShowAddDialog] = React.useState(false)
  const [newProspectEmail, setNewProspectEmail] = React.useState("")
  const [bulkEmails, setBulkEmails] = React.useState("")
  const [isAddingProspects, setIsAddingProspects] = React.useState(false)
  const [selectedProspectId, setSelectedProspectId] = React.useState<string | null>(null)
  const [showDetailsDialog, setShowDetailsDialog] = React.useState(false)

  // Fetch enrollments on mount
  React.useEffect(() => {
    async function fetchEnrollments() {
      try {
        const enrollments = await getEnrollments(sequence.id, userId)
        const transformedProspects: Prospect[] = enrollments.map((enrollment: any) => ({
          id: enrollment.id,
          prospectId: enrollment.prospectId,
          firstName: enrollment.prospect?.firstName || "Unknown",
          lastName: enrollment.prospect?.lastName || "Prospect",
          email: enrollment.prospect?.email || `prospect-${enrollment.prospectId.slice(-4)}@example.com`,
          company: enrollment.prospect?.company || "Unknown Company",
          jobTitle: enrollment.prospect?.jobTitle || "Unknown Title",
          status: enrollment.status,
          currentStep: enrollment.currentStep+1,
          enrolledAt: enrollment.enrolledAt,
          nextStepAt: enrollment.nextStepAt,
          emailsOpened: enrollment.emailsOpened,
          replied: enrollment.replied,
          imageUrl: enrollment.prospect?.imageUrl || null,
        }))
        setProspects(transformedProspects)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load prospects.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (sequence.id !== "new") {
      fetchEnrollments()
    } else {
      setIsLoading(false)
    }
  }, [sequence.id, userId, toast])

  const filteredProspects = React.useMemo(() => {
    let result = prospects

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (p) =>
          p.firstName.toLowerCase().includes(query) ||
          p.lastName.toLowerCase().includes(query) ||
          p.email.toLowerCase().includes(query) ||
          p.company.toLowerCase().includes(query),
      )
    }

    if (statusFilter !== "all") {
      result = result.filter((p) => p.status === statusFilter)
    }

    return result
  }, [prospects, searchQuery, statusFilter])

  const handleSelectAll = () => {
    if (selectedProspects.size === filteredProspects.length) {
      setSelectedProspects(new Set())
    } else {
      setSelectedProspects(new Set(filteredProspects.map((p) => p.id)))
    }
  }

  const handleSelectProspect = (id: string) => {
    const newSelected = new Set(selectedProspects)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedProspects(newSelected)
  }

  const handlePauseEnrollment = async (enrollmentId: string) => {
    setIsActioning(true)
    try {
      await pauseEnrollment(enrollmentId, sequence.id, userId)
      setProspects((prev) =>
        prev.map((p) => (p.id === enrollmentId ? { ...p, status: "PAUSED" as EnrollmentStatus } : p)),
      )
      toast({ title: "Enrollment paused" })
    } catch (error) {
      toast({ title: "Error", description: "Failed to pause enrollment.", variant: "destructive" })
    } finally {
      setIsActioning(false)
    }
  }

  const handleResumeEnrollment = async (enrollmentId: string) => {
    setIsActioning(true)
    try {
      await resumeEnrollment(enrollmentId, sequence.id, userId)
      setProspects((prev) =>
        prev.map((p) => (p.id === enrollmentId ? { ...p, status: "ACTIVE" as EnrollmentStatus } : p)),
      )
      toast({ title: "Enrollment resumed" })
    } catch (error) {
      toast({ title: "Error", description: "Failed to resume enrollment.", variant: "destructive" })
    } finally {
      setIsActioning(false)
    }
  }

  const handleRemoveEnrollment = async (enrollmentId: string) => {
    setIsActioning(true)
    try {
      await removeEnrollment(enrollmentId, sequence.id, userId)
      setProspects((prev) => prev.filter((p) => p.id !== enrollmentId))
      toast({ title: "Enrollment removed" })
    } catch (error) {
      toast({ title: "Error", description: "Failed to remove enrollment.", variant: "destructive" })
    } finally {
      setIsActioning(false)
    }
  }

  const handleBulkPause = async () => {
    setIsActioning(true)
    try {
      await bulkPauseEnrollments(Array.from(selectedProspects), sequence.id, userId)
      setProspects((prev) =>
        prev.map((p) => (selectedProspects.has(p.id) ? { ...p, status: "PAUSED" as EnrollmentStatus } : p)),
      )
      setSelectedProspects(new Set())
      toast({ title: `${selectedProspects.size} enrollments paused` })
    } catch (error) {
      toast({ title: "Error", description: "Failed to pause enrollments.", variant: "destructive" })
    } finally {
      setIsActioning(false)
    }
  }

  const handleBulkResume = async () => {
    setIsActioning(true)
    try {
      await bulkResumeEnrollments(Array.from(selectedProspects), sequence.id, userId)
      setProspects((prev) =>
        prev.map((p) => (selectedProspects.has(p.id) ? { ...p, status: "ACTIVE" as EnrollmentStatus } : p)),
      )
      setSelectedProspects(new Set())
      toast({ title: `${selectedProspects.size} enrollments resumed` })
    } catch (error) {
      toast({ title: "Error", description: "Failed to resume enrollments.", variant: "destructive" })
    } finally {
      setIsActioning(false)
    }
  }

  const handleBulkRemove = async () => {
    setIsActioning(true)
    try {
      await bulkRemoveEnrollments(Array.from(selectedProspects), sequence.id, userId)
      setProspects((prev) => prev.filter((p) => !selectedProspects.has(p.id)))
      setSelectedProspects(new Set())
      toast({ title: `${selectedProspects.size} enrollments removed` })
    } catch (error) {
      toast({ title: "Error", description: "Failed to remove enrollments.", variant: "destructive" })
    } finally {
      setIsActioning(false)
    }
  }

  const handleAddProspects = async () => {
    if (sequence.id === "new") {
      toast({
        title: "Save first",
        description: "Please save the sequence before adding prospects.",
        variant: "destructive",
      })
      return
    }

    setIsAddingProspects(true)
    try {
      // Parse emails from bulk input or single email
      const emails = bulkEmails
        ? bulkEmails
            .split(/[\n,;]/)
            .map((e) => e.trim())
            .filter((e) => e && e.includes("@"))
        : newProspectEmail
          ? [newProspectEmail.trim()]
          : []

      if (emails.length === 0) {
        toast({
          title: "No valid emails",
          description: "Please enter at least one valid email address.",
          variant: "destructive",
        })
        return
      }

      let added = 0
      let skipped = 0
      for (const email of emails) {
        try {
          const enrollment = await createEnrollment(sequence.id, userId, email)
          if (enrollment) {
            added++
          } else {
            skipped++
          }
        } catch (error) {
          console.error(`Failed to enroll ${email}:`, error)
          skipped++
        }
      }

      if (skipped > 0) {
        toast({
          title: "Prospects added",
          description: `Added ${added} prospect(s). ${skipped} were already enrolled or failed.`,
        })
      } else {
        toast({
          title: "Prospects added",
          description: `Successfully enrolled ${added} prospect${added !== 1 ? "s" : ""}.`,
        })
      }

      // Refresh the list
      const enrollments = await getEnrollments(sequence.id, userId)
      const transformedProspects: Prospect[] = enrollments.map((enrollment: any) => ({
        id: enrollment.id,
        prospectId: enrollment.prospectId,
        firstName: enrollment.prospect?.firstName || "Unknown",
        lastName: enrollment.prospect?.lastName || "Prospect",
        email: enrollment.prospect?.email || `prospect-${enrollment.prospectId.slice(-4)}@example.com`,
        company: enrollment.prospect?.company || "Unknown Company",
        jobTitle: enrollment.prospect?.jobTitle || "Unknown Title",
        status: enrollment.status,
        currentStep: enrollment.currentStep+1,
        enrolledAt: enrollment.enrolledAt,
        nextStepAt: enrollment.nextStepAt,
        emailsOpened: enrollment.emailsOpened,
        replied: enrollment.replied,
        imageUrl: enrollment.prospect?.imageUrl || null,
      }))
      setProspects(transformedProspects)

      setShowAddDialog(false)
      setNewProspectEmail("")
      setBulkEmails("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add prospects.",
        variant: "destructive",
      })
    } finally {
      setIsAddingProspects(false)
    }
  }

  const handleViewDetails = (prospectId: string) => {
    setSelectedProspectId(prospectId)
    setShowDetailsDialog(true)
  }

  const formatDate = (date: Date | null) => {
    if (!date) return "-"
    return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const statusCounts = React.useMemo(() => {
    const counts: Record<string, number> = { all: prospects.length }
    prospects.forEach((p) => {
      counts[p.status] = (counts[p.status] || 0) + 1
    })
    return counts
  }, [prospects])

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <WaveLoader size="sm" bars={8} gap="tight" />
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Enrolled Prospects</h2>
            <p className="text-sm text-muted-foreground">{prospects.length} prospects in this sequence</p>
          </div>
          <Button size="sm" className="gap-2" onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4" />
            Add Prospects
          </Button>
        </div>

        {/* Filters */}
        <div className="mt-4 flex items-center justify-between">
          <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as EnrollmentStatus | "all")}>
            <TabsList className="h-8">
              <TabsTrigger value="all" className="h-7 px-3 text-xs">
                All
                <Badge variant="secondary" className="ml-1.5 h-4 px-1 text-[10px]">
                  {statusCounts.all}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="ACTIVE" className="h-7 px-3 text-xs">
                Active
                <Badge variant="secondary" className="ml-1.5 h-4 px-1 text-[10px]">
                  {statusCounts.ACTIVE || 0}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="REPLIED" className="h-7 px-3 text-xs">
                Replied
                <Badge variant="secondary" className="ml-1.5 h-4 px-1 text-[10px]">
                  {statusCounts.REPLIED || 0}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="COMPLETED" className="h-7 px-3 text-xs">
                Completed
              </TabsTrigger>
              <TabsTrigger value="BOUNCED" className="h-7 px-3 text-xs">
                Bounced
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search prospects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 w-64 pl-8 text-sm"
              />
            </div>
            <Button variant="outline" size="sm" className="h-8 gap-2 bg-transparent">
              <Filter className="h-3.5 w-3.5" />
              Filter
            </Button>
          </div>
        </div>
      </div>

      {/* Bulk actions */}
      {selectedProspects.size > 0 && (
        <div className="flex items-center justify-between border-b border-border bg-muted/50 px-6 py-2">
          <span className="text-sm text-muted-foreground">{selectedProspects.size} selected</span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleBulkPause} disabled={isActioning}>
              {isActioning ? <WaveLoader size="sm" bars={8} gap="tight" /> : <Pause className="mr-1.5 h-3.5 w-3.5" />}
              Pause
            </Button>
            <Button variant="outline" size="sm" onClick={handleBulkResume} disabled={isActioning}>
              {isActioning ? <WaveLoader size="sm" bars={8} gap="tight" /> : <Play className="mr-1.5 h-3.5 w-3.5" />}
              Resume
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:bg-destructive hover:text-destructive-foreground bg-transparent"
              onClick={handleBulkRemove}
              disabled={isActioning}
            >
              {isActioning ? <WaveLoader size="sm" bars={8} gap="tight" /> : <Trash2 className="mr-1.5 h-3.5 w-3.5" />}
              Remove
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-background">
            <tr className="border-b border-border text-xs text-muted-foreground">
              <th className="px-6 py-3 text-left">
                <Checkbox
                  checked={selectedProspects.size === filteredProspects.length && filteredProspects.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </th>
              <th className="px-3 py-3 text-left font-medium">Prospect</th>
              <th className="px-3 py-3 text-left font-medium">Status</th>
              <th className="px-3 py-3 text-left font-medium">Current Step</th>
              <th className="px-3 py-3 text-left font-medium">Enrolled</th>
              <th className="px-3 py-3 text-left font-medium">Next Step</th>
              <th className="px-3 py-3 text-left font-medium">Opens</th>
              <th className="px-3 py-3 text-left font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredProspects.map((prospect) => {
              const statusConfig = STATUS_CONFIG[prospect.status]
              const StatusIcon = statusConfig.icon

              return (
                <tr key={prospect.id} className="group hover:bg-muted/50">
                  <td className="px-6 py-3">
                    <Checkbox
                      checked={selectedProspects.has(prospect.id)}
                      onCheckedChange={() => handleSelectProspect(prospect.id)}
                    />
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={prospect.imageUrl || undefined} />
                        <AvatarFallback className="text-xs">
                          {prospect.firstName[0]}
                          {prospect.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {prospect.firstName} {prospect.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {prospect.jobTitle} at {prospect.company}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <Badge variant="secondary" className={cn("gap-1", statusConfig.className)}>
                      <StatusIcon className={cn("h-3 w-3", statusConfig.iconClassName)} />
                      {statusConfig.label}
                    </Badge>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                        {prospect.currentStep}
                      </div>
                      <span className="text-sm text-muted-foreground">of {sequence.totalSteps}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-sm text-muted-foreground">{formatDate(prospect.enrolledAt)}</td>
                  <td className="px-3 py-3 text-sm text-muted-foreground">
                    {prospect.nextStepAt ? formatDate(prospect.nextStepAt) : "-"}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-sm">{prospect.emailsOpened}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetails(prospect.prospectId)}>
                          View details
                        </DropdownMenuItem>
                        <DropdownMenuItem>Send manual email</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {prospect.status === "ACTIVE" ? (
                          <DropdownMenuItem onClick={() => handlePauseEnrollment(prospect.id)}>
                            Pause enrollment
                          </DropdownMenuItem>
                        ) : prospect.status === "PAUSED" ? (
                          <DropdownMenuItem onClick={() => handleResumeEnrollment(prospect.id)}>
                            Resume enrollment
                          </DropdownMenuItem>
                        ) : null}
                        <DropdownMenuItem>Move to step...</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleRemoveEnrollment(prospect.id)}
                        >
                          Remove from sequence
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {filteredProspects.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-sm text-muted-foreground">
              {prospects.length === 0
                ? "No prospects enrolled in this sequence yet"
                : "No prospects found matching your filters"}
            </p>
            {prospects.length === 0 && (
              <Button
                variant="outline"
                size="sm"
                className="mt-4 bg-transparent"
                onClick={() => setShowAddDialog(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add your first prospects
              </Button>
            )}
          </div>
        )}
      </div>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Prospects</DialogTitle>
            <DialogDescription>Add prospects to this sequence by entering their email addresses.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Tabs defaultValue="single" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="single" className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  Single
                </TabsTrigger>
                <TabsTrigger value="bulk" className="gap-2">
                  <Upload className="h-4 w-4" />
                  Bulk
                </TabsTrigger>
              </TabsList>

              <div className="mt-4">
                <div className="space-y-2">
                  <Label>Email address(es)</Label>
                  <Textarea
                    placeholder="Enter email addresses (one per line, or comma-separated)"
                    value={bulkEmails || newProspectEmail}
                    onChange={(e) => {
                      if (e.target.value.includes("\n") || e.target.value.includes(",")) {
                        setBulkEmails(e.target.value)
                        setNewProspectEmail("")
                      } else {
                        setNewProspectEmail(e.target.value)
                        setBulkEmails("")
                      }
                    }}
                    rows={5}
                  />
                  <p className="text-xs text-muted-foreground">
                    {bulkEmails
                      ? `${bulkEmails.split(/[\n,;]/).filter((e) => e.trim() && e.includes("@")).length} valid email(s) detected`
                      : "Enter one or more email addresses"}
                  </p>
                </div>
              </div>
            </Tabs>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddProspects} disabled={isAddingProspects}>
              {isAddingProspects ? (
                <>
                  <WaveLoader size="sm" bars={8} gap="tight" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Prospects
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {selectedProspectId && (
        <ProspectDetailsDialog
          prospectId={selectedProspectId}
          open={showDetailsDialog}
          onOpenChange={setShowDetailsDialog}
        />
      )}
    </div>
  )
}
