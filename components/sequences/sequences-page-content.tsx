// "use client"

// import * as React from "react"
// import { useRouter } from "next/navigation"
// import {
//   Plus,
//   Search,
//   LayoutGrid,
//   LayoutList,
//   Play,
//   Pause,
//   Trash2,
//   Archive,
//   ArrowUpDown,
//   Sparkles,
//   Zap,
//   ChevronDown,
//   X,
//   Mail,
//   Users,
//   TrendingUp,
//   Tag,
//   Upload,
//   Loader2,
// } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Badge } from "@/components/ui/badge"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
//   DropdownMenuCheckboxItem,
//   DropdownMenuLabel,
// } from "@/components/ui/dropdown-menu"
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Switch } from "@/components/ui/switch"
// import { cn } from "@/lib/utils"
// import type { Sequence, SequenceStatus } from "@/lib/types/sequence"
// import { SequenceCard } from "@/components/sequences/sequence-card"
// import { SequenceTableRow } from "@/components/sequences/sequence-table-row"
// import { SequenceEmptyState } from "@/components/sequences/sequence-empty-state"
// import {
//   createSequence,
//   bulkUpdateSequenceStatus,
//   bulkArchiveSequences,
//   bulkDeleteSequences,
// } from "@/lib/actions/sequence-actions"
// import { toast } from "sonner"

// type ViewMode = "grid" | "list"
// type SortField = "name" | "created" | "updated" | "enrolled" | "openRate" | "replyRate"
// type SortDirection = "asc" | "desc"

// const STATUS_OPTIONS: { value: SequenceStatus | "all"; label: string }[] = [
//   { value: "all", label: "All Sequences" },
//   { value: "ACTIVE", label: "Active" },
//   { value: "DRAFT", label: "Drafts" },
//   { value: "PAUSED", label: "Paused" },
//   { value: "COMPLETED", label: "Completed" },
//   { value: "ARCHIVED", label: "Archived" },
// ]

// interface SequencesPageContentProps {
//   initialSequences: Sequence[]
//   allTags: string[]
//   userId: string
// }

// export function SequencesPageContent({ initialSequences, allTags, userId }: SequencesPageContentProps) {
//   const router = useRouter()
//   const [sequences, setSequences] = React.useState<Sequence[]>(initialSequences)
//   const [viewMode, setViewMode] = React.useState<ViewMode>("grid")
//   const [searchQuery, setSearchQuery] = React.useState("")
//   const [statusFilter, setStatusFilter] = React.useState<SequenceStatus | "all">("all")
//   const [sortField, setSortField] = React.useState<SortField>("updated")
//   const [sortDirection, setSortDirection] = React.useState<SortDirection>("desc")
//   const [selectedSequences, setSelectedSequences] = React.useState<Set<string>>(new Set())
//   const [showNewSequenceDialog, setShowNewSequenceDialog] = React.useState(false)
//   const [tagFilter, setTagFilter] = React.useState<string[]>([])
//   const [isCreating, setIsCreating] = React.useState(false)
//   const [isBulkLoading, setIsBulkLoading] = React.useState(false)
//   const [newSequence, setNewSequence] = React.useState({
//     name: "",
//     description: "",
//     useAI: false,
//   })

//   React.useEffect(() => {
//     setSequences(initialSequences)
//   }, [initialSequences])

//   // Filter and sort sequences
//   const filteredSequences = React.useMemo(() => {
//     let result = [...sequences]

//     // Search filter
//     if (searchQuery) {
//       const query = searchQuery.toLowerCase()
//       result = result.filter(
//         (seq) =>
//           seq.name.toLowerCase().includes(query) ||
//           seq.description?.toLowerCase().includes(query) ||
//           seq.tags.some((tag) => tag.toLowerCase().includes(query)),
//       )
//     }

//     // Status filter
//     if (statusFilter !== "all") {
//       result = result.filter((seq) => seq.status === statusFilter)
//     }

//     // Tag filter
//     if (tagFilter.length > 0) {
//       result = result.filter((seq) => tagFilter.some((tag) => seq.tags.includes(tag)))
//     }

//     // Sort
//     result.sort((a, b) => {
//       let comparison = 0
//       switch (sortField) {
//         case "name":
//           comparison = a.name.localeCompare(b.name)
//           break
//         case "created":
//           comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
//           break
//         case "updated":
//           comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
//           break
//         case "enrolled":
//           comparison = a.totalEnrolled - b.totalEnrolled
//           break
//         case "openRate":
//           comparison = (a.avgOpenRate ?? 0) - (b.avgOpenRate ?? 0)
//           break
//         case "replyRate":
//           comparison = (a.avgReplyRate ?? 0) - (b.avgReplyRate ?? 0)
//           break
//       }
//       return sortDirection === "desc" ? -comparison : comparison
//     })

//     return result
//   }, [sequences, searchQuery, statusFilter, tagFilter, sortField, sortDirection])

//   // Stats calculation
//   const stats = React.useMemo(() => {
//     const active = sequences.filter((s) => s.status === "ACTIVE").length
//     const totalEnrolled = sequences.reduce((sum, s) => sum + s.totalEnrolled, 0)
//     const seqsWithOpenRate = sequences.filter((s) => s.avgOpenRate != null)
//     const avgOpenRate =
//       seqsWithOpenRate.length > 0
//         ? seqsWithOpenRate.reduce((sum, s) => sum + (s.avgOpenRate ?? 0), 0) / seqsWithOpenRate.length
//         : 0
//     const seqsWithReplyRate = sequences.filter((s) => s.avgReplyRate != null)
//     const avgReplyRate =
//       seqsWithReplyRate.length > 0
//         ? seqsWithReplyRate.reduce((sum, s) => sum + (s.avgReplyRate ?? 0), 0) / seqsWithReplyRate.length
//         : 0
//     return { active, totalEnrolled, avgOpenRate, avgReplyRate }
//   }, [sequences])

//   const handleSelectAll = () => {
//     if (selectedSequences.size === filteredSequences.length) {
//       setSelectedSequences(new Set())
//     } else {
//       setSelectedSequences(new Set(filteredSequences.map((s) => s.id)))
//     }
//   }

//   const handleSelectSequence = (id: string) => {
//     const newSelected = new Set(selectedSequences)
//     if (newSelected.has(id)) {
//       newSelected.delete(id)
//     } else {
//       newSelected.add(id)
//     }
//     setSelectedSequences(newSelected)
//   }

//   const handleBulkAction = async (action: "pause" | "resume" | "archive" | "delete") => {
//     const ids = Array.from(selectedSequences)
//     if (ids.length === 0) return

//     setIsBulkLoading(true)
//     try {
//       switch (action) {
//         case "pause":
//           await bulkUpdateSequenceStatus(ids, userId, "PAUSED")
//           toast.success(`${ids.length} sequence(s) paused`)
//           break
//         case "resume":
//           await bulkUpdateSequenceStatus(ids, userId, "ACTIVE")
//           toast.success(`${ids.length} sequence(s) activated`)
//           break
//         case "archive":
//           await bulkArchiveSequences(ids, userId)
//           toast.success(`${ids.length} sequence(s) archived`)
//           break
//         case "delete":
//           await bulkDeleteSequences(ids, userId)
//           toast.success(`${ids.length} sequence(s) deleted`)
//           break
//       }
//       setSelectedSequences(new Set())
//       router.refresh()
//     } catch (error) {
//       toast.error("Failed to perform action")
//       console.error(error)
//     } finally {
//       setIsBulkLoading(false)
//     }
//   }

//   const handleCreateSequence = async () => {
//     if (!newSequence.name.trim()) {
//       toast.error("Please enter a sequence name")
//       return
//     }

//     setIsCreating(true)
//     try {
//       const created = await createSequence(userId, {
//         name: newSequence.name,
//         description: newSequence.description || undefined,
//         useAI: newSequence.useAI,
//       })

//       toast.success("Sequence created!")
//       setShowNewSequenceDialog(false)
//       setNewSequence({ name: "", description: "", useAI: false })

//       // Navigate to the new sequence builder
//       router.push(`dashboard/sequences/${created.id}`)
//     } catch (error) {
//       toast.error("Failed to create sequence")
//       console.error(error)
//     } finally {
//       setIsCreating(false)
//     }
//   }

//   const handleSequenceUpdated = (updatedSequence: Sequence) => {
//     setSequences((prev) => prev.map((seq) => (seq.id === updatedSequence.id ? updatedSequence : seq)))
//   }

//   const handleSequenceDeleted = (sequenceId: string) => {
//     setSequences((prev) => prev.filter((seq) => seq.id !== sequenceId))
//     setSelectedSequences((prev) => {
//       const newSet = new Set(prev)
//       newSet.delete(sequenceId)
//       return newSet
//     })
//   }

//   const toggleSort = (field: SortField) => {
//     if (sortField === field) {
//       setSortDirection(sortDirection === "asc" ? "desc" : "asc")
//     } else {
//       setSortField(field)
//       setSortDirection("desc")
//     }
//   }

//   return (
//     <TooltipProvider>
//       <div className="flex h-full flex-col">
//         {/* Header */}
//         <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//           <div className="px-6 py-4">
//             {/* Title and main actions */}
//             <div className="flex items-center justify-between">
//               <div>
//                 <h1 className="text-2xl font-semibold tracking-tight text-foreground">Sequences</h1>
//                 <p className="mt-1 text-sm text-muted-foreground">Create and manage automated email sequences</p>
//               </div>
//               <div className="flex items-center gap-3">
//                 <Button variant="outline" size="sm" className="gap-2 bg-transparent">
//                   <Upload className="h-4 w-4" />
//                   Import
//                 </Button>
//                 <Button onClick={() => setShowNewSequenceDialog(true)} size="sm" className="gap-2">
//                   <Plus className="h-4 w-4" />
//                   New Sequence
//                 </Button>
//               </div>
//             </div>

//             {/* Stats bar */}
//             <div className="mt-4 flex items-center gap-6">
//               <div className="flex items-center gap-2">
//                 <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
//                   <Zap className="h-4 w-4 text-primary" />
//                 </div>
//                 <div>
//                   <p className="text-xs text-muted-foreground">Active</p>
//                   <p className="text-sm font-semibold text-foreground">{stats.active}</p>
//                 </div>
//               </div>
//               <div className="h-8 w-px bg-border" />
//               <div className="flex items-center gap-2">
//                 <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
//                   <Users className="h-4 w-4 text-muted-foreground" />
//                 </div>
//                 <div>
//                   <p className="text-xs text-muted-foreground">Enrolled</p>
//                   <p className="text-sm font-semibold text-foreground">{stats.totalEnrolled.toLocaleString()}</p>
//                 </div>
//               </div>
//               <div className="h-8 w-px bg-border" />
//               <div className="flex items-center gap-2">
//                 <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
//                   <Mail className="h-4 w-4 text-muted-foreground" />
//                 </div>
//                 <div>
//                   <p className="text-xs text-muted-foreground">Avg. Open Rate</p>
//                   <p className="text-sm font-semibold text-foreground">{stats.avgOpenRate.toFixed(1)}%</p>
//                 </div>
//               </div>
//               <div className="h-8 w-px bg-border" />
//               <div className="flex items-center gap-2">
//                 <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
//                   <TrendingUp className="h-4 w-4 text-muted-foreground" />
//                 </div>
//                 <div>
//                   <p className="text-xs text-muted-foreground">Avg. Reply Rate</p>
//                   <p className="text-sm font-semibold text-foreground">{stats.avgReplyRate.toFixed(1)}%</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Filters bar */}
//           <div className="flex items-center justify-between border-t border-border px-6 py-3">
//             <div className="flex items-center gap-3">
//               {/* Status tabs */}
//               <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as SequenceStatus | "all")}>
//                 <TabsList className="h-8">
//                   {STATUS_OPTIONS.map((option) => (
//                     <TabsTrigger key={option.value} value={option.value} className="h-7 px-3 text-xs">
//                       {option.label}
//                       {option.value !== "all" && (
//                         <Badge variant="secondary" className="ml-1.5 h-4 px-1 text-[10px]">
//                           {sequences.filter((s) => s.status === option.value).length}
//                         </Badge>
//                       )}
//                     </TabsTrigger>
//                   ))}
//                 </TabsList>
//               </Tabs>

//               {/* Tag filter */}
//               {tagFilter.length > 0 && (
//                 <div className="flex items-center gap-1">
//                   {tagFilter.map((tag) => (
//                     <Badge key={tag} variant="secondary" className="gap-1 pl-2 pr-1">
//                       {tag}
//                       <button
//                         onClick={() => setTagFilter(tagFilter.filter((t) => t !== tag))}
//                         className="ml-0.5 rounded-full p-0.5 hover:bg-muted-foreground/20"
//                       >
//                         <X className="h-3 w-3" />
//                       </button>
//                     </Badge>
//                   ))}
//                   <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => setTagFilter([])}>
//                     Clear
//                   </Button>
//                 </div>
//               )}
//             </div>

//             <div className="flex items-center gap-2">
//               {/* Search */}
//               <div className="relative">
//                 <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//                 <Input
//                   placeholder="Search sequences..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="h-8 w-64 pl-8 text-sm"
//                 />
//               </div>

//               {/* Advanced filters */}
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button variant="outline" size="sm" className="h-8 gap-2 bg-transparent">
//                     <Tag className="h-3.5 w-3.5" />
//                     Tags
//                     <ChevronDown className="h-3 w-3" />
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end" className="w-48">
//                   <DropdownMenuLabel>Filter by tag</DropdownMenuLabel>
//                   <DropdownMenuSeparator />
//                   {allTags.length === 0 ? (
//                     <div className="px-2 py-1.5 text-xs text-muted-foreground">No tags yet</div>
//                   ) : (
//                     allTags.map((tag) => (
//                       <DropdownMenuCheckboxItem
//                         key={tag}
//                         checked={tagFilter.includes(tag)}
//                         onCheckedChange={(checked) => {
//                           if (checked) {
//                             setTagFilter([...tagFilter, tag])
//                           } else {
//                             setTagFilter(tagFilter.filter((t) => t !== tag))
//                           }
//                         }}
//                       >
//                         {tag}
//                       </DropdownMenuCheckboxItem>
//                     ))
//                   )}
//                 </DropdownMenuContent>
//               </DropdownMenu>

//               {/* Sort */}
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button variant="outline" size="sm" className="h-8 gap-2 bg-transparent">
//                     <ArrowUpDown className="h-3.5 w-3.5" />
//                     Sort
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end" className="w-48">
//                   <DropdownMenuLabel>Sort by</DropdownMenuLabel>
//                   <DropdownMenuSeparator />
//                   {[
//                     { field: "updated" as SortField, label: "Last updated" },
//                     { field: "created" as SortField, label: "Date created" },
//                     { field: "name" as SortField, label: "Name" },
//                     { field: "enrolled" as SortField, label: "Enrolled" },
//                     { field: "openRate" as SortField, label: "Open rate" },
//                     { field: "replyRate" as SortField, label: "Reply rate" },
//                   ].map((option) => (
//                     <DropdownMenuCheckboxItem
//                       key={option.field}
//                       checked={sortField === option.field}
//                       onCheckedChange={() => toggleSort(option.field)}
//                     >
//                       {option.label}
//                       {sortField === option.field && (
//                         <span className="ml-auto text-xs text-muted-foreground">
//                           {sortDirection === "asc" ? "A-Z" : "Z-A"}
//                         </span>
//                       )}
//                     </DropdownMenuCheckboxItem>
//                   ))}
//                 </DropdownMenuContent>
//               </DropdownMenu>

//               {/* View toggle */}
//               <div className="flex items-center rounded-md border border-input bg-background p-0.5">
//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <button
//                       onClick={() => setViewMode("grid")}
//                       className={cn(
//                         "rounded-sm p-1.5 transition-colors",
//                         viewMode === "grid"
//                           ? "bg-secondary text-foreground"
//                           : "text-muted-foreground hover:text-foreground",
//                       )}
//                     >
//                       <LayoutGrid className="h-4 w-4" />
//                     </button>
//                   </TooltipTrigger>
//                   <TooltipContent>Grid view</TooltipContent>
//                 </Tooltip>
//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <button
//                       onClick={() => setViewMode("list")}
//                       className={cn(
//                         "rounded-sm p-1.5 transition-colors",
//                         viewMode === "list"
//                           ? "bg-secondary text-foreground"
//                           : "text-muted-foreground hover:text-foreground",
//                       )}
//                     >
//                       <LayoutList className="h-4 w-4" />
//                     </button>
//                   </TooltipTrigger>
//                   <TooltipContent>List view</TooltipContent>
//                 </Tooltip>
//               </div>
//             </div>
//           </div>

//           {/* Bulk actions bar */}
//           {selectedSequences.size > 0 && (
//             <div className="flex items-center justify-between border-t border-border bg-secondary/50 px-6 py-2">
//               <div className="flex items-center gap-2">
//                 <Checkbox
//                   checked={selectedSequences.size === filteredSequences.length}
//                   onCheckedChange={handleSelectAll}
//                 />
//                 <span className="text-sm text-muted-foreground">{selectedSequences.size} selected</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Button variant="outline" size="sm" onClick={() => handleBulkAction("pause")} disabled={isBulkLoading}>
//                   {isBulkLoading ? (
//                     <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
//                   ) : (
//                     <Pause className="mr-1.5 h-3.5 w-3.5" />
//                   )}
//                   Pause
//                 </Button>
//                 <Button variant="outline" size="sm" onClick={() => handleBulkAction("resume")} disabled={isBulkLoading}>
//                   {isBulkLoading ? (
//                     <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
//                   ) : (
//                     <Play className="mr-1.5 h-3.5 w-3.5" />
//                   )}
//                   Resume
//                 </Button>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => handleBulkAction("archive")}
//                   disabled={isBulkLoading}
//                 >
//                   {isBulkLoading ? (
//                     <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
//                   ) : (
//                     <Archive className="mr-1.5 h-3.5 w-3.5" />
//                   )}
//                   Archive
//                 </Button>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   className="text-destructive hover:bg-destructive hover:text-destructive-foreground bg-transparent"
//                   onClick={() => handleBulkAction("delete")}
//                   disabled={isBulkLoading}
//                 >
//                   {isBulkLoading ? (
//                     <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
//                   ) : (
//                     <Trash2 className="mr-1.5 h-3.5 w-3.5" />
//                   )}
//                   Delete
//                 </Button>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Content */}
//         <div className="flex-1 overflow-auto p-6">
//           {filteredSequences.length === 0 ? (
//             <SequenceEmptyState
//               hasSequences={sequences.length > 0}
//               onCreateSequence={() => setShowNewSequenceDialog(true)}
//             />
//           ) : viewMode === "grid" ? (
//             <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//               {filteredSequences.map((sequence) => (
//                 <SequenceCard
//                   key={sequence.id}
//                   sequence={sequence}
//                   userId={userId}
//                   isSelected={selectedSequences.has(sequence.id)}
//                   onSelect={() => handleSelectSequence(sequence.id)}
//                   onEdit={() => router.push(`dashboard/sequences/${sequence.id}`)}
//                   onUpdated={handleSequenceUpdated}
//                   onDeleted={() => handleSequenceDeleted(sequence.id)}
//                 />
//               ))}
//             </div>
//           ) : (
//             <div className="rounded-lg border border-border bg-card">
//               {/* Table header */}
//               <div className="grid grid-cols-[auto_1fr_120px_120px_100px_100px_100px_48px] items-center gap-4 border-b border-border px-4 py-3 text-xs font-medium text-muted-foreground">
//                 <Checkbox
//                   checked={selectedSequences.size === filteredSequences.length && filteredSequences.length > 0}
//                   onCheckedChange={handleSelectAll}
//                 />
//                 <button onClick={() => toggleSort("name")} className="flex items-center gap-1 hover:text-foreground">
//                   Name
//                   {sortField === "name" && <ArrowUpDown className="h-3 w-3" />}
//                 </button>
//                 <span>Status</span>
//                 <button
//                   onClick={() => toggleSort("enrolled")}
//                   className="flex items-center gap-1 hover:text-foreground"
//                 >
//                   Enrolled
//                   {sortField === "enrolled" && <ArrowUpDown className="h-3 w-3" />}
//                 </button>
//                 <button
//                   onClick={() => toggleSort("openRate")}
//                   className="flex items-center gap-1 hover:text-foreground"
//                 >
//                   Open Rate
//                   {sortField === "openRate" && <ArrowUpDown className="h-3 w-3" />}
//                 </button>
//                 <button
//                   onClick={() => toggleSort("replyRate")}
//                   className="flex items-center gap-1 hover:text-foreground"
//                 >
//                   Reply Rate
//                   {sortField === "replyRate" && <ArrowUpDown className="h-3 w-3" />}
//                 </button>
//                 <button onClick={() => toggleSort("updated")} className="flex items-center gap-1 hover:text-foreground">
//                   Updated
//                   {sortField === "updated" && <ArrowUpDown className="h-3 w-3" />}
//                 </button>
//                 <span />
//               </div>
//               {/* Table rows */}
//               <div className="divide-y divide-border">
//                 {filteredSequences.map((sequence) => (
//                   <SequenceTableRow
//                     key={sequence.id}
//                     sequence={sequence}
//                     userId={userId}
//                     isSelected={selectedSequences.has(sequence.id)}
//                     onSelect={() => handleSelectSequence(sequence.id)}
//                     onEdit={() => router.push(`dashboard/sequences/${sequence.id}`)}
//                     onUpdated={handleSequenceUpdated}
//                     onDeleted={() => handleSequenceDeleted(sequence.id)}
//                   />
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* New Sequence Dialog */}
//         <Dialog open={showNewSequenceDialog} onOpenChange={setShowNewSequenceDialog}>
//           <DialogContent className="sm:max-w-md">
//             <DialogHeader>
//               <DialogTitle>Create New Sequence</DialogTitle>
//               <DialogDescription>
//                 Set up your email sequence with AI assistance or start from scratch.
//               </DialogDescription>
//             </DialogHeader>
//             <div className="space-y-4 py-4">
//               <div className="space-y-2">
//                 <Label htmlFor="name">Sequence Name</Label>
//                 <Input
//                   id="name"
//                   placeholder="e.g., SaaS Decision Makers Outreach"
//                   value={newSequence.name}
//                   onChange={(e) => setNewSequence({ ...newSequence, name: e.target.value })}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="description">Description (optional)</Label>
//                 <Textarea
//                   id="description"
//                   placeholder="Brief description of this sequence..."
//                   value={newSequence.description}
//                   onChange={(e) => setNewSequence({ ...newSequence, description: e.target.value })}
//                   rows={3}
//                 />
//               </div>
//               <div className="flex items-center justify-between rounded-lg border border-border p-4">
//                 <div className="flex items-center gap-3">
//                   <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
//                     <Sparkles className="h-5 w-5 text-primary" />
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium">AI Personalization</p>
//                     <p className="text-xs text-muted-foreground">Generate personalized icebreakers</p>
//                   </div>
//                 </div>
//                 <Switch
//                   checked={newSequence.useAI}
//                   onCheckedChange={(checked) => setNewSequence({ ...newSequence, useAI: checked })}
//                 />
//               </div>
//             </div>
//             <DialogFooter>
//               <Button variant="outline" onClick={() => setShowNewSequenceDialog(false)} disabled={isCreating}>
//                 Cancel
//               </Button>
//               <Button onClick={handleCreateSequence} disabled={isCreating || !newSequence.name.trim()}>
//                 {isCreating ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Creating...
//                   </>
//                 ) : (
//                   "Create Sequence"
//                 )}
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       </div>
//     </TooltipProvider>
//   )
// }

"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  Plus,
  Search,
  LayoutGrid,
  LayoutList,
  Play,
  Pause,
  Trash2,
  Archive,
  ArrowUpDown,
  Zap,
  ChevronDown,
  X,
  Mail,
  Users,
  TrendingUp,
  Tag,
  Upload,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import type { Sequence, SequenceStatus } from "@/lib/types/sequence"
import { SequenceCard } from "@/components/sequences/sequence-card"
import { SequenceTableRow } from "@/components/sequences/sequence-table-row"
import { SequenceEmptyState } from "@/components/sequences/sequence-empty-state"
import {
  createSequence,
  bulkUpdateSequenceStatus,
  bulkArchiveSequences,
  bulkDeleteSequences,
} from "@/lib/actions/sequence-actions"
import { toast } from "sonner"

type ViewMode = "grid" | "list"
type SortField = "name" | "created" | "updated" | "enrolled" | "openRate" | "replyRate"
type SortDirection = "asc" | "desc"
type SortOption = "name" | "createdAt" | "updatedAt" | "totalEnrolled" | "avgOpenRate" | "avgReplyRate"

const STATUS_OPTIONS: { value: SequenceStatus | "all"; label: string }[] = [
  { value: "all", label: "All Sequences" },
  { value: "ACTIVE", label: "Active" },
  { value: "DRAFT", label: "Drafts" },
  { value: "PAUSED", label: "Paused" },
  { value: "COMPLETED", label: "Completed" },
  { value: "ARCHIVED", label: "Archived" },
]

interface SequencesPageContentProps {
  initialSequences: Sequence[]
  allTags: string[]
  userId: string
}

export function SequencesPageContent({ initialSequences, allTags, userId }: SequencesPageContentProps) {
  const router = useRouter()
  const [sequences, setSequences] = React.useState<Sequence[]>(initialSequences)
  const [view, setView] = React.useState<"grid" | "list">("grid")
  const [statusFilter, setStatusFilter] = React.useState<"all" | SequenceStatus>("all")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedTags, setSelectedTags] = React.useState<string[]>([])
  const [sortBy, setSortBy] = React.useState<SortOption>("updatedAt")
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("desc")
  const [selectedSequences, setSelectedSequences] = React.useState<Set<string>>(new Set())
  const [showFilters, setShowFilters] = React.useState(false)
  const [showNewSequenceDialog, setShowNewSequenceDialog] = React.useState(false)
  const [newSequence, setNewSequence] = React.useState({ name: "", description: "" })
  const [isCreating, setIsCreating] = React.useState(false)
  const [isBulkLoading, setIsBulkLoading] = React.useState(false) // Declare isBulkLoading

  React.useEffect(() => {
    setSequences(initialSequences)
  }, [initialSequences])

  // Filter and sort sequences
  const filteredSequences = React.useMemo(() => {
    let result = [...sequences]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (seq) =>
          seq.name.toLowerCase().includes(query) ||
          seq.description?.toLowerCase().includes(query) ||
          seq.tags.some((tag) => tag.toLowerCase().includes(query)),
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((seq) => seq.status === statusFilter)
    }

    // Tag filter
    if (selectedTags.length > 0) {
      result = result.filter((seq) => selectedTags.some((tag) => seq.tags.includes(tag)))
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name)
          break
        case "createdAt":
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
        case "updatedAt":
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
          break
        case "totalEnrolled":
          comparison = a.totalEnrolled - b.totalEnrolled
          break
        case "avgOpenRate":
          comparison = (a.avgOpenRate ?? 0) - (b.avgOpenRate ?? 0)
          break
        case "avgReplyRate":
          comparison = (a.avgReplyRate ?? 0) - (b.avgReplyRate ?? 0)
          break
      }
      return sortOrder === "desc" ? -comparison : comparison
    })

    return result
  }, [sequences, searchQuery, statusFilter, selectedTags, sortBy, sortOrder])

  // Stats calculation
  const stats = React.useMemo(() => {
    const active = sequences.filter((s) => s.status === "ACTIVE").length
    const totalEnrolled = sequences.reduce((sum, s) => sum + s.totalEnrolled, 0)
    const seqsWithOpenRate = sequences.filter((s) => s.avgOpenRate != null)
    const avgOpenRate =
      seqsWithOpenRate.length > 0
        ? seqsWithOpenRate.reduce((sum, s) => sum + (s.avgOpenRate ?? 0), 0) / seqsWithOpenRate.length
        : 0
    const seqsWithReplyRate = sequences.filter((s) => s.avgReplyRate != null)
    const avgReplyRate =
      seqsWithReplyRate.length > 0
        ? seqsWithReplyRate.reduce((sum, s) => sum + (s.avgReplyRate ?? 0), 0) / seqsWithReplyRate.length
        : 0
    return { active, totalEnrolled, avgOpenRate, avgReplyRate }
  }, [sequences])

  const handleSelectAll = () => {
    if (selectedSequences.size === filteredSequences.length) {
      setSelectedSequences(new Set())
    } else {
      setSelectedSequences(new Set(filteredSequences.map((s) => s.id)))
    }
  }

  const handleSelectSequence = (id: string) => {
    const newSelected = new Set(selectedSequences)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedSequences(newSelected)
  }

  const handleBulkAction = async (action: "pause" | "resume" | "archive" | "delete") => {
    const ids = Array.from(selectedSequences)
    if (ids.length === 0) return

    setIsBulkLoading(true)
    try {
      switch (action) {
        case "pause":
          await bulkUpdateSequenceStatus(ids, userId, "PAUSED")
          toast.success(`${ids.length} sequence(s) paused`)
          break
        case "resume":
          await bulkUpdateSequenceStatus(ids, userId, "ACTIVE")
          toast.success(`${ids.length} sequence(s) activated`)
          break
        case "archive":
          await bulkArchiveSequences(ids, userId)
          toast.success(`${ids.length} sequence(s) archived`)
          break
        case "delete":
          await bulkDeleteSequences(ids, userId)
          toast.success(`${ids.length} sequence(s) deleted`)
          break
      }
      setSelectedSequences(new Set())
      router.refresh()
    } catch (error) {
      toast.error("Failed to perform action")
      console.error(error)
    } finally {
      setIsBulkLoading(false)
    }
  }

  const handleCreateSequence = async () => {
    if (!newSequence.name.trim()) {
      toast.error("Please enter a sequence name")
      return
    }

    setIsCreating(true)
    try {
      const created = await createSequence(userId, {
        name: newSequence.name,
        description: newSequence.description || null,
      })

      toast.success("Sequence created!")
      setShowNewSequenceDialog(false)
      setNewSequence({ name: "", description: "" })

      router.push(`/dashboard/sequences/${created.id}`)
    } catch (error) {
      toast.error("Failed to create sequence")
      console.error(error)
    } finally {
      setIsCreating(false)
    }
  }

  const handleSequenceUpdated = (updatedSequence: Sequence) => {
    setSequences((prev) => prev.map((seq) => (seq.id === updatedSequence.id ? updatedSequence : seq)))
  }

  const handleSequenceDeleted = (sequenceId: string) => {
    setSequences((prev) => prev.filter((seq) => seq.id !== sequenceId))
    setSelectedSequences((prev) => {
      const newSet = new Set(prev)
      newSet.delete(sequenceId)
      return newSet
    })
  }

  const toggleSort = (field: SortOption) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("desc")
    }
  }

  return (
    <TooltipProvider>
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="px-6 py-4">
            {/* Title and main actions */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">Sequences</h1>
                <p className="mt-1 text-sm text-muted-foreground">Create and manage automated email sequences</p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Upload className="h-4 w-4" />
                  Import
                </Button>
                <Button onClick={() => setShowNewSequenceDialog(true)} size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  New Sequence
                </Button>
              </div>
            </div>

            {/* Stats bar */}
            <div className="mt-4 flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Zap className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Active</p>
                  <p className="text-sm font-semibold text-foreground">{stats.active}</p>
                </div>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
                  <Users className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Enrolled</p>
                  <p className="text-sm font-semibold text-foreground">{stats.totalEnrolled.toLocaleString()}</p>
                </div>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Avg. Open Rate</p>
                  <p className="text-sm font-semibold text-foreground">{stats.avgOpenRate.toFixed(1)}%</p>
                </div>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Avg. Reply Rate</p>
                  <p className="text-sm font-semibold text-foreground">{stats.avgReplyRate.toFixed(1)}%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters bar */}
          <div className="flex items-center justify-between border-t border-border px-6 py-3">
            <div className="flex items-center gap-3">
              {/* Status tabs */}
              <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as SequenceStatus | "all")}>
                <TabsList className="h-8">
                  {STATUS_OPTIONS.map((option) => (
                    <TabsTrigger key={option.value} value={option.value} className="h-7 px-3 text-xs">
                      {option.label}
                      {option.value !== "all" && (
                        <Badge variant="secondary" className="ml-1.5 h-4 px-1 text-[10px]">
                          {sequences.filter((s) => s.status === option.value).length}
                        </Badge>
                      )}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>

              {/* Tag filter */}
              {selectedTags.length > 0 && (
                <div className="flex items-center gap-1">
                  {selectedTags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1 pl-2 pr-1">
                      {tag}
                      <button
                        onClick={() => setSelectedTags(selectedTags.filter((t) => t !== tag))}
                        className="ml-0.5 rounded-full p-0.5 hover:bg-muted-foreground/20"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => setSelectedTags([])}>
                    Clear
                  </Button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search sequences..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-8 w-64 pl-8 text-sm"
                />
              </div>

              {/* Advanced filters */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 gap-2 bg-transparent">
                    <Tag className="h-3.5 w-3.5" />
                    Tags
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Filter by tag</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {allTags.length === 0 ? (
                    <div className="px-2 py-1.5 text-xs text-muted-foreground">No tags yet</div>
                  ) : (
                    allTags.map((tag) => (
                      <DropdownMenuCheckboxItem
                        key={tag}
                        checked={selectedTags.includes(tag)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedTags([...selectedTags, tag])
                          } else {
                            setSelectedTags(selectedTags.filter((t) => t !== tag))
                          }
                        }}
                      >
                        {tag}
                      </DropdownMenuCheckboxItem>
                    ))
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Sort */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 gap-2 bg-transparent">
                    <ArrowUpDown className="h-3.5 w-3.5" />
                    Sort
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {[
                    { field: "updatedAt" as SortOption, label: "Last updated" },
                    { field: "createdAt" as SortOption, label: "Date created" },
                    { field: "name" as SortOption, label: "Name" },
                    { field: "totalEnrolled" as SortOption, label: "Enrolled" },
                    { field: "avgOpenRate" as SortOption, label: "Open rate" },
                    { field: "avgReplyRate" as SortOption, label: "Reply rate" },
                  ].map((option) => (
                    <DropdownMenuCheckboxItem
                      key={option.field}
                      checked={sortBy === option.field}
                      onCheckedChange={() => toggleSort(option.field)}
                    >
                      {option.label}
                      {sortBy === option.field && (
                        <span className="ml-auto text-xs text-muted-foreground">
                          {sortOrder === "asc" ? "A-Z" : "Z-A"}
                        </span>
                      )}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* View toggle */}
              <div className="flex items-center rounded-md border border-input bg-background p-0.5">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setView("grid")}
                      className={cn(
                        "rounded-sm p-1.5 transition-colors",
                        view === "grid"
                          ? "bg-secondary text-foreground"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Grid view</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setView("list")}
                      className={cn(
                        "rounded-sm p-1.5 transition-colors",
                        view === "list"
                          ? "bg-secondary text-foreground"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <LayoutList className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>List view</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>

          {/* Bulk actions bar */}
          {selectedSequences.size > 0 && (
            <div className="flex items-center justify-between border-t border-border bg-secondary/50 px-6 py-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={selectedSequences.size === filteredSequences.length}
                  onCheckedChange={handleSelectAll}
                />
                <span className="text-sm text-muted-foreground">{selectedSequences.size} selected</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => handleBulkAction("pause")} disabled={isBulkLoading}>
                  {isBulkLoading ? (
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Pause className="mr-1.5 h-3.5 w-3.5" />
                  )}
                  Pause
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleBulkAction("resume")} disabled={isBulkLoading}>
                  {isBulkLoading ? (
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Play className="mr-1.5 h-3.5 w-3.5" />
                  )}
                  Resume
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction("archive")}
                  disabled={isBulkLoading}
                >
                  {isBulkLoading ? (
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Archive className="mr-1.5 h-3.5 w-3.5" />
                  )}
                  Archive
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:bg-destructive hover:text-destructive-foreground bg-transparent"
                  onClick={() => handleBulkAction("delete")}
                  disabled={isBulkLoading}
                >
                  {isBulkLoading ? (
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                  )}
                  Delete
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {filteredSequences.length === 0 ? (
            <SequenceEmptyState
              hasSequences={sequences.length > 0}
              onCreateSequence={() => setShowNewSequenceDialog(true)}
            />
          ) : view === "grid" ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredSequences.map((sequence) => (
                <SequenceCard
                  key={sequence.id}
                  sequence={sequence}
                  userId={userId}
                  isSelected={selectedSequences.has(sequence.id)}
                  onSelect={() => handleSelectSequence(sequence.id)}
                  onEdit={() => router.push(`/dashboard/sequences/${sequence.id}`)}
                  onUpdated={handleSequenceUpdated}
                  onDeleted={() => handleSequenceDeleted(sequence.id)}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-border bg-card">
              {/* Table header */}
              <div className="grid grid-cols-[auto_1fr_120px_120px_100px_100px_100px_48px] items-center gap-4 border-b border-border px-4 py-3 text-xs font-medium text-muted-foreground">
                <Checkbox
                  checked={selectedSequences.size === filteredSequences.length && filteredSequences.length > 0}
                  onCheckedChange={handleSelectAll}
                />
                <button onClick={() => toggleSort("name")} className="flex items-center gap-1 hover:text-foreground">
                  Name
                  {sortBy === "name" && <ArrowUpDown className="h-3 w-3" />}
                </button>
                <span>Status</span>
                <button
                  onClick={() => toggleSort("totalEnrolled")}
                  className="flex items-center gap-1 hover:text-foreground"
                >
                  Enrolled
                  {sortBy === "totalEnrolled" && <ArrowUpDown className="h-3 w-3" />}
                </button>
                <button
                  onClick={() => toggleSort("avgOpenRate")}
                  className="flex items-center gap-1 hover:text-foreground"
                >
                  Open Rate
                  {sortBy === "avgOpenRate" && <ArrowUpDown className="h-3 w-3" />}
                </button>
                <button
                  onClick={() => toggleSort("avgReplyRate")}
                  className="flex items-center gap-1 hover:text-foreground"
                >
                  Reply Rate
                  {sortBy === "avgReplyRate" && <ArrowUpDown className="h-3 w-3" />}
                </button>
                <button
                  onClick={() => toggleSort("updatedAt")}
                  className="flex items-center gap-1 hover:text-foreground"
                >
                  Updated
                  {sortBy === "updatedAt" && <ArrowUpDown className="h-3 w-3" />}
                </button>
                <span />
              </div>
              {/* Table rows */}
              <div className="divide-y divide-border">
                {filteredSequences.map((sequence) => (
                  <SequenceTableRow
                    key={sequence.id}
                    sequence={sequence}
                    userId={userId}
                    isSelected={selectedSequences.has(sequence.id)}
                    onSelect={() => handleSelectSequence(sequence.id)}
                    onEdit={() => router.push(`/dashboard/sequences/${sequence.id}`)}
                    onUpdated={handleSequenceUpdated}
                    onDeleted={() => handleSequenceDeleted(sequence.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* New Sequence Dialog */}
        <Dialog open={showNewSequenceDialog} onOpenChange={setShowNewSequenceDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Sequence</DialogTitle>
              <DialogDescription>Set up your email sequence.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Sequence Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., SaaS Decision Makers Outreach"
                  value={newSequence.name}
                  onChange={(e) => setNewSequence({ ...newSequence, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of this sequence..."
                  value={newSequence.description}
                  onChange={(e) => setNewSequence({ ...newSequence, description: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNewSequenceDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateSequence} disabled={isCreating}>
                {isCreating ? "Creating..." : "Create Sequence"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  )
}
