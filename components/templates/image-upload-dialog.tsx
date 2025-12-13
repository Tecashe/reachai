"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Upload, ImageIcon, Loader2, Check, Trash2, Search, ExternalLink } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface UploadedImage {
  id: string
  url: string
  filename: string
  size: number
  uploadedAt: Date
}

interface ImageUploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImageSelect: (imageUrl: string, alt?: string) => void
  existingImages?: UploadedImage[]
}

export function ImageUploadDialog({ open, onOpenChange, onImageSelect, existingImages = [] }: ImageUploadDialogProps) {
  const [uploading, setUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const [imageAlt, setImageAlt] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filteredImages = existingImages.filter((img) => img.filename.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleFileSelect = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return

      const file = files[0]

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file")
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB")
        return
      }

      setUploading(true)

      try {
        // Create FormData
        const formData = new FormData()
        formData.append("file", file)

        // Upload to your API endpoint (you'll need to create this)
        const response = await fetch("/api/upload/image", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          throw new Error("Upload failed")
        }

        const data = await response.json()

        toast.success("Image uploaded successfully")
        onImageSelect(data.url, file.name)
        onOpenChange(false)
      } catch (error) {
        console.error("[v0] Image upload error:", error)
        toast.error("Failed to upload image")
      } finally {
        setUploading(false)
      }
    },
    [onImageSelect, onOpenChange],
  )

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const files = e.dataTransfer.files
    handleFileSelect(files)
  }

  const handleUrlInsert = () => {
    if (!imageUrl.trim()) {
      toast.error("Please enter an image URL")
      return
    }

    // Basic URL validation
    try {
      new URL(imageUrl)
    } catch {
      toast.error("Please enter a valid URL")
      return
    }

    onImageSelect(imageUrl, imageAlt || undefined)
    onOpenChange(false)
    setImageUrl("")
    setImageAlt("")
  }

  const handleLibrarySelect = () => {
    const selectedImage = existingImages.find((img) => img.id === selectedImageId)
    if (!selectedImage) {
      toast.error("Please select an image")
      return
    }

    onImageSelect(selectedImage.url, selectedImage.filename)
    onOpenChange(false)
    setSelectedImageId(null)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Insert Image</DialogTitle>
          <DialogDescription>Upload a new image, use a URL, or select from your library</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="upload" className="flex-1 flex flex-col min-h-0">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="url">From URL</TabsTrigger>
            <TabsTrigger value="library">Library ({existingImages.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="flex-1 flex flex-col min-h-0 mt-4">
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={cn(
                "flex-1 border-2 border-dashed rounded-lg p-8",
                "flex flex-col items-center justify-center",
                "hover:border-primary/50 hover:bg-muted/50 transition-colors",
                "cursor-pointer",
              )}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files)}
              />

              {uploading ? (
                <>
                  <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                  <p className="text-sm font-medium">Uploading image...</p>
                </>
              ) : (
                <>
                  <div className="p-4 rounded-full bg-primary/10 mb-4">
                    <Upload className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-sm font-medium mb-2">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 5MB</p>
                </>
              )}
            </div>

            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-start gap-2">
                <ImageIcon className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="text-xs text-muted-foreground">
                  <p className="font-medium mb-1">Image Guidelines:</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Recommended width: 600px for email templates</li>
                    <li>Use high-quality images for better results</li>
                    <li>Images will be optimized automatically</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="url" className="flex-1 flex flex-col space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="image-url">Image URL *</Label>
              <Input
                id="image-url"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image-alt">Alt Text (Optional)</Label>
              <Input
                id="image-alt"
                placeholder="Description of the image"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Alt text improves accessibility and helps with email deliverability
              </p>
            </div>

            {imageUrl && (
              <div className="flex-1 flex items-center justify-center border-2 border-dashed rounded-lg p-4">
                <img
                  src={imageUrl || "/placeholder.svg"}
                  alt="Preview"
                  className="max-w-full max-h-64 object-contain"
                />
              </div>
            )}

            <Button onClick={handleUrlInsert} className="w-full">
              <ExternalLink className="w-4 h-4 mr-2" />
              Insert Image from URL
            </Button>
          </TabsContent>

          <TabsContent value="library" className="flex-1 flex flex-col min-h-0 mt-4">
            {existingImages.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                <ImageIcon className="w-12 h-12 text-muted-foreground/50 mb-4" />
                <p className="font-medium mb-2">No images in your library</p>
                <p className="text-sm text-muted-foreground">Upload your first image to get started</p>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search images..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>

                <ScrollArea className="flex-1 -mx-2 px-2">
                  <div className="grid grid-cols-3 gap-3">
                    {filteredImages.map((image) => (
                      <button
                        key={image.id}
                        onClick={() => setSelectedImageId(image.id)}
                        className={cn(
                          "relative group rounded-lg overflow-hidden border-2",
                          "hover:border-primary/50 transition-colors aspect-square",
                          selectedImageId === image.id ? "border-primary ring-2 ring-primary/20" : "border-border",
                        )}
                      >
                        <img
                          src={image.url || "/placeholder.svg"}
                          alt={image.filename}
                          className="w-full h-full object-cover"
                        />

                        {selectedImageId === image.id && (
                          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                            <div className="p-2 rounded-full bg-primary">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        )}

                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-xs text-white truncate">{image.filename}</p>
                          <p className="text-[10px] text-white/80">{formatFileSize(image.size)}</p>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            // Handle delete
                            toast.success("Image deleted")
                          }}
                          className="absolute top-2 right-2 p-1 rounded-md bg-destructive text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </button>
                    ))}
                  </div>
                </ScrollArea>

                {selectedImageId && (
                  <div className="mt-4 pt-4 border-t">
                    <Button onClick={handleLibrarySelect} className="w-full">
                      <Check className="w-4 h-4 mr-2" />
                      Insert Selected Image
                    </Button>
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
