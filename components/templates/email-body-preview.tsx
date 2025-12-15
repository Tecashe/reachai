"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Wand2, Eye, Code } from "lucide-react"
import { cn } from "@/lib/utils"

interface EmailBodyPreviewProps {
  htmlContent: string
  onOpenEditor: () => void
  className?: string
}

export function EmailBodyPreview({ htmlContent, onOpenEditor, className }: EmailBodyPreviewProps) {
  const [viewMode, setViewMode] = useState<"preview" | "code">("preview")

  // Check if content has HTML
  const isHtml = /<[^>]+>/.test(htmlContent)

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "preview" ? "secondary" : "ghost"}
            size="sm"
            className="h-7 text-xs"
            onClick={() => setViewMode("preview")}
          >
            <Eye className="h-3.5 w-3.5 mr-1" />
            Preview
          </Button>
          <Button
            variant={viewMode === "code" ? "secondary" : "ghost"}
            size="sm"
            className="h-7 text-xs"
            onClick={() => setViewMode("code")}
          >
            <Code className="h-3.5 w-3.5 mr-1" />
            HTML
          </Button>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-7 gap-1.5 px-2 text-xs"
          onClick={onOpenEditor}
        >
          <Wand2 className="h-3.5 w-3.5" />
          Edit Email
        </Button>
      </div>

      {viewMode === "preview" ? (
        <div className="border rounded-lg bg-white dark:bg-gray-950 min-h-[300px] max-h-[600px] overflow-auto">
          <div className="p-6">
            {/* Email content preview with proper styling */}
            <div
              className="email-preview-content"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </div>
        </div>
      ) : (
        <div className="border rounded-lg bg-muted/30 min-h-[300px] max-h-[600px] overflow-auto">
          <pre className="p-4 text-xs font-mono">
            <code>{htmlContent}</code>
          </pre>
        </div>
      )}

      <style jsx global>{`
        /* Email preview styles */
        .email-preview-content {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          font-size: 14px;
          line-height: 1.6;
          color: #374151;
        }

        .dark .email-preview-content {
          color: #d1d5db;
        }

        .email-preview-content h1 {
          font-size: 2em;
          font-weight: bold;
          margin: 0.5em 0;
        }

        .email-preview-content h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 0.5em 0;
        }

        .email-preview-content h3 {
          font-size: 1.25em;
          font-weight: bold;
          margin: 0.5em 0;
        }

        .email-preview-content p {
          margin: 0.5em 0;
        }

        .email-preview-content a {
          color: #3B82F6;
          text-decoration: underline;
        }

        .email-preview-content strong {
          font-weight: 600;
        }

        .email-preview-content em {
          font-style: italic;
        }

        .email-preview-content ul,
        .email-preview-content ol {
          padding-left: 1.5rem;
          margin: 0.5rem 0;
        }

        .email-preview-content ul li {
          list-style-type: disc;
        }

        .email-preview-content ol li {
          list-style-type: decimal;
        }

        .email-preview-content img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 1rem 0;
        }

        .email-preview-content blockquote {
          border-left: 3px solid #E5E7EB;
          padding-left: 1rem;
          margin: 1rem 0;
          color: #6B7280;
        }

        .email-preview-content hr {
          border: none;
          border-top: 2px solid #E5E7EB;
          margin: 2rem 0;
        }

        .email-preview-content code {
          background-color: #F3F4F6;
          padding: 0.2em 0.4em;
          border-radius: 0.25em;
          font-family: monospace;
          font-size: 0.9em;
        }

        .email-preview-content pre {
          background-color: #F3F4F6;
          padding: 1rem;
          border-radius: 0.5em;
          overflow-x: auto;
        }

        .email-preview-content pre code {
          background: none;
          padding: 0;
        }

        /* Button styles (from your custom button extension) */
        .email-preview-content div[data-type="button"] {
          text-align: center;
          margin: 25px 0;
        }

        .email-preview-content div[data-type="button"] a {
          padding: 14px 32px;
          text-decoration: none;
          border-radius: 8px;
          display: inline-block;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .email-preview-content div[data-type="button"] a:hover {
          opacity: 0.9;
        }

        /* Highlight variables */
        .email-preview-content {
          /* This will style template variables like {{firstName}} */
        }
      `}</style>
    </div>
  )
}