// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Folder, Plus, Trash2, MoreVertical, X, FolderOpen, Inbox } from "lucide-react"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// import { createFolder, deleteFolder } from "@/lib/actions/prospect-folders"
// import { toast } from "sonner"
// import { Badge } from "@/components/ui/badge"

// interface FolderSidebarProps {
//   folders: Array<{
//     id: string
//     name: string
//     color: string
//     icon: string
//     prospectCount: number
//   }>
//   selectedFolderId: string | null
//   onSelectFolder: (folderId: string | null) => void
//   showTrash: boolean
//   onShowTrash: () => void
//   trashedCount: number
// }

// export function FolderSidebar({
//   folders,
//   selectedFolderId,
//   onSelectFolder,
//   showTrash,
//   onShowTrash,
//   trashedCount,
// }: FolderSidebarProps) {
//   const [isCreating, setIsCreating] = useState(false)
//   const [newFolderName, setNewFolderName] = useState("")
//   const [isLoading, setIsLoading] = useState(false)

//   const handleCreateFolder = async () => {
//     if (!newFolderName.trim()) {
//       toast.error("Please enter a folder name")
//       return
//     }

//     setIsLoading(true)
//     const result = await createFolder(newFolderName)
//     setIsLoading(false)

//     if (result.success) {
//       toast.success("Folder created successfully")
//       setNewFolderName("")
//       setIsCreating(false)
//     } else {
//       toast.error(result.error || "Failed to create folder")
//     }
//   }

//   const handleDeleteFolder = async (folderId: string) => {
//     if (!confirm("Are you sure? Prospects in this folder will be moved to 'All Prospects'.")) {
//       return
//     }

//     const result = await deleteFolder(folderId)

//     if (result.success) {
//       toast.success("Folder deleted")
//       if (selectedFolderId === folderId) {
//         onSelectFolder(null)
//       }
//     } else {
//       toast.error(result.error || "Failed to delete folder")
//     }
//   }

//   return (
//     <div className="w-64 border-r bg-muted/10 flex flex-col">
//       <div className="p-4 border-b">
//         <h2 className="font-semibold text-sm text-muted-foreground mb-3">ORGANIZE</h2>

//         <Button
//           variant={!selectedFolderId && !showTrash ? "secondary" : "ghost"}
//           className="w-full justify-start mb-1"
//           onClick={() => {
//             onSelectFolder(null)
//           }}
//         >
//           <Inbox className="h-4 w-4 mr-2" />
//           All Prospects
//         </Button>
//       </div>

//       <ScrollArea className="flex-1 p-4">
//         <div className="space-y-1">
//           <div className="flex items-center justify-between mb-2">
//             <h3 className="text-sm font-medium text-muted-foreground">FOLDERS</h3>
//             <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsCreating(true)}>
//               <Plus className="h-3 w-3" />
//             </Button>
//           </div>

//           {isCreating && (
//             <div className="flex items-center gap-1 mb-2">
//               <Input
//                 placeholder="Folder name"
//                 value={newFolderName}
//                 onChange={(e) => setNewFolderName(e.target.value)}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter") handleCreateFolder()
//                   if (e.key === "Escape") setIsCreating(false)
//                 }}
//                 autoFocus
//                 disabled={isLoading}
//                 className="h-8 text-sm"
//               />
//               <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleCreateFolder} disabled={isLoading}>
//                 <Plus className="h-3 w-3" />
//               </Button>
//               <Button
//                 size="icon"
//                 variant="ghost"
//                 className="h-8 w-8"
//                 onClick={() => {
//                   setIsCreating(false)
//                   setNewFolderName("")
//                 }}
//                 disabled={isLoading}
//               >
//                 <X className="h-3 w-3" />
//               </Button>
//             </div>
//           )}

//           {folders.map((folder) => (
//             <div key={folder.id} className="group flex items-center justify-between">
//               <Button
//                 variant={selectedFolderId === folder.id ? "secondary" : "ghost"}
//                 className="flex-1 justify-start"
//                 onClick={() => onSelectFolder(folder.id)}
//               >
//                 {selectedFolderId === folder.id ? (
//                   <FolderOpen className="h-4 w-4 mr-2" style={{ color: folder.color }} />
//                 ) : (
//                   <Folder className="h-4 w-4 mr-2" style={{ color: folder.color }} />
//                 )}
//                 <span className="flex-1 text-left truncate">{folder.name}</span>
//                 <Badge variant="secondary" className="ml-2">
//                   {folder.prospectCount}
//                 </Badge>
//               </Button>
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
//                   >
//                     <MoreVertical className="h-3 w-3" />
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end">
//                   <DropdownMenuItem onClick={() => handleDeleteFolder(folder.id)}>
//                     <Trash2 className="h-4 w-4 mr-2" />
//                     Delete
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </div>
//           ))}
//         </div>
//       </ScrollArea>

//       <div className="p-4 border-t">
//         <Button variant={showTrash ? "secondary" : "ghost"} className="w-full justify-start" onClick={onShowTrash}>
//           <Trash2 className="h-4 w-4 mr-2" />
//           Trash
//           {trashedCount > 0 && (
//             <Badge variant="secondary" className="ml-auto">
//               {trashedCount}
//             </Badge>
//           )}
//         </Button>
//       </div>
//     </div>
//   )
// }

// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Folder, Plus, Trash2, MoreVertical, X, FolderOpen, Inbox, ChevronRight } from "lucide-react"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// import { createFolder, deleteFolder } from "@/lib/actions/prospect-folders"
// import { toast } from "sonner"
// import { Badge } from "@/components/ui/badge"
// import { cn } from "@/lib/utils"

// interface FolderSidebarProps {
//   folders: Array<{
//     id: string
//     name: string
//     color: string
//     icon: string
//     prospectCount: number
//   }>
//   selectedFolderId: string | null
//   onSelectFolder: (folderId: string | null) => void
//   showTrash: boolean
//   onShowTrash: () => void
//   trashedCount: number
// }

// export function FolderSidebar({
//   folders,
//   selectedFolderId,
//   onSelectFolder,
//   showTrash,
//   onShowTrash,
//   trashedCount,
// }: FolderSidebarProps) {
//   const [isCreating, setIsCreating] = useState(false)
//   const [newFolderName, setNewFolderName] = useState("")
//   const [isLoading, setIsLoading] = useState(false)
//   const [isOpen, setIsOpen] = useState(false)

//   const handleCreateFolder = async () => {
//     if (!newFolderName.trim()) {
//       toast.error("Please enter a folder name")
//       return
//     }

//     setIsLoading(true)
//     const result = await createFolder(newFolderName)
//     setIsLoading(false)

//     if (result.success) {
//       toast.success("Folder created successfully")
//       setNewFolderName("")
//       setIsCreating(false)
//     } else {
//       toast.error(result.error || "Failed to create folder")
//     }
//   }

//   const handleDeleteFolder = async (folderId: string) => {
//     if (!confirm("Are you sure? Prospects in this folder will be moved to 'All Prospects'.")) {
//       return
//     }

//     const result = await deleteFolder(folderId)

//     if (result.success) {
//       toast.success("Folder deleted")
//       if (selectedFolderId === folderId) {
//         onSelectFolder(null)
//       }
//     } else {
//       toast.error(result.error || "Failed to delete folder")
//     }
//   }

//   return (
//     <div
//       className={cn(
//         "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-background border-r z-20 transition-all duration-300 flex flex-col",
//         isOpen ? "w-64" : "w-12",
//       )}
//       onMouseEnter={() => setIsOpen(true)}
//       onMouseLeave={() => setIsOpen(false)}
//     >
//       <div className="absolute -right-3 top-1/2 -translate-y-1/2">
//         <div className="bg-border rounded-full p-1">
//           <ChevronRight className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
//         </div>
//       </div>

//       {!isOpen && (
//         <div className="p-2 space-y-2">
//           <Button
//             variant={!selectedFolderId && !showTrash ? "secondary" : "ghost"}
//             size="icon"
//             className="w-8 h-8"
//             onClick={() => onSelectFolder(null)}
//           >
//             <Inbox className="h-4 w-4" />
//           </Button>
//           {folders.slice(0, 3).map((folder) => (
//             <Button
//               key={folder.id}
//               variant={selectedFolderId === folder.id ? "secondary" : "ghost"}
//               size="icon"
//               className="w-8 h-8"
//               onClick={() => onSelectFolder(folder.id)}
//             >
//               <Folder className="h-4 w-4" style={{ color: folder.color }} />
//             </Button>
//           ))}
//         </div>
//       )}

//       {isOpen && (
//         <>
//           <div className="p-4 border-b">
//             <h2 className="font-semibold text-sm text-muted-foreground mb-3">ORGANIZE</h2>

//             <Button
//               variant={!selectedFolderId && !showTrash ? "secondary" : "ghost"}
//               className="w-full justify-start mb-1"
//               onClick={() => onSelectFolder(null)}
//             >
//               <Inbox className="h-4 w-4 mr-2" />
//               All Prospects
//             </Button>
//           </div>

//           <ScrollArea className="flex-1 p-4">
//             <div className="space-y-1">
//               <div className="flex items-center justify-between mb-2">
//                 <h3 className="text-sm font-medium text-muted-foreground">FOLDERS</h3>
//                 <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsCreating(true)}>
//                   <Plus className="h-3 w-3" />
//                 </Button>
//               </div>

//               {isCreating && (
//                 <div className="flex items-center gap-1 mb-2">
//                   <Input
//                     placeholder="Folder name"
//                     value={newFolderName}
//                     onChange={(e) => setNewFolderName(e.target.value)}
//                     onKeyDown={(e) => {
//                       if (e.key === "Enter") handleCreateFolder()
//                       if (e.key === "Escape") setIsCreating(false)
//                     }}
//                     autoFocus
//                     disabled={isLoading}
//                     className="h-8 text-sm"
//                   />
//                   <Button
//                     size="icon"
//                     variant="ghost"
//                     className="h-8 w-8"
//                     onClick={handleCreateFolder}
//                     disabled={isLoading}
//                   >
//                     <Plus className="h-3 w-3" />
//                   </Button>
//                   <Button
//                     size="icon"
//                     variant="ghost"
//                     className="h-8 w-8"
//                     onClick={() => {
//                       setIsCreating(false)
//                       setNewFolderName("")
//                     }}
//                     disabled={isLoading}
//                   >
//                     <X className="h-3 w-3" />
//                   </Button>
//                 </div>
//               )}

//               {folders.map((folder) => (
//                 <div key={folder.id} className="group flex items-center justify-between">
//                   <Button
//                     variant={selectedFolderId === folder.id ? "secondary" : "ghost"}
//                     className="flex-1 justify-start"
//                     onClick={() => onSelectFolder(folder.id)}
//                   >
//                     {selectedFolderId === folder.id ? (
//                       <FolderOpen className="h-4 w-4 mr-2" style={{ color: folder.color }} />
//                     ) : (
//                       <Folder className="h-4 w-4 mr-2" style={{ color: folder.color }} />
//                     )}
//                     <span className="flex-1 text-left truncate">{folder.name}</span>
//                     <Badge variant="secondary" className="ml-2">
//                       {folder.prospectCount}
//                     </Badge>
//                   </Button>
//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
//                       >
//                         <MoreVertical className="h-3 w-3" />
//                       </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent align="end">
//                       <DropdownMenuItem onClick={() => handleDeleteFolder(folder.id)}>
//                         <Trash2 className="h-4 w-4 mr-2" />
//                         Delete
//                       </DropdownMenuItem>
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 </div>
//               ))}
//             </div>
//           </ScrollArea>

//           <div className="p-4 border-t mt-auto">
//             <Button variant={showTrash ? "secondary" : "ghost"} className="w-full justify-start" onClick={onShowTrash}>
//               <Trash2 className="h-4 w-4 mr-2" />
//               Trash
//               {trashedCount > 0 && (
//                 <Badge variant="secondary" className="ml-auto">
//                   {trashedCount}
//                 </Badge>
//               )}
//             </Button>
//           </div>
//         </>
//       )}
//     </div>
//   )
// }


"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Folder, Plus, Trash2, MoreVertical, X, FolderOpen, Inbox, ChevronRight, GitMerge } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { createFolder, deleteFolder, mergeFolders } from "@/lib/actions/prospect-folders"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

interface FolderSidebarProps {
  folders: Array<{
    id: string
    name: string
    color: string
    icon: string
    prospectCount: number
  }>
  selectedFolderId: string | null
  onSelectFolder: (folderId: string | null) => void
  showTrash: boolean
  onShowTrash: () => void
  trashedCount: number
}

export function FolderSidebar({
  folders,
  selectedFolderId,
  onSelectFolder,
  showTrash,
  onShowTrash,
  trashedCount,
}: FolderSidebarProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [showMergeDialog, setShowMergeDialog] = useState(false)
  const [selectedForMerge, setSelectedForMerge] = useState<string[]>([])
  const [mergeName, setMergeName] = useState("")

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      toast.error("Please enter a folder name")
      return
    }

    setIsLoading(true)
    const result = await createFolder(newFolderName)
    setIsLoading(false)

    if (result.success) {
      toast.success("Folder created successfully")
      setNewFolderName("")
      setIsCreating(false)
    } else {
      toast.error(result.error || "Failed to create folder")
    }
  }

  const handleDeleteFolder = async (folderId: string) => {
    if (!confirm("Are you sure? Prospects in this folder will be moved to 'All Prospects'.")) {
      return
    }

    const result = await deleteFolder(folderId)

    if (result.success) {
      toast.success("Folder deleted")
      if (selectedFolderId === folderId) {
        onSelectFolder(null)
      }
    } else {
      toast.error(result.error || "Failed to delete folder")
    }
  }

  const handleMergeFolders = async () => {
    if (selectedForMerge.length < 2) {
      toast.error("Select at least 2 folders to merge")
      return
    }

    if (!mergeName.trim()) {
      toast.error("Please enter a name for the merged folder")
      return
    }

    try {
      const result = await mergeFolders(selectedForMerge, mergeName)
      if (result.success) {
        toast.success(`Merged ${selectedForMerge.length} folders into "${mergeName}"`)
        setShowMergeDialog(false)
        setSelectedForMerge([])
        setMergeName("")
        window.location.reload()
      } else {
        toast.error(result.error || "Failed to merge folders")
      }
    } catch (error) {
      toast.error("Failed to merge folders")
    }
  }

  return (
    <>
      <div
        className={cn(
          "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-background border-r z-20 transition-all duration-300 flex flex-col",
          isOpen ? "w-64" : "w-12",
        )}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <div className="absolute -right-3 top-1/2 -translate-y-1/2">
          <div className="bg-border rounded-full p-1">
            <ChevronRight className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
          </div>
        </div>

        {!isOpen && (
          <div className="p-2 space-y-2">
            <Button
              variant={!selectedFolderId && !showTrash ? "secondary" : "ghost"}
              size="icon"
              className="w-8 h-8"
              onClick={() => onSelectFolder(null)}
            >
              <Inbox className="h-4 w-4" />
            </Button>
            {folders.slice(0, 3).map((folder) => (
              <Button
                key={folder.id}
                variant={selectedFolderId === folder.id ? "secondary" : "ghost"}
                size="icon"
                className="w-8 h-8"
                onClick={() => onSelectFolder(folder.id)}
              >
                <Folder className="h-4 w-4" style={{ color: folder.color }} />
              </Button>
            ))}
          </div>
        )}

        {isOpen && (
          <>
            <div className="p-4 border-b">
              <h2 className="font-semibold text-sm text-muted-foreground mb-3">ORGANIZE</h2>

              <Button
                variant={!selectedFolderId && !showTrash ? "secondary" : "ghost"}
                className="w-full justify-start mb-1"
                onClick={() => onSelectFolder(null)}
              >
                <Inbox className="h-4 w-4 mr-2" />
                All Prospects
              </Button>

              {folders.length >= 2 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start mt-2 bg-transparent"
                  onClick={() => setShowMergeDialog(true)}
                >
                  <GitMerge className="h-4 w-4 mr-2" />
                  Merge Folders
                </Button>
              )}
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-muted-foreground">FOLDERS</h3>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsCreating(true)}>
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>

                {isCreating && (
                  <div className="flex items-center gap-1 mb-2">
                    <Input
                      placeholder="Folder name"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleCreateFolder()
                        if (e.key === "Escape") setIsCreating(false)
                      }}
                      autoFocus
                      disabled={isLoading}
                      className="h-8 text-sm"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={handleCreateFolder}
                      disabled={isLoading}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => {
                        setIsCreating(false)
                        setNewFolderName("")
                      }}
                      disabled={isLoading}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}

                {folders.map((folder) => (
                  <div key={folder.id} className="group flex items-center justify-between">
                    <Button
                      variant={selectedFolderId === folder.id ? "secondary" : "ghost"}
                      className="flex-1 justify-start"
                      onClick={() => onSelectFolder(folder.id)}
                    >
                      {selectedFolderId === folder.id ? (
                        <FolderOpen className="h-4 w-4 mr-2" style={{ color: folder.color }} />
                      ) : (
                        <Folder className="h-4 w-4 mr-2" style={{ color: folder.color }} />
                      )}
                      <span className="flex-1 text-left truncate">{folder.name}</span>
                      <Badge variant="secondary" className="ml-2">
                        {folder.prospectCount}
                      </Badge>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleDeleteFolder(folder.id)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-4 border-t mt-auto">
              <Button
                variant={showTrash ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={onShowTrash}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Trash
                {trashedCount > 0 && (
                  <Badge variant="secondary" className="ml-auto">
                    {trashedCount}
                  </Badge>
                )}
              </Button>
            </div>
          </>
        )}
      </div>

      <Dialog open={showMergeDialog} onOpenChange={setShowMergeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Merge Folders</DialogTitle>
            <DialogDescription>
              Select folders to merge. All prospects will be moved to the new merged folder and duplicates will be
              removed.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Select folders to merge (minimum 2)</Label>
              <div className="max-h-60 overflow-y-auto space-y-2">
                {folders.map((folder) => (
                  <div key={folder.id} className="flex items-center gap-2 p-2 hover:bg-accent rounded">
                    <Checkbox
                      checked={selectedForMerge.includes(folder.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedForMerge([...selectedForMerge, folder.id])
                        } else {
                          setSelectedForMerge(selectedForMerge.filter((id) => id !== folder.id))
                        }
                      }}
                    />
                    <Folder className="h-4 w-4" style={{ color: folder.color }} />
                    <span className="text-sm flex-1">{folder.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {folder.prospectCount}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="merge-name">New folder name</Label>
              <Input
                id="merge-name"
                value={mergeName}
                onChange={(e) => setMergeName(e.target.value)}
                placeholder="Enter merged folder name"
              />
            </div>
            {selectedForMerge.length >= 2 && (
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Merging {selectedForMerge.length} folders with{" "}
                  {folders.filter((f) => selectedForMerge.includes(f.id)).reduce((sum, f) => sum + f.prospectCount, 0)}{" "}
                  total prospects
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowMergeDialog(false)
                setSelectedForMerge([])
                setMergeName("")
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleMergeFolders} disabled={selectedForMerge.length < 2 || !mergeName.trim()}>
              <GitMerge className="h-4 w-4 mr-2" />
              Merge {selectedForMerge.length} Folders
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
