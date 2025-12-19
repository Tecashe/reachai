
"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Upload, ImageIcon, Loader2, Check, Trash2, Search, ExternalLink, AlertTriangle, Info, Zap } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import {
  compressImage,
  formatBytes,
  calculateDeliverabilityImpact,
  getImageDimensions,
} from "@/lib/utils/image-optimizer"

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
  const [compressing, setCompressing] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const [imageAlt, setImageAlt] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null)
  const [compressionPreview, setCompressionPreview] = useState<{
    originalSize: number
    compressedSize: number
    dimensions: { width: number; height: number }
    compressionRatio: number
    deliverability: ReturnType<typeof calculateDeliverabilityImpact>
  } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filteredImages = existingImages.filter((img) => img.filename.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleFileSelect = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return

      const file = files[0]

      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file")
        return
      }

      setCompressing(true)
      setCompressionPreview(null)

      try {
        const originalDimensions = await getImageDimensions(file)

        const optimized = await compressImage(file, {
          maxWidth: 600,
          maxHeight: 800,
          quality: 0.85,
          targetSizeKB: 100,
        })

        const deliverability = calculateDeliverabilityImpact(optimized.compressedSize, optimized.dimensions)

        setCompressionPreview({
          originalSize: optimized.originalSize,
          compressedSize: optimized.compressedSize,
          dimensions: optimized.dimensions,
          compressionRatio: optimized.compressionRatio,
          deliverability,
        })

        if (deliverability.level === "critical" || deliverability.level === "high") {
          toast.warning("Image may impact email deliverability", {
            description: "Consider using a smaller image or hosting externally",
          })
        }

        setCompressing(false)
        setUploading(true)

        const formData = new FormData()
        formData.append("file", optimized.file)

        const response = await fetch("/api/upload/image", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          throw new Error("Upload failed")
        }

        const data = await response.json()

        toast.success("Image uploaded and optimized", {
          description: `Reduced by ${optimized.compressionRatio.toFixed(0)}% for better deliverability`,
        })
        onImageSelect(data.url, file.name)
        onOpenChange(false)
      } catch (error) {
        console.error("[v0] Image upload error:", error)
        toast.error("Failed to upload image")
      } finally {
        setUploading(false)
        setCompressing(false)
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

  const getDeliverabilityColor = (level: string) => {
    switch (level) {
      case "low":
        return "text-green-500"
      case "medium":
        return "text-yellow-500"
      case "high":
        return "text-orange-500"
      case "critical":
        return "text-red-500"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Insert Image</DialogTitle>
          <DialogDescription>Upload and optimize images for cold emails</DialogDescription>
        </DialogHeader>

        <Alert className="bg-amber-500/10 border-amber-500/50">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <AlertTitle className="text-amber-500">Cold Email Best Practices</AlertTitle>
          <AlertDescription className="text-sm text-muted-foreground space-y-1">
            <p>Images can reduce deliverability by 30-50%. For best results:</p>
            <ul className="list-disc list-inside ml-2 space-y-0.5">
              <li>Keep images under 100KB (we'll auto-compress)</li>
              <li>Use 600px max width for mobile compatibility</li>
              <li>Consider text-only for first email, images in follow-ups</li>
              <li>Host on reliable CDN (Google Photos, Imgur) for better reputation</li>
            </ul>
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="upload" className="flex-1 flex flex-col min-h-0">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">Upload & Optimize</TabsTrigger>
            <TabsTrigger value="url">From URL</TabsTrigger>
            <TabsTrigger value="library">Library ({existingImages.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="flex-1 flex flex-col min-h-0 mt-4 space-y-4">
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={cn(
                "border-2 border-dashed rounded-lg p-12",
                "flex flex-col items-center justify-center",
                "hover:border-primary/50 hover:bg-muted/50 transition-colors",
                "cursor-pointer min-h-[200px]",
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

              {compressing || uploading ? (
                <>
                  <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                  <p className="text-sm font-medium">{compressing ? "Optimizing for cold email..." : "Uploading..."}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {compressing ? "Compressing and analyzing deliverability" : "Almost done"}
                  </p>
                </>
              ) : (
                <>
                  <div className="p-4 rounded-full bg-primary/10 mb-4">
                    <Upload className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-sm font-medium mb-2">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground">We'll automatically optimize for cold emails</p>
                </>
              )}
            </div>

            {compressionPreview && (
              <div className="space-y-4 p-4 bg-muted/30 rounded-lg border">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Optimization Results</h4>
                    <p className="text-xs text-muted-foreground">
                      Reduced by {compressionPreview.compressionRatio.toFixed(0)}% for better deliverability
                    </p>
                  </div>
                  <Zap className="w-5 h-5 text-primary" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Original Size</p>
                    <p className="text-sm font-medium">{formatBytes(compressionPreview.originalSize)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Optimized Size</p>
                    <p className="text-sm font-medium text-green-600">
                      {formatBytes(compressionPreview.compressedSize)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Dimensions</p>
                    <p className="text-sm font-medium">
                      {compressionPreview.dimensions.width} × {compressionPreview.dimensions.height}px
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Deliverability Impact</p>
                    <p
                      className={cn(
                        "text-sm font-semibold",
                        getDeliverabilityColor(compressionPreview.deliverability.level),
                      )}
                    >
                      {compressionPreview.deliverability.level.toUpperCase()}
                    </p>
                  </div>
                </div>

                {compressionPreview.deliverability.issues.length > 0 && (
                  <Alert variant={compressionPreview.deliverability.level === "critical" ? "destructive" : "default"}>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle className="text-sm">Deliverability Warnings</AlertTitle>
                    <AlertDescription>
                      <ul className="text-xs space-y-1 mt-2">
                        {compressionPreview.deliverability.issues.map((issue, i) => (
                          <li key={i}>• {issue}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Email Deliverability Score</span>
                    <span
                      className={cn("font-semibold", getDeliverabilityColor(compressionPreview.deliverability.level))}
                    >
                      {100 - compressionPreview.deliverability.score}/100
                    </span>
                  </div>
                  <Progress value={100 - compressionPreview.deliverability.score} className="h-2" />
                </div>
              </div>
            )}

            <div className="space-y-3">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle className="text-sm">Pro Tips for Cold Emails</AlertTitle>
                <AlertDescription className="text-xs space-y-2 mt-2">
                  <div>
                    <p className="font-medium mb-1">✓ Best Practices:</p>
                    <ul className="space-y-0.5 list-disc list-inside ml-2">
                      <li>Use simple, relevant images (logos, screenshots, simple graphics)</li>
                      <li>Avoid stock photos and generic imagery</li>
                      <li>Keep file size under 100KB (we handle this automatically)</li>
                      <li>Max width: 600px for mobile email clients</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium mb-1">✗ Avoid:</p>
                    <ul className="space-y-0.5 list-disc list-inside ml-2">
                      <li>Multiple images in one email (triggers spam filters)</li>
                      <li>Large hero images or banners</li>
                      <li>Animated GIFs (poor client support)</li>
                      <li>Images as the main message content</li>
                    </ul>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="font-medium mb-1">💡 Alternative: Use External Hosting</p>
                    <p>Host images on Google Photos or Imgur, then use "From URL" tab for better sender reputation.</p>
                  </div>
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>

          <TabsContent value="url" className="flex-1 flex flex-col space-y-4 mt-4">
            <Alert className="bg-blue-500/10 border-blue-500/50">
              <Info className="h-4 w-4 text-blue-500" />
              <AlertTitle className="text-blue-500 text-sm">Recommended for Cold Emails</AlertTitle>
              <AlertDescription className="text-xs text-muted-foreground">
                Using externally hosted images (Imgur, Google Photos, reputable CDNs) improves deliverability by
                separating image hosting from your domain reputation.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="image-url">Image URL *</Label>
              <Input
                id="image-url"
                placeholder="https://i.imgur.com/example.jpg or Google Photos link"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Prefer CDN-hosted images (Imgur, Google Photos, Cloudinary) for better reputation
              </p>
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
