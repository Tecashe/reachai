"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Save, Eye, Plus, X, Palette, FileText, Code, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { createTemplate, updateTemplate } from "@/lib/actions/template-actions"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import type { EmailTemplate } from "@prisma/client"

interface TemplateEditorFormProps {
  userId: string
  template?: EmailTemplate & { user?: { name: string | null } | null }
  onSave?: () => void
}

const CATEGORIES = [
  "Cold Outreach",
  "Follow-up",
  "Nurture",
  "Meeting Request",
  "Introduction",
  "Partnership",
  "Recruiting",
  "Sales",
  "Customer Success",
  "Re-engagement",
]

const INDUSTRIES = [
  { value: "saas", label: "SaaS" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "real_estate", label: "Real Estate" },
  { value: "recruiting", label: "Recruiting" },
  { value: "healthcare", label: "Healthcare" },
  { value: "finance", label: "Finance" },
  { value: "education", label: "Education" },
  { value: "nonprofit", label: "Non-profit" },
  { value: "technology", label: "Technology" },
  { value: "consulting", label: "Consulting" },
]

const TEMPLATE_TYPES = [
  { value: "TEXT", label: "Plain Text", description: "Simple text-based email" },
  { value: "HTML", label: "HTML", description: "Rich HTML email with styling" },
  { value: "VISUAL", label: "Visual", description: "Visual block-based email" },
]

export function TemplateEditorForm({ userId, template, onSave }: TemplateEditorFormProps) {
  const router = useRouter()
  const [isSaving, setIsSaving] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState("content")

  // Basic info
  const [formData, setFormData] = React.useState({
    name: template?.name || "",
    description: template?.description ?? undefined,
    category: template?.category || "",
    industry: template?.industry || "",
    templateType: template?.templateType || "TEXT",
    isFavorite: template?.isFavorite || false,
  })

  // Content
  const [subject, setSubject] = React.useState(template?.subject || "")
  const [body, setBody] = React.useState(template?.body || "")

  // Tags
  const [tags, setTags] = React.useState<string[]>(template?.tags || [])
  const [tagInput, setTagInput] = React.useState("")

  // Variables
  const [variables, setVariables] = React.useState<
    Array<{
      name: string
      required: boolean
      defaultValue: string
      description: string
    }>
  >(template?.variables && Array.isArray(template.variables) ? (template.variables as any[]) : [])

  // Visual settings
  const [colorScheme, setColorScheme] = React.useState<{
    primary?: string
    secondary?: string
    accent?: string
  }>(
    template?.colorScheme && typeof template.colorScheme === "object"
      ? (template.colorScheme as any)
      : { primary: "#3b82f6", secondary: "#64748b", accent: "#10b981" },
  )

  // Extract variables from content
  React.useEffect(() => {
    const content = `${subject} ${body}`
    const variablePattern = /\{\{([^}]+)\}\}/g
    const found = new Set<string>()
    let match

    while ((match = variablePattern.exec(content)) !== null) {
      found.add(match[1])
    }

    // Add any new variables that aren't already in the list
    const currentVarNames = new Set(variables.map((v) => v.name))
    const newVars = Array.from(found).filter((v) => !currentVarNames.has(v))

    if (newVars.length > 0) {
      setVariables((prev) => [
        ...prev,
        ...newVars.map((name) => ({
          name,
          required: false,
          defaultValue: "",
          description: "",
        })),
      ])
    }
  }, [subject, body])

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const addVariable = () => {
    setVariables([...variables, { name: "", required: false, defaultValue: "", description: "" }])
  }

  const updateVariable = (index: number, field: string, value: any) => {
    const updated = [...variables]
    updated[index] = { ...updated[index], [field]: value }
    setVariables(updated)
  }

  const removeVariable = (index: number) => {
    setVariables(variables.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const templateData = {
        name: formData.name,
        description: formData.description ?? undefined,
        category: formData.category ?? undefined,
        industry: formData.industry ?? undefined,
        templateType: formData.templateType as "TEXT" | "HTML" | "VISUAL",
        subject,
        body,
        tags,
        variables,
        colorScheme: {
          primary: colorScheme.primary || "#3b82f6",
          secondary: colorScheme.secondary || "#8b5cf6",
          accent: colorScheme.accent || "#10b981",
        },
        isFavorite: formData.isFavorite,
      }

      if (template) {
        const result = await updateTemplate(userId, {
          id: template.id,
          ...templateData,
        })
        if (result.success) {
          toast.success("Template updated successfully")
          router.push("/templates")
        } else {
          toast.error(result.message || "Failed to update template")
        }
      } else {
        const result = await createTemplate(userId, templateData)
        if (result.success) {
          toast.success("Template created successfully")
          router.push("/templates")
        } else {
          toast.error(result.message || "Failed to create template")
        }
      }
      onSave?.()
    } catch (error) {
      console.error("Failed to save template:", error)
      toast.error("Failed to save template")
    } finally {
      setIsSaving(false)
    }
  }

  // Sample preview data
  const sampleData: Record<string, string> = {
    firstName: "John",
    lastName: "Doe",
    fullName: "John Doe",
    email: "john@company.com",
    company: "Acme Inc",
    jobTitle: "VP of Sales",
    industry: "Technology",
    senderName: "Your Name",
    senderCompany: "Your Company",
  }

  const previewSubject = React.useMemo(() => {
    let result = subject
    Object.entries(sampleData).forEach(([key, value]) => {
      result = result.replace(new RegExp(`{{${key}}}`, "gi"), value)
    })
    return result
  }, [subject])

  const previewBody = React.useMemo(() => {
    let result = body
    Object.entries(sampleData).forEach(([key, value]) => {
      result = result.replace(new RegExp(`{{${key}}}`, "gi"), value)
    })
    return result
  }, [body])

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex">
          {/* Editor Panel */}
          <div className="flex-1 border-r overflow-hidden flex flex-col">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <div className="border-b px-6 py-2">
                <TabsList>
                  <TabsTrigger value="content" className="gap-2">
                    <FileText className="h-4 w-4" />
                    Content
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="gap-2">
                    <Settings className="h-4 w-4" />
                    Settings
                  </TabsTrigger>
                  <TabsTrigger value="variables" className="gap-2">
                    <Code className="h-4 w-4" />
                    Variables
                  </TabsTrigger>
                  <TabsTrigger value="design" className="gap-2">
                    <Palette className="h-4 w-4" />
                    Design
                  </TabsTrigger>
                </TabsList>
              </div>

              <ScrollArea className="flex-1">
                <div className="p-6">
                  <TabsContent value="content" className="mt-0 space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject Line *</Label>
                      <Input
                        id="subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Enter email subject..."
                        className="font-medium"
                      />
                      <p className="text-xs text-muted-foreground">
                        Use variables like {`{{firstName}}`}, {`{{company}}`} for personalization
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="body">Email Body *</Label>
                      <Textarea
                        id="body"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        placeholder="Write your email content here...&#10;&#10;Use {{variables}} for personalization"
                        className="min-h-[400px] font-mono text-sm"
                      />
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{body.length} characters</span>
                        <span>{(body.match(/\{\{[^}]+\}\}/g) || []).length} variables detected</span>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="settings" className="mt-0 space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Template Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., Cold Intro - Tech Startups"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Brief description of when to use this template..."
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) => setFormData({ ...formData, category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {CATEGORIES.map((cat) => (
                              <SelectItem key={cat} value={cat}>
                                {cat}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="industry">Industry</Label>
                        <Select
                          value={formData.industry}
                          onValueChange={(value) => setFormData({ ...formData, industry: value })}
                        >
                          <SelectTrigger>
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
                    </div>

                    <div className="space-y-2">
                      <Label>Template Type</Label>
                      <div className="grid grid-cols-3 gap-3">
                        {TEMPLATE_TYPES.map((type) => (
                          <Card
                            key={type.value}
                            className={cn(
                              "p-3 cursor-pointer transition-colors hover:border-primary",
                              formData.templateType === type.value && "border-primary bg-primary/5",
                            )}
                            onClick={() =>
                              setFormData({ ...formData, templateType: type.value as "TEXT" | "HTML" | "VISUAL" })
                            }
                          >
                            <p className="font-medium text-sm">{type.label}</p>
                            <p className="text-xs text-muted-foreground mt-1">{type.description}</p>
                          </Card>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Tags</Label>
                      <div className="flex gap-2">
                        <Input
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                          placeholder="Add tag..."
                          className="flex-1"
                        />
                        <Button onClick={addTag} size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="gap-1">
                              {tag}
                              <button onClick={() => removeTag(tag)} className="ml-1 hover:text-destructive">
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Mark as Favorite</Label>
                        <p className="text-xs text-muted-foreground">Quick access to this template</p>
                      </div>
                      <Switch
                        checked={formData.isFavorite}
                        onCheckedChange={(checked) => setFormData({ ...formData, isFavorite: checked })}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="variables" className="mt-0 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Template Variables</h3>
                        <p className="text-sm text-muted-foreground">Define variables used in your template</p>
                      </div>
                      <Button onClick={addVariable} size="sm" variant="outline">
                        <Plus className="h-4 w-4 mr-1" />
                        Add Variable
                      </Button>
                    </div>

                    {variables.length === 0 ? (
                      <Card className="p-6 text-center">
                        <p className="text-sm text-muted-foreground">
                          No variables defined yet. Variables will be auto-detected from your content.
                        </p>
                      </Card>
                    ) : (
                      <div className="space-y-3">
                        {variables.map((variable, index) => (
                          <Card key={index} className="p-4">
                            <div className="space-y-3">
                              <div className="flex items-start gap-3">
                                <div className="flex-1 space-y-2">
                                  <Input
                                    value={variable.name}
                                    onChange={(e) => updateVariable(index, "name", e.target.value)}
                                    placeholder="Variable name (e.g., firstName)"
                                    className="font-mono text-sm"
                                  />
                                  <Input
                                    value={variable.description}
                                    onChange={(e) => updateVariable(index, "description", e.target.value)}
                                    placeholder="Description (optional)"
                                    className="text-sm"
                                  />
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeVariable(index)}
                                  className="text-muted-foreground hover:text-destructive"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                  <Switch
                                    checked={variable.required}
                                    onCheckedChange={(checked) => updateVariable(index, "required", checked)}
                                  />
                                  <Label className="text-sm">Required</Label>
                                </div>
                                <Input
                                  value={variable.defaultValue}
                                  onChange={(e) => updateVariable(index, "defaultValue", e.target.value)}
                                  placeholder="Default value (optional)"
                                  className="flex-1 text-sm"
                                />
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="design" className="mt-0 space-y-6">
                    <div>
                      <h3 className="font-medium mb-4">Color Scheme</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="primary-color">Primary</Label>
                          <div className="flex gap-2">
                            <Input
                              id="primary-color"
                              type="color"
                              value={colorScheme.primary}
                              onChange={(e) => setColorScheme({ ...colorScheme, primary: e.target.value })}
                              className="w-16 h-10 p-1 cursor-pointer"
                            />
                            <Input
                              value={colorScheme.primary}
                              onChange={(e) => setColorScheme({ ...colorScheme, primary: e.target.value })}
                              placeholder="#3b82f6"
                              className="flex-1 font-mono text-sm"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="secondary-color">Secondary</Label>
                          <div className="flex gap-2">
                            <Input
                              id="secondary-color"
                              type="color"
                              value={colorScheme.secondary}
                              onChange={(e) => setColorScheme({ ...colorScheme, secondary: e.target.value })}
                              className="w-16 h-10 p-1 cursor-pointer"
                            />
                            <Input
                              value={colorScheme.secondary}
                              onChange={(e) => setColorScheme({ ...colorScheme, secondary: e.target.value })}
                              placeholder="#64748b"
                              className="flex-1 font-mono text-sm"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="accent-color">Accent</Label>
                          <div className="flex gap-2">
                            <Input
                              id="accent-color"
                              type="color"
                              value={colorScheme.accent}
                              onChange={(e) => setColorScheme({ ...colorScheme, accent: e.target.value })}
                              className="w-16 h-10 p-1 cursor-pointer"
                            />
                            <Input
                              value={colorScheme.accent}
                              onChange={(e) => setColorScheme({ ...colorScheme, accent: e.target.value })}
                              placeholder="#10b981"
                              className="flex-1 font-mono text-sm"
                            />
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        These colors can be used in HTML templates for consistent branding
                      </p>
                    </div>
                  </TabsContent>
                </div>
              </ScrollArea>
            </Tabs>
          </div>

          {/* Live Preview Panel */}
          <div className="w-[450px] flex flex-col overflow-hidden bg-muted/30">
            <div className="border-b px-4 py-3 bg-background">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-medium text-sm">Live Preview</h3>
              </div>
            </div>
            <ScrollArea className="flex-1 p-4">
              <div className="mx-auto max-w-md">
                <Card className="overflow-hidden shadow-sm">
                  <div className="border-b bg-muted/50 p-3">
                    <p className="text-xs text-muted-foreground mb-1">Subject</p>
                    <p className="font-medium text-sm">{previewSubject || "No subject"}</p>
                  </div>
                  <div className="p-4 bg-background">
                    <pre className="whitespace-pre-wrap text-sm font-sans">{previewBody || "No content"}</pre>
                  </div>
                </Card>

                {variables.length > 0 && (
                  <Card className="mt-4 p-3">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Sample Variables</p>
                    <div className="space-y-1 text-xs">
                      {Object.entries(sampleData)
                        .slice(0, 5)
                        .map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <code className="text-muted-foreground">{`{{${key}}}`}</code>
                            <span className="font-medium">{value}</span>
                          </div>
                        ))}
                    </div>
                  </Card>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="border-t px-6 py-4 bg-background">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <div className="flex items-center gap-2">
            <Button onClick={handleSubmit} disabled={isSaving} className="gap-2">
              {isSaving ? (
                <>Saving...</>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {template ? "Update Template" : "Create Template"}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Performance Stats */}
      {template && (
        <div className="space-y-2">
          <Label>Performance</Label>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Times Used</p>
              <p className="text-2xl font-bold">{template.timesUsed}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Avg Open Rate</p>
              <p className="text-2xl font-bold">{template.avgOpenRate?.toFixed(1) ?? "0.0"}%</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Avg Reply Rate</p>
              <p className="text-2xl font-bold">{template.avgReplyRate?.toFixed(1) ?? "0.0"}%</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
