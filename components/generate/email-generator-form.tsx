// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Textarea } from "@/components/ui/textarea"
// import { Input } from "@/components/ui/input"
// import { Loader2, Sparkles, RefreshCw, Copy, Check } from "lucide-react"
// import { Card, CardContent } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"

// export function EmailGeneratorForm() {
//   const [generating, setGenerating] = useState(false)
//   const [generated, setGenerated] = useState(false)
//   const [copied, setCopied] = useState(false)
//   const [generatedEmail, setGeneratedEmail] = useState({
//     subject: "",
//     body: "",
//     qualityScore: 0,
//     personalizationScore: 0,
//     suggestions: [] as string[],
//   })

//   const handleGenerate = async () => {
//     setGenerating(true)

//     // Simulate AI generation
//     await new Promise((resolve) => setTimeout(resolve, 2000))

//     setGeneratedEmail({
//       subject: "Quick question about TechFlow's sales automation",
//       body: `Hi Sarah,

// I noticed TechFlow recently raised $10M in Series A funding - congrats! Scaling sales operations at this stage can be challenging, especially when you're trying to maintain personalization at scale.

// I work with sales leaders at companies like yours who are looking to improve email response rates without sacrificing quality. We've helped similar teams increase reply rates by 3x using AI-powered personalization.

// Would you be open to a 15-minute chat next week to explore how we could help TechFlow scale your outreach?

// Best,
// John`,
//       qualityScore: 92,
//       personalizationScore: 88,
//       suggestions: [
//         "Consider adding a specific metric from their recent news",
//         "The CTA could be more specific about the value proposition",
//         "Great use of recent funding news as a hook",
//       ],
//     })

//     setGenerating(false)
//     setGenerated(true)
//   }

//   const handleCopy = () => {
//     navigator.clipboard.writeText(`Subject: ${generatedEmail.subject}\n\n${generatedEmail.body}`)
//     setCopied(true)
//     setTimeout(() => setCopied(false), 2000)
//   }

//   return (
//     <div className="space-y-6">
//       <div className="grid gap-6 md:grid-cols-2">
//         <div className="space-y-4">
//           <div className="space-y-2">
//             <Label htmlFor="prospect">Select Prospect</Label>
//             <Select>
//               <SelectTrigger id="prospect">
//                 <SelectValue placeholder="Choose a prospect" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="1">Sarah Chen - TechFlow</SelectItem>
//                 <SelectItem value="2">Marcus Rodriguez - GrowthLabs</SelectItem>
//                 <SelectItem value="3">Emily Watson - CloudScale</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="template">Template (Optional)</Label>
//             <Select>
//               <SelectTrigger id="template">
//                 <SelectValue placeholder="Start from scratch or use template" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="none">No Template</SelectItem>
//                 <SelectItem value="1">SaaS Founder Outreach</SelectItem>
//                 <SelectItem value="2">Follow-up After No Response</SelectItem>
//                 <SelectItem value="3">Meeting Request - Enterprise</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="tone">Tone of Voice</Label>
//             <Select defaultValue="professional">
//               <SelectTrigger id="tone">
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="professional">Professional</SelectItem>
//                 <SelectItem value="casual">Casual</SelectItem>
//                 <SelectItem value="friendly">Friendly</SelectItem>
//                 <SelectItem value="formal">Formal</SelectItem>
//                 <SelectItem value="consultative">Consultative</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="personalization">Personalization Level</Label>
//             <Select defaultValue="HIGH">
//               <SelectTrigger id="personalization">
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="LOW">Low - Basic name and company</SelectItem>
//                 <SelectItem value="MEDIUM">Medium - Include job title</SelectItem>
//                 <SelectItem value="HIGH">High - Deep personalization</SelectItem>
//                 <SelectItem value="ULTRA">Ultra - Maximum insights</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="cta">Call to Action</Label>
//             <Input id="cta" placeholder="e.g., schedule a quick call" defaultValue="schedule a quick call" />
//           </div>

//           <Button onClick={handleGenerate} disabled={generating} className="w-full">
//             {generating ? (
//               <>
//                 <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                 Generating...
//               </>
//             ) : (
//               <>
//                 <Sparkles className="h-4 w-4 mr-2" />
//                 Generate Email
//               </>
//             )}
//           </Button>
//         </div>

//         <div className="space-y-4">
//           {!generated ? (
//             <Card className="border-dashed">
//               <CardContent className="p-12 text-center">
//                 <Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
//                 <p className="text-muted-foreground">Generated email will appear here</p>
//               </CardContent>
//             </Card>
//           ) : (
//             <div className="space-y-4">
//               <Card>
//                 <CardContent className="p-6 space-y-4">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-4">
//                       <div>
//                         <p className="text-sm text-muted-foreground">Quality Score</p>
//                         <p className="text-2xl font-bold text-green-600 dark:text-green-400">
//                           {generatedEmail.qualityScore}/100
//                         </p>
//                       </div>
//                       <div>
//                         <p className="text-sm text-muted-foreground">Personalization</p>
//                         <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
//                           {generatedEmail.personalizationScore}/100
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <Button variant="outline" size="icon" onClick={handleGenerate}>
//                         <RefreshCw className="h-4 w-4" />
//                       </Button>
//                       <Button variant="outline" size="icon" onClick={handleCopy}>
//                         {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
//                       </Button>
//                     </div>
//                   </div>

//                   <div className="space-y-3">
//                     <div>
//                       <Label className="text-xs text-muted-foreground">Subject Line</Label>
//                       <Input value={generatedEmail.subject} readOnly className="mt-1" />
//                     </div>

//                     <div>
//                       <Label className="text-xs text-muted-foreground">Email Body</Label>
//                       <Textarea value={generatedEmail.body} readOnly rows={12} className="mt-1 font-mono text-sm" />
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card>
//                 <CardContent className="p-6">
//                   <h3 className="font-semibold mb-3">AI Suggestions</h3>
//                   <ul className="space-y-2">
//                     {generatedEmail.suggestions.map((suggestion, index) => (
//                       <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
//                         <Badge variant="outline" className="mt-0.5">
//                           {index + 1}
//                         </Badge>
//                         {suggestion}
//                       </li>
//                     ))}
//                   </ul>
//                 </CardContent>
//               </Card>

//               <div className="flex gap-3">
//                 <Button className="flex-1">Save to Templates</Button>
//                 <Button variant="outline" className="flex-1 bg-transparent">
//                   Send Test Email
//                 </Button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Loader2, Sparkles, RefreshCw, Copy, Check } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getProspects } from "@/lib/actions/prospects"
import { getTemplates } from "@/lib/actions/templates"

export function EmailGeneratorForm() {
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [copied, setCopied] = useState(false)
  const [prospects, setProspects] = useState<any[]>([])
  const [templates, setTemplates] = useState<any[]>([])
  const [selectedProspect, setSelectedProspect] = useState("")
  const [generatedEmail, setGeneratedEmail] = useState({
    subject: "",
    body: "",
    qualityScore: 0,
    personalizationScore: 0,
    suggestions: [] as string[],
  })

  useEffect(() => {
    getProspects().then(setProspects).catch(console.error)
    getTemplates().then(setTemplates).catch(console.error)
  }, [])

  const handleGenerate = async () => {
    if (!selectedProspect) {
      alert("Please select a prospect first")
      return
    }

    setGenerating(true)

    try {
      // Call the email generation API
      const response = await fetch("/api/generate/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prospectId: selectedProspect,
          tone: "professional",
          personalizationLevel: "HIGH",
        }),
      })

      if (!response.ok) throw new Error("Failed to generate email")

      const data = await response.json()
      setGeneratedEmail(data)
      setGenerated(true)
    } catch (error) {
      alert("Failed to generate email. Please try again.")
    } finally {
      setGenerating(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(`Subject: ${generatedEmail.subject}\n\n${generatedEmail.body}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prospect">Select Prospect</Label>
            <Select value={selectedProspect} onValueChange={setSelectedProspect}>
              <SelectTrigger id="prospect">
                <SelectValue placeholder="Choose a prospect" />
              </SelectTrigger>
              <SelectContent>
                {prospects.map((prospect) => (
                  <SelectItem key={prospect.id} value={prospect.id}>
                    {prospect.firstName} {prospect.lastName} - {prospect.company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="template">Template (Optional)</Label>
            <Select>
              <SelectTrigger id="template">
                <SelectValue placeholder="Start from scratch or use template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Template</SelectItem>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tone">Tone of Voice</Label>
            <Select defaultValue="professional">
              <SelectTrigger id="tone">
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

          <div className="space-y-2">
            <Label htmlFor="personalization">Personalization Level</Label>
            <Select defaultValue="HIGH">
              <SelectTrigger id="personalization">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOW">Low - Basic name and company</SelectItem>
                <SelectItem value="MEDIUM">Medium - Include job title</SelectItem>
                <SelectItem value="HIGH">High - Deep personalization</SelectItem>
                <SelectItem value="ULTRA">Ultra - Maximum insights</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleGenerate} disabled={generating || !selectedProspect} className="w-full">
            {generating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Email
              </>
            )}
          </Button>
        </div>

        <div className="space-y-4">
          {!generated ? (
            <Card className="border-dashed">
              <CardContent className="p-12 text-center">
                <Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Generated email will appear here</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Quality Score</p>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {generatedEmail.qualityScore}/100
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Personalization</p>
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {generatedEmail.personalizationScore}/100
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" onClick={handleGenerate}>
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={handleCopy}>
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">Subject Line</Label>
                      <Input value={generatedEmail.subject} readOnly className="mt-1" />
                    </div>

                    <div>
                      <Label className="text-xs text-muted-foreground">Email Body</Label>
                      <Textarea value={generatedEmail.body} readOnly rows={12} className="mt-1 font-mono text-sm" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {generatedEmail.suggestions.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-3">AI Suggestions</h3>
                    <ul className="space-y-2">
                      {generatedEmail.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <Badge variant="outline" className="mt-0.5">
                            {index + 1}
                          </Badge>
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
