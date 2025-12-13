"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X, Plus, Eye, Code, Save } from "lucide-react"
import { createTemplate, updateTemplate, type CreateTemplateInput } from "@/lib/actions/template-actions"
import { useToast } from "@/hooks/use-toast"

interface Variable {
  name: string
  required: boolean
  defaultValue: string
  description: string
}

interface TemplateEditorProps {
  userId: string
  template?: any
  onSave?: (template: any) => void
  onCancel?: () => void
}

export function TemplateEditor({ userId, template, onSave, onCancel }: TemplateEditorProps) {
  const [name, setName] = useState(template?.name || "")
  const [description, setDescription] = useState(template?.description || "")
  const [subject, setSubject] = useState(template?.subject || "")
  const [body, setBody] = useState(template?.body || "")
  const [category, setCategory] = useState(template?.category || "")
  const [industry, setIndustry] = useState(template?.industry || "")
  const [tags, setTags] = useState<string[]>(template?.tags || [])
  const [tagInput, setTagInput] = useState("")
  const [variables, setVariables] = useState<Variable[]>(
    template?.variables || [
      { name: "firstName", required: true, defaultValue: "", description: "Recipient's first name" },
      { name: "company", required: true, defaultValue: "", description: "Company name" },
    ],
  )
  const [previewMode, setPreviewMode] = useState(false)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  const categories = [
    "Cold Outreach",
    "Follow-up",
    "Meeting Request",
    "Introduction",
    "Value Proposition",
    "Product Demo",
    "Case Study",
    "Event Invitation",
    "Content Sharing",
    "Partnership",
    "Re-engagement",
    "Thank You",
  ]

  const industries = [
    "SaaS",
    "E-commerce",
    "Real Estate",
    "Recruiting",
    "Healthcare",
    "Finance",
    "Education",
    "Nonprofit",
    "Technology",
    "Consulting",
    "Marketing",
    "Sales",
  ]

  function addTag() {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput])
      setTagInput("")
    }
  }

  function removeTag(tag: string) {
    setTags(tags.filter((t) => t !== tag))
  }

  function addVariable() {
    setVariables([...variables, { name: "", required: false, defaultValue: "", description: "" }])
  }

  function updateVariable(index: number, field: keyof Variable, value: string | boolean) {
    const updated = [...variables]
    updated[index] = { ...updated[index], [field]: value }
    setVariables(updated)
  }

  function removeVariable(index: number) {
    setVariables(variables.filter((_, i) => i !== index))
  }

  function generatePreview() {
    let previewSubject = subject
    let previewBody = body

    // Replace variables with example values
    variables.forEach((variable) => {
      const exampleValue = variable.defaultValue || `[${variable.name}]`
      const regex = new RegExp(`{{\\s*${variable.name}\\s*}}`, "g")
      previewSubject = previewSubject.replace(regex, exampleValue)
      previewBody = previewBody.replace(regex, exampleValue)
    })

    return { subject: previewSubject, body: previewBody }
  }

  async function handleSave() {
    if (!name || !subject || !body) {
      toast({
        title: "Validation error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setSaving(true)

    const input: CreateTemplateInput = {
      name,
      description,
      subject,
      body,
      category,
      industry,
      tags,
      variables,
      templateType: "TEXT",
    }

    let result
    if (template?.id) {
      result = await updateTemplate(userId, { ...input, id: template.id })
    } else {
      result = await createTemplate(userId, input)
    }

    setSaving(false)

    if (result.success) {
      toast({
        title: template?.id ? "Template updated" : "Template created",
        description: "Your template has been saved successfully",
      })
      if (onSave && result.template) {
        onSave(result.template)
      }
    } else {
      toast({
        title: "Error",
        description: result.message || "Failed to save template",
        variant: "destructive",
      })
    }
  }

  const preview = generatePreview()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{template?.id ? "Edit" : "Create"} Template</h2>
          <p className="text-muted-foreground">Design your email template with variables and preview</p>
        </div>
        <div className="flex gap-2">
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button onClick={handleSave} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Saving..." : "Save Template"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Editor */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Template Details</CardTitle>
              <CardDescription>Basic information about your template</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Template Name *</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="My Template" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of this template"
                  rows={2}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select value={industry} onValueChange={setIndustry}>
                    <SelectTrigger id="industry">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((ind) => (
                        <SelectItem key={ind} value={ind}>
                          {ind}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <div className="flex gap-2">
                  <Input
                    id="tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    placeholder="Add tags"
                  />
                  <Button type="button" variant="outline" size="icon" onClick={addTag}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                        <button onClick={() => removeTag(tag)} className="ml-1">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Email Content</CardTitle>
              <CardDescription>Use variables like {`{{firstName}}`} for personalization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject Line *</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Quick question about {{company}}"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="body">Email Body *</Label>
                <Textarea
                  id="body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder={`Hi {{firstName}},\n\nI noticed that {{company}} recently...\n\nBest regards`}
                  rows={12}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Variables
                <Button type="button" variant="outline" size="sm" onClick={addVariable}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Variable
                </Button>
              </CardTitle>
              <CardDescription>Define dynamic fields for personalization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {variables.map((variable, index) => (
                <div key={index} className="space-y-2 rounded-lg border p-3">
                  <div className="flex items-start justify-between">
                    <div className="grid flex-1 gap-2">
                      <div className="grid gap-2 md:grid-cols-2">
                        <Input
                          value={variable.name}
                          onChange={(e) => updateVariable(index, "name", e.target.value)}
                          placeholder="Variable name"
                        />
                        <Input
                          value={variable.defaultValue}
                          onChange={(e) => updateVariable(index, "defaultValue", e.target.value)}
                          placeholder="Default value"
                        />
                      </div>
                      <Input
                        value={variable.description}
                        onChange={(e) => updateVariable(index, "description", e.target.value)}
                        placeholder="Description"
                      />
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={variable.required}
                          onChange={(e) => updateVariable(index, "required", e.target.checked)}
                          className="rounded"
                        />
                        Required field
                      </label>
                    </div>
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeVariable(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        <div className="space-y-6">
          <Card className="sticky top-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Preview</CardTitle>
                <Tabs
                  value={previewMode ? "rendered" : "variables"}
                  onValueChange={(v) => setPreviewMode(v === "rendered")}
                >
                  <TabsList>
                    <TabsTrigger value="variables">
                      <Code className="mr-2 h-4 w-4" />
                      With Variables
                    </TabsTrigger>
                    <TabsTrigger value="rendered">
                      <Eye className="mr-2 h-4 w-4" />
                      Rendered
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <CardDescription>See how your email will look</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase text-muted-foreground">Subject</Label>
                <div className="rounded-lg border bg-muted/50 p-3 text-sm font-medium">
                  {previewMode ? preview.subject : subject || "Your subject line will appear here"}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase text-muted-foreground">Body</Label>
                <div className="max-h-[600px] overflow-y-auto rounded-lg border bg-muted/50 p-4">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                    {previewMode ? preview.body : body || "Your email body will appear here"}
                  </pre>
                </div>
              </div>
              {variables.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase text-muted-foreground">Available Variables</Label>
                  <div className="flex flex-wrap gap-2">
                    {variables.map((v) => (
                      <Badge key={v.name} variant="outline" className="font-mono">
                        {`{{${v.name}}}`}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
