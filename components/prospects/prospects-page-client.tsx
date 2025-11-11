// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Search, Plus, Download } from "lucide-react"
// import Link from "next/link"
// import { ProspectsList } from "@/components/prospects/prospects-list"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { UploadProspectsDialog } from "@/components/prospects/upload-prospects-dialog"
// import { ApolloLeadFinderDialog } from "@/components/prospects/apollo-lead-finder-dialog"
// import { CRMImportDialog } from "@/components/prospects/crm-import-dialog"
// import { FolderSidebar } from "@/components/prospects/folder-sidebar"

// interface ProspectsPageClientProps {
//   initialFolders: Array<{
//     id: string
//     name: string
//     color: string
//     icon: string
//     prospectCount: number
//   }>
//   initialTrashedCount: number
// }

// export function ProspectsPageClient({ initialFolders, initialTrashedCount }: ProspectsPageClientProps) {
//   const [folders] = useState(initialFolders)
//   const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
//   const [showTrash, setShowTrash] = useState(false)
//   const [searchQuery, setSearchQuery] = useState("")
//   const [trashedCount] = useState(initialTrashedCount)
//   const [activeTab, setActiveTab] = useState("all")

//   return (
//     <div className="flex h-full">
//       <FolderSidebar
//         folders={folders}
//         selectedFolderId={selectedFolderId}
//         onSelectFolder={(id) => {
//           setSelectedFolderId(id)
//           setShowTrash(false)
//         }}
//         showTrash={showTrash}
//         onShowTrash={() => {
//           setShowTrash(true)
//           setSelectedFolderId(null)
//         }}
//         trashedCount={trashedCount}
//       />

//       <div className="flex-1 space-y-6 p-6">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-3xl font-bold tracking-tight">
//               {showTrash
//                 ? "Trash"
//                 : selectedFolderId
//                   ? folders.find((f) => f.id === selectedFolderId)?.name
//                   : "All Prospects"}
//             </h1>
//             <p className="text-muted-foreground">{showTrash ? "Deleted prospects" : "Manage your prospect database"}</p>
//           </div>
//           {!showTrash && (
//             <div className="flex items-center gap-2">
//               <Button variant="outline">
//                 <Download className="h-4 w-4 mr-2" />
//                 Export
//               </Button>
//               <CRMImportDialog />
//               <ApolloLeadFinderDialog subscriptionTier="FREE" researchCredits={0} />
//               <UploadProspectsDialog />
//               <Button asChild>
//                 <Link href="/dashboard/prospects/new">
//                   <Plus className="h-4 w-4 mr-2" />
//                   Add Prospect
//                 </Link>
//               </Button>
//             </div>
//           )}
//         </div>

//         {!showTrash && (
//           <div className="flex items-center gap-4">
//             <div className="relative flex-1 max-w-md">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//               <Input
//                 placeholder="Search prospects..."
//                 className="pl-9"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </div>
//           </div>
//         )}

//         {showTrash ? (
//           <ProspectsList folderId={null} isTrashed={true} searchQuery={searchQuery} key={`trash-${searchQuery}`} />
//         ) : (
//           <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
//             <TabsList>
//               <TabsTrigger value="all">All Prospects</TabsTrigger>
//               <TabsTrigger value="ACTIVE">Active</TabsTrigger>
//               <TabsTrigger value="CONTACTED">Contacted</TabsTrigger>
//               <TabsTrigger value="REPLIED">Replied</TabsTrigger>
//               <TabsTrigger value="UNSUBSCRIBED">Unsubscribed</TabsTrigger>
//             </TabsList>

//             <TabsContent value="all" className="space-y-4">
//               <ProspectsList
//                 folderId={selectedFolderId}
//                 searchQuery={searchQuery}
//                 key={`all-${selectedFolderId}-${searchQuery}`}
//               />
//             </TabsContent>

//             <TabsContent value="ACTIVE" className="space-y-4">
//               <ProspectsList
//                 status="ACTIVE"
//                 folderId={selectedFolderId}
//                 searchQuery={searchQuery}
//                 key={`active-${selectedFolderId}-${searchQuery}`}
//               />
//             </TabsContent>

//             <TabsContent value="CONTACTED" className="space-y-4">
//               <ProspectsList
//                 status="CONTACTED"
//                 folderId={selectedFolderId}
//                 searchQuery={searchQuery}
//                 key={`contacted-${selectedFolderId}-${searchQuery}`}
//               />
//             </TabsContent>

//             <TabsContent value="REPLIED" className="space-y-4">
//               <ProspectsList
//                 status="REPLIED"
//                 folderId={selectedFolderId}
//                 searchQuery={searchQuery}
//                 key={`replied-${selectedFolderId}-${searchQuery}`}
//               />
//             </TabsContent>

//             <TabsContent value="UNSUBSCRIBED" className="space-y-4">
//               <ProspectsList
//                 status="UNSUBSCRIBED"
//                 folderId={selectedFolderId}
//                 searchQuery={searchQuery}
//                 key={`unsubscribed-${selectedFolderId}-${searchQuery}`}
//               />
//             </TabsContent>
//           </Tabs>
//         )}
//       </div>
//     </div>
//   )
// }

// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Search, Plus, Download, Wand2, FolderInput, Trash2 } from "lucide-react"
// import Link from "next/link"
// import { ProspectsList } from "@/components/prospects/prospects-list"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { UploadProspectsDialog } from "@/components/prospects/upload-prospects-dialog"
// import { ApolloLeadFinderDialog } from "@/components/prospects/apollo-lead-finder-dialog"
// import { CRMImportDialog } from "@/components/prospects/crm-import-dialog"
// import { FolderSidebar } from "@/components/prospects/folder-sidebar"
// import { DuplicateDetectorDialog } from "./duplicate-detector-dialog"
// import { findDuplicates } from "@/lib/services/duplicate-detector"
// import { bulkMoveToFolder, bulkDeleteProspects, bulkRestoreProspects } from "@/lib/actions/prospects"
// import { toast } from "sonner"
// import { Badge } from "@/components/ui/badge"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"

// interface ProspectsPageClientProps {
//   initialFolders: Array<{
//     id: string
//     name: string
//     color: string
//     icon: string
//     prospectCount: number
//   }>
//   initialTrashedCount: number
// }

// export function ProspectsPageClient({ initialFolders, initialTrashedCount }: ProspectsPageClientProps) {
//   const [folders] = useState(initialFolders)
//   const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
//   const [showTrash, setShowTrash] = useState(false)
//   const [searchQuery, setSearchQuery] = useState("")
//   const [trashedCount] = useState(initialTrashedCount)
//   const [activeTab, setActiveTab] = useState("all")
//   const [selectedProspects, setSelectedProspects] = useState<string[]>([])
//   const [duplicateGroups, setDuplicateGroups] = useState<any[]>([])
//   const [showDuplicates, setShowDuplicates] = useState(false)
//   const [isScanning, setIsScanning] = useState(false)

//   const handleToggleSelect = (id: string) => {
//     setSelectedProspects((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]))
//   }

//   const handleToggleSelectAll = (ids: string[]) => {
//     setSelectedProspects((prev) => (prev.length === ids.length ? [] : ids))
//   }

//   const handleScanDuplicates = async () => {
//     setIsScanning(true)
//     toast.info("Scanning for duplicates...")

//     try {
//       const groups = await findDuplicates("")
//       setDuplicateGroups(groups)

//       if (groups.length === 0) {
//         toast.success("No duplicates found!")
//       } else {
//         toast.success(`Found ${groups.length} duplicate group(s)`)
//         setShowDuplicates(true)
//       }
//     } catch (error) {
//       toast.error("Failed to scan for duplicates")
//     } finally {
//       setIsScanning(false)
//     }
//   }

//   const handleBulkMoveToFolder = async (folderId: string | null) => {
//     if (selectedProspects.length === 0) {
//       toast.error("Please select prospects first")
//       return
//     }

//     const result = await bulkMoveToFolder(selectedProspects, folderId)

//     if (result.success) {
//       toast.success(`Moved ${selectedProspects.length} prospect(s)`)
//       setSelectedProspects([])
//     } else {
//       toast.error("Failed to move prospects")
//     }
//   }

//   const handleBulkDelete = async () => {
//     if (selectedProspects.length === 0) {
//       toast.error("Please select prospects first")
//       return
//     }

//     if (!confirm(`Move ${selectedProspects.length} prospect(s) to trash?`)) {
//       return
//     }

//     const result = await bulkDeleteProspects(selectedProspects)

//     if (result.success) {
//       toast.success(`Moved ${selectedProspects.length} prospect(s) to trash`)
//       setSelectedProspects([])
//     } else {
//       toast.error("Failed to delete prospects")
//     }
//   }

//   const handleBulkRestore = async () => {
//     if (selectedProspects.length === 0) {
//       toast.error("Please select prospects first")
//       return
//     }

//     const result = await bulkRestoreProspects(selectedProspects)

//     if (result.success) {
//       toast.success(`Restored ${selectedProspects.length} prospect(s)`)
//       setSelectedProspects([])
//     } else {
//       toast.error("Failed to restore prospects")
//     }
//   }

//   const duplicateProspectIds = duplicateGroups.flatMap((group) => group.prospects.map((p: any) => p.id))

//   return (
//     <div className="flex h-full">
//       <FolderSidebar
//         folders={folders}
//         selectedFolderId={selectedFolderId}
//         onSelectFolder={(id) => {
//           setSelectedFolderId(id)
//           setShowTrash(false)
//         }}
//         showTrash={showTrash}
//         onShowTrash={() => {
//           setShowTrash(true)
//           setSelectedFolderId(null)
//         }}
//         trashedCount={trashedCount}
//       />

//       <div className="flex-1 space-y-6 p-6">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-3xl font-bold tracking-tight">
//               {showTrash
//                 ? "Trash"
//                 : selectedFolderId
//                   ? folders.find((f) => f.id === selectedFolderId)?.name
//                   : "All Prospects"}
//             </h1>
//             <p className="text-muted-foreground">{showTrash ? "Deleted prospects" : "Manage your prospect database"}</p>
//           </div>
//           {!showTrash && (
//             <div className="flex items-center gap-2">
//               <Button variant="outline" onClick={handleScanDuplicates} disabled={isScanning}>
//                 <Wand2 className="h-4 w-4 mr-2" />
//                 {isScanning ? "Scanning..." : "Find Duplicates"}
//               </Button>
//               <Button variant="outline">
//                 <Download className="h-4 w-4 mr-2" />
//                 Export
//               </Button>
//               <CRMImportDialog />
//               <ApolloLeadFinderDialog subscriptionTier="FREE" researchCredits={0} />
//               <UploadProspectsDialog />
//               <Button asChild>
//                 <Link href="/dashboard/prospects/new">
//                   <Plus className="h-4 w-4 mr-2" />
//                   Add Prospect
//                 </Link>
//               </Button>
//             </div>
//           )}
//         </div>

//         {selectedProspects.length > 0 && (
//           <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <Badge variant="default">{selectedProspects.length} selected</Badge>
//             </div>
//             <div className="flex items-center gap-2">
//               {showTrash ? (
//                 <>
//                   <Button variant="outline" size="sm" onClick={handleBulkRestore}>
//                     <FolderInput className="h-4 w-4 mr-2" />
//                     Restore
//                   </Button>
//                   <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
//                     <Trash2 className="h-4 w-4 mr-2" />
//                     Delete Permanently
//                   </Button>
//                 </>
//               ) : (
//                 <>
//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <Button variant="outline" size="sm">
//                         <FolderInput className="h-4 w-4 mr-2" />
//                         Move to Folder
//                       </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent>
//                       <DropdownMenuItem onClick={() => handleBulkMoveToFolder(null)}>All Prospects</DropdownMenuItem>
//                       <DropdownMenuSeparator />
//                       {initialFolders.map((folder) => (
//                         <DropdownMenuItem key={folder.id} onClick={() => handleBulkMoveToFolder(folder.id)}>
//                           <div className="flex items-center gap-2">
//                             <div className="w-3 h-3 rounded" style={{ backgroundColor: folder.color }} />
//                             {folder.name}
//                           </div>
//                         </DropdownMenuItem>
//                       ))}
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                   <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
//                     <Trash2 className="h-4 w-4 mr-2" />
//                     Move to Trash
//                   </Button>
//                 </>
//               )}
//             </div>
//           </div>
//         )}

//         {!showTrash && (
//           <div className="flex items-center gap-4">
//             <div className="relative flex-1 max-w-md">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//               <Input
//                 placeholder="Search prospects..."
//                 className="pl-9"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </div>
//           </div>
//         )}

//         {showTrash ? (
//           <ProspectsList
//             folderId={null}
//             isTrashed={true}
//             searchQuery={searchQuery}
//             selectedProspects={selectedProspects}
//             onToggleSelect={handleToggleSelect}
//             onToggleSelectAll={handleToggleSelectAll}
//             duplicateProspectIds={duplicateProspectIds}
//             key={`trash-${searchQuery}`}
//           />
//         ) : (
//           <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
//             <TabsList>
//               <TabsTrigger value="all">All Prospects</TabsTrigger>
//               <TabsTrigger value="ACTIVE">Active</TabsTrigger>
//               <TabsTrigger value="CONTACTED">Contacted</TabsTrigger>
//               <TabsTrigger value="REPLIED">Replied</TabsTrigger>
//               <TabsTrigger value="UNSUBSCRIBED">Unsubscribed</TabsTrigger>
//             </TabsList>

//             <TabsContent value="all" className="space-y-4">
//               <ProspectsList
//                 folderId={selectedFolderId}
//                 searchQuery={searchQuery}
//                 selectedProspects={selectedProspects}
//                 onToggleSelect={handleToggleSelect}
//                 onToggleSelectAll={handleToggleSelectAll}
//                 duplicateProspectIds={duplicateProspectIds}
//                 key={`all-${selectedFolderId}-${searchQuery}`}
//               />
//             </TabsContent>

//             <TabsContent value="ACTIVE" className="space-y-4">
//               <ProspectsList
//                 status="ACTIVE"
//                 folderId={selectedFolderId}
//                 searchQuery={searchQuery}
//                 selectedProspects={selectedProspects}
//                 onToggleSelect={handleToggleSelect}
//                 onToggleSelectAll={handleToggleSelectAll}
//                 duplicateProspectIds={duplicateProspectIds}
//                 key={`active-${selectedFolderId}-${searchQuery}`}
//               />
//             </TabsContent>

//             <TabsContent value="CONTACTED" className="space-y-4">
//               <ProspectsList
//                 status="CONTACTED"
//                 folderId={selectedFolderId}
//                 searchQuery={searchQuery}
//                 selectedProspects={selectedProspects}
//                 onToggleSelect={handleToggleSelect}
//                 onToggleSelectAll={handleToggleSelectAll}
//                 duplicateProspectIds={duplicateProspectIds}
//                 key={`contacted-${selectedFolderId}-${searchQuery}`}
//               />
//             </TabsContent>

//             <TabsContent value="REPLIED" className="space-y-4">
//               <ProspectsList
//                 status="REPLIED"
//                 folderId={selectedFolderId}
//                 searchQuery={searchQuery}
//                 selectedProspects={selectedProspects}
//                 onToggleSelect={handleToggleSelect}
//                 onToggleSelectAll={handleToggleSelectAll}
//                 duplicateProspectIds={duplicateProspectIds}
//                 key={`replied-${selectedFolderId}-${searchQuery}`}
//               />
//             </TabsContent>

//             <TabsContent value="UNSUBSCRIBED" className="space-y-4">
//               <ProspectsList
//                 status="UNSUBSCRIBED"
//                 folderId={selectedFolderId}
//                 searchQuery={searchQuery}
//                 selectedProspects={selectedProspects}
//                 onToggleSelect={handleToggleSelect}
//                 onToggleSelectAll={handleToggleSelectAll}
//                 duplicateProspectIds={duplicateProspectIds}
//                 key={`unsubscribed-${selectedFolderId}-${searchQuery}`}
//               />
//             </TabsContent>
//           </Tabs>
//         )}
//       </div>

//       <DuplicateDetectorDialog
//         open={showDuplicates}
//         onOpenChange={setShowDuplicates}
//         duplicateGroups={duplicateGroups}
//         onResolved={() => {
//           setDuplicateGroups([])
//           setSelectedProspects([])
//         }}
//       />
//     </div>
//   )
// }


// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Search, Plus, Download, Wand2, FolderInput, Trash2, ArrowLeft } from "lucide-react"
// import Link from "next/link"
// import { ProspectsList } from "@/components/prospects/prospects-list"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { UploadProspectsDialog } from "@/components/prospects/upload-prospects-dialog"
// import { ApolloLeadFinderDialog } from "@/components/prospects/apollo-lead-finder-dialog"
// import { CRMImportDialog } from "@/components/prospects/crm-import-dialog"
// import { FolderGrid } from "@/components/prospects/folder-grid"
// import { DuplicateDetectorDialog } from "@/components/prospects/duplicate-detector-dialog"
// import { findDuplicates } from "@/lib/services/duplicate-detector"
// import { bulkMoveToFolder, bulkDeleteProspects, bulkRestoreProspects } from "@/lib/actions/prospects"
// import { toast } from "sonner"
// import { Badge } from "@/components/ui/badge"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"

// interface ProspectsPageClientProps {
//   initialFolders: Array<{
//     id: string
//     name: string
//     color: string
//     icon: string
//     prospectCount: number
//   }>
//   initialTrashedCount: number
// }

// export function ProspectsPageClient({ initialFolders, initialTrashedCount }: ProspectsPageClientProps) {
//   const [folders] = useState(initialFolders)
//   const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
//   const [showTrash, setShowTrash] = useState(false)
//   const [searchQuery, setSearchQuery] = useState("")
//   const [trashedCount] = useState(initialTrashedCount)
//   const [activeTab, setActiveTab] = useState("all")
//   const [selectedProspects, setSelectedProspects] = useState<string[]>([])
//   const [duplicateGroups, setDuplicateGroups] = useState<any[]>([])
//   const [showDuplicates, setShowDuplicates] = useState(false)
//   const [isScanning, setIsScanning] = useState(false)

//   const showFolderGrid = !selectedFolderId && !showTrash

//   const handleToggleSelect = (id: string) => {
//     setSelectedProspects((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]))
//   }

//   const handleToggleSelectAll = (ids: string[]) => {
//     setSelectedProspects((prev) => (prev.length === ids.length ? [] : ids))
//   }

//   const handleScanDuplicates = async () => {
//     setIsScanning(true)
//     toast.info("Scanning for duplicates...")

//     try {
//       const groups = await findDuplicates("")
//       setDuplicateGroups(groups)

//       if (groups.length === 0) {
//         toast.success("No duplicates found!")
//       } else {
//         toast.success(`Found ${groups.length} duplicate group(s)`)
//         setShowDuplicates(true)
//       }
//     } catch (error) {
//       toast.error("Failed to scan for duplicates")
//     } finally {
//       setIsScanning(false)
//     }
//   }

//   const handleBulkMoveToFolder = async (folderId: string | null) => {
//     if (selectedProspects.length === 0) {
//       toast.error("Please select prospects first")
//       return
//     }

//     const result = await bulkMoveToFolder(selectedProspects, folderId)

//     if (result.success) {
//       toast.success(`Moved ${selectedProspects.length} prospect(s)`)
//       setSelectedProspects([])
//       window.location.reload()
//     } else {
//       toast.error("Failed to move prospects")
//     }
//   }

//   const handleBulkDelete = async () => {
//     if (selectedProspects.length === 0) {
//       toast.error("Please select prospects first")
//       return
//     }

//     if (!confirm(`Move ${selectedProspects.length} prospect(s) to trash?`)) {
//       return
//     }

//     const result = await bulkDeleteProspects(selectedProspects)

//     if (result.success) {
//       toast.success(`Moved ${selectedProspects.length} prospect(s) to trash`)
//       setSelectedProspects([])
//       window.location.reload()
//     } else {
//       toast.error("Failed to delete prospects")
//     }
//   }

//   const handleBulkRestore = async () => {
//     if (selectedProspects.length === 0) {
//       toast.error("Please select prospects first")
//       return
//     }

//     const result = await bulkRestoreProspects(selectedProspects)

//     if (result.success) {
//       toast.success(`Restored ${selectedProspects.length} prospect(s)`)
//       setSelectedProspects([])
//       window.location.reload()
//     } else {
//       toast.error("Failed to restore prospects")
//     }
//   }

//   const duplicateProspectIds = duplicateGroups.flatMap((group) => group.prospects.map((p: any) => p.id))

//   const selectedFolder = folders.find((f) => f.id === selectedFolderId)

//   return (
//     <div className="space-y-6 p-6">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-4">
//           {(selectedFolderId || showTrash) && (
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={() => {
//                 setSelectedFolderId(null)
//                 setShowTrash(false)
//               }}
//             >
//               <ArrowLeft className="h-5 w-5" />
//             </Button>
//           )}
//           <div>
//             <h1 className="text-3xl font-bold tracking-tight">
//               {showTrash ? "Trash" : selectedFolderId ? selectedFolder?.name : "My Folders"}
//             </h1>
//             <p className="text-muted-foreground">
//               {showTrash
//                 ? "Deleted prospects"
//                 : selectedFolderId
//                   ? `${selectedFolder?.prospectCount || 0} prospects`
//                   : `${folders.length} folders • ${folders.reduce((sum, f) => sum + f.prospectCount, 0)} total prospects`}
//             </p>
//           </div>
//         </div>
//         {!showTrash && !showFolderGrid && (
//           <div className="flex items-center gap-2">
//             <Button variant="outline" onClick={handleScanDuplicates} disabled={isScanning}>
//               <Wand2 className="h-4 w-4 mr-2" />
//               {isScanning ? "Scanning..." : "Find Duplicates"}
//             </Button>
//             <Button variant="outline">
//               <Download className="h-4 w-4 mr-2" />
//               Export
//             </Button>
//             <CRMImportDialog />
//             <ApolloLeadFinderDialog subscriptionTier="FREE" researchCredits={0} />
//             <UploadProspectsDialog />
//             <Button asChild>
//               <Link href="/dashboard/prospects/new">
//                 <Plus className="h-4 w-4 mr-2" />
//                 Add Prospect
//               </Link>
//             </Button>
//           </div>
//         )}
//         {showTrash && (
//           <Button
//             variant="outline"
//             onClick={() => {
//               setShowTrash(false)
//               setSelectedFolderId(null)
//             }}
//           >
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Back to Folders
//           </Button>
//         )}
//       </div>

//       {selectedProspects.length > 0 && !showFolderGrid && (
//         <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <Badge variant="default">{selectedProspects.length} selected</Badge>
//           </div>
//           <div className="flex items-center gap-2">
//             {showTrash ? (
//               <>
//                 <Button variant="outline" size="sm" onClick={handleBulkRestore}>
//                   <FolderInput className="h-4 w-4 mr-2" />
//                   Restore
//                 </Button>
//                 <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
//                   <Trash2 className="h-4 w-4 mr-2" />
//                   Delete Permanently
//                 </Button>
//               </>
//             ) : (
//               <>
//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <Button variant="outline" size="sm">
//                       <FolderInput className="h-4 w-4 mr-2" />
//                       Move to Folder
//                     </Button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent>
//                     <DropdownMenuItem onClick={() => handleBulkMoveToFolder(null)}>All Prospects</DropdownMenuItem>
//                     <DropdownMenuSeparator />
//                     {initialFolders.map((folder) => (
//                       <DropdownMenuItem key={folder.id} onClick={() => handleBulkMoveToFolder(folder.id)}>
//                         <div className="flex items-center gap-2">
//                           <div className="w-3 h-3 rounded" style={{ backgroundColor: folder.color }} />
//                           {folder.name}
//                         </div>
//                       </DropdownMenuItem>
//                     ))}
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//                 <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
//                   <Trash2 className="h-4 w-4 mr-2" />
//                   Move to Trash
//                 </Button>
//               </>
//             )}
//           </div>
//         </div>
//       )}

//       {showFolderGrid && (
//         <div className="space-y-6">
//           <FolderGrid folders={folders} onSelectFolder={setSelectedFolderId} />

//           <div className="flex items-center justify-between p-6 border rounded-lg bg-muted/30">
//             <div className="flex items-center gap-4">
//               <div className="w-12 h-12 rounded-lg bg-background flex items-center justify-center">
//                 <Trash2 className="h-6 w-6 text-muted-foreground" />
//               </div>
//               <div>
//                 <h3 className="font-semibold">Trash</h3>
//                 <p className="text-sm text-muted-foreground">{trashedCount} deleted prospects</p>
//               </div>
//             </div>
//             <Button variant="outline" onClick={() => setShowTrash(true)}>
//               View Trash
//             </Button>
//           </div>
//         </div>
//       )}

//       {!showFolderGrid && (
//         <>
//           <div className="flex items-center gap-4">
//             <div className="relative flex-1 max-w-md">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//               <Input
//                 placeholder="Search prospects..."
//                 className="pl-9"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </div>
//           </div>

//           {showTrash ? (
//             <ProspectsList
//               folderId={null}
//               isTrashed={true}
//               searchQuery={searchQuery}
//               selectedProspects={selectedProspects}
//               onToggleSelect={handleToggleSelect}
//               onToggleSelectAll={handleToggleSelectAll}
//               duplicateProspectIds={duplicateProspectIds}
//               key={`trash-${searchQuery}`}
//             />
//           ) : (
//             <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
//               <TabsList>
//                 <TabsTrigger value="all">All Prospects</TabsTrigger>
//                 <TabsTrigger value="ACTIVE">Active</TabsTrigger>
//                 <TabsTrigger value="CONTACTED">Contacted</TabsTrigger>
//                 <TabsTrigger value="REPLIED">Replied</TabsTrigger>
//                 <TabsTrigger value="UNSUBSCRIBED">Unsubscribed</TabsTrigger>
//               </TabsList>

//               <TabsContent value="all" className="space-y-4">
//                 <ProspectsList
//                   folderId={selectedFolderId}
//                   searchQuery={searchQuery}
//                   selectedProspects={selectedProspects}
//                   onToggleSelect={handleToggleSelect}
//                   onToggleSelectAll={handleToggleSelectAll}
//                   duplicateProspectIds={duplicateProspectIds}
//                   key={`all-${selectedFolderId}-${searchQuery}`}
//                 />
//               </TabsContent>

//               <TabsContent value="ACTIVE" className="space-y-4">
//                 <ProspectsList
//                   status="ACTIVE"
//                   folderId={selectedFolderId}
//                   searchQuery={searchQuery}
//                   selectedProspects={selectedProspects}
//                   onToggleSelect={handleToggleSelect}
//                   onToggleSelectAll={handleToggleSelectAll}
//                   duplicateProspectIds={duplicateProspectIds}
//                   key={`active-${selectedFolderId}-${searchQuery}`}
//                 />
//               </TabsContent>

//               <TabsContent value="CONTACTED" className="space-y-4">
//                 <ProspectsList
//                   status="CONTACTED"
//                   folderId={selectedFolderId}
//                   searchQuery={searchQuery}
//                   selectedProspects={selectedProspects}
//                   onToggleSelect={handleToggleSelect}
//                   onToggleSelectAll={handleToggleSelectAll}
//                   duplicateProspectIds={duplicateProspectIds}
//                   key={`contacted-${selectedFolderId}-${searchQuery}`}
//                 />
//               </TabsContent>

//               <TabsContent value="REPLIED" className="space-y-4">
//                 <ProspectsList
//                   status="REPLIED"
//                   folderId={selectedFolderId}
//                   searchQuery={searchQuery}
//                   selectedProspects={selectedProspects}
//                   onToggleSelect={handleToggleSelect}
//                   onToggleSelectAll={handleToggleSelectAll}
//                   duplicateProspectIds={duplicateProspectIds}
//                   key={`replied-${selectedFolderId}-${searchQuery}`}
//                 />
//               </TabsContent>

//               <TabsContent value="UNSUBSCRIBED" className="space-y-4">
//                 <ProspectsList
//                   status="UNSUBSCRIBED"
//                   folderId={selectedFolderId}
//                   searchQuery={searchQuery}
//                   selectedProspects={selectedProspects}
//                   onToggleSelect={handleToggleSelect}
//                   onToggleSelectAll={handleToggleSelectAll}
//                   duplicateProspectIds={duplicateProspectIds}
//                   key={`unsubscribed-${selectedFolderId}-${searchQuery}`}
//                 />
//               </TabsContent>
//             </Tabs>
//           )}
//         </>
//       )}

//       <DuplicateDetectorDialog
//         open={showDuplicates}
//         onOpenChange={setShowDuplicates}
//         duplicateGroups={duplicateGroups}
//         onResolved={() => {
//           setDuplicateGroups([])
//           setSelectedProspects([])
//         }}
//       />
//     </div>
//   )
// }


// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Search, Plus, Download, Wand2, FolderInput, Trash2, ArrowLeft } from "lucide-react"
// import Link from "next/link"
// import { ProspectsList } from "@/components/prospects/prospects-list"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { UploadProspectsDialog } from "@/components/prospects/upload-prospects-dialog"
// import { ApolloLeadFinderDialog } from "@/components/prospects/apollo-lead-finder-dialog"
// import { CRMImportDialog } from "@/components/prospects/crm-import-dialog"
// import { FolderGrid } from "@/components/prospects/folder-grid"
// import { DuplicateDetectorDialog } from "@/components/prospects/duplicate-detector-dialog"
// import { findDuplicates } from "@/lib/services/duplicate-detector"
// import { bulkMoveToFolder, bulkDeleteProspects, bulkRestoreProspects } from "@/lib/actions/prospects"
// import { toast } from "sonner"
// import { Badge } from "@/components/ui/badge"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"

// interface ProspectsPageClientProps {
//   initialFolders: Array<{
//     id: string
//     name: string
//     color: string
//     icon: string
//     prospectCount: number
//   }>
//   initialTrashedCount: number
// }

// export function ProspectsPageClient({ initialFolders, initialTrashedCount }: ProspectsPageClientProps) {
//   const [folders, setFolders] = useState(initialFolders)
//   const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
//   const [showTrash, setShowTrash] = useState(false)
//   const [searchQuery, setSearchQuery] = useState("")
//   const [trashedCount, setTrashedCount] = useState(initialTrashedCount)
//   const [activeTab, setActiveTab] = useState("all")
//   const [selectedProspects, setSelectedProspects] = useState<string[]>([])
//   const [duplicateGroups, setDuplicateGroups] = useState<any[]>([])
//   const [showDuplicates, setShowDuplicates] = useState(false)
//   const [isScanning, setIsScanning] = useState(false)

//   const showFolderGrid = !selectedFolderId && !showTrash

//   const handleToggleSelect = (id: string) => {
//     setSelectedProspects((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]))
//   }

//   const handleToggleSelectAll = (ids: string[]) => {
//     setSelectedProspects((prev) => (prev.length === ids.length ? [] : ids))
//   }

//   const handleScanDuplicates = async () => {
//     setIsScanning(true)
//     toast.info("Scanning for duplicates...")

//     try {
//       const groups = await findDuplicates("")
//       setDuplicateGroups(groups)

//       if (groups.length === 0) {
//         toast.success("No duplicates found!")
//       } else {
//         toast.success(`Found ${groups.length} duplicate group(s)`)
//         setShowDuplicates(true)
//       }
//     } catch (error) {
//       toast.error("Failed to scan for duplicates")
//     } finally {
//       setIsScanning(false)
//     }
//   }

//   const handleBulkMoveToFolder = async (folderId: string | null) => {
//     if (selectedProspects.length === 0) {
//       toast.error("Please select prospects first")
//       return
//     }

//     const result = await bulkMoveToFolder(selectedProspects, folderId)

//     if (result.success) {
//       toast.success(`Moved ${selectedProspects.length} prospect(s)`)
//       setSelectedProspects([])
//       window.location.reload()
//     } else {
//       toast.error("Failed to move prospects")
//     }
//   }

//   const handleBulkDelete = async () => {
//     if (selectedProspects.length === 0) {
//       toast.error("Please select prospects first")
//       return
//     }

//     if (!confirm(`Move ${selectedProspects.length} prospect(s) to trash?`)) {
//       return
//     }

//     const result = await bulkDeleteProspects(selectedProspects)

//     if (result.success) {
//       toast.success(`Moved ${selectedProspects.length} prospect(s) to trash`)
//       setSelectedProspects([])
//       window.location.reload()
//     } else {
//       toast.error("Failed to delete prospects")
//     }
//   }

//   const handleBulkRestore = async () => {
//     if (selectedProspects.length === 0) {
//       toast.error("Please select prospects first")
//       return
//     }

//     const result = await bulkRestoreProspects(selectedProspects)

//     if (result.success) {
//       toast.success(`Restored ${selectedProspects.length} prospect(s)`)
//       setSelectedProspects([])
//       window.location.reload()
//     } else {
//       toast.error("Failed to restore prospects")
//     }
//   }

//   const duplicateProspectIds = duplicateGroups.flatMap((group) => group.prospects.map((p: any) => p.id))

//   const selectedFolder = folders.find((f) => f.id === selectedFolderId)

//   return (
//     <div className="space-y-6 p-6">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-4">
//           {(selectedFolderId || showTrash) && (
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={() => {
//                 setSelectedFolderId(null)
//                 setShowTrash(false)
//               }}
//             >
//               <ArrowLeft className="h-5 w-5" />
//             </Button>
//           )}
//           <div>
//             <h1 className="text-3xl font-bold tracking-tight">
//               {showTrash ? "Trash" : selectedFolderId ? selectedFolder?.name : "My Folders"}
//             </h1>
//             <p className="text-muted-foreground">
//               {showTrash
//                 ? "Deleted prospects"
//                 : selectedFolderId
//                   ? `${selectedFolder?.prospectCount || 0} prospects`
//                   : `${folders.length} folders • ${folders.reduce((sum, f) => sum + f.prospectCount, 0)} total prospects`}
//             </p>
//           </div>
//         </div>
//         {!showTrash && !showFolderGrid && (
//           <div className="flex items-center gap-2">
//             <Button variant="outline" onClick={handleScanDuplicates} disabled={isScanning}>
//               <Wand2 className="h-4 w-4 mr-2" />
//               {isScanning ? "Scanning..." : "Find Duplicates"}
//             </Button>
//             <Button variant="outline">
//               <Download className="h-4 w-4 mr-2" />
//               Export
//             </Button>
//             <CRMImportDialog />
//             <ApolloLeadFinderDialog subscriptionTier="FREE" researchCredits={0} />
//             <UploadProspectsDialog />
//             <Button asChild>
//               <Link href="/dashboard/prospects/new">
//                 <Plus className="h-4 w-4 mr-2" />
//                 Add Prospect
//               </Link>
//             </Button>
//           </div>
//         )}
//         {showTrash && (
//           <Button
//             variant="outline"
//             onClick={() => {
//               setShowTrash(false)
//               setSelectedFolderId(null)
//             }}
//           >
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Back to Folders
//           </Button>
//         )}
//       </div>

//       {selectedProspects.length > 0 && !showFolderGrid && (
//         <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <Badge variant="default">{selectedProspects.length} selected</Badge>
//           </div>
//           <div className="flex items-center gap-2">
//             {showTrash ? (
//               <>
//                 <Button variant="outline" size="sm" onClick={handleBulkRestore}>
//                   <FolderInput className="h-4 w-4 mr-2" />
//                   Restore
//                 </Button>
//                 <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
//                   <Trash2 className="h-4 w-4 mr-2" />
//                   Delete Permanently
//                 </Button>
//               </>
//             ) : (
//               <>
//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <Button variant="outline" size="sm">
//                       <FolderInput className="h-4 w-4 mr-2" />
//                       Move to Folder
//                     </Button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent>
//                     <DropdownMenuItem onClick={() => handleBulkMoveToFolder(null)}>All Prospects</DropdownMenuItem>
//                     <DropdownMenuSeparator />
//                     {initialFolders.map((folder) => (
//                       <DropdownMenuItem key={folder.id} onClick={() => handleBulkMoveToFolder(folder.id)}>
//                         <div className="flex items-center gap-2">
//                           <div className="w-3 h-3 rounded" style={{ backgroundColor: folder.color }} />
//                           {folder.name}
//                         </div>
//                       </DropdownMenuItem>
//                     ))}
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//                 <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
//                   <Trash2 className="h-4 w-4 mr-2" />
//                   Move to Trash
//                 </Button>
//               </>
//             )}
//           </div>
//         </div>
//       )}

//       {showFolderGrid && (
//         <div className="space-y-6">
//           <FolderGrid folders={folders} onSelectFolder={setSelectedFolderId} />

//           <div className="flex items-center justify-between p-6 border rounded-lg bg-muted/30">
//             <div className="flex items-center gap-4">
//               <div className="w-12 h-12 rounded-lg bg-background flex items-center justify-center">
//                 <Trash2 className="h-6 w-6 text-muted-foreground" />
//               </div>
//               <div>
//                 <h3 className="font-semibold">Trash</h3>
//                 <p className="text-sm text-muted-foreground">{trashedCount} deleted prospects</p>
//               </div>
//             </div>
//             <Button variant="outline" onClick={() => setShowTrash(true)}>
//               View Trash
//             </Button>
//           </div>
//         </div>
//       )}

//       {!showFolderGrid && (
//         <>
//           <div className="flex items-center gap-4">
//             <div className="relative flex-1 max-w-md">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//               <Input
//                 placeholder="Search prospects..."
//                 className="pl-9"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </div>
//           </div>

//           {showTrash ? (
//             <ProspectsList
//               folderId={null}
//               isTrashed={true}
//               searchQuery={searchQuery}
//               selectedProspects={selectedProspects}
//               onToggleSelect={handleToggleSelect}
//               onToggleSelectAll={handleToggleSelectAll}
//               duplicateProspectIds={duplicateProspectIds}
//               key={`trash-${searchQuery}`}
//             />
//           ) : (
//             <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
//               <TabsList>
//                 <TabsTrigger value="all">All Prospects</TabsTrigger>
//                 <TabsTrigger value="ACTIVE">Active</TabsTrigger>
//                 <TabsTrigger value="CONTACTED">Contacted</TabsTrigger>
//                 <TabsTrigger value="REPLIED">Replied</TabsTrigger>
//                 <TabsTrigger value="UNSUBSCRIBED">Unsubscribed</TabsTrigger>
//               </TabsList>

//               <TabsContent value="all" className="space-y-4">
//                 <ProspectsList
//                   folderId={selectedFolderId}
//                   searchQuery={searchQuery}
//                   selectedProspects={selectedProspects}
//                   onToggleSelect={handleToggleSelect}
//                   onToggleSelectAll={handleToggleSelectAll}
//                   duplicateProspectIds={duplicateProspectIds}
//                   key={`all-${selectedFolderId}-${searchQuery}`}
//                 />
//               </TabsContent>

//               <TabsContent value="ACTIVE" className="space-y-4">
//                 <ProspectsList
//                   status="ACTIVE"
//                   folderId={selectedFolderId}
//                   searchQuery={searchQuery}
//                   selectedProspects={selectedProspects}
//                   onToggleSelect={handleToggleSelect}
//                   onToggleSelectAll={handleToggleSelectAll}
//                   duplicateProspectIds={duplicateProspectIds}
//                   key={`active-${selectedFolderId}-${searchQuery}`}
//                 />
//               </TabsContent>

//               <TabsContent value="CONTACTED" className="space-y-4">
//                 <ProspectsList
//                   status="CONTACTED"
//                   folderId={selectedFolderId}
//                   searchQuery={searchQuery}
//                   selectedProspects={selectedProspects}
//                   onToggleSelect={handleToggleSelect}
//                   onToggleSelectAll={handleToggleSelectAll}
//                   duplicateProspectIds={duplicateProspectIds}
//                   key={`contacted-${selectedFolderId}-${searchQuery}`}
//                 />
//               </TabsContent>

//               <TabsContent value="REPLIED" className="space-y-4">
//                 <ProspectsList
//                   status="REPLIED"
//                   folderId={selectedFolderId}
//                   searchQuery={searchQuery}
//                   selectedProspects={selectedProspects}
//                   onToggleSelect={handleToggleSelect}
//                   onToggleSelectAll={handleToggleSelectAll}
//                   duplicateProspectIds={duplicateProspectIds}
//                   key={`replied-${selectedFolderId}-${searchQuery}`}
//                 />
//               </TabsContent>

//               <TabsContent value="UNSUBSCRIBED" className="space-y-4">
//                 <ProspectsList
//                   status="UNSUBSCRIBED"
//                   folderId={selectedFolderId}
//                   searchQuery={searchQuery}
//                   selectedProspects={selectedProspects}
//                   onToggleSelect={handleToggleSelect}
//                   onToggleSelectAll={handleToggleSelectAll}
//                   duplicateProspectIds={duplicateProspectIds}
//                   key={`unsubscribed-${selectedFolderId}-${searchQuery}`}
//                 />
//               </TabsContent>
//             </Tabs>
//           )}
//         </>
//       )}

//       <DuplicateDetectorDialog
//         open={showDuplicates}
//         onOpenChange={setShowDuplicates}
//         duplicateGroups={duplicateGroups}
//         onResolved={() => {
//           setDuplicateGroups([])
//           setSelectedProspects([])
//         }}
//       />
//     </div>
//   )
// }


"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Download, Wand2, FolderInput, Trash2, ArrowLeft, FolderOpen } from "lucide-react"
import Link from "next/link"
import { ProspectsList } from "@/components/prospects/prospects-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UploadProspectsDialog } from "@/components/prospects/upload-prospects-dialog"
import { ApolloLeadFinderDialog } from "@/components/prospects/apollo-lead-finder-dialog"
import { CRMImportDialog } from "@/components/prospects/crm-import-dialog"
import { FolderGrid } from "@/components/prospects/folder-grid"
import { DuplicateDetectorDialog } from "@/components/prospects/duplicate-detector-dialog"
import { findDuplicates } from "@/lib/services/duplicate-detector"
import { bulkMoveToFolder, bulkDeleteProspects, bulkRestoreProspects } from "@/lib/actions/prospects"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getTrashedFolders } from "@/lib/actions/prospect-folders"

interface ProspectsPageClientProps {
  initialFolders: Array<{
    id: string
    name: string
    color: string
    icon: string
    prospectCount: number
  }>
  initialTrashedCount: number
}

export function ProspectsPageClient({ initialFolders, initialTrashedCount }: ProspectsPageClientProps) {
  const [folders, setFolders] = useState(initialFolders)
  const [trashedFolders, setTrashedFolders] = useState<any[]>([])
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
  const [showTrash, setShowTrash] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [trashedCount, setTrashedCount] = useState(initialTrashedCount)
  const [activeTab, setActiveTab] = useState("all")
  const [selectedProspects, setSelectedProspects] = useState<string[]>([])
  const [duplicateGroups, setDuplicateGroups] = useState<any[]>([])
  const [showDuplicates, setShowDuplicates] = useState(false)
  const [isScanning, setIsScanning] = useState(false)

  const showFolderGrid = !selectedFolderId && !showTrash

  const handleToggleSelect = (id: string) => {
    setSelectedProspects((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]))
  }

  const handleToggleSelectAll = (ids: string[]) => {
    setSelectedProspects((prev) => (prev.length === ids.length ? [] : ids))
  }

  const handleScanDuplicates = async () => {
    setIsScanning(true)
    toast.info("Scanning for duplicates...")

    try {
      const groups = await findDuplicates("")
      setDuplicateGroups(groups)

      if (groups.length === 0) {
        toast.success("No duplicates found!")
      } else {
        toast.success(`Found ${groups.length} duplicate group(s)`)
        setShowDuplicates(true)
      }
    } catch (error) {
      toast.error("Failed to scan for duplicates")
    } finally {
      setIsScanning(false)
    }
  }

  const handleBulkMoveToFolder = async (folderId: string | null) => {
    if (selectedProspects.length === 0) {
      toast.error("Please select prospects first")
      return
    }

    const result = await bulkMoveToFolder(selectedProspects, folderId)

    if (result.success) {
      toast.success(`Moved ${selectedProspects.length} prospect(s)`)
      setSelectedProspects([])
      window.location.reload()
    } else {
      toast.error("Failed to move prospects")
    }
  }

  const handleBulkDelete = async () => {
    if (selectedProspects.length === 0) {
      toast.error("Please select prospects first")
      return
    }

    if (!confirm(`Move ${selectedProspects.length} prospect(s) to trash?`)) {
      return
    }

    const result = await bulkDeleteProspects(selectedProspects)

    if (result.success) {
      toast.success(`Moved ${selectedProspects.length} prospect(s) to trash`)
      setSelectedProspects([])
      window.location.reload()
    } else {
      toast.error("Failed to delete prospects")
    }
  }

  const handleBulkRestore = async () => {
    if (selectedProspects.length === 0) {
      toast.error("Please select prospects first")
      return
    }

    const result = await bulkRestoreProspects(selectedProspects)

    if (result.success) {
      toast.success(`Restored ${selectedProspects.length} prospect(s)`)
      setSelectedProspects([])
      window.location.reload()
    } else {
      toast.error("Failed to restore prospects")
    }
  }

  const duplicateProspectIds = duplicateGroups.flatMap((group) => group.prospects.map((p: any) => p.id))

  const selectedFolder = folders.find((f) => f.id === selectedFolderId)

  useEffect(() => {
    if (showTrash && trashedFolders.length === 0) {
      getTrashedFolders().then(setTrashedFolders)
    }
  }, [showTrash])

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {(selectedFolderId || showTrash) && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setSelectedFolderId(null)
                setShowTrash(false)
              }}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {showTrash ? "Trash" : selectedFolderId ? selectedFolder?.name : "My Folders"}
            </h1>
            <p className="text-muted-foreground">
              {showTrash
                ? "Deleted prospects"
                : selectedFolderId
                  ? `${selectedFolder?.prospectCount || 0} prospects`
                  : `${folders.length} folders • ${folders.reduce((sum, f) => sum + f.prospectCount, 0)} total prospects`}
            </p>
          </div>
        </div>
        {!showTrash && !showFolderGrid && (
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleScanDuplicates} disabled={isScanning}>
              <Wand2 className="h-4 w-4 mr-2" />
              {isScanning ? "Scanning..." : "Find Duplicates"}
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <CRMImportDialog />
            <ApolloLeadFinderDialog subscriptionTier="FREE" researchCredits={0} />
            <UploadProspectsDialog />
            <Button asChild>
              <Link href="/dashboard/prospects/new">
                <Plus className="h-4 w-4 mr-2" />
                Add Prospect
              </Link>
            </Button>
          </div>
        )}
        {showTrash && (
          <Button
            variant="outline"
            onClick={() => {
              setShowTrash(false)
              setSelectedFolderId(null)
            }}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Folders
          </Button>
        )}
      </div>

      {selectedProspects.length > 0 && !showFolderGrid && (
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="default">{selectedProspects.length} selected</Badge>
          </div>
          <div className="flex items-center gap-2">
            {showTrash ? (
              <>
                <Button variant="outline" size="sm" onClick={handleBulkRestore}>
                  <FolderInput className="h-4 w-4 mr-2" />
                  Restore
                </Button>
                <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Permanently
                </Button>
              </>
            ) : (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <FolderInput className="h-4 w-4 mr-2" />
                      Move to Folder
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleBulkMoveToFolder(null)}>All Prospects</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {initialFolders.map((folder) => (
                      <DropdownMenuItem key={folder.id} onClick={() => handleBulkMoveToFolder(folder.id)}>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded" style={{ backgroundColor: folder.color }} />
                          {folder.name}
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Move to Trash
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      {showFolderGrid && (
        <div className="space-y-6">
          <FolderGrid folders={folders} onSelectFolder={setSelectedFolderId} />

          <div className="space-y-4">
            <div className="flex items-center justify-between p-6 border rounded-lg bg-muted/30">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-background flex items-center justify-center">
                  <Trash2 className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold">Trash</h3>
                  <p className="text-sm text-muted-foreground">
                    {trashedCount} deleted prospects • {trashedFolders.length} deleted folders
                  </p>
                </div>
              </div>
              <Button variant="outline" onClick={() => setShowTrash(true)}>
                View Trash
              </Button>
            </div>

            {showTrash && trashedFolders.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {trashedFolders.map((folder) => (
                  <div key={folder.id} className="border rounded-lg p-4 bg-muted/50">
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${folder.color}20` }}
                      >
                        <FolderOpen className="h-5 w-5" style={{ color: folder.color }} />
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={async () => {
                          const { restoreFolder } = await import("@/lib/actions/prospect-folders")
                          const result = await restoreFolder(folder.id)
                          if (result.success) {
                            toast.success("Folder restored!")
                            window.location.reload()
                          }
                        }}
                      >
                        Restore
                      </Button>
                    </div>
                    <h4 className="font-medium text-sm">{folder.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{folder.prospectCount} prospects</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {!showFolderGrid && (
        <>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search prospects..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {showTrash ? (
            <ProspectsList
              folderId={null}
              isTrashed={true}
              searchQuery={searchQuery}
              selectedProspects={selectedProspects}
              onToggleSelect={handleToggleSelect}
              onToggleSelectAll={handleToggleSelectAll}
              duplicateProspectIds={duplicateProspectIds}
              key={`trash-${searchQuery}`}
            />
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList>
                <TabsTrigger value="all">All Prospects</TabsTrigger>
                <TabsTrigger value="ACTIVE">Active</TabsTrigger>
                <TabsTrigger value="CONTACTED">Contacted</TabsTrigger>
                <TabsTrigger value="REPLIED">Replied</TabsTrigger>
                <TabsTrigger value="UNSUBSCRIBED">Unsubscribed</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                <ProspectsList
                  folderId={selectedFolderId}
                  searchQuery={searchQuery}
                  selectedProspects={selectedProspects}
                  onToggleSelect={handleToggleSelect}
                  onToggleSelectAll={handleToggleSelectAll}
                  duplicateProspectIds={duplicateProspectIds}
                  key={`all-${selectedFolderId}-${searchQuery}`}
                />
              </TabsContent>

              <TabsContent value="ACTIVE" className="space-y-4">
                <ProspectsList
                  status="ACTIVE"
                  folderId={selectedFolderId}
                  searchQuery={searchQuery}
                  selectedProspects={selectedProspects}
                  onToggleSelect={handleToggleSelect}
                  onToggleSelectAll={handleToggleSelectAll}
                  duplicateProspectIds={duplicateProspectIds}
                  key={`active-${selectedFolderId}-${searchQuery}`}
                />
              </TabsContent>

              <TabsContent value="CONTACTED" className="space-y-4">
                <ProspectsList
                  status="CONTACTED"
                  folderId={selectedFolderId}
                  searchQuery={searchQuery}
                  selectedProspects={selectedProspects}
                  onToggleSelect={handleToggleSelect}
                  onToggleSelectAll={handleToggleSelectAll}
                  duplicateProspectIds={duplicateProspectIds}
                  key={`contacted-${selectedFolderId}-${searchQuery}`}
                />
              </TabsContent>

              <TabsContent value="REPLIED" className="space-y-4">
                <ProspectsList
                  status="REPLIED"
                  folderId={selectedFolderId}
                  searchQuery={searchQuery}
                  selectedProspects={selectedProspects}
                  onToggleSelect={handleToggleSelect}
                  onToggleSelectAll={handleToggleSelectAll}
                  duplicateProspectIds={duplicateProspectIds}
                  key={`replied-${selectedFolderId}-${searchQuery}`}
                />
              </TabsContent>

              <TabsContent value="UNSUBSCRIBED" className="space-y-4">
                <ProspectsList
                  status="UNSUBSCRIBED"
                  folderId={selectedFolderId}
                  searchQuery={searchQuery}
                  selectedProspects={selectedProspects}
                  onToggleSelect={handleToggleSelect}
                  onToggleSelectAll={handleToggleSelectAll}
                  duplicateProspectIds={duplicateProspectIds}
                  key={`unsubscribed-${selectedFolderId}-${searchQuery}`}
                />
              </TabsContent>
            </Tabs>
          )}
        </>
      )}

      <DuplicateDetectorDialog
        open={showDuplicates}
        onOpenChange={setShowDuplicates}
        duplicateGroups={duplicateGroups}
        onResolved={() => {
          setDuplicateGroups([])
          setSelectedProspects([])
        }}
      />
    </div>
  )
}
