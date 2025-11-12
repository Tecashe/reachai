"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, FileText, ImageIcon, Video, File, AlertTriangle } from "lucide-react"
import { useState } from "react"

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
    if (mimeType.startsWith("image/")) return <ImageIcon className="h-5 w-5" />
    if (mimeType.startsWith("video/")) return <Video className="h-5 w-5" />
    if (mimeType.includes("pdf")) return <FileText className="h-5 w-5" />
    return <File className="h-5 w-5" />
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
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium">
        <FileText className="h-4 w-4" />
        <span>Attachments ({attachments.length})</span>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {attachments.map((attachment) => {
          const mimeType = attachment.mimeType || attachment.contentType || "application/octet-stream"
          const fileUrl = attachment.url || attachment.storageUrl || ""

          return (
            <Card key={attachment.id} className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {getFileIcon(mimeType)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{attachment.filename}</p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(attachment.size)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {attachment.metadata?.requiresReview && (
                    <Badge variant="destructive" className="text-xs">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Review
                    </Badge>
                  )}
                  {attachment.metadata?.isContract && (
                    <Badge variant="secondary" className="text-xs">
                      Contract
                    </Badge>
                  )}
                  {attachment.metadata?.isProposal && (
                    <Badge variant="secondary" className="text-xs">
                      Proposal
                    </Badge>
                  )}

                  {isPreviewable(mimeType) && fileUrl && (
                    <Button variant="ghost" size="sm" onClick={() => setPreviewUrl(fileUrl)}>
                      Preview
                    </Button>
                  )}

                  {fileUrl && (
                    <Button variant="ghost" size="sm" asChild>
                      <a href={fileUrl} download={attachment.filename}>
                        <Download className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Preview Modal */}
      {previewUrl && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewUrl(null)}
        >
          <div className="max-w-4xl max-h-[90vh] w-full bg-background rounded-lg overflow-auto">
            <div className="p-4 border-b flex items-center justify-between">
              <span className="font-medium">Attachment Preview</span>
              <Button variant="ghost" size="sm" onClick={() => setPreviewUrl(null)}>
                Close
              </Button>
            </div>
            <div className="p-4">
              {previewUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                <img src={previewUrl || "/placeholder.svg"} alt="Preview" className="max-w-full h-auto" />
              ) : previewUrl.match(/\.pdf$/i) ? (
                <iframe src={previewUrl} className="w-full h-[70vh]" />
              ) : (
                <p className="text-muted-foreground">Preview not available</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
