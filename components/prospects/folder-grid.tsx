// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Card, CardContent } from "@/components/ui/card"
// import { Folder, FolderOpen, MoreVertical, Edit2, Trash2, Check, X, Palette } from "lucide-react"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { createFolder, deleteFolder, updateFolder } from "@/lib/actions/prospect-folders"
// import { toast } from "sonner"
// import { cn } from "@/lib/utils"

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

//   const handleCreateFolder = async () => {
//     if (!newFolderName.trim()) {
//       toast.error("Please enter a folder name")
//       return
//     }

//     // Check for duplicate names
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

//     // Check for duplicate names (excluding current folder)
//     if (folders.some((f) => f.id !== folderId && f.name.toLowerCase() === editName.toLowerCase())) {
//       toast.error("A folder with this name already exists")
//       return
//     }

//     const result = await updateFolder(folderId, editName, editColor)

//     if (result.success) {
//       toast.success("Folder updated!")
//       setEditingId(null)
//       window.location.reload()
//     } else {
//       toast.error(result.error || "Failed to update folder")
//     }
//   }

//   const handleDeleteFolder = async (folderId: string, folderName: string) => {
//     if (!confirm(`Delete "${folderName}"? Prospects will be moved to All Prospects.`)) {
//       return
//     }

//     const result = await deleteFolder(folderId)

//     if (result.success) {
//       toast.success("Folder deleted")
//       window.location.reload()
//     } else {
//       toast.error(result.error || "Failed to delete folder")
//     }
//   }

//   return (
//     <div className="space-y-6">
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
//         {/* Create New Folder Card */}
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

//         {/* Existing Folders */}
//         {folders.map((folder) => (
//           <Card
//             key={folder.id}
//             className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-2"
//             style={{ borderColor: `${folder.color}30` }}
//             onClick={() => !editingId && onSelectFolder(folder.id)}
//           >
//             <CardContent className="p-6 relative">
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
//                         <DropdownMenuItem onClick={() => handleStartEdit(folder)}>
//                           <Edit2 className="h-4 w-4 mr-2" />
//                           Rename
//                         </DropdownMenuItem>
//                         <DropdownMenuItem
//                           onClick={() => handleDeleteFolder(folder.id, folder.name)}
//                           className="text-destructive"
//                         >
//                           <Trash2 className="h-4 w-4 mr-2" />
//                           Delete
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
//     </div>
//   )
// }



// "use client"

// import type React from "react"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Card, CardContent } from "@/components/ui/card"
// import { Folder, FolderOpen, MoreVertical, Edit2, Trash2, Check, X, Palette } from "lucide-react"
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
// import { createFolder, deleteFolder, updateFolder, mergeFolders } from "@/lib/actions/prospect-folders"
// import { toast } from "sonner"
// import { cn } from "@/lib/utils"

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
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
//   const [folderToDelete, setFolderToDelete] = useState<{ id: string; name: string } | null>(null)

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

//   const handleDeleteFolder = async (folderId: string, folderName: string) => {
//     setFolderToDelete({ id: folderId, name: folderName })
//     setDeleteDialogOpen(true)
//   }

//   const confirmDelete = async () => {
//     if (!folderToDelete) return

//     const loadingToast = toast.loading("Deleting folder...")
//     const result = await deleteFolder(folderToDelete.id)

//     toast.dismiss(loadingToast)
//     if (result.success) {
//       toast.success("Folder deleted")
//       setDeleteDialogOpen(false)
//       setFolderToDelete(null)
//       window.location.reload()
//     } else {
//       toast.error(result.error || "Failed to delete folder")
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
//       setMergeSource(draggedFolder)
//       setMergeTarget(targetFolderId)
//       setMergeDialogOpen(true)
//     }
//     setDraggedFolder(null)
//     setDropTarget(null)
//   }

//   const handleMergeFolders = async () => {
//     if (!mergeSource || !mergeTarget) return

//     const sourceFolder = folders.find((f) => f.id === mergeSource)
//     const targetFolder = folders.find((f) => f.id === mergeTarget)

//     if (!sourceFolder || !targetFolder) return

//     const loadingToast = toast.loading("Merging folders...")

//     const foldersToDelete = []
//     if (trashSourceFolder) foldersToDelete.push(mergeSource)
//     if (trashTargetFolder) foldersToDelete.push(mergeTarget)

//     const result = await mergeFolders(
//       trashSourceFolder && trashTargetFolder ? [mergeSource, mergeTarget] : [mergeSource],
//       trashTargetFolder ? `${sourceFolder.name} + ${targetFolder.name}` : targetFolder.name,
//     )

//     toast.dismiss(loadingToast)
//     if (result.success) {
//       toast.success("Folders merged successfully!")
//       setMergeDialogOpen(false)
//       setMergeSource(null)
//       setMergeTarget(null)
//       setTrashSourceFolder(false)
//       setTrashTargetFolder(false)
//       window.location.reload()
//     } else {
//       toast.error(result.error || "Failed to merge folders")
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
//             className={cn(
//               "group hover:shadow-lg transition-all duration-200 cursor-pointer border-2",
//               dropTarget === folder.id && "ring-2 ring-primary ring-offset-2 scale-105",
//             )}
//             style={{ borderColor: `${folder.color}30` }}
//             onClick={() => !editingId && onSelectFolder(folder.id)}
//           >
//             <CardContent className="p-6 relative">
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
//                         <DropdownMenuItem onClick={() => handleStartEdit(folder)}>
//                           <Edit2 className="h-4 w-4 mr-2" />
//                           Rename
//                         </DropdownMenuItem>
//                         <DropdownMenuItem
//                           onClick={() => handleDeleteFolder(folder.id, folder.name)}
//                           className="text-destructive"
//                         >
//                           <Trash2 className="h-4 w-4 mr-2" />
//                           Delete
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

//       <Dialog open={mergeDialogOpen} onOpenChange={setMergeDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Merge Folders</DialogTitle>
//             <DialogDescription>
//               Are you sure you want to combine <strong>{folders.find((f) => f.id === mergeSource)?.name}</strong> into{" "}
//               <strong>{folders.find((f) => f.id === mergeTarget)?.name}</strong>?
//             </DialogDescription>
//           </DialogHeader>
//           <div className="space-y-4 py-4">
//             <div className="flex items-center space-x-2">
//               <Checkbox
//                 id="trash-source"
//                 checked={trashSourceFolder}
//                 onCheckedChange={(checked) => setTrashSourceFolder(checked as boolean)}
//               />
//               <Label htmlFor="trash-source" className="text-sm font-normal cursor-pointer">
//                 Delete source folder after merge
//               </Label>
//             </div>
//             <div className="flex items-center space-x-2">
//               <Checkbox
//                 id="trash-target"
//                 checked={trashTargetFolder}
//                 onCheckedChange={(checked) => setTrashTargetFolder(checked as boolean)}
//               />
//               <Label htmlFor="trash-target" className="text-sm font-normal cursor-pointer">
//                 Delete target folder after merge (create new combined folder)
//               </Label>
//             </div>
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setMergeDialogOpen(false)}>
//               Cancel
//             </Button>
//             <Button onClick={handleMergeFolders}>Confirm Merge</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Delete Folder</DialogTitle>
//             <DialogDescription>
//               Are you sure you want to delete <strong>{folderToDelete?.name}</strong>? All prospects will be moved to
//               "All Prospects".
//             </DialogDescription>
//           </DialogHeader>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
//               Cancel
//             </Button>
//             <Button variant="destructive" onClick={confirmDelete}>
//               Delete Folder
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }



// "use client"

// import type React from "react"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Card, CardContent } from "@/components/ui/card"
// import { Folder, FolderOpen, MoreVertical, Edit2, Trash2, Check, X, Palette } from "lucide-react"
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
// import { createFolder, deleteFolder, updateFolder, mergeFolders } from "@/lib/actions/prospect-folders"
// import { toast } from "sonner"
// import { cn } from "@/lib/utils"

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
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
//   const [folderToDelete, setFolderToDelete] = useState<{ id: string; name: string } | null>(null)
//   const [mergeNameDialogOpen, setMergeNameDialogOpen] = useState(false)
//   const [newMergedFolderName, setNewMergedFolderName] = useState("")
//   const [duplicateCheckDialogOpen, setDuplicateCheckDialogOpen] = useState(false)
//   const [duplicatesFound, setDuplicatesFound] = useState<any[]>([])
//   const [isCheckingDuplicates, setIsCheckingDuplicates] = useState(false)

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

//   const handleDeleteFolder = async (folderId: string, folderName: string) => {
//     setFolderToDelete({ id: folderId, name: folderName })
//     setDeleteDialogOpen(true)
//   }

//   const confirmDelete = async () => {
//     if (!folderToDelete) return

//     const loadingToast = toast.loading("Deleting folder...")
//     const result = await deleteFolder(folderToDelete.id)

//     toast.dismiss(loadingToast)
//     if (result.success) {
//       toast.success("Folder deleted")
//       setDeleteDialogOpen(false)
//       setFolderToDelete(null)
//       window.location.reload()
//     } else {
//       toast.error(result.error || "Failed to delete folder")
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

//   const handleProceedToMerge = () => {
//     if (!newMergedFolderName.trim()) {
//       toast.error("Please enter a folder name")
//       return
//     }

//     if (folders.some((f) => f.name.toLowerCase() === newMergedFolderName.toLowerCase())) {
//       toast.error("A folder with this name already exists")
//       return
//     }

//     setMergeNameDialogOpen(false)
//     setMergeDialogOpen(true)
//   }

//   const handleMergeFolders = async () => {
//     if (!mergeSource || !mergeTarget) return

//     const sourceFolder = folders.find((f) => f.id === mergeSource)
//     const targetFolder = folders.find((f) => f.id === mergeTarget)

//     if (!sourceFolder || !targetFolder) return

//     setIsCheckingDuplicates(true)
//     toast.loading("Checking for duplicates...")

//     const loadingToast = toast.loading("Merging folders...")

//     const foldersToDelete = []
//     if (trashSourceFolder) foldersToDelete.push(mergeSource)
//     if (trashTargetFolder) foldersToDelete.push(mergeTarget)

//     const result = await mergeFolders(
//       trashSourceFolder && trashTargetFolder ? [mergeSource, mergeTarget] : [mergeSource],
//       newMergedFolderName,
//     )

//     toast.dismiss(loadingToast)
//     if (result.success) {
//       toast.success("Folders merged successfully!")
//       setMergeDialogOpen(false)
//       setMergeSource(null)
//       setMergeTarget(null)
//       setTrashSourceFolder(false)
//       setTrashTargetFolder(false)
//       setNewMergedFolderName("")
//       window.location.reload()
//     } else {
//       toast.error(result.error || "Failed to merge folders")
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
//             className={cn(
//               "group hover:shadow-lg transition-all duration-200 cursor-pointer border-2",
//               dropTarget === folder.id && "ring-2 ring-primary ring-offset-2 scale-105",
//             )}
//             style={{ borderColor: `${folder.color}30` }}
//             onClick={() => !editingId && onSelectFolder(folder.id)}
//           >
//             <CardContent className="p-6 relative">
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
//                         <DropdownMenuItem
//                           onClick={(e) => {
//                             e.stopPropagation()
//                             handleDeleteFolder(folder.id, folder.name)
//                           }}
//                           className="text-destructive"
//                         >
//                           <Trash2 className="h-4 w-4 mr-2" />
//                           Delete
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
//                 Delete <strong>{folders.find((f) => f.id === mergeSource)?.name}</strong> after merge
//               </Label>
//             </div>
//             <div className="flex items-center space-x-2">
//               <Checkbox
//                 id="trash-target"
//                 checked={trashTargetFolder}
//                 onCheckedChange={(checked) => setTrashTargetFolder(checked as boolean)}
//               />
//               <Label htmlFor="trash-target" className="text-sm font-normal cursor-pointer">
//                 Delete <strong>{folders.find((f) => f.id === mergeTarget)?.name}</strong> after merge
//               </Label>
//             </div>
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setMergeDialogOpen(false)}>
//               Cancel
//             </Button>
//             <Button onClick={handleMergeFolders}>Merge Folders</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Delete Folder</DialogTitle>
//             <DialogDescription>
//               Are you sure you want to delete <strong>{folderToDelete?.name}</strong>? All prospects will be moved to
//               "All Prospects".
//             </DialogDescription>
//           </DialogHeader>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
//               Cancel
//             </Button>
//             <Button variant="destructive" onClick={confirmDelete}>
//               Delete Folder
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }



// "use client"

// import type React from "react"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Card, CardContent } from "@/components/ui/card"
// import { Folder, FolderOpen, MoreVertical, Edit2, Trash2, Check, X, Palette } from "lucide-react"
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
// import { createFolder, updateFolder, mergeFolders, trashFolder } from "@/lib/actions/prospect-folders"
// import { toast } from "sonner"
// import { cn } from "@/lib/utils"

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
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
//   const [folderToDelete, setFolderToDelete] = useState<{ id: string; name: string } | null>(null)
//   const [mergeNameDialogOpen, setMergeNameDialogOpen] = useState(false)
//   const [newMergedFolderName, setNewMergedFolderName] = useState("")
//   const [duplicateCheckDialogOpen, setDuplicateCheckDialogOpen] = useState(false)
//   const [duplicatesFound, setDuplicatesFound] = useState<any[]>([])
//   const [isCheckingDuplicates, setIsCheckingDuplicates] = useState(false)

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

//   const handleDeleteFolder = async (folderId: string, folderName: string) => {
//     setFolderToDelete({ id: folderId, name: folderName })
//     setDeleteDialogOpen(true)
//   }

//   const confirmDelete = async () => {
//     if (!folderToDelete) return

//     const loadingToast = toast.loading("Trashing folder...")
//     const result = await trashFolder(folderToDelete.id)

//     toast.dismiss(loadingToast)
//     if (result.success) {
//       toast.success("Folder moved to trash")
//       setDeleteDialogOpen(false)
//       setFolderToDelete(null)
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

//   const handleProceedToMerge = () => {
//     if (!newMergedFolderName.trim()) {
//       toast.error("Please enter a folder name")
//       return
//     }

//     if (folders.some((f) => f.name.toLowerCase() === newMergedFolderName.toLowerCase())) {
//       toast.error("A folder with this name already exists")
//       return
//     }

//     setMergeNameDialogOpen(false)
//     setMergeDialogOpen(true)
//   }

//   const handleMergeFolders = async () => {
//     if (!mergeSource || !mergeTarget) return

//     const sourceFolder = folders.find((f) => f.id === mergeSource)
//     const targetFolder = folders.find((f) => f.id === mergeTarget)

//     if (!sourceFolder || !targetFolder) return

//     setIsCheckingDuplicates(true)
//     const checkingToast = toast.loading("Checking for duplicates...")

//     const result = await mergeFolders([mergeSource, mergeTarget], newMergedFolderName, {
//       source: trashSourceFolder,
//       target: trashTargetFolder,
//     })

//     toast.dismiss(checkingToast)

//     if (result.success) {
//       if (result.duplicatesFound && result.duplicatesFound > 0) {
//         // Show duplicate dialog
//         setDuplicatesFound(result.duplicates || [])
//         setDuplicateCheckDialogOpen(true)
//         toast.success(`Folders merged! Found ${result.duplicatesFound} duplicates.`)
//       } else {
//         toast.success("Folders merged successfully! No duplicates found.")
//       }

//       setMergeDialogOpen(false)
//       setMergeSource(null)
//       setMergeTarget(null)
//       setTrashSourceFolder(false)
//       setTrashTargetFolder(false)
//       setNewMergedFolderName("")
//       setIsCheckingDuplicates(false)
//       window.location.reload()
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
//             className={cn(
//               "group hover:shadow-lg transition-all duration-200 cursor-pointer border-2",
//               dropTarget === folder.id && "ring-2 ring-primary ring-offset-2 scale-105",
//             )}
//             style={{ borderColor: `${folder.color}30` }}
//             onClick={() => !editingId && onSelectFolder(folder.id)}
//           >
//             <CardContent className="p-6 relative">
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
//                         <DropdownMenuItem
//                           onClick={(e) => {
//                             e.stopPropagation()
//                             handleDeleteFolder(folder.id, folder.name)
//                           }}
//                           className="text-destructive"
//                         >
//                           <Trash2 className="h-4 w-4 mr-2" />
//                           Delete
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

//       <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Trash Folder</DialogTitle>
//             <DialogDescription>
//               Are you sure you want to trash <strong>{folderToDelete?.name}</strong>? The folder and its prospects can
//               be restored later from trash.
//             </DialogDescription>
//           </DialogHeader>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
//               Cancel
//             </Button>
//             <Button variant="destructive" onClick={confirmDelete}>
//               Move to Trash
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       <Dialog open={duplicateCheckDialogOpen} onOpenChange={setDuplicateCheckDialogOpen}>
//         <DialogContent className="max-w-2xl">
//           <DialogHeader>
//             <DialogTitle>Duplicates Found</DialogTitle>
//             <DialogDescription>
//               We found {duplicatesFound.length} duplicate(s) during the merge. Review them below.
//             </DialogDescription>
//           </DialogHeader>
//           <div className="max-h-96 overflow-y-auto space-y-3">
//             {duplicatesFound.map((dup, idx) => (
//               <div key={idx} className="border rounded-lg p-3 space-y-2">
//                 <p className="font-medium text-sm">Duplicate Email: {dup.duplicate.email}</p>
//                 <div className="grid grid-cols-2 gap-3 text-xs">
//                   <div className="space-y-1">
//                     <p className="text-muted-foreground">Original:</p>
//                     <p>
//                       <strong>Name:</strong> {dup.original.firstName} {dup.original.lastName}
//                     </p>
//                     <p>
//                       <strong>Company:</strong> {dup.original.company || "N/A"}
//                     </p>
//                   </div>
//                   <div className="space-y-1">
//                     <p className="text-muted-foreground">Duplicate:</p>
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
//     </div>
//   )
// }


// "use client"

// import type React from "react"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Card, CardContent } from "@/components/ui/card"
// import { Folder, FolderOpen, MoreVertical, Edit2, Trash2, Check, X, Palette } from "lucide-react"
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
// import { createFolder, updateFolder, mergeFolders, trashFolder } from "@/lib/actions/prospect-folders"
// import { toast } from "sonner"
// import { cn } from "@/lib/utils"

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
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
//   const [folderToDelete, setFolderToDelete] = useState<{ id: string; name: string } | null>(null)
//   const [mergeNameDialogOpen, setMergeNameDialogOpen] = useState(false)
//   const [newMergedFolderName, setNewMergedFolderName] = useState("")
//   const [duplicateCheckDialogOpen, setDuplicateCheckDialogOpen] = useState(false)
//   const [duplicatesFound, setDuplicatesFound] = useState<any[]>([])
//   const [isCheckingDuplicates, setIsCheckingDuplicates] = useState(false)

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

//   const handleDeleteFolder = async (folderId: string, folderName: string) => {
//     setFolderToDelete({ id: folderId, name: folderName })
//     setDeleteDialogOpen(true)
//   }

//   const confirmDelete = async () => {
//     if (!folderToDelete) return

//     const loadingToast = toast.loading("Moving folder to trash...")
//     const result = await trashFolder(folderToDelete.id)

//     toast.dismiss(loadingToast)
//     if (result.success) {
//       toast.success("Folder moved to trash")
//       setDeleteDialogOpen(false)
//       setFolderToDelete(null)
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

//   const handleProceedToMerge = () => {
//     if (!newMergedFolderName.trim()) {
//       toast.error("Please enter a folder name")
//       return
//     }

//     if (folders.some((f) => f.name.toLowerCase() === newMergedFolderName.toLowerCase())) {
//       toast.error("A folder with this name already exists")
//       return
//     }

//     setMergeNameDialogOpen(false)
//     setMergeDialogOpen(true)
//   }

//   const handleMergeFolders = async () => {
//     if (!mergeSource || !mergeTarget) return

//     const sourceFolder = folders.find((f) => f.id === mergeSource)
//     const targetFolder = folders.find((f) => f.id === mergeTarget)

//     if (!sourceFolder || !targetFolder) return

//     setIsCheckingDuplicates(true)
//     const checkingToast = toast.loading("Merging folders and checking for duplicates...")

//     const result = await mergeFolders([mergeSource, mergeTarget], newMergedFolderName, {
//       source: trashSourceFolder,
//       target: trashTargetFolder,
//     })

//     toast.dismiss(checkingToast)

//     if (result.success) {
//       if (result.duplicatesFound && result.duplicatesFound > 0) {
//         // Show duplicate dialog
//         setDuplicatesFound(result.duplicates || [])
//         setDuplicateCheckDialogOpen(true)
//         toast.success(`Folders merged! Found ${result.duplicatesFound} duplicate(s) that were automatically removed.`)
//       } else {
//         toast.success("Folders merged successfully! No duplicates found.")
//       }

//       setMergeDialogOpen(false)
//       setMergeSource(null)
//       setMergeTarget(null)
//       setTrashSourceFolder(false)
//       setTrashTargetFolder(false)
//       setNewMergedFolderName("")
//       setIsCheckingDuplicates(false)
//       window.location.reload()
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
//             className={cn(
//               "group hover:shadow-lg transition-all duration-200 cursor-pointer border-2",
//               dropTarget === folder.id && "ring-2 ring-primary ring-offset-2 scale-105",
//             )}
//             style={{ borderColor: `${folder.color}30` }}
//             onClick={() => !editingId && onSelectFolder(folder.id)}
//           >
//             <CardContent className="p-6 relative">
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
//                         <DropdownMenuItem
//                           onClick={(e) => {
//                             e.stopPropagation()
//                             handleDeleteFolder(folder.id, folder.name)
//                           }}
//                           className="text-destructive"
//                         >
//                           <Trash2 className="h-4 w-4 mr-2" />
//                           Delete
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

//       <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Trash Folder</DialogTitle>
//             <DialogDescription>
//               Are you sure you want to trash <strong>{folderToDelete?.name}</strong>? The folder and its prospects can
//               be restored later from trash.
//             </DialogDescription>
//           </DialogHeader>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
//               Cancel
//             </Button>
//             <Button variant="destructive" onClick={confirmDelete}>
//               Move to Trash
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       <Dialog open={duplicateCheckDialogOpen} onOpenChange={setDuplicateCheckDialogOpen}>
//         <DialogContent className="max-w-2xl">
//           <DialogHeader>
//             <DialogTitle>Duplicates Found</DialogTitle>
//             <DialogDescription>
//               We found {duplicatesFound.length} duplicate(s) during the merge. Review them below.
//             </DialogDescription>
//           </DialogHeader>
//           <div className="max-h-96 overflow-y-auto space-y-3">
//             {duplicatesFound.map((dup, idx) => (
//               <div key={idx} className="border rounded-lg p-3 space-y-2">
//                 <p className="font-medium text-sm">Duplicate Email: {dup.duplicate.email}</p>
//                 <div className="grid grid-cols-2 gap-3 text-xs">
//                   <div className="space-y-1">
//                     <p className="text-muted-foreground">Original:</p>
//                     <p>
//                       <strong>Name:</strong> {dup.original.firstName} {dup.original.lastName}
//                     </p>
//                     <p>
//                       <strong>Company:</strong> {dup.original.company || "N/A"}
//                     </p>
//                   </div>
//                   <div className="space-y-1">
//                     <p className="text-muted-foreground">Duplicate:</p>
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
//     </div>
//   )
// }


"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Folder, FolderOpen, MoreVertical, Edit2, Trash2, Check, X, Palette } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { createFolder, updateFolder, mergeFolders, trashFolder } from "@/lib/actions/prospect-folders"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const FOLDER_COLORS = [
  { name: "Blue", value: "#3b82f6" },
  { name: "Purple", value: "#a855f7" },
  { name: "Pink", value: "#ec4899" },
  { name: "Red", value: "#ef4444" },
  { name: "Orange", value: "#f97316" },
  { name: "Yellow", value: "#eab308" },
  { name: "Green", value: "#22c55e" },
  { name: "Teal", value: "#14b8a6" },
  { name: "Cyan", value: "#06b6d4" },
  { name: "Indigo", value: "#6366f1" },
]

interface FolderGridProps {
  folders: Array<{
    id: string
    name: string
    color: string
    icon: string
    prospectCount: number
  }>
  onSelectFolder: (folderId: string | null) => void
}

export function FolderGrid({ folders, onSelectFolder }: FolderGridProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [newFolderColor, setNewFolderColor] = useState("#3b82f6")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [editColor, setEditColor] = useState("")
  const [draggedFolder, setDraggedFolder] = useState<string | null>(null)
  const [dropTarget, setDropTarget] = useState<string | null>(null)
  const [mergeDialogOpen, setMergeDialogOpen] = useState(false)
  const [mergeSource, setMergeSource] = useState<string | null>(null)
  const [mergeTarget, setMergeTarget] = useState<string | null>(null)
  const [trashSourceFolder, setTrashSourceFolder] = useState(false)
  const [trashTargetFolder, setTrashTargetFolder] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [folderToDelete, setFolderToDelete] = useState<{ id: string; name: string } | null>(null)
  const [mergeNameDialogOpen, setMergeNameDialogOpen] = useState(false)
  const [newMergedFolderName, setNewMergedFolderName] = useState("")
  const [duplicateCheckDialogOpen, setDuplicateCheckDialogOpen] = useState(false)
  const [duplicatesFound, setDuplicatesFound] = useState<any[]>([])
  const [isCheckingDuplicates, setIsCheckingDuplicates] = useState(false)

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      toast.error("Please enter a folder name")
      return
    }

    if (folders.some((f) => f.name.toLowerCase() === newFolderName.toLowerCase())) {
      toast.error("A folder with this name already exists")
      return
    }

    const result = await createFolder(newFolderName, newFolderColor, "folder")

    if (result.success) {
      toast.success("Folder created!")
      setNewFolderName("")
      setNewFolderColor("#3b82f6")
      setIsCreating(false)
      window.location.reload()
    } else {
      toast.error(result.error || "Failed to create folder")
    }
  }

  const handleStartEdit = (folder: { id: string; name: string; color: string }) => {
    setEditingId(folder.id)
    setEditName(folder.name)
    setEditColor(folder.color)
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

    const loadingToast = toast.loading("Updating folder...")
    const result = await updateFolder(folderId, editName, editColor)

    toast.dismiss(loadingToast)
    if (result.success) {
      toast.success("Folder updated!")
      setEditingId(null)
      window.location.reload()
    } else {
      toast.error(result.error || "Failed to update folder")
    }
  }

  const handleDeleteFolder = async (folderId: string, folderName: string) => {
    setFolderToDelete({ id: folderId, name: folderName })
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!folderToDelete) return

    const loadingToast = toast.loading("Moving folder to trash...")
    const result = await trashFolder(folderToDelete.id)

    toast.dismiss(loadingToast)
    if (result.success) {
      toast.success("Folder moved to trash")
      setDeleteDialogOpen(false)
      setFolderToDelete(null)
      window.location.reload()
    } else {
      toast.error(result.error || "Failed to trash folder")
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
        setNewMergedFolderName(`${sourceFolder.name} + ${targetFolder.name}`)
      }

      setMergeSource(draggedFolder)
      setMergeTarget(targetFolderId)
      setMergeNameDialogOpen(true)
    }
    setDraggedFolder(null)
    setDropTarget(null)
  }

  const handleProceedToMerge = () => {
    if (!newMergedFolderName.trim()) {
      toast.error("Please enter a folder name")
      return
    }

    if (folders.some((f) => f.name.toLowerCase() === newMergedFolderName.toLowerCase())) {
      toast.error("A folder with this name already exists")
      return
    }

    setMergeNameDialogOpen(false)
    setMergeDialogOpen(true)
  }

  const handleMergeFolders = async () => {
    if (!mergeSource || !mergeTarget) return

    const sourceFolder = folders.find((f) => f.id === mergeSource)
    const targetFolder = folders.find((f) => f.id === mergeTarget)

    if (!sourceFolder || !targetFolder) return

    setIsCheckingDuplicates(true)
    const checkingToast = toast.loading("Merging folders and checking for duplicates...")

    const result = await mergeFolders([mergeSource, mergeTarget], newMergedFolderName, {
      source: trashSourceFolder,
      target: trashTargetFolder,
    })

    toast.dismiss(checkingToast)

    if (result.success) {
      setMergeDialogOpen(false)
      setMergeSource(null)
      setMergeTarget(null)
      setTrashSourceFolder(false)
      setTrashTargetFolder(false)
      setNewMergedFolderName("")
      setIsCheckingDuplicates(false)

      if (result.duplicatesFound && result.duplicatesFound > 0) {
        setDuplicatesFound(result.duplicates || [])
        setDuplicateCheckDialogOpen(true)
        toast.success(`Folders merged! Found ${result.duplicatesFound} duplicate(s) that were automatically removed.`, {
          duration: 5000,
        })
      } else {
        toast.success("Folders merged successfully! No duplicates found.", {
          duration: 3000,
        })
        setTimeout(() => window.location.reload(), 1000)
      }
    } else {
      toast.error(result.error || "Failed to merge folders")
      setIsCheckingDuplicates(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {isCreating ? (
          <Card className="border-2 border-dashed border-primary/50 hover:border-primary transition-colors">
            <CardContent className="p-6 space-y-4">
              <Input
                placeholder="Folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreateFolder()
                  if (e.key === "Escape") setIsCreating(false)
                }}
                autoFocus
                className="h-9"
              />
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    <Palette className="h-4 w-4 mr-2" />
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: newFolderColor }} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-3">
                  <div className="grid grid-cols-5 gap-2">
                    {FOLDER_COLORS.map((color) => (
                      <button
                        key={color.value}
                        className={cn(
                          "w-8 h-8 rounded-md border-2 transition-all hover:scale-110",
                          newFolderColor === color.value ? "border-foreground scale-110" : "border-transparent",
                        )}
                        style={{ backgroundColor: color.value }}
                        onClick={() => setNewFolderColor(color.value)}
                        title={color.name}
                      />
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleCreateFolder} className="flex-1">
                  <Check className="h-4 w-4 mr-1" />
                  Create
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setIsCreating(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card
            className="border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 transition-colors cursor-pointer group"
            onClick={() => setIsCreating(true)}
          >
            <CardContent className="p-6 flex flex-col items-center justify-center min-h-[160px]">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors">
                <Folder className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                New Folder
              </p>
            </CardContent>
          </Card>
        )}

        {folders.map((folder) => (
          <Card
            key={folder.id}
            draggable={!editingId}
            onDragStart={(e) => handleDragStart(e, folder.id)}
            onDragOver={(e) => handleDragOver(e, folder.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, folder.id)}
            className={cn(
              "group hover:shadow-lg transition-all duration-200 cursor-pointer border-2",
              dropTarget === folder.id && "ring-2 ring-primary ring-offset-2 scale-105",
            )}
            style={{ borderColor: `${folder.color}30` }}
            onClick={() => !editingId && onSelectFolder(folder.id)}
          >
            <CardContent className="p-6 relative">
              {editingId === folder.id ? (
                <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveEdit(folder.id)
                      if (e.key === "Escape") setEditingId(null)
                    }}
                    autoFocus
                    className="h-8 text-sm"
                  />
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        <Palette className="h-4 w-4 mr-2" />
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: editColor }} />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-3">
                      <div className="grid grid-cols-5 gap-2">
                        {FOLDER_COLORS.map((color) => (
                          <button
                            key={color.value}
                            className={cn(
                              "w-8 h-8 rounded-md border-2 transition-all hover:scale-110",
                              editColor === color.value ? "border-foreground scale-110" : "border-transparent",
                            )}
                            style={{ backgroundColor: color.value }}
                            onClick={() => setEditColor(color.value)}
                            title={color.name}
                          />
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleSaveEdit(folder.id)} className="flex-1">
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            handleStartEdit(folder)
                          }}
                        >
                          <Edit2 className="h-4 w-4 mr-2" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteFolder(folder.id, folder.name)
                          }}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex flex-col items-center text-center space-y-3">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110"
                      style={{ backgroundColor: `${folder.color}20` }}
                    >
                      <FolderOpen className="h-8 w-8 transition-all" style={{ color: folder.color }} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm line-clamp-1">{folder.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{folder.prospectCount} prospects</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={mergeNameDialogOpen} onOpenChange={setMergeNameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Name Your Merged Folder</DialogTitle>
            <DialogDescription>
              Choose a name for the folder created from merging{" "}
              <strong>{folders.find((f) => f.id === mergeSource)?.name}</strong> and{" "}
              <strong>{folders.find((f) => f.id === mergeTarget)?.name}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="New folder name"
              value={newMergedFolderName}
              onChange={(e) => setNewMergedFolderName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleProceedToMerge()
              }}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMergeNameDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleProceedToMerge}>Continue</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={mergeDialogOpen} onOpenChange={setMergeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Merge Folder Options</DialogTitle>
            <DialogDescription>Choose what to do with the original folders after merging.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="trash-source"
                checked={trashSourceFolder}
                onCheckedChange={(checked) => setTrashSourceFolder(checked as boolean)}
              />
              <Label htmlFor="trash-source" className="text-sm font-normal cursor-pointer">
                Trash <strong>{folders.find((f) => f.id === mergeSource)?.name}</strong> after merge
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="trash-target"
                checked={trashTargetFolder}
                onCheckedChange={(checked) => setTrashTargetFolder(checked as boolean)}
              />
              <Label htmlFor="trash-target" className="text-sm font-normal cursor-pointer">
                Trash <strong>{folders.find((f) => f.id === mergeTarget)?.name}</strong> after merge
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMergeDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleMergeFolders} disabled={isCheckingDuplicates}>
              {isCheckingDuplicates ? "Checking..." : "Merge Folders"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Trash Folder</DialogTitle>
            <DialogDescription>
              Are you sure you want to trash <strong>{folderToDelete?.name}</strong>? The folder and its prospects can
              be restored later from trash.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Move to Trash
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={duplicateCheckDialogOpen}
        onOpenChange={(open) => {
          setDuplicateCheckDialogOpen(open)
          if (!open) {
            setTimeout(() => window.location.reload(), 500)
          }
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Duplicates Found and Removed</DialogTitle>
            <DialogDescription>
              We found and automatically removed {duplicatesFound.length} duplicate(s) during the merge. Here's what was
              removed:
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-96 overflow-y-auto space-y-3">
            {duplicatesFound.map((dup, idx) => (
              <div key={idx} className="border rounded-lg p-3 space-y-2">
                <p className="font-medium text-sm">Duplicate Email: {dup.duplicate.email}</p>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <p className="text-muted-foreground">✅ Kept:</p>
                    <p>
                      <strong>Name:</strong> {dup.original.firstName} {dup.original.lastName}
                    </p>
                    <p>
                      <strong>Company:</strong> {dup.original.company || "N/A"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">❌ Removed:</p>
                    <p>
                      <strong>Name:</strong> {dup.duplicate.firstName} {dup.duplicate.lastName}
                    </p>
                    <p>
                      <strong>Company:</strong> {dup.duplicate.company || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button onClick={() => setDuplicateCheckDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
