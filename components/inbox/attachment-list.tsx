"use client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, FileText, ImageIcon, Video, File, AlertTriangle, X, Eye, Paperclip } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface Attachment {
  id: string
  filename: string
  mimeType?: string
  contentType?: string
  size: number
  url?: string
  storageUrl?: string | null
  metadata?: {
    isContract?: boolean
    isProposal?: boolean
    requiresReview?: boolean
  }
}

interface AttachmentListProps {
  attachments: Attachment[]
}

export function AttachmentList({ attachments }: AttachmentListProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  if (!attachments || attachments.length === 0) {
    return null
  }

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) return ImageIcon
    if (mimeType.startsWith("video/")) return Video
    if (mimeType.includes("pdf")) return FileText
    return File
  }

  const getFileColor = (mimeType: string) => {
    if (mimeType.startsWith("image/")) return "text-pink-500 bg-pink-500/10"
    if (mimeType.startsWith("video/")) return "text-purple-500 bg-purple-500/10"
    if (mimeType.includes("pdf")) return "text-red-500 bg-red-500/10"
    return "text-blue-500 bg-blue-500/10"
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  const isPreviewable = (mimeType: string) => {
    return mimeType.startsWith("image/") || mimeType.includes("pdf") || mimeType.startsWith("text/")
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Paperclip className="h-4 w-4 text-muted-foreground" />
        <span>Attachments</span>
        <Badge variant="secondary" className="text-xs px-2 py-0">
          {attachments.length}
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {attachments.map((attachment) => {
          const mimeType = attachment.mimeType || attachment.contentType || "application/octet-stream"
          const fileUrl = attachment.url || attachment.storageUrl || ""
          const FileIcon = getFileIcon(mimeType)
          const fileColor = getFileColor(mimeType)

          return (
            <div
              key={attachment.id}
              className={cn(
                "group flex items-center gap-3 p-3 rounded-xl",
                "bg-muted/30 border border-border/50",
                "hover:bg-muted/50 transition-colors",
              )}
            >
              <div className={cn("rounded-lg p-2", fileColor)}>
                <FileIcon className="h-4 w-4" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{attachment.filename}</p>
                <p className="text-xs text-muted-foreground">{formatFileSize(attachment.size)}</p>
              </div>

              <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                {attachment.metadata?.requiresReview && (
                  <Badge variant="destructive" className="text-xs px-2 py-0.5 gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Review
                  </Badge>
                )}
                {attachment.metadata?.isContract && (
                  <Badge variant="secondary" className="text-xs px-2 py-0.5">
                    Contract
                  </Badge>
                )}
                {attachment.metadata?.isProposal && (
                  <Badge variant="secondary" className="text-xs px-2 py-0.5">
                    Proposal
                  </Badge>
                )}

                {isPreviewable(mimeType) && fileUrl && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPreviewUrl(fileUrl)}
                    className="h-8 px-2 rounded-lg"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                )}

                {fileUrl && (
                  <Button variant="ghost" size="sm" asChild className="h-8 px-2 rounded-lg">
                    <a href={fileUrl} download={attachment.filename}>
                      <Download className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Preview Modal */}
      {previewUrl && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewUrl(null)}
        >
          <div
            className="max-w-4xl max-h-[90vh] w-full bg-background rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-border/50 flex items-center justify-between bg-muted/30">
              <span className="font-medium">Attachment Preview</span>
              <Button variant="ghost" size="icon" onClick={() => setPreviewUrl(null)} className="h-8 w-8 rounded-lg">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4 max-h-[calc(90vh-80px)] overflow-auto">
              {previewUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                <img src={previewUrl || "/placeholder.svg"} alt="Preview" className="max-w-full h-auto rounded-lg" />
              ) : previewUrl.match(/\.pdf$/i) ? (
                <iframe src={previewUrl} className="w-full h-[70vh] rounded-lg" />
              ) : (
                <p className="text-muted-foreground text-center py-8">Preview not available</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
