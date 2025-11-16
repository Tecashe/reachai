"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Loader2, Copy, Save } from 'lucide-react'
import { INDUSTRIES } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { createTemplate } from "@/lib/actions/templates"

interface GeneratedTemplate {
  name: string
  subject: string
  body: string
  variables: string[]
  suggestions?: string[]
}

export function AITemplateGenerator() {
  const [prompt, setPrompt] = useState("")
  const [industry, setIndustry] = useState("")
  const [purpose, setPurpose] = useState("")
  const [tone, setTone] = useState("professional")
  const [targetLength, setTargetLength] = useState("medium")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [generated, setGenerated] = useState<GeneratedTemplate | null>(null)
  const { toast } = useToast()

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt required",
        description: "Please describe the template you want to create",
        variant: "destructive"
      })
      return
    }

    setIsGenerating(true)
    
    try {
      const response = await fetch("/api/templates/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          industry,
          purpose,
          tone,
          targetLength,
          includePersonalization: true
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate template")
      }

      setGenerated(data.template)
      toast({
        title: "Template generated",
        description: "Your AI-powered template is ready!"
      })
    } catch (error) {
      console.error("Generation error:", error)
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive"
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSave = async () => {
    if (!generated) return

    setIsSaving(true)

    try {
      const result = await createTemplate({
        name: generated.name,
        subject: generated.subject,
        body: generated.body,
        category: purpose || "cold-outreach",
        industry: industry,
        variables: generated.variables,
        tags: [purpose, tone, "ai-generated"].filter(Boolean),
      })

      if (!result.success) {
        throw new Error(result.error)
      }

      toast({
        title: "Template saved",
        description: "Your template has been added to your library"
      })

      // Reset form
      setPrompt("")
      setGenerated(null)
    } catch (error) {
      toast({
        title: "Save failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied",
      description: "Template content copied to clipboard"
    })
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Generator Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Template Generator
          </CardTitle>
          <CardDescription>
            Describe your template and let AI create it for you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prompt">Template Description</Label>
            <Textarea
              id="prompt"
              placeholder="Example: Create a cold email for SaaS companies offering a free trial..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger id="industry">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRIES.map((ind) => (
                    <SelectItem key={ind.value} value={ind.value}>
                      {ind.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose</Label>
              <Select value={purpose} onValueChange={setPurpose}>
                <SelectTrigger id="purpose">
                  <SelectValue placeholder="Select purpose" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cold-outreach">Cold Outreach</SelectItem>
                  <SelectItem value="follow-up">Follow Up</SelectItem>
                  <SelectItem value="meeting-request">Meeting Request</SelectItem>
                  <SelectItem value="nurture">Nurture</SelectItem>
                  <SelectItem value="reengagement">Re-engagement</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tone">Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger id="tone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="length">Length</Label>
              <Select value={targetLength} onValueChange={setTargetLength}>
                <SelectTrigger id="length">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Short</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="long">Long</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating || !prompt.trim()}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Template
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Generated Result */}
      <Card className={generated ? "" : "opacity-50"}>
        <CardHeader>
          <CardTitle>Generated Template</CardTitle>
          <CardDescription>
            {generated ? "Review and save your AI-generated template" : "Your template will appear here"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {generated ? (
            <>
              <div>
                <Label className="text-sm font-medium">Template Name</Label>
                <p className="mt-1 text-sm">{generated.name}</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label className="text-sm font-medium">Subject Line</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(generated.subject)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-sm bg-muted p-3 rounded-md">{generated.subject}</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label className="text-sm font-medium">Email Body</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(generated.body)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <div className="text-sm bg-muted p-3 rounded-md whitespace-pre-wrap max-h-64 overflow-y-auto">
                  {generated.body}
                </div>
              </div>

              {generated.variables.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Variables</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {generated.variables.map((variable) => (
                      <Badge key={variable} variant="secondary">
                        {`{{${variable}}}`}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {generated.suggestions && generated.suggestions.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Suggestions</Label>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    {generated.suggestions.map((suggestion, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              <div className="text-center space-y-2">
                <Sparkles className="h-12 w-12 mx-auto opacity-20" />
                <p className="text-sm">Generate a template to see results</p>
              </div>
            </div>
          )}
        </CardContent>
        {generated && (
          <CardFooter>
            <Button 
              onClick={handleSave} 
              disabled={isSaving}
              className="w-full"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save to Library
                </>
              )}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}
