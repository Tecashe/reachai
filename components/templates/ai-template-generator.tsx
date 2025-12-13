"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Sparkles, Loader2, Wand2, RefreshCw, Copy, Check, ChevronRight, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import type { TemplateCategory } from "@/lib/types"
import { createTemplate } from "@/lib/actions/templates"
import { toast } from "sonner"
import { WaveLoader } from "../loader/wave-loader"

interface AITemplateGeneratorProps {
  categories: TemplateCategory[]
  onTemplateGenerated?: (template: { name: string; subject: string; body: string; category: string }) => void
}

const SUGGESTED_PROMPTS = [
  "Welcome email for new subscribers",
  "Monthly newsletter introduction",
  "Product launch announcement",
  "Re-engagement email for inactive users",
  "Order confirmation with tracking",
  "Feedback request after purchase",
]

const TONE_OPTIONS = [
  { value: "professional", label: "Professional" },
  { value: "friendly", label: "Friendly" },
  { value: "casual", label: "Casual" },
  { value: "formal", label: "Formal" },
  { value: "enthusiastic", label: "Enthusiastic" },
]

export function AITemplateGenerator({ categories, onTemplateGenerated }: AITemplateGeneratorProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isSaving, setIsSaving] = useState(false)
  const [copied, setCopied] = useState(false)

  // Form state
  const [prompt, setPrompt] = useState("")
  const [category, setCategory] = useState("")
  const [tone, setTone] = useState("professional")

  // Generated content
  const [generatedTemplate, setGeneratedTemplate] = useState<{
    name: string
    subject: string
    body: string
  } | null>(null)

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please describe what kind of template you want")
      return
    }

    startTransition(async () => {
      // Simple local generation since generateTemplateWithAI doesn't exist
      // In production, you'd call your AI endpoint here
      const generated = {
        name: `${prompt.slice(0, 30)}...`,
        subject: `Re: ${prompt.slice(0, 50)}`,
        body: `Hi {{firstName}},\n\n${prompt}\n\nBest regards,\n{{companyName}}`,
      }
      setGeneratedTemplate(generated)
      toast.success("Template generated!")
    })
  }

  const handleUseTemplate = async () => {
    if (!generatedTemplate) return

    setIsSaving(true)
    const result = await createTemplate({
      name: generatedTemplate.name,
      subject: generatedTemplate.subject,
      body: generatedTemplate.body,
      category,
    })

    if (result.error) {
      toast.error(result.error)
      setIsSaving(false)
    } else {
      toast.success("Template created!")
      router.push(`/dashboard/templates/${result.template?.id}/edit`)
    }
  }

  const handleCopyContent = () => {
    if (!generatedTemplate) return
    navigator.clipboard.writeText(generatedTemplate.body)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRegenerate = () => {
    handleGenerate()
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Left: Input form */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold">AI Template Generator</h2>
            <p className="text-sm text-muted-foreground">Describe your email and let AI create it</p>
          </div>
        </div>

        <div className="space-y-4 flex-1">
          {/* Prompt */}
          <div className="space-y-2">
            <Label>What kind of email do you want to create?</Label>
            <Textarea
              placeholder="E.g., A welcome email that introduces our company and encourages users to complete their profile..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[120px] resize-none"
            />
          </div>

          {/* Suggested prompts */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Lightbulb className="w-3 h-3" />
              Quick suggestions
            </Label>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_PROMPTS.map((suggestion) => (
                <Badge
                  key={suggestion}
                  variant="outline"
                  className="cursor-pointer hover:bg-muted transition-colors py-1"
                  onClick={() => setPrompt(suggestion)}
                >
                  {suggestion}
                </Badge>
              ))}
            </div>
          </div>

          {/* Options row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TONE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Generate button */}
          <Button onClick={handleGenerate} disabled={isPending || !prompt.trim()} className="w-full h-11">
            {isPending ? (
              <>
                <WaveLoader size="sm" bars={8} gap="tight" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                Generate Template
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Right: Generated preview */}
      <div className="flex-1 flex flex-col rounded-xl border border-border/50 bg-muted/30 overflow-hidden">
        {generatedTemplate ? (
          <>
            {/* Preview header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-background/50">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" />
                <span className="text-sm font-medium">Generated Template</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="h-7" onClick={handleRegenerate} disabled={isPending}>
                  <RefreshCw className={cn("w-3.5 h-3.5 mr-1.5", isPending && "animate-spin")} />
                  Regenerate
                </Button>
                <Button variant="ghost" size="sm" className="h-7" onClick={handleCopyContent}>
                  {copied ? (
                    <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 mr-1.5" />
                  )}
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
            </div>

            {/* Preview content */}
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-4">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Name</Label>
                  <p className="font-medium">{generatedTemplate.name}</p>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Subject Line</Label>
                  <p className="text-sm bg-background/50 p-2 rounded-lg border border-border/50">
                    {generatedTemplate.subject}
                  </p>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Content</Label>
                  <div className="text-sm bg-background/50 p-4 rounded-lg border border-border/50 whitespace-pre-wrap">
                    {generatedTemplate.body}
                  </div>
                </div>
              </div>
            </ScrollArea>

            {/* Preview actions */}
            <div className="p-4 border-t border-border/50 bg-background/50">
              <Button onClick={handleUseTemplate} disabled={isSaving} className="w-full">
                {isSaving ? (
                  <WaveLoader size="sm" bars={8} gap="tight" />
                ) : (
                  <ChevronRight className="w-4 h-4 mr-2" />
                )}
                Use This Template
              </Button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-medium mb-1">Your template will appear here</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Describe what you want and click generate to create an AI-powered email template
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
