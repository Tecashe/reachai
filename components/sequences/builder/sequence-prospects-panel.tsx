
// "use client"

// import * as React from "react"
// import {
//   Search,
//   Plus,
//   Filter,
//   MoreHorizontal,
//   Mail,
//   Pause,
//   Play,
//   Trash2,
//   CheckCircle2,
//   Clock,
//   AlertCircle,
//   XCircle,
//   MessageSquare,
//   UserPlus,
//   Upload,
// } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Badge } from "@/components/ui/badge"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog"
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Textarea } from "@/components/ui/textarea"
// import { useToast } from "@/hooks/use-toast"
// import { cn } from "@/lib/utils"
// import type { Sequence, EnrollmentStatus } from "@/lib/types/sequence"
// import {
//   getEnrollments,
//   pauseEnrollment,
//   resumeEnrollment,
//   removeEnrollment,
//   bulkPauseEnrollments,
//   bulkResumeEnrollments,
//   bulkRemoveEnrollments,
//   createEnrollment,
// } from "@/lib/actions/sequence-actions"
// import { ProspectDetailsDialog } from "./prospect-details-dialog"
// import { WaveLoader } from "@/components/loader/wave-loader"

// interface SequenceProspectsPanelProps {
//   sequence: Sequence
//   userId: string
// }

// interface Prospect {
//   id: string
//   prospectId: string
//   firstName: string
//   lastName: string
//   email: string
//   company: string
//   jobTitle: string
//   status: EnrollmentStatus
//   currentStep: number
//   enrolledAt: Date
//   nextStepAt: Date | null
//   emailsOpened: number
//   replied: boolean
//   imageUrl: string | null
// }

// const STATUS_CONFIG: Record<
//   EnrollmentStatus,
//   { label: string; icon: React.ElementType; className: string; iconClassName: string }
// > = {
//   ACTIVE: { label: "Active", icon: Clock, className: "bg-blue-500/10 text-blue-600", iconClassName: "text-blue-500" },
//   PAUSED: {
//     label: "Paused",
//     icon: Pause,
//     className: "bg-yellow-500/10 text-yellow-600",
//     iconClassName: "text-yellow-500",
//   },
//   COMPLETED: {
//     label: "Completed",
//     icon: CheckCircle2,
//     className: "bg-green-500/10 text-green-600",
//     iconClassName: "text-green-500",
//   },
//   BOUNCED: { label: "Bounced", icon: XCircle, className: "bg-red-500/10 text-red-600", iconClassName: "text-red-500" },
//   REPLIED: {
//     label: "Replied",
//     icon: MessageSquare,
//     className: "bg-purple-500/10 text-purple-600",
//     iconClassName: "text-purple-500",
//   },
//   UNSUBSCRIBED: {
//     label: "Unsubscribed",
//     icon: AlertCircle,
//     className: "bg-orange-500/10 text-orange-600",
//     iconClassName: "text-orange-500",
//   },
//   MANUALLY_REMOVED: {
//     label: "Removed",
//     icon: XCircle,
//     className: "bg-muted text-muted-foreground",
//     iconClassName: "text-muted-foreground",
//   },
// }

// export function SequenceProspectsPanel({ sequence, userId }: SequenceProspectsPanelProps) {
//   const { toast } = useToast()

//   const [searchQuery, setSearchQuery] = React.useState("")
//   const [statusFilter, setStatusFilter] = React.useState<EnrollmentStatus | "all">("all")
//   const [selectedProspects, setSelectedProspects] = React.useState<Set<string>>(new Set())
//   const [prospects, setProspects] = React.useState<Prospect[]>([])
//   const [isLoading, setIsLoading] = React.useState(true)
//   const [isActioning, setIsActioning] = React.useState(false)
//   const [showAddDialog, setShowAddDialog] = React.useState(false)
//   const [newProspectEmail, setNewProspectEmail] = React.useState("")
//   const [bulkEmails, setBulkEmails] = React.useState("")
//   const [isAddingProspects, setIsAddingProspects] = React.useState(false)
//   const [selectedProspectId, setSelectedProspectId] = React.useState<string | null>(null)
//   const [showDetailsDialog, setShowDetailsDialog] = React.useState(false)

//   // Fetch enrollments on mount
//   React.useEffect(() => {
//     async function fetchEnrollments() {
//       try {
//         const enrollments = await getEnrollments(sequence.id, userId)
//         const transformedProspects: Prospect[] = enrollments.map((enrollment: any) => ({
//           id: enrollment.id,
//           prospectId: enrollment.prospectId,
//           firstName: enrollment.prospect?.firstName || "Unknown",
//           lastName: enrollment.prospect?.lastName || "Prospect",
//           email: enrollment.prospect?.email || `prospect-${enrollment.prospectId.slice(-4)}@example.com`,
//           company: enrollment.prospect?.company || "Unknown Company",
//           jobTitle: enrollment.prospect?.jobTitle || "Unknown Title",
//           status: enrollment.status,
//           currentStep: enrollment.currentStep+1,
//           enrolledAt: enrollment.enrolledAt,
//           nextStepAt: enrollment.nextStepAt,
//           emailsOpened: enrollment.emailsOpened,
//           replied: enrollment.replied,
//           imageUrl: enrollment.prospect?.imageUrl || null,
//         }))
//         setProspects(transformedProspects)
//       } catch (error) {
//         toast({
//           title: "Error",
//           description: "Failed to load prospects.",
//           variant: "destructive",
//         })
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     if (sequence.id !== "new") {
//       fetchEnrollments()
//     } else {
//       setIsLoading(false)
//     }
//   }, [sequence.id, userId, toast])

//   const filteredProspects = React.useMemo(() => {
//     let result = prospects

//     if (searchQuery) {
//       const query = searchQuery.toLowerCase()
//       result = result.filter(
//         (p) =>
//           p.firstName.toLowerCase().includes(query) ||
//           p.lastName.toLowerCase().includes(query) ||
//           p.email.toLowerCase().includes(query) ||
//           p.company.toLowerCase().includes(query),
//       )
//     }

//     if (statusFilter !== "all") {
//       result = result.filter((p) => p.status === statusFilter)
//     }

//     return result
//   }, [prospects, searchQuery, statusFilter])

//   const handleSelectAll = () => {
//     if (selectedProspects.size === filteredProspects.length) {
//       setSelectedProspects(new Set())
//     } else {
//       setSelectedProspects(new Set(filteredProspects.map((p) => p.id)))
//     }
//   }

//   const handleSelectProspect = (id: string) => {
//     const newSelected = new Set(selectedProspects)
//     if (newSelected.has(id)) {
//       newSelected.delete(id)
//     } else {
//       newSelected.add(id)
//     }
//     setSelectedProspects(newSelected)
//   }

//   const handlePauseEnrollment = async (enrollmentId: string) => {
//     setIsActioning(true)
//     try {
//       await pauseEnrollment(enrollmentId, sequence.id, userId)
//       setProspects((prev) =>
//         prev.map((p) => (p.id === enrollmentId ? { ...p, status: "PAUSED" as EnrollmentStatus } : p)),
//       )
//       toast({ title: "Enrollment paused" })
//     } catch (error) {
//       toast({ title: "Error", description: "Failed to pause enrollment.", variant: "destructive" })
//     } finally {
//       setIsActioning(false)
//     }
//   }

//   const handleResumeEnrollment = async (enrollmentId: string) => {
//     setIsActioning(true)
//     try {
//       await resumeEnrollment(enrollmentId, sequence.id, userId)
//       setProspects((prev) =>
//         prev.map((p) => (p.id === enrollmentId ? { ...p, status: "ACTIVE" as EnrollmentStatus } : p)),
//       )
//       toast({ title: "Enrollment resumed" })
//     } catch (error) {
//       toast({ title: "Error", description: "Failed to resume enrollment.", variant: "destructive" })
//     } finally {
//       setIsActioning(false)
//     }
//   }

//   const handleRemoveEnrollment = async (enrollmentId: string) => {
//     setIsActioning(true)
//     try {
//       await removeEnrollment(enrollmentId, sequence.id, userId)
//       setProspects((prev) => prev.filter((p) => p.id !== enrollmentId))
//       toast({ title: "Enrollment removed" })
//     } catch (error) {
//       toast({ title: "Error", description: "Failed to remove enrollment.", variant: "destructive" })
//     } finally {
//       setIsActioning(false)
//     }
//   }

//   const handleBulkPause = async () => {
//     setIsActioning(true)
//     try {
//       await bulkPauseEnrollments(Array.from(selectedProspects), sequence.id, userId)
//       setProspects((prev) =>
//         prev.map((p) => (selectedProspects.has(p.id) ? { ...p, status: "PAUSED" as EnrollmentStatus } : p)),
//       )
//       setSelectedProspects(new Set())
//       toast({ title: `${selectedProspects.size} enrollments paused` })
//     } catch (error) {
//       toast({ title: "Error", description: "Failed to pause enrollments.", variant: "destructive" })
//     } finally {
//       setIsActioning(false)
//     }
//   }

//   const handleBulkResume = async () => {
//     setIsActioning(true)
//     try {
//       await bulkResumeEnrollments(Array.from(selectedProspects), sequence.id, userId)
//       setProspects((prev) =>
//         prev.map((p) => (selectedProspects.has(p.id) ? { ...p, status: "ACTIVE" as EnrollmentStatus } : p)),
//       )
//       setSelectedProspects(new Set())
//       toast({ title: `${selectedProspects.size} enrollments resumed` })
//     } catch (error) {
//       toast({ title: "Error", description: "Failed to resume enrollments.", variant: "destructive" })
//     } finally {
//       setIsActioning(false)
//     }
//   }

//   const handleBulkRemove = async () => {
//     setIsActioning(true)
//     try {
//       await bulkRemoveEnrollments(Array.from(selectedProspects), sequence.id, userId)
//       setProspects((prev) => prev.filter((p) => !selectedProspects.has(p.id)))
//       setSelectedProspects(new Set())
//       toast({ title: `${selectedProspects.size} enrollments removed` })
//     } catch (error) {
//       toast({ title: "Error", description: "Failed to remove enrollments.", variant: "destructive" })
//     } finally {
//       setIsActioning(false)
//     }
//   }

//   const handleAddProspects = async () => {
//     if (sequence.id === "new") {
//       toast({
//         title: "Save first",
//         description: "Please save the sequence before adding prospects.",
//         variant: "destructive",
//       })
//       return
//     }

//     setIsAddingProspects(true)
//     try {
//       // Parse emails from bulk input or single email
//       const emails = bulkEmails
//         ? bulkEmails
//             .split(/[\n,;]/)
//             .map((e) => e.trim())
//             .filter((e) => e && e.includes("@"))
//         : newProspectEmail
//           ? [newProspectEmail.trim()]
//           : []

//       if (emails.length === 0) {
//         toast({
//           title: "No valid emails",
//           description: "Please enter at least one valid email address.",
//           variant: "destructive",
//         })
//         return
//       }

//       let added = 0
//       let skipped = 0
//       for (const email of emails) {
//         try {
//           const enrollment = await createEnrollment(sequence.id, userId, email)
//           if (enrollment) {
//             added++
//           } else {
//             skipped++
//           }
//         } catch (error) {
//           console.error(`Failed to enroll ${email}:`, error)
//           skipped++
//         }
//       }

//       if (skipped > 0) {
//         toast({
//           title: "Prospects added",
//           description: `Added ${added} prospect(s). ${skipped} were already enrolled or failed.`,
//         })
//       } else {
//         toast({
//           title: "Prospects added",
//           description: `Successfully enrolled ${added} prospect${added !== 1 ? "s" : ""}.`,
//         })
//       }

//       // Refresh the list
//       const enrollments = await getEnrollments(sequence.id, userId)
//       const transformedProspects: Prospect[] = enrollments.map((enrollment: any) => ({
//         id: enrollment.id,
//         prospectId: enrollment.prospectId,
//         firstName: enrollment.prospect?.firstName || "Unknown",
//         lastName: enrollment.prospect?.lastName || "Prospect",
//         email: enrollment.prospect?.email || `prospect-${enrollment.prospectId.slice(-4)}@example.com`,
//         company: enrollment.prospect?.company || "Unknown Company",
//         jobTitle: enrollment.prospect?.jobTitle || "Unknown Title",
//         status: enrollment.status,
//         currentStep: enrollment.currentStep+1,
//         enrolledAt: enrollment.enrolledAt,
//         nextStepAt: enrollment.nextStepAt,
//         emailsOpened: enrollment.emailsOpened,
//         replied: enrollment.replied,
//         imageUrl: enrollment.prospect?.imageUrl || null,
//       }))
//       setProspects(transformedProspects)

//       setShowAddDialog(false)
//       setNewProspectEmail("")
//       setBulkEmails("")
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to add prospects.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsAddingProspects(false)
//     }
//   }

//   const handleViewDetails = (prospectId: string) => {
//     setSelectedProspectId(prospectId)
//     setShowDetailsDialog(true)
//   }

//   const formatDate = (date: Date | null) => {
//     if (!date) return "-"
//     return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
//   }

//   const statusCounts = React.useMemo(() => {
//     const counts: Record<string, number> = { all: prospects.length }
//     prospects.forEach((p) => {
//       counts[p.status] = (counts[p.status] || 0) + 1
//     })
//     return counts
//   }, [prospects])

//   if (isLoading) {
//     return (
//       <div className="flex h-full items-center justify-center">
//         <WaveLoader size="sm" bars={8} gap="tight" />
//       </div>
//     )
//   }

//   return (
//     <div className="flex h-full flex-col">
//       {/* Header */}
//       <div className="border-b border-border px-6 py-4">
//         <div className="flex items-center justify-between">
//           <div>
//             <h2 className="text-lg font-semibold text-foreground">Enrolled Prospects</h2>
//             <p className="text-sm text-muted-foreground">{prospects.length} prospects in this sequence</p>
//           </div>
//           <Button size="sm" className="gap-2" onClick={() => setShowAddDialog(true)}>
//             <Plus className="h-4 w-4" />
//             Add Prospects
//           </Button>
//         </div>

//         {/* Filters */}
//         <div className="mt-4 flex items-center justify-between">
//           <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as EnrollmentStatus | "all")}>
//             <TabsList className="h-8">
//               <TabsTrigger value="all" className="h-7 px-3 text-xs">
//                 All
//                 <Badge variant="secondary" className="ml-1.5 h-4 px-1 text-[10px]">
//                   {statusCounts.all}
//                 </Badge>
//               </TabsTrigger>
//               <TabsTrigger value="ACTIVE" className="h-7 px-3 text-xs">
//                 Active
//                 <Badge variant="secondary" className="ml-1.5 h-4 px-1 text-[10px]">
//                   {statusCounts.ACTIVE || 0}
//                 </Badge>
//               </TabsTrigger>
//               <TabsTrigger value="REPLIED" className="h-7 px-3 text-xs">
//                 Replied
//                 <Badge variant="secondary" className="ml-1.5 h-4 px-1 text-[10px]">
//                   {statusCounts.REPLIED || 0}
//                 </Badge>
//               </TabsTrigger>
//               <TabsTrigger value="COMPLETED" className="h-7 px-3 text-xs">
//                 Completed
//               </TabsTrigger>
//               <TabsTrigger value="BOUNCED" className="h-7 px-3 text-xs">
//                 Bounced
//               </TabsTrigger>
//             </TabsList>
//           </Tabs>

//           <div className="flex items-center gap-2">
//             <div className="relative">
//               <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//               <Input
//                 placeholder="Search prospects..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="h-8 w-64 pl-8 text-sm"
//               />
//             </div>
//             <Button variant="outline" size="sm" className="h-8 gap-2 bg-transparent">
//               <Filter className="h-3.5 w-3.5" />
//               Filter
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* Bulk actions */}
//       {selectedProspects.size > 0 && (
//         <div className="flex items-center justify-between border-b border-border bg-muted/50 px-6 py-2">
//           <span className="text-sm text-muted-foreground">{selectedProspects.size} selected</span>
//           <div className="flex items-center gap-2">
//             <Button variant="outline" size="sm" onClick={handleBulkPause} disabled={isActioning}>
//               {isActioning ? <WaveLoader size="sm" bars={8} gap="tight" /> : <Pause className="mr-1.5 h-3.5 w-3.5" />}
//               Pause
//             </Button>
//             <Button variant="outline" size="sm" onClick={handleBulkResume} disabled={isActioning}>
//               {isActioning ? <WaveLoader size="sm" bars={8} gap="tight" /> : <Play className="mr-1.5 h-3.5 w-3.5" />}
//               Resume
//             </Button>
//             <Button
//               variant="outline"
//               size="sm"
//               className="text-destructive hover:bg-destructive hover:text-destructive-foreground bg-transparent"
//               onClick={handleBulkRemove}
//               disabled={isActioning}
//             >
//               {isActioning ? <WaveLoader size="sm" bars={8} gap="tight" /> : <Trash2 className="mr-1.5 h-3.5 w-3.5" />}
//               Remove
//             </Button>
//           </div>
//         </div>
//       )}

//       {/* Table */}
//       <div className="flex-1 overflow-auto">
//         <table className="w-full">
//           <thead className="sticky top-0 bg-background">
//             <tr className="border-b border-border text-xs text-muted-foreground">
//               <th className="px-6 py-3 text-left">
//                 <Checkbox
//                   checked={selectedProspects.size === filteredProspects.length && filteredProspects.length > 0}
//                   onCheckedChange={handleSelectAll}
//                 />
//               </th>
//               <th className="px-3 py-3 text-left font-medium">Prospect</th>
//               <th className="px-3 py-3 text-left font-medium">Status</th>
//               <th className="px-3 py-3 text-left font-medium">Current Step</th>
//               <th className="px-3 py-3 text-left font-medium">Enrolled</th>
//               <th className="px-3 py-3 text-left font-medium">Next Step</th>
//               <th className="px-3 py-3 text-left font-medium">Opens</th>
//               <th className="px-3 py-3 text-left font-medium"></th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-border">
//             {filteredProspects.map((prospect) => {
//               const statusConfig = STATUS_CONFIG[prospect.status]
//               const StatusIcon = statusConfig.icon

//               return (
//                 <tr key={prospect.id} className="group hover:bg-muted/50">
//                   <td className="px-6 py-3">
//                     <Checkbox
//                       checked={selectedProspects.has(prospect.id)}
//                       onCheckedChange={() => handleSelectProspect(prospect.id)}
//                     />
//                   </td>
//                   <td className="px-3 py-3">
//                     <div className="flex items-center gap-3">
//                       <Avatar className="h-8 w-8">
//                         <AvatarImage src={prospect.imageUrl || undefined} />
//                         <AvatarFallback className="text-xs">
//                           {prospect.firstName[0]}
//                           {prospect.lastName[0]}
//                         </AvatarFallback>
//                       </Avatar>
//                       <div>
//                         <p className="text-sm font-medium text-foreground">
//                           {prospect.firstName} {prospect.lastName}
//                         </p>
//                         <p className="text-xs text-muted-foreground">
//                           {prospect.jobTitle} at {prospect.company}
//                         </p>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-3 py-3">
//                     <Badge variant="secondary" className={cn("gap-1", statusConfig.className)}>
//                       <StatusIcon className={cn("h-3 w-3", statusConfig.iconClassName)} />
//                       {statusConfig.label}
//                     </Badge>
//                   </td>
//                   <td className="px-3 py-3">
//                     <div className="flex items-center gap-2">
//                       <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
//                         {prospect.currentStep}
//                       </div>
//                       <span className="text-sm text-muted-foreground">of {sequence.totalSteps}</span>
//                     </div>
//                   </td>
//                   <td className="px-3 py-3 text-sm text-muted-foreground">{formatDate(prospect.enrolledAt)}</td>
//                   <td className="px-3 py-3 text-sm text-muted-foreground">
//                     {prospect.nextStepAt ? formatDate(prospect.nextStepAt) : "-"}
//                   </td>
//                   <td className="px-3 py-3">
//                     <div className="flex items-center gap-1">
//                       <Mail className="h-3.5 w-3.5 text-muted-foreground" />
//                       <span className="text-sm">{prospect.emailsOpened}</span>
//                     </div>
//                   </td>
//                   <td className="px-3 py-3">
//                     <DropdownMenu>
//                       <DropdownMenuTrigger asChild>
//                         <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
//                           <MoreHorizontal className="h-4 w-4" />
//                         </Button>
//                       </DropdownMenuTrigger>
//                       <DropdownMenuContent align="end">
//                         <DropdownMenuItem onClick={() => handleViewDetails(prospect.prospectId)}>
//                           View details
//                         </DropdownMenuItem>
//                         <DropdownMenuItem>Send manual email</DropdownMenuItem>
//                         <DropdownMenuSeparator />
//                         {prospect.status === "ACTIVE" ? (
//                           <DropdownMenuItem onClick={() => handlePauseEnrollment(prospect.id)}>
//                             Pause enrollment
//                           </DropdownMenuItem>
//                         ) : prospect.status === "PAUSED" ? (
//                           <DropdownMenuItem onClick={() => handleResumeEnrollment(prospect.id)}>
//                             Resume enrollment
//                           </DropdownMenuItem>
//                         ) : null}
//                         <DropdownMenuItem>Move to step...</DropdownMenuItem>
//                         <DropdownMenuSeparator />
//                         <DropdownMenuItem
//                           className="text-destructive focus:text-destructive"
//                           onClick={() => handleRemoveEnrollment(prospect.id)}
//                         >
//                           Remove from sequence
//                         </DropdownMenuItem>
//                       </DropdownMenuContent>
//                     </DropdownMenu>
//                   </td>
//                 </tr>
//               )
//             })}
//           </tbody>
//         </table>

//         {filteredProspects.length === 0 && (
//           <div className="flex flex-col items-center justify-center py-16">
//             <p className="text-sm text-muted-foreground">
//               {prospects.length === 0
//                 ? "No prospects enrolled in this sequence yet"
//                 : "No prospects found matching your filters"}
//             </p>
//             {prospects.length === 0 && (
//               <Button
//                 variant="outline"
//                 size="sm"
//                 className="mt-4 bg-transparent"
//                 onClick={() => setShowAddDialog(true)}
//               >
//                 <Plus className="mr-2 h-4 w-4" />
//                 Add your first prospects
//               </Button>
//             )}
//           </div>
//         )}
//       </div>

//       <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
//         <DialogContent className="sm:max-w-lg">
//           <DialogHeader>
//             <DialogTitle>Add Prospects</DialogTitle>
//             <DialogDescription>Add prospects to this sequence by entering their email addresses.</DialogDescription>
//           </DialogHeader>

//           <div className="space-y-4 py-4">
//             <Tabs defaultValue="single" className="w-full">
//               <TabsList className="grid w-full grid-cols-2">
//                 <TabsTrigger value="single" className="gap-2">
//                   <UserPlus className="h-4 w-4" />
//                   Single
//                 </TabsTrigger>
//                 <TabsTrigger value="bulk" className="gap-2">
//                   <Upload className="h-4 w-4" />
//                   Bulk
//                 </TabsTrigger>
//               </TabsList>

//               <div className="mt-4">
//                 <div className="space-y-2">
//                   <Label>Email address(es)</Label>
//                   <Textarea
//                     placeholder="Enter email addresses (one per line, or comma-separated)"
//                     value={bulkEmails || newProspectEmail}
//                     onChange={(e) => {
//                       if (e.target.value.includes("\n") || e.target.value.includes(",")) {
//                         setBulkEmails(e.target.value)
//                         setNewProspectEmail("")
//                       } else {
//                         setNewProspectEmail(e.target.value)
//                         setBulkEmails("")
//                       }
//                     }}
//                     rows={5}
//                   />
//                   <p className="text-xs text-muted-foreground">
//                     {bulkEmails
//                       ? `${bulkEmails.split(/[\n,;]/).filter((e) => e.trim() && e.includes("@")).length} valid email(s) detected`
//                       : "Enter one or more email addresses"}
//                   </p>
//                 </div>
//               </div>
//             </Tabs>
//           </div>

//           <DialogFooter>
//             <Button variant="outline" onClick={() => setShowAddDialog(false)}>
//               Cancel
//             </Button>
//             <Button onClick={handleAddProspects} disabled={isAddingProspects}>
//               {isAddingProspects ? (
//                 <>
//                   <WaveLoader size="sm" bars={8} gap="tight" />
//                   Adding...
//                 </>
//               ) : (
//                 <>
//                   <Plus className="mr-2 h-4 w-4" />
//                   Add Prospects
//                 </>
//               )}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {selectedProspectId && (
//         <ProspectDetailsDialog
//           prospectId={selectedProspectId}
//           open={showDetailsDialog}
//           onOpenChange={setShowDetailsDialog}
//         />
//       )}
//     </div>
//   )
// }

"use client"

import * as React from "react"
import {
  Users,
  Search,
  MoreHorizontal,
  Pause,
  Play,
  Trash2,
  ArrowUpDown,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronDown,
  RefreshCw,
  UserPlus,
  Eye,
  MessageSquare,
  Zap,
  Building2,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import type { Sequence } from "@/lib/types/sequence"
import {
  getSequenceEnrollments,
  pauseEnrollment,
  resumeEnrollment,
  removeEnrollment,
} from "@/lib/actions/sequence-actions"
import { WaveLoader } from "@/components/loader/wave-loader"

interface SequenceProspectsPanelProps {
  sequence: Sequence
  userId: string
}

interface EnrollmentWithProspect {
  id: string
  prospectId: string
  status: "ACTIVE" | "PAUSED" | "COMPLETED" | "EXITED" | "BOUNCED" | "REPLIED"
  currentStepIndex: number
  enrolledAt: Date
  completedAt: Date | null
  lastActivityAt: Date | null
  prospect: {
    id: string
    firstName: string | null
    lastName: string | null
    email: string
    company: string | null
    title: string | null
    avatarUrl: string | null
    linkedinUrl: string | null
  }
  stats?: {
    emailsSent: number
    emailsOpened: number
    linksClicked: number
  }
}

type FilterStatus = "ALL" | "ACTIVE" | "PAUSED" | "COMPLETED" | "REPLIED" | "BOUNCED"

const STATUS_CONFIG: Record<string, { label: string; icon: React.ElementType; className: string; bgClass: string }> = {
  ACTIVE: {
    label: "Active",
    icon: Zap,
    className: "text-emerald-600",
    bgClass: "bg-emerald-500/10 border-emerald-500/20",
  },
  PAUSED: {
    label: "Paused",
    icon: Pause,
    className: "text-amber-600",
    bgClass: "bg-amber-500/10 border-amber-500/20",
  },
  COMPLETED: {
    label: "Completed",
    icon: CheckCircle2,
    className: "text-blue-600",
    bgClass: "bg-blue-500/10 border-blue-500/20",
  },
  REPLIED: {
    label: "Replied",
    icon: MessageSquare,
    className: "text-purple-600",
    bgClass: "bg-purple-500/10 border-purple-500/20",
  },
  BOUNCED: {
    label: "Bounced",
    icon: XCircle,
    className: "text-red-600",
    bgClass: "bg-red-500/10 border-red-500/20",
  },
  EXITED: {
    label: "Exited",
    icon: AlertCircle,
    className: "text-gray-600",
    bgClass: "bg-gray-500/10 border-gray-500/20",
  },
}

export function SequenceProspectsPanel({ sequence, userId }: SequenceProspectsPanelProps) {
  const { toast } = useToast()
  const [enrollments, setEnrollments] = React.useState<EnrollmentWithProspect[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [filterStatus, setFilterStatus] = React.useState<FilterStatus>("ALL")
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set())
  const [sortBy, setSortBy] = React.useState<"recent" | "name" | "step">("recent")
  const [selectedProspect, setSelectedProspect] = React.useState<EnrollmentWithProspect | null>(null)
  const [showRemoveConfirm, setShowRemoveConfirm] = React.useState(false)
  const [actionLoading, setActionLoading] = React.useState<string | null>(null)

  const fetchEnrollments = React.useCallback(async () => {
    try {
      const data = await getSequenceEnrollments(sequence.id, userId)
      setEnrollments(data || [])
    } catch (error) {
      console.error("Failed to fetch enrollments:", error)
      toast({
        title: "Error",
        description: "Failed to load prospects",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [sequence.id, userId, toast])

  React.useEffect(() => {
    fetchEnrollments()
  }, [fetchEnrollments])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchEnrollments()
  }

  const handlePause = async (enrollmentId: string) => {
    setActionLoading(enrollmentId)
    try {
      await pauseEnrollment(enrollmentId, userId)
      setEnrollments((prev) => prev.map((e) => (e.id === enrollmentId ? { ...e, status: "PAUSED" as const } : e)))
      toast({ title: "Enrollment paused" })
    } catch (error) {
      toast({ title: "Error", description: "Failed to pause enrollment", variant: "destructive" })
    } finally {
      setActionLoading(null)
    }
  }

  const handleResume = async (enrollmentId: string) => {
    setActionLoading(enrollmentId)
    try {
      await resumeEnrollment(enrollmentId, userId)
      setEnrollments((prev) => prev.map((e) => (e.id === enrollmentId ? { ...e, status: "ACTIVE" as const } : e)))
      toast({ title: "Enrollment resumed" })
    } catch (error) {
      toast({ title: "Error", description: "Failed to resume enrollment", variant: "destructive" })
    } finally {
      setActionLoading(null)
    }
  }

  const handleRemove = async (enrollmentId: string) => {
    setActionLoading(enrollmentId)
    try {
      await removeEnrollment(enrollmentId, userId)
      setEnrollments((prev) => prev.filter((e) => e.id !== enrollmentId))
      toast({ title: "Prospect removed from sequence" })
      setShowRemoveConfirm(false)
      setSelectedProspect(null)
    } catch (error) {
      toast({ title: "Error", description: "Failed to remove prospect", variant: "destructive" })
    } finally {
      setActionLoading(null)
    }
  }

  const handleBulkPause = async () => {
    for (const id of selectedIds) {
      const enrollment = enrollments.find((e) => e.id === id)
      if (enrollment?.status === "ACTIVE") {
        await handlePause(id)
      }
    }
    setSelectedIds(new Set())
  }

  const handleBulkResume = async () => {
    for (const id of selectedIds) {
      const enrollment = enrollments.find((e) => e.id === id)
      if (enrollment?.status === "PAUSED") {
        await handleResume(id)
      }
    }
    setSelectedIds(new Set())
  }

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredEnrollments.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredEnrollments.map((e) => e.id)))
    }
  }

  const filteredEnrollments = React.useMemo(() => {
    let result = enrollments

    // Filter by status
    if (filterStatus !== "ALL") {
      result = result.filter((e) => e.status === filterStatus)
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (e) =>
          e.prospect.email.toLowerCase().includes(query) ||
          e.prospect.firstName?.toLowerCase().includes(query) ||
          e.prospect.lastName?.toLowerCase().includes(query) ||
          e.prospect.company?.toLowerCase().includes(query),
      )
    }

    // Sort
    result = [...result].sort((a, b) => {
      if (sortBy === "recent") {
        return new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime()
      }
      if (sortBy === "name") {
        const nameA = `${a.prospect.firstName || ""} ${a.prospect.lastName || ""}`.trim()
        const nameB = `${b.prospect.firstName || ""} ${b.prospect.lastName || ""}`.trim()
        return nameA.localeCompare(nameB)
      }
      if (sortBy === "step") {
        return b.currentStepIndex - a.currentStepIndex
      }
      return 0
    })

    return result
  }, [enrollments, filterStatus, searchQuery, sortBy])

  const statusCounts = React.useMemo(() => {
    const counts: Record<string, number> = { ALL: enrollments.length }
    for (const e of enrollments) {
      counts[e.status] = (counts[e.status] || 0) + 1
    }
    return counts
  }, [enrollments])

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-9 w-24" />
        </div>
        <Skeleton className="h-10 w-full" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="relative overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5" />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 border-b">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Prospects</h2>
              <p className="text-sm text-muted-foreground">{enrollments.length} enrolled in sequence</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="gap-2 bg-transparent"
            >
              {isRefreshing ? <WaveLoader size="sm" bars={8} gap="tight" /> : <RefreshCw className="h-4 w-4" />}
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button size="sm" className="gap-2 shadow-sm">
              <UserPlus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Prospects</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="shrink-0 p-4 sm:p-5 space-y-4 border-b">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10"
          />
        </div>

        {/* Status tabs */}
        <Tabs value={filterStatus} onValueChange={(v) => setFilterStatus(v as FilterStatus)} className="w-full">
          <TabsList className="w-full h-auto flex-wrap justify-start gap-1 bg-transparent p-0">
            {(["ALL", "ACTIVE", "PAUSED", "COMPLETED", "REPLIED", "BOUNCED"] as const).map((status) => {
              const count = statusCounts[status] || 0
              const config = status === "ALL" ? null : STATUS_CONFIG[status]
              return (
                <TabsTrigger
                  key={status}
                  value={status}
                  className={cn(
                    "h-8 px-3 gap-1.5 rounded-full border data-[state=active]:border-primary/30 data-[state=active]:bg-primary/5",
                    "data-[state=inactive]:border-transparent data-[state=inactive]:bg-muted/50",
                  )}
                >
                  {config && <config.icon className={cn("h-3 w-3", config.className)} />}
                  <span className="text-xs font-medium">{status === "ALL" ? "All" : config?.label}</span>
                  <Badge variant="secondary" className="h-5 px-1.5 text-[10px] font-semibold">
                    {count}
                  </Badge>
                </TabsTrigger>
              )
            })}
          </TabsList>
        </Tabs>

        {/* Actions row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {selectedIds.size > 0 && (
              <>
                <Badge variant="secondary" className="gap-1">
                  {selectedIds.size} selected
                </Badge>
                <Button variant="outline" size="sm" onClick={handleBulkPause} className="h-8 gap-1.5 bg-transparent">
                  <Pause className="h-3 w-3" />
                  <span className="hidden sm:inline">Pause</span>
                </Button>
                <Button variant="outline" size="sm" onClick={handleBulkResume} className="h-8 gap-1.5 bg-transparent">
                  <Play className="h-3 w-3" />
                  <span className="hidden sm:inline">Resume</span>
                </Button>
              </>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1.5 bg-transparent">
                <ArrowUpDown className="h-3 w-3" />
                Sort
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuCheckboxItem checked={sortBy === "recent"} onCheckedChange={() => setSortBy("recent")}>
                Most recent
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={sortBy === "name"} onCheckedChange={() => setSortBy("name")}>
                Name A-Z
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={sortBy === "step"} onCheckedChange={() => setSortBy("step")}>
                Furthest step
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Prospects List */}
      <ScrollArea className="flex-1">
        <div className="p-4 sm:p-5 space-y-2">
          {filteredEnrollments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
                <Users className="h-7 w-7 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-1">No prospects found</h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                {searchQuery
                  ? "Try adjusting your search or filters"
                  : "Add prospects to this sequence to start engaging"}
              </p>
            </div>
          ) : (
            <>
              {/* Select all header */}
              <div className="flex items-center gap-3 px-3 py-2">
                <Checkbox
                  checked={selectedIds.size === filteredEnrollments.length && filteredEnrollments.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
                <span className="text-xs text-muted-foreground">Select all</span>
              </div>

              {filteredEnrollments.map((enrollment) => {
                const config = STATUS_CONFIG[enrollment.status]
                const Icon = config?.icon || AlertCircle
                const fullName =
                  `${enrollment.prospect.firstName || ""} ${enrollment.prospect.lastName || ""}`.trim() ||
                  enrollment.prospect.email
                const initials = fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)

                return (
                  <Card
                    key={enrollment.id}
                    className={cn(
                      "group transition-all cursor-pointer hover:shadow-md",
                      selectedIds.has(enrollment.id) && "ring-2 ring-primary/30 bg-primary/5",
                    )}
                    onClick={() => setSelectedProspect(enrollment)}
                  >
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex items-center gap-3 shrink-0">
                          <Checkbox
                            checked={selectedIds.has(enrollment.id)}
                            onCheckedChange={() => toggleSelect(enrollment.id)}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <Avatar className="h-10 w-10 ring-2 ring-background">
                            <AvatarImage src={enrollment.prospect.avatarUrl || undefined} alt={fullName} />
                            <AvatarFallback className="text-xs font-medium bg-primary/10 text-primary">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="font-semibold text-sm truncate">{fullName}</p>
                              <p className="text-xs text-muted-foreground truncate">{enrollment.prospect.email}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <Badge
                                variant="outline"
                                className={cn("text-[10px] font-medium border", config?.bgClass)}
                              >
                                <Icon className={cn("h-3 w-3 mr-1", config?.className)} />
                                {config?.label}
                              </Badge>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setSelectedProspect(enrollment)
                                    }}
                                  >
                                    <Eye className="mr-2 h-4 w-4" />
                                    View details
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  {enrollment.status === "ACTIVE" ? (
                                    <DropdownMenuItem
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handlePause(enrollment.id)
                                      }}
                                    >
                                      <Pause className="mr-2 h-4 w-4" />
                                      Pause enrollment
                                    </DropdownMenuItem>
                                  ) : enrollment.status === "PAUSED" ? (
                                    <DropdownMenuItem
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleResume(enrollment.id)
                                      }}
                                    >
                                      <Play className="mr-2 h-4 w-4" />
                                      Resume enrollment
                                    </DropdownMenuItem>
                                  ) : null}
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-destructive focus:text-destructive"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setSelectedProspect(enrollment)
                                      setShowRemoveConfirm(true)
                                    }}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Remove from sequence
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            {enrollment.prospect.company && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Building2 className="h-3 w-3" />
                                <span className="truncate max-w-[120px]">{enrollment.prospect.company}</span>
                              </div>
                            )}
                            <Badge variant="secondary" className="text-[10px] font-medium">
                              Step {enrollment.currentStepIndex + 1}
                            </Badge>
                            <span className="text-[10px] text-muted-foreground">
                              {new Date(enrollment.enrolledAt).toLocaleDateString()}
                            </span>
                          </div>

                          {enrollment.stats && (
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span>{enrollment.stats.emailsSent} sent</span>
                              <span>{enrollment.stats.emailsOpened} opened</span>
                              <span>{enrollment.stats.linksClicked} clicked</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </>
          )}
        </div>
      </ScrollArea>

      {/* Prospect Detail Dialog */}
      <Dialog open={!!selectedProspect && !showRemoveConfirm} onOpenChange={() => setSelectedProspect(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Prospect Details</DialogTitle>
          </DialogHeader>
          {selectedProspect && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14 ring-2 ring-primary/20">
                  <AvatarImage src={selectedProspect.prospect.avatarUrl || undefined} />
                  <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">
                    {`${selectedProspect.prospect.firstName?.[0] || ""}${selectedProspect.prospect.lastName?.[0] || ""}`.toUpperCase() ||
                      selectedProspect.prospect.email[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-lg">
                    {selectedProspect.prospect.firstName} {selectedProspect.prospect.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">{selectedProspect.prospect.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-muted/50 border">
                  <p className="text-xs text-muted-foreground mb-1">Company</p>
                  <p className="font-medium text-sm">{selectedProspect.prospect.company || "—"}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50 border">
                  <p className="text-xs text-muted-foreground mb-1">Title</p>
                  <p className="font-medium text-sm">{selectedProspect.prospect.title || "—"}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50 border">
                  <p className="text-xs text-muted-foreground mb-1">Status</p>
                  <Badge variant="outline" className={STATUS_CONFIG[selectedProspect.status]?.bgClass}>
                    {STATUS_CONFIG[selectedProspect.status]?.label}
                  </Badge>
                </div>
                <div className="p-3 rounded-lg bg-muted/50 border">
                  <p className="text-xs text-muted-foreground mb-1">Current Step</p>
                  <p className="font-medium text-sm">Step {selectedProspect.currentStepIndex + 1}</p>
                </div>
              </div>

              {selectedProspect.prospect.linkedinUrl && (
                <Button variant="outline" className="w-full gap-2 bg-transparent" asChild>
                  <a href={selectedProspect.prospect.linkedinUrl} target="_blank" rel="noopener noreferrer">
                    View LinkedIn Profile
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              )}

              <div className="flex gap-2 pt-2 border-t">
                {selectedProspect.status === "ACTIVE" ? (
                  <Button
                    variant="outline"
                    className="flex-1 gap-2 bg-transparent"
                    onClick={() => handlePause(selectedProspect.id)}
                    disabled={actionLoading === selectedProspect.id}
                  >
                    {actionLoading === selectedProspect.id ? (
                      <WaveLoader size="sm" bars={8} gap="tight" />
                    ) : (
                      <Pause className="h-4 w-4" />
                    )}
                    Pause
                  </Button>
                ) : selectedProspect.status === "PAUSED" ? (
                  <Button
                    variant="outline"
                    className="flex-1 gap-2 bg-transparent"
                    onClick={() => handleResume(selectedProspect.id)}
                    disabled={actionLoading === selectedProspect.id}
                  >
                    {actionLoading === selectedProspect.id ? (
                      <WaveLoader size="sm" bars={8} gap="tight" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                    Resume
                  </Button>
                ) : null}
                <Button variant="destructive" className="flex-1 gap-2" onClick={() => setShowRemoveConfirm(true)}>
                  <Trash2 className="h-4 w-4" />
                  Remove
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Remove Confirmation Dialog */}
      <Dialog open={showRemoveConfirm} onOpenChange={setShowRemoveConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Remove Prospect</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this prospect from the sequence? They will no longer receive emails from
              this sequence.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowRemoveConfirm(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedProspect && handleRemove(selectedProspect.id)}
              disabled={actionLoading === selectedProspect?.id}
            >
              {actionLoading === selectedProspect?.id ? <WaveLoader size="sm" bars={8} gap="tight" /> : "Remove"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
