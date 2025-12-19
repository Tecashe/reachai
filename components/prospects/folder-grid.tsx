




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
  Users,
  GitMerge,
  AlertTriangle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { createFolder, updateFolder, trashFolder, mergeFolders } from "@/lib/actions/prospect-folders"

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
  const [newFolderColor, setNewFolderColor] = useState("#3B82F6")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [editColor, setEditColor] = useState("")
  const [dropdownOpenId, setDropdownOpenId] = useState<string | null>(null)

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
      setNewFolderColor("#3B82F6")
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

  const handleTrashFolder = async (folderId: string, folderName: string) => {
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

    const targetFolder = folders.find((f) => f.id === mergeTarget)

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

  const handleCardClick = (folderId: string) => {
    if (editingId || dropdownOpenId === folderId) {
      return
    }
    onSelectFolder(folderId)
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
            onClick={() => handleCardClick(folder.id)}
          >
            <CardContent className="p-6 relative">
              {!editingId && (
                <div className="absolute top-2 right-2 z-10">
                  <DropdownMenu
                    open={dropdownOpenId === folder.id}
                    onOpenChange={(open) => {
                      setDropdownOpenId(open ? folder.id : null)
                    }}
                  >
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation()
                          e.preventDefault()
                        }}
                        onMouseDown={(e) => {
                          e.stopPropagation()
                        }}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          setEditingId(folder.id)
                          setEditName(folder.name)
                          setEditColor(folder.color)
                          setDropdownOpenId(null)
                        }}
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleTrashFolder(folder.id, folder.name)
                          setDropdownOpenId(null)
                        }}
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
