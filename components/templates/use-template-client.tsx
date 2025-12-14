"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { duplicateTemplate } from "@/lib/actions/templates"
import { Loader2, FileText, Copy } from "lucide-react"

interface UseTemplateClientProps {
  templateId: string
  templateName: string
}

export function UseTemplateClient({ templateId, templateName }: UseTemplateClientProps) {
  const router = useRouter()
  const [status, setStatus] = useState<"duplicating" | "success" | "error">("duplicating")
  const [error, setError] = useState<string>("")

  useEffect(() => {
    async function handleDuplicate() {
      try {
        const result = await duplicateTemplate(templateId)

        if (result.success && result.template) {
          setStatus("success")
          // Small delay for user to see success message
          setTimeout(() => {
            router.push(`/dashboard/templates/${result.template!.id}/edit`)
          }, 800)
        } else {
          setStatus("error")
          setError(result.error || "Failed to duplicate template")
        }
      } catch (err) {
        setStatus("error")
        setError("An unexpected error occurred")
      }
    }

    handleDuplicate()
  }, [templateId, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full mx-auto p-8">
        <div className="text-center space-y-6">
          {status === "duplicating" && (
            <>
              <div className="flex justify-center">
                <div className="relative">
                  <FileText className="h-16 w-16 text-muted-foreground" />
                  <Copy className="h-8 w-8 text-primary absolute -bottom-1 -right-1 animate-bounce" />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold">Creating Your Copy</h2>
                <p className="text-muted-foreground">
                  Duplicating <span className="font-medium text-foreground">{templateName}</span> to your library...
                </p>
              </div>
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            </>
          )}

          {status === "success" && (
            <>
              <div className="flex justify-center">
                <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <Copy className="h-8 w-8 text-emerald-500" />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-emerald-600">Template Ready!</h2>
                <p className="text-muted-foreground">Redirecting to editor...</p>
              </div>
            </>
          )}

          {status === "error" && (
            <>
              <div className="flex justify-center">
                <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
                  <FileText className="h-8 w-8 text-destructive" />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-destructive">Something Went Wrong</h2>
                <p className="text-muted-foreground">{error}</p>
              </div>
              <button
                onClick={() => router.push("/dashboard/templates")}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Back to Templates
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
