
// "use client"

// import type React from "react"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Card, CardContent } from "@/components/ui/card"
// import { Folder, FolderOpen, MoreVertical, Edit2, Check, X, Palette } from "lucide-react"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Label } from "@/components/ui/label"
// import { Trash2Icon } from "lucide-react"
// import {
//   createFolder,
//   updateFolder,
//   mergeFolders,
//   trashFolder,
//   checkDuplicatesBeforeMerge,
// } from "@/lib/actions/prospect-folders"
// import { toast } from "sonner"
// import { cn } from "@/lib/utils"
// import { DuplicateDetectorDialog } from "./duplicate-detector-dialog"

// const FOLDER_COLORS = [
//   { name: "Blue", value: "#3b82f6" },
//   { name: "Purple", value: "#a855f7" },
//   { name: "Pink", value: "#ec4899" },
//   { name: "Red", value: "#ef4444" },
//   { name: "Orange", value: "#f97316" },
//   { name: "Yellow", value: "#eab308" },
//   { name: "Green", value: "#22c55e" },
//   { name: "Teal", value: "#14b8a6" },
//   { name: "Cyan", value: "#06b6d4" },
//   { name: "Indigo", value: "#6366f1" },
// ]

// interface FolderGridProps {
//   folders: Array<{
//     id: string
//     name: string
//     color: string
//     icon: string
//     prospectCount: number
//   }>
//   onSelectFolder: (folderId: string | null) => void
// }

// export function FolderGrid({ folders, onSelectFolder }: FolderGridProps) {
//   const [isCreating, setIsCreating] = useState(false)
//   const [newFolderName, setNewFolderName] = useState("")
//   const [newFolderColor, setNewFolderColor] = useState("#3b82f6")
//   const [editingId, setEditingId] = useState<string | null>(null)
//   const [editName, setEditName] = useState("")
//   const [editColor, setEditColor] = useState("")
//   const [draggedFolder, setDraggedFolder] = useState<string | null>(null)
//   const [dropTarget, setDropTarget] = useState<string | null>(null)
//   const [mergeDialogOpen, setMergeDialogOpen] = useState(false)
//   const [mergeSource, setMergeSource] = useState<string | null>(null)
//   const [mergeTarget, setMergeTarget] = useState<string | null>(null)
//   const [trashSourceFolder, setTrashSourceFolder] = useState(false)
//   const [trashTargetFolder, setTrashTargetFolder] = useState(false)
//   const [mergeNameDialogOpen, setMergeNameDialogOpen] = useState(false)
//   const [newMergedFolderName, setNewMergedFolderName] = useState("")
//   const [duplicateCheckDialogOpen, setDuplicateCheckDialogOpen] = useState(false)
//   const [duplicatesFound, setDuplicatesFound] = useState<any[]>([])
//   const [isCheckingDuplicates, setIsCheckingDuplicates] = useState(false)
//   const [duplicateDialogOpen, setDuplicateDialogOpen] = useState(false)
//   const [duplicateGroups, setDuplicateGroups] = useState<any[]>([])
//   const [prospectsToExclude, setProspectsToExclude] = useState<string[]>([])
//   const [hoveredFolderId, setHoveredFolderId] = useState<string | null>(null)

//   const handleCreateFolder = async () => {
//     if (!newFolderName.trim()) {
//       toast.error("Please enter a folder name")
//       return
//     }

//     if (folders.some((f) => f.name.toLowerCase() === newFolderName.toLowerCase())) {
//       toast.error("A folder with this name already exists")
//       return
//     }

//     const result = await createFolder(newFolderName, newFolderColor, "folder")

//     if (result.success) {
//       toast.success("Folder created!")
//       setNewFolderName("")
//       setNewFolderColor("#3b82f6")
//       setIsCreating(false)
//       window.location.reload()
//     } else {
//       toast.error(result.error || "Failed to create folder")
//     }
//   }

//   const handleStartEdit = (folder: { id: string; name: string; color: string }) => {
//     setEditingId(folder.id)
//     setEditName(folder.name)
//     setEditColor(folder.color)
//   }

//   const handleSaveEdit = async (folderId: string) => {
//     if (!editName.trim()) {
//       toast.error("Folder name cannot be empty")
//       return
//     }

//     if (folders.some((f) => f.id !== folderId && f.name.toLowerCase() === editName.toLowerCase())) {
//       toast.error("A folder with this name already exists")
//       return
//     }

//     const loadingToast = toast.loading("Updating folder...")
//     const result = await updateFolder(folderId, editName, editColor)

//     toast.dismiss(loadingToast)
//     if (result.success) {
//       toast.success("Folder updated!")
//       setEditingId(null)
//       window.location.reload()
//     } else {
//       toast.error(result.error || "Failed to update folder")
//     }
//   }

//   const handleTrashFolder = async (folderId: string, folderName: string, e: React.MouseEvent) => {
//     e.stopPropagation()

//     const loadingToast = toast.loading("Moving folder to trash...")
//     const result = await trashFolder(folderId)

//     toast.dismiss(loadingToast)
//     if (result.success) {
//       toast.success(`"${folderName}" moved to trash. You can restore it anytime.`, {
//         duration: 5000,
//       })
//       window.location.reload()
//     } else {
//       toast.error(result.error || "Failed to trash folder")
//     }
//   }

//   const handleDragStart = (e: React.DragEvent, folderId: string) => {
//     setDraggedFolder(folderId)
//     e.dataTransfer.effectAllowed = "move"
//   }

//   const handleDragOver = (e: React.DragEvent, folderId: string) => {
//     e.preventDefault()
//     e.dataTransfer.dropEffect = "move"
//     if (draggedFolder && draggedFolder !== folderId) {
//       setDropTarget(folderId)
//     }
//   }

//   const handleDragLeave = () => {
//     setDropTarget(null)
//   }

//   const handleDrop = (e: React.DragEvent, targetFolderId: string) => {
//     e.preventDefault()
//     if (draggedFolder && draggedFolder !== targetFolderId) {
//       const sourceFolder = folders.find((f) => f.id === draggedFolder)
//       const targetFolder = folders.find((f) => f.id === targetFolderId)

//       if (sourceFolder && targetFolder) {
//         setNewMergedFolderName(`${sourceFolder.name} + ${targetFolder.name}`)
//       }

//       setMergeSource(draggedFolder)
//       setMergeTarget(targetFolderId)
//       setMergeNameDialogOpen(true)
//     }
//     setDraggedFolder(null)
//     setDropTarget(null)
//   }

//   const handleProceedToMerge = async () => {
//     if (!newMergedFolderName.trim()) {
//       toast.error("Please enter a folder name")
//       return
//     }

//     if (folders.some((f) => f.name.toLowerCase() === newMergedFolderName.toLowerCase())) {
//       toast.error("A folder with this name already exists")
//       return
//     }

//     setMergeNameDialogOpen(false)

//     const checkingToast = toast.loading("Checking for duplicates...")
//     const checkResult = await checkDuplicatesBeforeMerge([mergeSource!, mergeTarget!])
//     toast.dismiss(checkingToast)

//     if (!checkResult.success) {
//       toast.error(checkResult.error || "Failed to check duplicates")
//       return
//     }

//     if (checkResult.hasDuplicates) {
//       toast.info(`Found ${checkResult.duplicateGroups.length} duplicate group(s)`, { duration: 3000 })
//       setDuplicateGroups(checkResult.duplicateGroups)
//       setDuplicateDialogOpen(true)
//     } else {
//       toast.success("No duplicates found!")
//       setMergeDialogOpen(true)
//     }
//   }

//   const handleDuplicatesResolved = (excludeIds: string[]) => {
//     setProspectsToExclude(excludeIds)
//     setDuplicateDialogOpen(false)
//     setMergeDialogOpen(true)
//   }

//   const handleMergeFolders = async () => {
//     if (!mergeSource || !mergeTarget) return

//     const sourceFolder = folders.find((f) => f.id === mergeSource)
//     const targetFolder = folders.find((f) => f.id === mergeTarget)

//     if (!sourceFolder || !targetFolder) return

//     setIsCheckingDuplicates(true)
//     const mergingToast = toast.loading("Merging folders...")

//     const result = await mergeFolders(
//       [mergeSource, mergeTarget],
//       newMergedFolderName,
//       {
//         source: trashSourceFolder,
//         target: trashTargetFolder,
//       },
//       prospectsToExclude,
//     )

//     toast.dismiss(mergingToast)

//     if (result.success) {
//       setMergeDialogOpen(false)
//       setMergeSource(null)
//       setMergeTarget(null)
//       setTrashSourceFolder(false)
//       setTrashTargetFolder(false)
//       setNewMergedFolderName("")
//       setProspectsToExclude([])
//       setIsCheckingDuplicates(false)

//       // Optional chaining for duplicatesRemoved
//       if (result.duplicatesRemoved && result.duplicatesRemoved > 0) {
//         toast.success(`Folders merged! Removed ${result.duplicatesRemoved} duplicate(s).`, {
//           duration: 3000,
//         })
//       } else {
//         toast.success("Folders merged successfully!", {
//           duration: 3000,
//         })
//       }

//       setTimeout(() => window.location.reload(), 1000)
//     } else {
//       toast.error(result.error || "Failed to merge folders")
//       setIsCheckingDuplicates(false)
//     }
//   }

//   return (
//     <div className="space-y-6">
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
//         {isCreating ? (
//           <Card className="border-2 border-dashed border-primary/50 hover:border-primary transition-colors">
//             <CardContent className="p-6 space-y-4">
//               <Input
//                 placeholder="Folder name"
//                 value={newFolderName}
//                 onChange={(e) => setNewFolderName(e.target.value)}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter") handleCreateFolder()
//                   if (e.key === "Escape") setIsCreating(false)
//                 }}
//                 autoFocus
//                 className="h-9"
//               />
//               <Popover>
//                 <PopoverTrigger asChild>
//                   <Button variant="outline" size="sm" className="w-full bg-transparent">
//                     <Palette className="h-4 w-4 mr-2" />
//                     <div className="w-4 h-4 rounded" style={{ backgroundColor: newFolderColor }} />
//                   </Button>
//                 </PopoverTrigger>
//                 <PopoverContent className="w-auto p-3">
//                   <div className="grid grid-cols-5 gap-2">
//                     {FOLDER_COLORS.map((color) => (
//                       <button
//                         key={color.value}
//                         className={cn(
//                           "w-8 h-8 rounded-md border-2 transition-all hover:scale-110",
//                           newFolderColor === color.value ? "border-foreground scale-110" : "border-transparent",
//                         )}
//                         style={{ backgroundColor: color.value }}
//                         onClick={() => setNewFolderColor(color.value)}
//                         title={color.name}
//                       />
//                     ))}
//                   </div>
//                 </PopoverContent>
//               </Popover>
//               <div className="flex gap-2">
//                 <Button size="sm" onClick={handleCreateFolder} className="flex-1">
//                   <Check className="h-4 w-4 mr-1" />
//                   Create
//                 </Button>
//                 <Button size="sm" variant="ghost" onClick={() => setIsCreating(false)}>
//                   <X className="h-4 w-4" />
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         ) : (
//           <Card
//             className="border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 transition-colors cursor-pointer group"
//             onClick={() => setIsCreating(true)}
//           >
//             <CardContent className="p-6 flex flex-col items-center justify-center min-h-[160px]">
//               <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors">
//                 <Folder className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
//               </div>
//               <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
//                 New Folder
//               </p>
//             </CardContent>
//           </Card>
//         )}

//         {folders.map((folder) => (
//           <Card
//             key={folder.id}
//             draggable={!editingId}
//             onDragStart={(e) => handleDragStart(e, folder.id)}
//             onDragOver={(e) => handleDragOver(e, folder.id)}
//             onDragLeave={handleDragLeave}
//             onDrop={(e) => handleDrop(e, folder.id)}
//             onMouseEnter={() => setHoveredFolderId(folder.id)}
//             onMouseLeave={() => setHoveredFolderId(null)}
//             className={cn(
//               "group hover:shadow-lg transition-all duration-200 cursor-pointer border-2 relative",
//               dropTarget === folder.id && "ring-2 ring-primary ring-offset-2 scale-105",
//             )}
//             style={{ borderColor: `${folder.color}30` }}
//             onClick={() => !editingId && onSelectFolder(folder.id)}
//           >
//             <CardContent className="p-6 relative">
//               {hoveredFolderId === folder.id && !editingId && (
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   className="absolute top-2 left-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
//                   onClick={(e) => handleTrashFolder(folder.id, folder.name, e)}
//                 >
//                   <Trash2Icon className="h-4 w-4" />
//                 </Button>
//               )}

//               {editingId === folder.id ? (
//                 <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
//                   <Input
//                     value={editName}
//                     onChange={(e) => setEditName(e.target.value)}
//                     onKeyDown={(e) => {
//                       if (e.key === "Enter") handleSaveEdit(folder.id)
//                       if (e.key === "Escape") setEditingId(null)
//                     }}
//                     autoFocus
//                     className="h-8 text-sm"
//                   />
//                   <Popover>
//                     <PopoverTrigger asChild>
//                       <Button variant="outline" size="sm" className="w-full bg-transparent">
//                         <Palette className="h-4 w-4 mr-2" />
//                         <div className="w-4 h-4 rounded" style={{ backgroundColor: editColor }} />
//                       </Button>
//                     </PopoverTrigger>
//                     <PopoverContent className="w-auto p-3">
//                       <div className="grid grid-cols-5 gap-2">
//                         {FOLDER_COLORS.map((color) => (
//                           <button
//                             key={color.value}
//                             className={cn(
//                               "w-8 h-8 rounded-md border-2 transition-all hover:scale-110",
//                               editColor === color.value ? "border-foreground scale-110" : "border-transparent",
//                             )}
//                             style={{ backgroundColor: color.value }}
//                             onClick={() => setEditColor(color.value)}
//                             title={color.name}
//                           />
//                         ))}
//                       </div>
//                     </PopoverContent>
//                   </Popover>
//                   <div className="flex gap-2">
//                     <Button size="sm" onClick={() => handleSaveEdit(folder.id)} className="flex-1">
//                       <Check className="h-4 w-4" />
//                     </Button>
//                     <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
//                       <X className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </div>
//               ) : (
//                 <>
//                   <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
//                     <DropdownMenu>
//                       <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
//                         <Button variant="ghost" size="icon" className="h-8 w-8">
//                           <MoreVertical className="h-4 w-4" />
//                         </Button>
//                       </DropdownMenuTrigger>
//                       <DropdownMenuContent align="end">
//                         <DropdownMenuItem
//                           onClick={(e) => {
//                             e.stopPropagation()
//                             handleStartEdit(folder)
//                           }}
//                         >
//                           <Edit2 className="h-4 w-4 mr-2" />
//                           Rename
//                         </DropdownMenuItem>
//                       </DropdownMenuContent>
//                     </DropdownMenu>
//                   </div>

//                   <div className="flex flex-col items-center text-center space-y-3">
//                     <div
//                       className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110"
//                       style={{ backgroundColor: `${folder.color}20` }}
//                     >
//                       <FolderOpen className="h-8 w-8 transition-all" style={{ color: folder.color }} />
//                     </div>
//                     <div>
//                       <h3 className="font-semibold text-sm line-clamp-1">{folder.name}</h3>
//                       <p className="text-xs text-muted-foreground mt-1">{folder.prospectCount} prospects</p>
//                     </div>
//                   </div>
//                 </>
//               )}
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       <Dialog open={mergeNameDialogOpen} onOpenChange={setMergeNameDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Name Your Merged Folder</DialogTitle>
//             <DialogDescription>
//               Choose a name for the folder created from merging{" "}
//               <strong>{folders.find((f) => f.id === mergeSource)?.name}</strong> and{" "}
//               <strong>{folders.find((f) => f.id === mergeTarget)?.name}</strong>
//             </DialogDescription>
//           </DialogHeader>
//           <div className="py-4">
//             <Input
//               placeholder="New folder name"
//               value={newMergedFolderName}
//               onChange={(e) => setNewMergedFolderName(e.target.value)}
//               onKeyDown={(e) => {
//                 if (e.key === "Enter") handleProceedToMerge()
//               }}
//               autoFocus
//             />
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setMergeNameDialogOpen(false)}>
//               Cancel
//             </Button>
//             <Button onClick={handleProceedToMerge}>Continue</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       <Dialog open={mergeDialogOpen} onOpenChange={setMergeDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Merge Folder Options</DialogTitle>
//             <DialogDescription>Choose what to do with the original folders after merging.</DialogDescription>
//           </DialogHeader>
//           <div className="space-y-4 py-4">
//             <div className="flex items-center space-x-2">
//               <Checkbox
//                 id="trash-source"
//                 checked={trashSourceFolder}
//                 onCheckedChange={(checked) => setTrashSourceFolder(checked as boolean)}
//               />
//               <Label htmlFor="trash-source" className="text-sm font-normal cursor-pointer">
//                 Trash <strong>{folders.find((f) => f.id === mergeSource)?.name}</strong> after merge
//               </Label>
//             </div>
//             <div className="flex items-center space-x-2">
//               <Checkbox
//                 id="trash-target"
//                 checked={trashTargetFolder}
//                 onCheckedChange={(checked) => setTrashTargetFolder(checked as boolean)}
//               />
//               <Label htmlFor="trash-target" className="text-sm font-normal cursor-pointer">
//                 Trash <strong>{folders.find((f) => f.id === mergeTarget)?.name}</strong> after merge
//               </Label>
//             </div>
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setMergeDialogOpen(false)}>
//               Cancel
//             </Button>
//             <Button onClick={handleMergeFolders} disabled={isCheckingDuplicates}>
//               {isCheckingDuplicates ? "Checking..." : "Merge Folders"}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       <Dialog
//         open={duplicateCheckDialogOpen}
//         onOpenChange={(open) => {
//           setDuplicateCheckDialogOpen(open)
//           if (!open) {
//             setTimeout(() => window.location.reload(), 500)
//           }
//         }}
//       >
//         <DialogContent className="max-w-2xl">
//           <DialogHeader>
//             <DialogTitle>Duplicates Found and Removed</DialogTitle>
//             <DialogDescription>
//               We found and automatically removed {duplicatesFound.length} duplicate(s) during the merge. Here's what was
//               removed:
//             </DialogDescription>
//           </DialogHeader>
//           <div className="max-h-96 overflow-y-auto space-y-3">
//             {duplicatesFound.map((dup, idx) => (
//               <div key={idx} className="border rounded-lg p-3 space-y-2">
//                 <p className="font-medium text-sm">Duplicate Email: {dup.duplicate.email}</p>
//                 <div className="grid grid-cols-2 gap-3 text-xs">
//                   <div className="space-y-1">
//                     <p className="text-muted-foreground">✅ Kept:</p>
//                     <p>
//                       <strong>Name:</strong> {dup.original.firstName} {dup.original.lastName}
//                     </p>
//                     <p>
//                       <strong>Company:</strong> {dup.original.company || "N/A"}
//                     </p>
//                   </div>
//                   <div className="space-y-1">
//                     <p className="text-muted-foreground">❌ Removed:</p>
//                     <p>
//                       <strong>Name:</strong> {dup.duplicate.firstName} {dup.duplicate.lastName}
//                     </p>
//                     <p>
//                       <strong>Company:</strong> {dup.duplicate.company || "N/A"}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//           <DialogFooter>
//             <Button onClick={() => setDuplicateCheckDialogOpen(false)}>Close</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       <DuplicateDetectorDialog
//         open={duplicateDialogOpen}
//         onOpenChange={setDuplicateDialogOpen}
//         duplicateGroups={duplicateGroups}
//         onResolved={handleDuplicatesResolved}
//       />
//     </div>
//   )
// }

"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  FolderIcon,
  Check,
  X,
  Upload,
  Users,
  GitMerge,
  AlertTriangle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { createFolder, updateFolder, trashFolder, mergeFolders } from "@/lib/actions/prospect-folders"
import { SmartImportDialog } from "@/components/prospects/smart-import-dialog"

interface Folder {
  id: string
  name: string
  color: string
  icon: string
  prospectCount: number
}

interface FolderGridProps {
  folders: Folder[]
  onSelectFolder: (folderId: string | null) => void
  onImportComplete?: () => void | Promise<void>
}

export function FolderGrid({ folders: initialFolders, onSelectFolder, onImportComplete }: FolderGridProps) {
  const [folders, setFolders] = useState(initialFolders)
  const [isCreating, setIsCreating] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [newFolderColor, setNewFolderColor] = useState("#3B82F6") // Blue
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [editColor, setEditColor] = useState("")
  const [hoveredFolderId, setHoveredFolderId] = useState<string | null>(null)

  // Drag and drop for merge
  const [draggedFolder, setDraggedFolder] = useState<string | null>(null)
  const [dropTarget, setDropTarget] = useState<string | null>(null)
  const [mergeDialogOpen, setMergeDialogOpen] = useState(false)
  const [mergeSource, setMergeSource] = useState<string | null>(null)
  const [mergeTarget, setMergeTarget] = useState<string | null>(null)
  const [mergedFolderName, setMergedFolderName] = useState("")
  const [trashSourceFolder, setTrashSourceFolder] = useState(true)
  const [trashTargetFolder, setTrashTargetFolder] = useState(false)

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      toast.error("Please enter a folder name")
      return
    }

    if (folders.some((f) => f.name.toLowerCase() === newFolderName.toLowerCase())) {
      toast.error("A folder with this name already exists")
      return
    }

    const result = await createFolder(newFolderName.trim(), newFolderColor)

    if (result.success && result.folder) {
      setFolders([...folders, result.folder])
      setNewFolderName("")
      setNewFolderColor("#3B82F6") // Blue
      setIsCreating(false)
      toast.success("Folder created!")
    } else {
      toast.error("Failed to create folder")
    }
  }

  const handleSaveEdit = async (folderId: string) => {
    if (!editName.trim()) {
      toast.error("Folder name cannot be empty")
      return
    }

    if (folders.some((f) => f.id !== folderId && f.name.toLowerCase() === editName.toLowerCase())) {
      toast.error("A folder with this name already exists")
      return
    }

    const result = await updateFolder(folderId, editName.trim(), editColor)

    if (result.success) {
      setFolders(folders.map((f) => (f.id === folderId ? { ...f, name: editName.trim(), color: editColor } : f)))
      setEditingId(null)
      toast.success("Folder updated!")
    } else {
      toast.error("Failed to update folder")
    }
  }

  const handleTrashFolder = async (folderId: string, folderName: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm(`Move "${folderName}" to trash? Prospects will be moved to "All Prospects".`)) return

    const result = await trashFolder(folderId)

    if (result.success) {
      setFolders(folders.filter((f) => f.id !== folderId))
      toast.success("Folder moved to trash")
    } else {
      toast.error("Failed to trash folder")
    }
  }

  const handleDragStart = (e: React.DragEvent, folderId: string) => {
    setDraggedFolder(folderId)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent, folderId: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    if (draggedFolder && draggedFolder !== folderId) {
      setDropTarget(folderId)
    }
  }

  const handleDragLeave = () => {
    setDropTarget(null)
  }

  const handleDrop = (e: React.DragEvent, targetFolderId: string) => {
    e.preventDefault()
    if (draggedFolder && draggedFolder !== targetFolderId) {
      const sourceFolder = folders.find((f) => f.id === draggedFolder)
      const targetFolder = folders.find((f) => f.id === targetFolderId)

      if (sourceFolder && targetFolder) {
        setMergeSource(draggedFolder)
        setMergeTarget(targetFolderId)
        setMergedFolderName(targetFolder.name)
        setMergeDialogOpen(true)
      }
    }
    setDraggedFolder(null)
    setDropTarget(null)
  }

  const handleDragEnd = () => {
    setDraggedFolder(null)
    setDropTarget(null)
  }

  const handleMergeFolders = async () => {
    if (!mergeSource || !mergeTarget) return

    const result = await mergeFolders(
      [mergeSource, mergeTarget],
      mergedFolderName || targetFolder?.name || "Merged Folder",
      { source: trashSourceFolder, target: trashTargetFolder },
    )

    if (result.success) {
      let updatedFolders = [...folders]

      if (trashSourceFolder) {
        updatedFolders = updatedFolders.filter((f) => f.id !== mergeSource)
      }
      if (trashTargetFolder) {
        updatedFolders = updatedFolders.filter((f) => f.id !== mergeTarget)
      }

      if (result.folderId) {
        updatedFolders.push({
          id: result.folderId,
          name: mergedFolderName || targetFolder?.name || "Merged Folder",
          color: targetFolder?.color || "#6366f1",
          icon: "folder",
          prospectCount: result.prospectsAdded || 0,
        })
      }

      setFolders(updatedFolders)
      toast.success(`Merged folders successfully! ${result.duplicatesRemoved || 0} duplicates removed.`)
      setMergeDialogOpen(false)
      setMergeSource(null)
      setMergeTarget(null)
      setMergedFolderName("")
      setTrashSourceFolder(true)
      setTrashTargetFolder(false)
    } else {
      toast.error(result.error || "Failed to merge folders")
    }
  }

  const sourceFolder = mergeSource ? folders.find((f) => f.id === mergeSource) : null
  const targetFolder = mergeTarget ? folders.find((f) => f.id === mergeTarget) : null

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {folders.map((folder) => (
          <Card
            key={folder.id}
            className={cn(
              "group cursor-pointer transition-all hover:shadow-md border-2",
              draggedFolder === folder.id && "opacity-50",
              dropTarget === folder.id && "border-primary border-dashed bg-primary/5",
            )}
            draggable={!editingId}
            onDragStart={(e) => handleDragStart(e, folder.id)}
            onDragOver={(e) => handleDragOver(e, folder.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, folder.id)}
            onDragEnd={handleDragEnd}
            onClick={() => !editingId && onSelectFolder(folder.id)}
            onMouseEnter={() => setHoveredFolderId(folder.id)}
            onMouseLeave={() => setHoveredFolderId(null)}
          >
            <CardContent className="p-6 relative">
              {hoveredFolderId === folder.id && !editingId && (
                <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <SmartImportDialog
                    folderId={folder.id}
                    folderName={folder.name}
                    onImportComplete={onImportComplete}
                    trigger={
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                        <Upload className="h-4 w-4" />
                      </Button>
                    }
                  />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          setEditingId(folder.id)
                          setEditName(folder.name)
                          setEditColor(folder.color)
                        }}
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={(e) => handleTrashFolder(folder.id, folder.name, e)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Move to Trash
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}

              {editingId === folder.id ? (
                <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Folder name"
                    autoFocus
                  />
                  <div className="flex flex-wrap gap-2">
                    {["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#06B6D4", "#F97316"].map(
                      (color) => (
                        <button
                          key={color}
                          className={cn(
                            "w-6 h-6 rounded-full transition-transform hover:scale-110",
                            editColor === color && "ring-2 ring-offset-2 ring-primary",
                          )}
                          style={{ backgroundColor: color }}
                          onClick={() => setEditColor(color)}
                        />
                      ),
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleSaveEdit(folder.id)}>
                      <Check className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${folder.color}20` }}
                    >
                      <FolderIcon className="h-6 w-6" style={{ color: folder.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{folder.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {folder.prospectCount} {folder.prospectCount === 1 ? "prospect" : "prospects"}
                      </p>
                    </div>
                  </div>

                  {dropTarget === folder.id && (
                    <div className="absolute inset-0 flex items-center justify-center bg-primary/10 rounded-lg">
                      <div className="flex items-center gap-2 text-primary font-medium">
                        <GitMerge className="h-5 w-5" />
                        Drop to merge
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        ))}

        {isCreating ? (
          <Card className="border-2 border-dashed">
            <CardContent className="p-6 space-y-4">
              <Input
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Folder name"
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && handleCreateFolder()}
              />
              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">Color</Label>
                <div className="flex flex-wrap gap-2">
                  {["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#06B6D4", "#F97316"].map(
                    (color) => (
                      <button
                        key={color}
                        className={cn(
                          "w-6 h-6 rounded-full transition-transform hover:scale-110",
                          newFolderColor === color && "ring-2 ring-offset-2 ring-primary",
                        )}
                        style={{ backgroundColor: color }}
                        onClick={() => setNewFolderColor(color)}
                      />
                    ),
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleCreateFolder}>
                  <Check className="h-4 w-4 mr-1" />
                  Create
                </Button>
                <Button size="sm" variant="outline" onClick={() => setIsCreating(false)}>
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card
            className="border-2 border-dashed cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => setIsCreating(true)}
          >
            <CardContent className="p-6 flex flex-col items-center justify-center h-full min-h-[140px] text-muted-foreground hover:text-foreground transition-colors">
              <Plus className="h-8 w-8 mb-2" />
              <span className="font-medium">New Folder</span>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={mergeDialogOpen} onOpenChange={setMergeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GitMerge className="h-5 w-5" />
              Merge Folders
            </DialogTitle>
            <DialogDescription>This will create a new folder with all prospects from both folders.</DialogDescription>
          </DialogHeader>

          <div className="flex items-center justify-center gap-4 py-6">
            <div className="text-center">
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-2"
                style={{ backgroundColor: `${sourceFolder?.color}20` }}
              >
                <FolderIcon className="h-8 w-8" style={{ color: sourceFolder?.color }} />
              </div>
              <p className="font-medium">{sourceFolder?.name}</p>
              <Badge variant="secondary" className="mt-1">
                <Users className="h-3 w-3 mr-1" />
                {sourceFolder?.prospectCount}
              </Badge>
            </div>

            <GitMerge className="h-6 w-6 text-muted-foreground" />

            <div className="text-center">
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-2"
                style={{ backgroundColor: `${targetFolder?.color}20` }}
              >
                <FolderIcon className="h-8 w-8" style={{ color: targetFolder?.color }} />
              </div>
              <p className="font-medium">{targetFolder?.name}</p>
              <Badge variant="secondary" className="mt-1">
                <Users className="h-3 w-3 mr-1" />
                {targetFolder?.prospectCount}
              </Badge>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mergedFolderName">New Folder Name</Label>
              <Input
                id="mergedFolderName"
                value={mergedFolderName}
                onChange={(e) => setMergedFolderName(e.target.value)}
                placeholder={targetFolder?.name || "Merged Folder"}
              />
            </div>

            <div className="space-y-2">
              <Label>After merging</Label>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={trashSourceFolder}
                    onChange={(e) => setTrashSourceFolder(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  Trash "{sourceFolder?.name}" folder
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={trashTargetFolder}
                    onChange={(e) => setTrashTargetFolder(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  Trash "{targetFolder?.name}" folder
                </label>
              </div>
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-3 flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-muted-foreground">
              The new folder will have up to{" "}
              <strong>{(sourceFolder?.prospectCount || 0) + (targetFolder?.prospectCount || 0)}</strong> prospects.
              Duplicates will be automatically removed.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setMergeDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleMergeFolders}>
              <GitMerge className="h-4 w-4 mr-2" />
              Merge Folders
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
