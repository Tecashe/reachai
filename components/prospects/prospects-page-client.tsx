
// "use client"

// import { useState, useEffect } from "react"
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
// import { getTrashedFolders, restoreFolder, permanentlyDeleteFolder } from "@/lib/actions/prospect-folders"
// import { Card, CardContent } from "@/components/ui/card"

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
//   const [trashedFolders, setTrashedFolders] = useState<any[]>([])
//   const [trashedProspectsCount, setTrashedProspectsCount] = useState(initialTrashedCount)
//   const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
//   const [showTrash, setShowTrash] = useState(false)
//   const [searchQuery, setSearchQuery] = useState("")
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

//   useEffect(() => {
//     if (showTrash) {
//       getTrashedFolders().then(setTrashedFolders)
//     }
//   }, [showTrash])

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
//                 ? "Deleted items can be restored or permanently deleted"
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

//           <Card className="border-dashed">
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-4">
//                   <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
//                     <Trash2 className="h-6 w-6 text-muted-foreground" />
//                   </div>
//                   <div>
//                     <h3 className="font-semibold text-lg">Trash</h3>
//                     <p className="text-sm text-muted-foreground">
//                       {trashedProspectsCount} deleted prospects • {trashedFolders.length} deleted folders
//                     </p>
//                   </div>
//                 </div>
//                 <Button
//                   variant="outline"
//                   onClick={() => setShowTrash(true)}
//                   disabled={trashedProspectsCount === 0 && trashedFolders.length === 0}
//                 >
//                   <Trash2 className="h-4 w-4 mr-2" />
//                   Open Trash
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       )}

//       {showTrash && (
//         <div className="space-y-8">
//           {trashedFolders.length > 0 && (
//             <div className="space-y-4">
//               <div className="flex items-center gap-2">
//                 <h3 className="text-lg font-semibold">Trashed Folders</h3>
//                 <Badge variant="secondary">{trashedFolders.length}</Badge>
//               </div>
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//                 {trashedFolders.map((folder) => (
//                   <Card key={folder.id} className="border-2 border-dashed border-muted-foreground/30">
//                     <CardContent className="p-6">
//                       <div className="flex items-center gap-3 mb-4">
//                         <div
//                           className="w-12 h-12 rounded-xl flex items-center justify-center"
//                           style={{ backgroundColor: `${folder.color}20` }}
//                         >
//                           <Trash2 className="h-6 w-6" style={{ color: folder.color }} />
//                         </div>
//                         <div className="flex-1 min-w-0">
//                           <h4 className="font-semibold truncate">{folder.name}</h4>
//                           <p className="text-xs text-muted-foreground">{folder.prospectCount} prospects</p>
//                         </div>
//                       </div>
//                       <div className="flex gap-2">
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           className="flex-1 bg-transparent"
//                           onClick={async () => {
//                             const result = await restoreFolder(folder.id)
//                             if (result.success) {
//                               toast.success("Folder restored!")
//                               window.location.reload()
//                             } else {
//                               toast.error("Failed to restore folder")
//                             }
//                           }}
//                         >
//                           Restore
//                         </Button>
//                         <Button
//                           variant="destructive"
//                           size="sm"
//                           onClick={async () => {
//                             if (
//                               confirm("Permanently delete this folder? Prospects will be moved to 'All Prospects'.")
//                             ) {
//                               const result = await permanentlyDeleteFolder(folder.id)
//                               if (result.success) {
//                                 toast.success("Folder deleted permanently")
//                                 window.location.reload()
//                               } else {
//                                 toast.error("Failed to delete folder")
//                               }
//                             }
//                           }}
//                         >
//                           Delete
//                         </Button>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             </div>
//           )}

//           {trashedProspectsCount > 0 && (
//             <div className="space-y-4">
//               <div className="flex items-center gap-2">
//                 <h3 className="text-lg font-semibold">Trashed Prospects</h3>
//                 <Badge variant="secondary">{trashedProspectsCount}</Badge>
//               </div>
//               <ProspectsList
//                 folderId={null}
//                 isTrashed={true}
//                 searchQuery={searchQuery}
//                 selectedProspects={selectedProspects}
//                 onToggleSelect={handleToggleSelect}
//                 onToggleSelectAll={handleToggleSelectAll}
//                 duplicateProspectIds={duplicateProspectIds}
//                 key={`trash-${searchQuery}`}
//               />
//             </div>
//           )}

//           {trashedProspectsCount === 0 && trashedFolders.length === 0 && (
//             <Card className="border-dashed">
//               <CardContent className="p-16 text-center">
//                 <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
//                   <Trash2 className="h-10 w-10 text-muted-foreground" />
//                 </div>
//                 <h3 className="text-lg font-semibold mb-2">Trash is empty</h3>
//                 <p className="text-sm text-muted-foreground">Deleted folders and prospects will appear here</p>
//               </CardContent>
//             </Card>
//           )}
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

// import { useState, useEffect, useCallback } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Search, Plus, Download, Wand2, FolderInput, Trash2, ArrowLeft, Upload } from "lucide-react"
// import Link from "next/link"
// import { ProspectsList } from "@/components/prospects/prospects-list"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { SmartImportDialog } from "@/components/prospects/smart-import-dialog"
// import { ApolloLeadFinderDialog } from "@/components/prospects/apollo-lead-finder-dialog"
// import { CRMImportDialog } from "@/components/prospects/crm-import-dialog"
// import { FolderGrid } from "@/components/prospects/folder-grid"
// import { DuplicateDetectorDialog } from "@/components/prospects/duplicate-detector-dialog"
// import { findDuplicates } from "@/lib/services/duplicate-detector"
// import { bulkMoveToFolder, bulkDeleteProspects, bulkRestoreProspects } from "@/lib/actions/prospects"
// import { getFolders } from "@/lib/actions/prospect-folders"
// import { toast } from "sonner"
// import { Badge } from "@/components/ui/badge"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { getTrashedFolders, restoreFolder, permanentlyDeleteFolder } from "@/lib/actions/prospect-folders"
// import { Card, CardContent } from "@/components/ui/card"

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
//   const [trashedFolders, setTrashedFolders] = useState<any[]>([])
//   const [trashedProspectsCount, setTrashedProspectsCount] = useState(initialTrashedCount)
//   const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
//   const [showTrash, setShowTrash] = useState(false)
//   const [searchQuery, setSearchQuery] = useState("")
//   const [activeTab, setActiveTab] = useState("all")
//   const [selectedProspects, setSelectedProspects] = useState<string[]>([])
//   const [duplicateGroups, setDuplicateGroups] = useState<any[]>([])
//   const [showDuplicates, setShowDuplicates] = useState(false)
//   const [isScanning, setIsScanning] = useState(false)

//   const [refreshKey, setRefreshKey] = useState(0)

//   const showFolderGrid = !selectedFolderId && !showTrash

//   const selectedFolder = folders.find((f) => f.id === selectedFolderId)

//   const handleRefreshData = useCallback(async () => {
//     console.log("[v0] Refreshing data after import...")
//     try {
//       // Refresh folders to get updated counts
//       const updatedFolders = await getFolders()
//       setFolders(updatedFolders)

//       // Increment refresh key to trigger ProspectsList re-fetch
//       setRefreshKey((prev) => prev + 1)

//       console.log("[v0] Data refreshed successfully")
//     } catch (error) {
//       console.error("[v0] Failed to refresh data:", error)
//     }
//   }, [])

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
//       handleRefreshData()
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
//       handleRefreshData()
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
//       handleRefreshData()
//     } else {
//       toast.error("Failed to restore prospects")
//     }
//   }

//   const duplicateProspectIds = duplicateGroups.flatMap((group) => group.prospects.map((p: any) => p.id))

//   useEffect(() => {
//     if (showTrash) {
//       getTrashedFolders().then(setTrashedFolders)
//     }
//   }, [showTrash])

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
//                 ? "Deleted items can be restored or permanently deleted"
//                 : selectedFolderId
//                   ? `${selectedFolder?.prospectCount || 0} prospects`
//                   : `${folders.length} folders - ${folders.reduce((sum, f) => sum + f.prospectCount, 0)} total prospects`}
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
//             {/* <CRMImportDialog /> */}

//             <CRMImportDialog 
//               folderId={selectedFolderId||""} 
//               onImportComplete={handleRefreshData} 
//             />

//             <ApolloLeadFinderDialog subscriptionTier="FREE" researchCredits={0} />
//             <SmartImportDialog
//               folderId={selectedFolderId||""}
//               folderName={selectedFolder?.name}
//               onImportComplete={handleRefreshData}
//               trigger={
//                 <Button variant="outline">
//                   <Upload className="h-4 w-4 mr-2" />
//                   Import Prospects
//                 </Button>
//               }
//             />
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
//                     {folders.map((folder) => (
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
//           <FolderGrid folders={folders} onSelectFolder={setSelectedFolderId} onImportComplete={handleRefreshData} />

//           <Card className="border-dashed">
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-4">
//                   <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
//                     <Trash2 className="h-6 w-6 text-muted-foreground" />
//                   </div>
//                   <div>
//                     <h3 className="font-semibold text-lg">Trash</h3>
//                     <p className="text-sm text-muted-foreground">
//                       {trashedProspectsCount} deleted prospects - {trashedFolders.length} deleted folders
//                     </p>
//                   </div>
//                 </div>
//                 <Button
//                   variant="outline"
//                   onClick={() => setShowTrash(true)}
//                   disabled={trashedProspectsCount === 0 && trashedFolders.length === 0}
//                 >
//                   <Trash2 className="h-4 w-4 mr-2" />
//                   Open Trash
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       )}

//       {showTrash && (
//         <div className="space-y-8">
//           {trashedFolders.length > 0 && (
//             <div className="space-y-4">
//               <div className="flex items-center gap-2">
//                 <h3 className="text-lg font-semibold">Trashed Folders</h3>
//                 <Badge variant="secondary">{trashedFolders.length}</Badge>
//               </div>
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//                 {trashedFolders.map((folder) => (
//                   <Card key={folder.id} className="border-2 border-dashed border-muted-foreground/30">
//                     <CardContent className="p-6">
//                       <div className="flex items-center gap-3 mb-4">
//                         <div
//                           className="w-12 h-12 rounded-xl flex items-center justify-center"
//                           style={{ backgroundColor: `${folder.color}20` }}
//                         >
//                           <Trash2 className="h-6 w-6" style={{ color: folder.color }} />
//                         </div>
//                         <div className="flex-1 min-w-0">
//                           <h4 className="font-semibold truncate">{folder.name}</h4>
//                           <p className="text-xs text-muted-foreground">{folder.prospectCount} prospects</p>
//                         </div>
//                       </div>
//                       <div className="flex gap-2">
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           className="flex-1 bg-transparent"
//                           onClick={async () => {
//                             const result = await restoreFolder(folder.id)
//                             if (result.success) {
//                               toast.success("Folder restored!")
//                               handleRefreshData()
//                             } else {
//                               toast.error("Failed to restore folder")
//                             }
//                           }}
//                         >
//                           Restore
//                         </Button>
//                         <Button
//                           variant="destructive"
//                           size="sm"
//                           onClick={async () => {
//                             if (
//                               confirm("Permanently delete this folder? Prospects will be moved to 'All Prospects'.")
//                             ) {
//                               const result = await permanentlyDeleteFolder(folder.id)
//                               if (result.success) {
//                                 toast.success("Folder deleted permanently")
//                                 handleRefreshData()
//                               } else {
//                                 toast.error("Failed to delete folder")
//                               }
//                             }
//                           }}
//                         >
//                           Delete
//                         </Button>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             </div>
//           )}

//           {trashedProspectsCount > 0 && (
//             <div className="space-y-4">
//               <div className="flex items-center gap-2">
//                 <h3 className="text-lg font-semibold">Trashed Prospects</h3>
//                 <Badge variant="secondary">{trashedProspectsCount}</Badge>
//               </div>
//               <ProspectsList
//                 folderId={null}
//                 isTrashed={true}
//                 searchQuery={searchQuery}
//                 selectedProspects={selectedProspects}
//                 onToggleSelect={handleToggleSelect}
//                 onToggleSelectAll={handleToggleSelectAll}
//                 duplicateProspectIds={duplicateProspectIds}
//                 refreshKey={refreshKey}
//                 key={`trash-${searchQuery}`}
//               />
//             </div>
//           )}

//           {trashedProspectsCount === 0 && trashedFolders.length === 0 && (
//             <Card className="border-dashed">
//               <CardContent className="p-16 text-center">
//                 <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
//                   <Trash2 className="h-10 w-10 text-muted-foreground" />
//                 </div>
//                 <h3 className="text-lg font-semibold mb-2">Trash is empty</h3>
//                 <p className="text-sm text-muted-foreground">Deleted folders and prospects will appear here</p>
//               </CardContent>
//             </Card>
//           )}
//         </div>
//       )}

//       {!showFolderGrid && !showTrash && (
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
//                 refreshKey={refreshKey}
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
//                 refreshKey={refreshKey}
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
//                 refreshKey={refreshKey}
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
//                 refreshKey={refreshKey}
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
//                 refreshKey={refreshKey}
//                 key={`unsubscribed-${selectedFolderId}-${searchQuery}`}
//               />
//             </TabsContent>
//           </Tabs>
//         </>
//       )}

//       <DuplicateDetectorDialog
//         open={showDuplicates}
//         onOpenChange={setShowDuplicates}
//         duplicateGroups={duplicateGroups}
//         onResolved={() => {
//           setDuplicateGroups([])
//           handleRefreshData()
//         }}
//       />
//     </div>
//   )
// }










"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Download, Wand2, FolderInput, Trash2, ArrowLeft, Upload } from "lucide-react"
import Link from "next/link"
import { ProspectsList } from "@/components/prospects/prospects-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SmartImportDialog } from "@/components/prospects/smart-import-dialog"
import { ApolloLeadFinderDialog } from "@/components/prospects/apollo-lead-finder-dialog"
import { CRMImportDialog } from "@/components/prospects/crm-import-dialog"
import { FolderGrid } from "@/components/prospects/folder-grid"
import { DuplicateDetectorDialog } from "@/components/prospects/duplicate-detector-dialog"
import { findDuplicates } from "@/lib/services/duplicate-detector"
import { bulkMoveToFolder, bulkDeleteProspects, bulkRestoreProspects } from "@/lib/actions/prospects"
import { getFolders } from "@/lib/actions/prospect-folders"
import { getUserCredits } from "@/lib/actions/user"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getTrashedFolders, restoreFolder, permanentlyDeleteFolder } from "@/lib/actions/prospect-folders"
import { Card, CardContent } from "@/components/ui/card"

interface ProspectsPageClientProps {
  initialFolders: Array<{
    id: string
    name: string
    color: string
    icon: string
    prospectCount: number
  }>
  initialTrashedCount: number
  subscriptionTier: string
  researchCredits: number
}

export function ProspectsPageClient({ 
  initialFolders, 
  initialTrashedCount,
  subscriptionTier,
  researchCredits: initialResearchCredits
}: ProspectsPageClientProps) {
  const [folders, setFolders] = useState(initialFolders)
  const [trashedFolders, setTrashedFolders] = useState<any[]>([])
  const [trashedProspectsCount, setTrashedProspectsCount] = useState(initialTrashedCount)
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
  const [showTrash, setShowTrash] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [selectedProspects, setSelectedProspects] = useState<string[]>([])
  const [duplicateGroups, setDuplicateGroups] = useState<any[]>([])
  const [showDuplicates, setShowDuplicates] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [researchCredits, setResearchCredits] = useState(initialResearchCredits)

  const [refreshKey, setRefreshKey] = useState(0)

  const showFolderGrid = !selectedFolderId && !showTrash

  const selectedFolder = folders.find((f) => f.id === selectedFolderId)

  const handleRefreshData = useCallback(async () => {
    console.log("[v0] Refreshing data after import...")
    try {
      // Refresh folders to get updated counts
      const updatedFolders = await getFolders()
      setFolders(updatedFolders)

      // Increment refresh key to trigger ProspectsList re-fetch
      setRefreshKey((prev) => prev + 1)

      console.log("[v0] Data refreshed successfully")
    } catch (error) {
      console.error("[v0] Failed to refresh data:", error)
    }
  }, [])

  const handleCreditsChange = useCallback(async () => {
    // Refresh credits after Apollo search
    try {
      const { researchCredits: updatedCredits } = await getUserCredits()
      setResearchCredits(updatedCredits)
      console.log("[v0] Credits refreshed:", updatedCredits)
    } catch (error) {
      console.error("[v0] Failed to refresh credits:", error)
      // Fallback to full refresh if credits fetch fails
      handleRefreshData()
    }
  }, [handleRefreshData])

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
      handleRefreshData()
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
      handleRefreshData()
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
      handleRefreshData()
    } else {
      toast.error("Failed to restore prospects")
    }
  }

  const duplicateProspectIds = duplicateGroups.flatMap((group) => group.prospects.map((p: any) => p.id))

  useEffect(() => {
    if (showTrash) {
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
                ? "Deleted items can be restored or permanently deleted"
                : selectedFolderId
                  ? `${selectedFolder?.prospectCount || 0} prospects`
                  : `${folders.length} folders - ${folders.reduce((sum, f) => sum + f.prospectCount, 0)} total prospects`}
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
            {/* <CRMImportDialog /> */}

            <CRMImportDialog 
              folderId={selectedFolderId||""} 
              onImportComplete={handleRefreshData} 
            />

            <ApolloLeadFinderDialog 
              subscriptionTier={subscriptionTier} 
              researchCredits={researchCredits}
              onCreditsChange={handleCreditsChange}
            />
            <SmartImportDialog
              folderId={selectedFolderId||""}
              folderName={selectedFolder?.name}
              onImportComplete={handleRefreshData}
              trigger={
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Import Prospects
                </Button>
              }
            />
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
                    {folders.map((folder) => (
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
          <FolderGrid folders={folders} onSelectFolder={setSelectedFolderId} onImportComplete={handleRefreshData} />

          <Card className="border-dashed">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                    <Trash2 className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Trash</h3>
                    <p className="text-sm text-muted-foreground">
                      {trashedProspectsCount} deleted prospects - {trashedFolders.length} deleted folders
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowTrash(true)}
                  disabled={trashedProspectsCount === 0 && trashedFolders.length === 0}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Open Trash
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {showTrash && (
        <div className="space-y-8">
          {trashedFolders.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">Trashed Folders</h3>
                <Badge variant="secondary">{trashedFolders.length}</Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {trashedFolders.map((folder) => (
                  <Card key={folder.id} className="border-2 border-dashed border-muted-foreground/30">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: `${folder.color}20` }}
                        >
                          <Trash2 className="h-6 w-6" style={{ color: folder.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold truncate">{folder.name}</h4>
                          <p className="text-xs text-muted-foreground">{folder.prospectCount} prospects</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-transparent"
                          onClick={async () => {
                            const result = await restoreFolder(folder.id)
                            if (result.success) {
                              toast.success("Folder restored!")
                              handleRefreshData()
                            } else {
                              toast.error("Failed to restore folder")
                            }
                          }}
                        >
                          Restore
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={async () => {
                            if (
                              confirm("Permanently delete this folder? Prospects will be moved to 'All Prospects'.")
                            ) {
                              const result = await permanentlyDeleteFolder(folder.id)
                              if (result.success) {
                                toast.success("Folder deleted permanently")
                                handleRefreshData()
                              } else {
                                toast.error("Failed to delete folder")
                              }
                            }
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {trashedProspectsCount > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">Trashed Prospects</h3>
                <Badge variant="secondary">{trashedProspectsCount}</Badge>
              </div>
              <ProspectsList
                folderId={null}
                isTrashed={true}
                searchQuery={searchQuery}
                selectedProspects={selectedProspects}
                onToggleSelect={handleToggleSelect}
                onToggleSelectAll={handleToggleSelectAll}
                duplicateProspectIds={duplicateProspectIds}
                refreshKey={refreshKey}
                key={`trash-${searchQuery}`}
              />
            </div>
          )}

          {trashedProspectsCount === 0 && trashedFolders.length === 0 && (
            <Card className="border-dashed">
              <CardContent className="p-16 text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Trash2 className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Trash is empty</h3>
                <p className="text-sm text-muted-foreground">Deleted folders and prospects will appear here</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {!showFolderGrid && !showTrash && (
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
                refreshKey={refreshKey}
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
                refreshKey={refreshKey}
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
                refreshKey={refreshKey}
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
                refreshKey={refreshKey}
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
                refreshKey={refreshKey}
                key={`unsubscribed-${selectedFolderId}-${searchQuery}`}
              />
            </TabsContent>
          </Tabs>
        </>
      )}

      <DuplicateDetectorDialog
        open={showDuplicates}
        onOpenChange={setShowDuplicates}
        duplicateGroups={duplicateGroups}
        onResolved={() => {
          setDuplicateGroups([])
          handleRefreshData()
        }}
      />
    </div>
  )
}