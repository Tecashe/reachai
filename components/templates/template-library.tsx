"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, Star, Copy, Eye, Trash2, MoreVertical, TrendingUp, Clock, Edit, Plus } from "lucide-react"
import { getTemplates, duplicateTemplate, deleteTemplate, toggleTemplateFavorite } from "@/lib/actions/template-actions"
import { useToast } from "@/hooks/use-toast"
import { TemplatePreviewDialog } from "./template-preview-dialog"
import { useRouter } from "next/navigation"

interface Template {
  id: string
  name: string
  description?: string | null
  subject: string
  body: string
  category?: string | null
  industry?: string | null
  tags: string[]
  thumbnailUrl?: string | null
  templateType: string
  timesUsed: number
  avgOpenRate?: number | null
  avgReplyRate?: number | null
  isFavorite: boolean
  viewCount: number
  isSystemTemplate: boolean
  user?: {
    id: string
    name: string | null
    email: string | null
  } | null
}

interface TemplateLibraryProps {
  userId: string
  onSelectTemplate?: (template: Template) => void
  onClose?: () => void
}

export function TemplateLibrary({ userId, onSelectTemplate, onClose }: TemplateLibraryProps) {
  const router = useRouter()
  const [templates, setTemplates] = useState<Template[]>([])
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedIndustry, setSelectedIndustry] = useState<string>("all")
  const [selectedTab, setSelectedTab] = useState<string>("all")
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null)
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

  useEffect(() => {
    loadTemplates()
  }, [])

  useEffect(() => {
    filterTemplates()
  }, [templates, searchQuery, selectedCategory, selectedIndustry, selectedTab])

  async function loadTemplates() {
    setLoading(true)
    const result = await getTemplates(userId, { includeSystem: true })
    if (result.success && result.templates) {
      setTemplates(result.templates as Template[])
    }
    setLoading(false)
  }

  function filterTemplates() {
    let filtered = templates

    if (selectedTab === "favorites") {
      filtered = filtered.filter((t) => t.isFavorite)
    } else if (selectedTab === "my-templates") {
      filtered = filtered.filter((t) => !t.isSystemTemplate)
    } else if (selectedTab === "system") {
      filtered = filtered.filter((t) => t.isSystemTemplate)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (t) =>
          t.name.toLowerCase().includes(query) ||
          t.description?.toLowerCase().includes(query) ||
          t.subject.toLowerCase().includes(query) ||
          t.tags.some((tag) => tag.toLowerCase().includes(query)),
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((t) => t.category === selectedCategory)
    }

    if (selectedIndustry !== "all") {
      filtered = filtered.filter((t) => t.industry === selectedIndustry)
    }

    setFilteredTemplates(filtered)
  }

  async function handleDuplicate(templateId: string) {
    const result = await duplicateTemplate(userId, templateId)
    if (result.success) {
      toast({
        title: "Template duplicated",
        description: "The template has been added to your library.",
      })
      loadTemplates()
    } else {
      toast({
        title: "Error",
        description: result.message || "Failed to duplicate template",
        variant: "destructive",
      })
    }
  }

  async function handleDelete(templateId: string) {
    if (!confirm("Are you sure you want to delete this template?")) return

    const result = await deleteTemplate(userId, templateId)
    if (result.success) {
      toast({
        title: "Template deleted",
        description: "The template has been removed from your library.",
      })
      loadTemplates()
    } else {
      toast({
        title: "Error",
        description: result.message || "Failed to delete template",
        variant: "destructive",
      })
    }
  }

  async function handleToggleFavorite(templateId: string) {
    const result = await toggleTemplateFavorite(userId, templateId)
    if (result.success) {
      setTemplates((prev) =>
        prev.map((t) => (t.id === templateId ? { ...t, isFavorite: result.isFavorite || false } : t)),
      )
    }
  }

  function handleUseTemplate(template: Template) {
    console.log("[v0] Using template:", template.name)
    if (onSelectTemplate) {
      onSelectTemplate(template)
    }
    if (onClose) {
      onClose()
    }
  }

  function handleEditTemplate(templateId: string) {
    router.push(`/templates/${templateId}`)
  }

  function handleCreateTemplate() {
    router.push("/templates/new")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Email Templates</h2>
          <p className="text-muted-foreground">Browse and use high-converting email templates for your campaigns</p>
        </div>
        <Button onClick={handleCreateTemplate} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Template
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Industries</SelectItem>
              {industries.map((ind) => (
                <SelectItem key={ind} value={ind}>
                  {ind}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="all">All Templates</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="my-templates">My Templates</TabsTrigger>
          <TabsTrigger value="system">Pre-built</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="mt-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-muted-foreground">Loading templates...</div>
            </div>
          ) : filteredTemplates.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground">No templates found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredTemplates.map((template) => (
                <Card key={template.id} className="flex flex-col">
                  <CardHeader className="relative">
                    <div className="absolute right-4 top-4 flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleToggleFavorite(template.id)}
                      >
                        <Star className={`h-4 w-4 ${template.isFavorite ? "fill-yellow-400 text-yellow-400" : ""}`} />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setPreviewTemplate(template)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Preview
                          </DropdownMenuItem>
                          {!template.isSystemTemplate && (
                            <DropdownMenuItem onClick={() => handleEditTemplate(template.id)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => handleDuplicate(template.id)}>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          {!template.isSystemTemplate && (
                            <DropdownMenuItem onClick={() => handleDelete(template.id)} className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardTitle className="pr-16 text-lg">{template.name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {template.description || template.subject}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {template.category && (
                        <Badge variant="secondary" className="text-xs">
                          {template.category}
                        </Badge>
                      )}
                      {template.industry && (
                        <Badge variant="outline" className="text-xs">
                          {template.industry}
                        </Badge>
                      )}
                      {template.isSystemTemplate && (
                        <Badge variant="default" className="text-xs">
                          Pre-built
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          Used
                        </span>
                        <span className="font-medium">{template.timesUsed}x</span>
                      </div>
                      {template.avgOpenRate !== null &&
                        template.avgOpenRate !== undefined &&
                        template.avgOpenRate > 0 && (
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <TrendingUp className="h-3 w-3" />
                              Open Rate
                            </span>
                            <span className="font-medium">{template.avgOpenRate.toFixed(1)}%</span>
                          </div>
                        )}
                      {template.avgReplyRate !== null &&
                        template.avgReplyRate !== undefined &&
                        template.avgReplyRate > 0 && (
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <TrendingUp className="h-3 w-3" />
                              Reply Rate
                            </span>
                            <span className="font-medium">{template.avgReplyRate.toFixed(1)}%</span>
                          </div>
                        )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={() => handleUseTemplate(template)} className="w-full">
                      Use Template
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Preview Dialog */}
      {previewTemplate && (
        <TemplatePreviewDialog
          template={previewTemplate as any}
          open={!!previewTemplate}
          onOpenChange={(open) => !open && setPreviewTemplate(null)}
          onUseTemplate={() => {
            handleUseTemplate(previewTemplate)
            setPreviewTemplate(null)
          }}
        />
      )}
    </div>
  )
}
