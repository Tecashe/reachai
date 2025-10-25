"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Loader2, Sparkles } from "lucide-react"
import { toast } from "sonner"

interface EmailGenerationStepProps {
  campaign: any
  onNext: () => void
  onBack: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

export function EmailGenerationStep({ campaign, onNext, onBack }: EmailGenerationStepProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [template, setTemplate] = useState({
    subject: "",
    body: "",
    tone: campaign.toneOfVoice || "professional",
    callToAction: "schedule a call",
  })

  const generateEmails = async () => {
    if (!template.subject || !template.body) {
      toast.error("Please provide both subject and body template")
      return
    }

    setIsGenerating(true)

    try {
      const response = await fetch("/api/emails/generate-batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignId: campaign.id,
          template: template.body,
          subject: template.subject,
          tone: template.tone,
          callToAction: template.callToAction,
        }),
      })

      if (!response.ok) {
        throw new Error("Email generation failed")
      }

      const data = await response.json()
      toast.success(`Generated ${data.count} personalized emails!`)
      onNext()
    } catch (error) {
      console.error("[v0] Email generation error:", error)
      toast.error("Failed to generate emails. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="subject">Email Subject Template</Label>
          <Input
            id="subject"
            placeholder="Quick question about {{company}}"
            value={template.subject}
            onChange={(e) => setTemplate({ ...template, subject: e.target.value })}
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Use variables like {`{firstName}`}, {`{company}`}, {`{jobTitle}`}
          </p>
        </div>

        <div>
          <Label htmlFor="body">Email Body Template</Label>
          <Textarea
            id="body"
            placeholder={`Hi {firstName},

I noticed {company} is working on [specific initiative]. We help companies like yours...

[Your value proposition]

Would you be open to a quick call?

Best,
[Your name]`}
            value={template.body}
            onChange={(e) => setTemplate({ ...template, body: e.target.value })}
            rows={12}
            className="mt-2 font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground mt-1">
            AI will personalize this template for each prospect using research data
          </p>
        </div>

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
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="cta">Call to Action</Label>
            <Input
              id="cta"
              placeholder="schedule a call"
              value={template.callToAction}
              onChange={(e) => setTemplate({ ...template, callToAction: e.target.value })}
              className="mt-2"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <Button variant="outline" onClick={onBack} disabled={isGenerating}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button onClick={generateEmails} disabled={isGenerating || !template.subject || !template.body}>
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Personalized Emails
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
