
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Loader2, Sparkles, Eye, RefreshCw, Copy, Check } from "lucide-react"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail } from "lucide-react"
import { WaveLoader } from "@/components/loader/wave-loader"

interface EmailGenerationStepProps {
  campaign: any
  onNext: () => void
  onBack: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

interface GeneratedEmail {
  subject: string
  body: string
  qualityScore: number
  personalizationScore: number
  suggestions: string[]
}

interface ProspectWithEmail {
  id: string
  firstName: string
  lastName: string
  email: string
  company: string
  jobTitle: string
  researchData?: any
}

export function EmailGenerationStep({ campaign, onNext, onBack }: EmailGenerationStepProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isLoadingProspects, setIsLoadingProspects] = useState(true)
  const [prospects, setProspects] = useState<ProspectWithEmail[]>([])
  const [generatedEmails, setGeneratedEmails] = useState<Record<string, GeneratedEmail>>({})
  const [selectedProspectId, setSelectedProspectId] = useState<string>("")
  const [useManualMode, setUseManualMode] = useState(false)
  const [template, setTemplate] = useState({
    subject: "",
    body: "",
    tone: campaign.toneOfVoice || "professional",
    callToAction: "schedule a quick call",
  })
  const [copiedId, setCopiedId] = useState<string>("")

  useEffect(() => {
    const loadProspects = async () => {
      try {
        setIsLoadingProspects(true)
        const response = await fetch(`/api/campaigns/${campaign.id}/prospects`)
        if (!response.ok) throw new Error("Failed to load prospects")
        const data = await response.json()
        setProspects(data.prospects || [])
        if (data.prospects?.length > 0) {
          setSelectedProspectId(data.prospects[0].id)
        }
      } catch (error) {
        console.error("[v0] Failed to load prospects:", error)
        toast.error("Failed to load prospects")
      } finally {
        setIsLoadingProspects(false)
      }
    }

    loadProspects()
  }, [campaign.id])

  const selectedProspect = prospects.find((p) => p.id === selectedProspectId)
  const selectedEmail = selectedProspectId ? generatedEmails[selectedProspectId] : undefined

  const generateEmailsForAll = async () => {
    if (!template.subject.trim() || !template.body.trim()) {
      toast.error("Please provide both subject and body template")
      return
    }

    if (prospects.length === 0) {
      toast.error("No prospects available to generate emails for")
      return
    }

    setIsGenerating(true)
    const newGeneratedEmails: Record<string, GeneratedEmail> = { ...generatedEmails }
    let successCount = 0
    let errorCount = 0

    try {
      // Process prospects in parallel with a limit of 5 concurrent requests
      const batchSize = 5
      for (let i = 0; i < prospects.length; i += batchSize) {
        const batch = prospects.slice(i, i + batchSize)

        const results = await Promise.allSettled(
          batch.map((prospect) =>
            fetch("/api/generate/email", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                prospect: {
                  firstName: prospect.firstName,
                  lastName: prospect.lastName,
                  email: prospect.email,
                  company: prospect.company,
                  jobTitle: prospect.jobTitle,
                },
                researchData: prospect.researchData,
                template: {
                  subject: template.subject,
                  body: template.body,
                },
                tone: template.tone,
                personalizationLevel: campaign.personalizationLevel || "MEDIUM",
                callToAction: template.callToAction,
              }),
            })
              .then(async (res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`)
                return res.json()
              })
              .then((data) => {
                newGeneratedEmails[prospect.id] = data.data
                successCount++
              }),
          ),
        )

        results.forEach((result, idx) => {
          if (result.status === "rejected") {
            console.error(`[v0] Failed to generate email for prospect ${batch[idx].email}:`, result.reason)
            errorCount++
          }
        })

        // Show progress
        const progress = Math.round(((i + batchSize) / prospects.length) * 100)
        toast.loading(`Generating emails... ${Math.min(progress, 100)}%`)
      }

      setGeneratedEmails(newGeneratedEmails)

      if (successCount > 0 && errorCount === 0) {
        toast.success(`Generated ${successCount} personalized emails!`)
      } else if (successCount > 0) {
        toast.warning(`Generated ${successCount} emails (${errorCount} failed)`)
      } else {
        toast.error(`Failed to generate emails for all prospects`)
      }
    } catch (error) {
      console.error("[v0] Email generation error:", error)
      toast.error("An error occurred while generating emails")
    } finally {
      setIsGenerating(false)
    }
  }

  const regenerateSelectedEmail = async () => {
    if (!selectedProspect) return

    setIsGenerating(true)
    try {
      const response = await fetch("/api/generate/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prospect: {
            firstName: selectedProspect.firstName,
            lastName: selectedProspect.lastName,
            email: selectedProspect.email,
            company: selectedProspect.company,
            jobTitle: selectedProspect.jobTitle,
          },
          researchData: selectedProspect.researchData,
          template: {
            subject: template.subject,
            body: template.body,
          },
          tone: template.tone,
          personalizationLevel: campaign.personalizationLevel || "MEDIUM",
          callToAction: template.callToAction,
        }),
      })

      if (!response.ok) throw new Error("Failed to generate email")

      const data = await response.json()
      setGeneratedEmails((prev) => ({
        ...prev,
        [selectedProspectId]: data.data,
      }))

      toast.success("Email regenerated successfully")
    } catch (error) {
      console.error("[v0] Regeneration error:", error)
      toast.error("Failed to regenerate email")
    } finally {
      setIsGenerating(false)
    }
  }

  const useManualTemplate = () => {
    if (!template.subject.trim() || !template.body.trim()) {
      toast.error("Please provide both subject and body template")
      return
    }

    const manualEmails: Record<string, GeneratedEmail> = {}

    prospects.forEach((prospect) => {
      // Replace variables manually
      const personalizedSubject = template.subject
        .replace(/\{\{firstName\}\}/g, prospect.firstName || "there")
        .replace(/\{\{lastName\}\}/g, prospect.lastName || "")
        .replace(/\{\{company\}\}/g, prospect.company || "your company")
        .replace(/\{\{jobTitle\}\}/g, prospect.jobTitle || "")

      const personalizedBody = template.body
        .replace(/\{\{firstName\}\}/g, prospect.firstName || "there")
        .replace(/\{\{lastName\}\}/g, prospect.lastName || "")
        .replace(/\{\{company\}\}/g, prospect.company || "your company")
        .replace(/\{\{jobTitle\}\}/g, prospect.jobTitle || "")

      manualEmails[prospect.id] = {
        subject: personalizedSubject,
        body: personalizedBody,
        qualityScore: 85,
        personalizationScore: 75,
        suggestions: [],
      }
    })

    setGeneratedEmails(manualEmails)
    toast.success(`Template personalized for ${prospects.length} prospects!`)
  }

  const copyEmailToClipboard = (email: GeneratedEmail) => {
    const text = `Subject: ${email.subject}\n\n${email.body}`
    navigator.clipboard.writeText(text)
    setCopiedId(selectedProspectId)
    toast.success("Email copied to clipboard")
    setTimeout(() => setCopiedId(""), 2000)
  }

  const handleSaveAndNext = async () => {
    if (Object.keys(generatedEmails).length === 0) {
      toast.error("Please generate emails before proceeding")
      return
    }

    try {
      const response = await fetch(`/api/campaigns/${campaign.id}/save-emails`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emails: generatedEmails,
          template,
        }),
      })

      if (!response.ok) throw new Error("Failed to save emails")

      toast.success("Emails saved successfully")
      onNext()
    } catch (error) {
      console.error("[v0] Save emails error:", error)
      toast.error("Failed to save emails")
    }
  }

  if (isLoadingProspects) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          {/* <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /> */}
          <WaveLoader size="sm" bars={8} gap="tight" />
          <p className="text-muted-foreground">Loading prospects...</p>
        </div>
      </div>
    )
  }

  if (prospects.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center space-y-4">
        <div className="text-lg font-semibold">No prospects found</div>
        <p className="text-muted-foreground">Please go back to import or add prospects first</p>
        <Button onClick={onBack} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Prospects
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Template Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Template
          </CardTitle>
          <CardDescription>
            <div className="flex items-center justify-between">
              <span>Configure your email template for personalization</span>
              <Button variant="ghost" size="sm" onClick={() => setUseManualMode(!useManualMode)} className="text-xs">
                {useManualMode ? "Use AI Mode" : "Use Manual Mode"}
              </Button>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="subject">Subject Line Template</Label>
            <Input
              id="subject"
              placeholder="Quick question about {{company}}"
              value={template.subject}
              onChange={(e) => setTemplate({ ...template, subject: e.target.value })}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Use variables:{" "}
              <code className="bg-muted px-1 rounded">
                {"{"}firstName{"}"}
              </code>
              ,{" "}
              <code className="bg-muted px-1 rounded">
                {"{"}lastName{"}"}
              </code>
              ,{" "}
              <code className="bg-muted px-1 rounded">
                {"{"}company{"}"}
              </code>
              ,{" "}
              <code className="bg-muted px-1 rounded">
                {"{"}jobTitle{"}"}
              </code>
            </p>
          </div>

          <div>
            <Label htmlFor="body">Email Body Template</Label>
            <Textarea
              id="body"
              placeholder={`Hi {firstName},\n\nI noticed {company} and wanted to reach out about [your topic].\n\nWould you be open to a quick chat?\n\nBest,\n[Your name]`}
              value={template.body}
              onChange={(e) => setTemplate({ ...template, body: e.target.value })}
              rows={10}
              className="mt-2 font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {useManualMode
                ? "Variables will be replaced with actual prospect data when sending"
                : "AI will use your research data to deeply personalize this template"}
            </p>
          </div>

          {!useManualMode && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tone">Tone of Voice</Label>
                <Select value={template.tone} onValueChange={(value) => setTemplate({ ...template, tone: value })}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="consultative">Consultative</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="cta">Call to Action</Label>
                <Input
                  id="cta"
                  placeholder="schedule a quick call"
                  value={template.callToAction}
                  onChange={(e) => setTemplate({ ...template, callToAction: e.target.value })}
                  className="mt-2"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Email Preview and Generator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            {useManualMode ? "Personalize" : "Generate & Preview"} ({prospects.length} prospects)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="preview" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="preview">Preview Generated</TabsTrigger>
              <TabsTrigger value="prospects">Select Prospect</TabsTrigger>
            </TabsList>

            <TabsContent value="prospects" className="space-y-4">
              <div className="space-y-2">
                <Label>Prospects</Label>
                <div className="max-h-64 overflow-y-auto space-y-2 border rounded-lg p-3">
                  {prospects.map((prospect) => {
                    const hasEmail = selectedProspectId in generatedEmails
                    return (
                      <button
                        key={prospect.id}
                        onClick={() => setSelectedProspectId(prospect.id)}
                        className={`w-full text-left p-3 rounded-lg transition-all text-sm ${
                          selectedProspectId === prospect.id
                            ? "bg-primary/10 border-2 border-primary"
                            : "bg-muted/50 border-2 border-transparent hover:bg-muted"
                        } ${hasEmail ? "ring-2 ring-green-500 ring-offset-1" : ""}`}
                      >
                        <div className="font-medium">
                          {prospect.firstName} {prospect.lastName}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {prospect.jobTitle} at {prospect.company}
                        </div>
                        <div className="text-xs text-muted-foreground">{prospect.email}</div>
                        {hasEmail && <div className="text-xs text-green-600 mt-1">✓ Email generated</div>}
                      </button>
                    )
                  })}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="preview" className="space-y-4">
              {selectedEmail && selectedProspect ? (
                <div className="space-y-4">
                  <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">To</div>
                      <div className="font-medium">{selectedProspect.email}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Subject</div>
                      <div className="font-medium text-lg">{selectedEmail.subject}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-2">Body</div>
                      <div className="whitespace-pre-wrap text-sm leading-relaxed border rounded p-3 bg-background">
                        {selectedEmail.body}
                      </div>
                    </div>
                  </div>

                  {/* Quality Scores */}
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="pt-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-primary">{selectedEmail.qualityScore}</div>
                          <div className="text-xs text-muted-foreground">Quality Score</div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-blue-500">{selectedEmail.personalizationScore}</div>
                          <div className="text-xs text-muted-foreground">Personalization</div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Suggestions */}
                  {selectedEmail.suggestions && selectedEmail.suggestions.length > 0 && (
                    <Card>
                      <CardContent className="pt-4">
                        <div className="text-sm font-medium mb-2">Improvement Suggestions</div>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          {selectedEmail.suggestions.map((suggestion, idx) => (
                            <li key={idx} className="flex gap-2">
                              <span className="flex-shrink-0">•</span>
                              <span>{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      onClick={regenerateSelectedEmail}
                      disabled={isGenerating}
                      variant="outline"
                      className="flex-1 bg-transparent"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Regenerate
                    </Button>
                    <Button onClick={() => copyEmailToClipboard(selectedEmail)} variant="outline" className="flex-1">
                      {copiedId === selectedProspectId ? (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Eye className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Generate emails to preview them here</p>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Generate Button */}
          <Button
            onClick={useManualMode ? useManualTemplate : generateEmailsForAll}
            disabled={isGenerating || !template.subject.trim() || !template.body.trim()}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <WaveLoader size="sm" bars={8} gap="tight" />
                Generating {Object.keys(generatedEmails).length}/{prospects.length}...
              </>
            ) : useManualMode ? (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Personalize Template for All ({prospects.length})
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate All Personalized Emails ({prospects.length})
              </>
            )}
          </Button>

          <div className="text-xs text-muted-foreground">
            {Object.keys(generatedEmails).length > 0 && (
              <p>
                ✓ {Object.keys(generatedEmails).length}/{prospects.length} emails{" "}
                {useManualMode ? "personalized" : "generated"}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t">
        <Button variant="outline" onClick={onBack} disabled={isGenerating}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button onClick={handleSaveAndNext} disabled={isGenerating || Object.keys(generatedEmails).length === 0}>
          Next Step
          <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
        </Button>
      </div>
    </div>
  )
}
