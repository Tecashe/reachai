"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { updateTemplate } from "@/lib/actions/templates"
import { toast } from "sonner"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

interface EditTemplateFormProps {
  template: {
    id: string
    name: string
    subject: string
    body: string
    category: string | null
    description: string | null
  }
}

export function EditTemplateForm({ template }: EditTemplateFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: template.name,
    subject: template.subject,
    body: template.body,
    category: template.category || "COLD_OUTREACH",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await updateTemplate(template.id, formData)

      if (result.success) {
        toast.success("Template updated successfully")
        router.push("/dashboard/templates")
        router.refresh()
      } else {
        toast.error(result.error || "Failed to update template")
      }
    } catch (error) {
      console.error("[builtbycashe] Error updating template:", error)
      toast.error("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Template Details</CardTitle>
              <CardDescription>Edit your template information and content</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/templates">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Template Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Cold Outreach - SaaS Founders"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger id="category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="COLD_OUTREACH">Cold Outreach</SelectItem>
                <SelectItem value="FOLLOW_UP">Follow Up</SelectItem>
                <SelectItem value="MEETING_REQUEST">Meeting Request</SelectItem>
                <SelectItem value="INTRODUCTION">Introduction</SelectItem>
                <SelectItem value="THANK_YOU">Thank You</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject Line</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="e.g., Quick question about {{company}}"
              required
            />
            <p className="text-xs text-muted-foreground">
              Use {`{{variable}}`} for dynamic content (e.g., {`{{firstName}}`}, {`{{company}}`})
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="body">Email Body</Label>
            <Textarea
              id="body"
              value={formData.body}
              onChange={(e) => setFormData({ ...formData, body: e.target.value })}
              placeholder="Hi {{firstName}},&#10;&#10;I noticed that {{company}} is..."
              rows={12}
              required
            />
            <p className="text-xs text-muted-foreground">
              Use {`{{variable}}`} for personalization. Available variables: firstName, lastName, company, position,
              etc.
            </p>
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link href="/dashboard/templates">Cancel</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
