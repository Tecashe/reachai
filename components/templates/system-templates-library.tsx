// "use client"

// import { useEffect, useState } from "react"
// import { Card, CardContent } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Search, Copy, Eye, Sparkles } from 'lucide-react'
// import { getSystemTemplates, cloneSystemTemplate } from "@/lib/actions/templates"
// import { toast } from "sonner"
// import { useRouter } from 'next/navigation'
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog"
// import Image from "next/image"

// type SystemTemplate = {
//   id: string
//   name: string
//   description: string | null
//   category: string | null
//   subject: string
//   body: string
//   industry: string | null
//   tags: string[]
//   thumbnailUrl: string | null
//   previewImageUrl: string | null
//   colorScheme: any
//   variables: string[]
// }

// const INDUSTRIES = [
//   { value: "all", label: "All Industries", icon: "🌐" },
//   { value: "saas", label: "SaaS", icon: "💻" },
//   { value: "ecommerce", label: "E-commerce", icon: "🛒" },
//   { value: "recruiting", label: "Recruiting", icon: "👔" },
//   { value: "real_estate", label: "Real Estate", icon: "🏠" },
//   { value: "consulting", label: "Consulting", icon: "💼" },
//   { value: "marketing_agency", label: "Marketing", icon: "📱" },
//   { value: "healthcare", label: "Healthcare", icon: "⚕️" },
//   { value: "finance", label: "Finance", icon: "💰" },
// ]

// export function SystemTemplatesLibrary() {
//   const router = useRouter()
//   const [templates, setTemplates] = useState<SystemTemplate[]>([])
//   const [filteredTemplates, setFilteredTemplates] = useState<SystemTemplate[]>([])
//   const [selectedIndustry, setSelectedIndustry] = useState("all")
//   const [searchQuery, setSearchQuery] = useState("")
//   const [loading, setLoading] = useState(true)
//   const [selectedTemplate, setSelectedTemplate] = useState<SystemTemplate | null>(null)

//   useEffect(() => {
//     async function loadTemplates() {
//       setLoading(true)
//       const data = await getSystemTemplates()
//       setTemplates(data)
//       setFilteredTemplates(data)
//       setLoading(false)
//     }
//     loadTemplates()
//   }, [])

//   useEffect(() => {
//     let filtered = templates

//     if (selectedIndustry !== "all") {
//       filtered = filtered.filter((t) => t.industry === selectedIndustry)
//     }

//     if (searchQuery) {
//       filtered = filtered.filter(
//         (t) =>
//           t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           t.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           t.category?.toLowerCase().includes(searchQuery.toLowerCase())
//       )
//     }

//     setFilteredTemplates(filtered)
//   }, [selectedIndustry, searchQuery, templates])

//   const handleCloneTemplate = async (templateId: string) => {
//     const result = await cloneSystemTemplate(templateId)
//     if (result.success) {
//       toast.success("Template added to My Templates!")
//       router.push(`/dashboard/templates/${result.template?.id}`)
//       router.refresh()
//     } else {
//       toast.error(result.error || "Failed to clone template")
//     }
//   }

//   if (loading) {
//     return (
//       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//         {[...Array(6)].map((_, i) => (
//           <Card key={i} className="animate-pulse">
//             <div className="h-48 bg-muted rounded-t-lg" />
//             <CardContent className="p-6">
//               <div className="h-4 bg-muted rounded w-3/4 mb-2" />
//               <div className="h-3 bg-muted rounded w-full mb-4" />
//               <div className="h-8 bg-muted rounded" />
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-6">
//       {/* Search and Filter */}
//       <div className="flex flex-col sm:flex-row gap-4">
//         <div className="relative flex-1">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//           <Input
//             placeholder="Search templates..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="pl-10"
//           />
//         </div>
//       </div>

//       {/* Industry Tabs */}
//       <Tabs value={selectedIndustry} onValueChange={setSelectedIndustry}>
//         <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto gap-2 bg-transparent p-0">
//           {INDUSTRIES.map((industry) => (
//             <TabsTrigger
//               key={industry.value}
//               value={industry.value}
//               className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
//             >
//               <span className="mr-2">{industry.icon}</span>
//               {industry.label}
//             </TabsTrigger>
//           ))}
//         </TabsList>

//         {INDUSTRIES.map((industry) => (
//           <TabsContent key={industry.value} value={industry.value} className="mt-6">
//             {filteredTemplates.length === 0 ? (
//               <Card>
//                 <CardContent className="flex flex-col items-center justify-center py-16">
//                   <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
//                   <p className="text-muted-foreground text-center">
//                     No templates found. Try a different search or industry filter.
//                   </p>
//                 </CardContent>
//               </Card>
//             ) : (
//               <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//                 {filteredTemplates.map((template) => (
//                   <Card key={template.id} className="group hover:shadow-lg transition-all overflow-hidden">
//                     {/* Template Thumbnail */}
//                     {template.thumbnailUrl && (
//                       <div className="relative h-48 bg-gradient-to-br from-primary/10 to-accent/10 overflow-hidden">
//                         <Image
//                           src={template.thumbnailUrl || "/placeholder.svg"}
//                           alt={template.name}
//                           fill
//                           className="object-cover group-hover:scale-105 transition-transform duration-300"
//                         />
//                         <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
//                       </div>
//                     )}

//                     <CardContent className="p-6">
//                       <div className="flex items-start justify-between mb-3">
//                         <div className="flex-1">
//                           <h3 className="font-semibold text-lg mb-1 line-clamp-1">{template.name}</h3>
//                           <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
//                             {template.description}
//                           </p>
//                         </div>
//                       </div>

//                       <div className="flex flex-wrap gap-2 mb-4">
//                         {template.tags.slice(0, 3).map((tag) => (
//                           <Badge key={tag} variant="secondary" className="text-xs">
//                             {tag}
//                           </Badge>
//                         ))}
//                       </div>

//                       <div className="text-xs text-muted-foreground mb-4">
//                         <strong>Variables:</strong> {template.variables.length > 0 ? template.variables.slice(0, 3).join(", ") : "None"}
//                         {template.variables.length > 3 && ` +${template.variables.length - 3} more`}
//                       </div>

//                       <div className="flex gap-2">
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => setSelectedTemplate(template)}
//                           className="flex-1"
//                         >
//                           <Eye className="h-4 w-4 mr-2" />
//                           Preview
//                         </Button>
//                         <Button
//                           size="sm"
//                           onClick={() => handleCloneTemplate(template.id)}
//                           className="flex-1"
//                         >
//                           <Copy className="h-4 w-4 mr-2" />
//                           Use Template
//                         </Button>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             )}
//           </TabsContent>
//         ))}
//       </Tabs>

//       {/* Preview Dialog */}
//       {selectedTemplate && (
//         <Dialog open={!!selectedTemplate} onOpenChange={() => setSelectedTemplate(null)}>
//           <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
//             <DialogHeader>
//               <DialogTitle className="text-2xl">{selectedTemplate.name}</DialogTitle>
//               <DialogDescription className="text-base">{selectedTemplate.description}</DialogDescription>
//             </DialogHeader>

//             {selectedTemplate.previewImageUrl && (
//               <div className="relative h-64 rounded-lg overflow-hidden bg-muted">
//                 <Image
//                   src={selectedTemplate.previewImageUrl || "/placeholder.svg"}
//                   alt={`${selectedTemplate.name} preview`}
//                   fill
//                   className="object-cover"
//                 />
//               </div>
//             )}

//             <div className="space-y-4">
//               <div>
//                 <p className="text-sm font-medium mb-2">Subject:</p>
//                 <div className="bg-muted p-3 rounded-md">
//                   <p className="text-sm">{selectedTemplate.subject}</p>
//                 </div>
//               </div>

//               <div>
//                 <p className="text-sm font-medium mb-2">Body:</p>
//                 <div className="bg-muted p-4 rounded-md">
//                   <pre className="text-sm whitespace-pre-wrap font-sans">{selectedTemplate.body}</pre>
//                 </div>
//               </div>

//               <div>
//                 <p className="text-sm font-medium mb-2">Variables ({selectedTemplate.variables.length}):</p>
//                 <div className="flex flex-wrap gap-2">
//                   {selectedTemplate.variables.map((variable) => (
//                     <Badge key={variable} variant="outline">
//                       {`{{${variable}}}`}
//                     </Badge>
//                   ))}
//                 </div>
//               </div>

//               <div className="flex gap-2 pt-4">
//                 <Button onClick={() => setSelectedTemplate(null)} variant="outline" className="flex-1">
//                   Close
//                 </Button>
//                 <Button
//                   onClick={() => {
//                     handleCloneTemplate(selectedTemplate.id)
//                     setSelectedTemplate(null)
//                   }}
//                   className="flex-1"
//                 >
//                   <Copy className="h-4 w-4 mr-2" />
//                   Use This Template
//                 </Button>
//               </div>
//             </div>
//           </DialogContent>
//         </Dialog>
//       )}
//     </div>
//   )
// }

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Search, Plus, Sparkles, Grid3x3, List, Star, Filter } from 'lucide-react'
import { INDUSTRIES } from "@/lib/types"
import { getTemplates, getSystemTemplates, cloneSystemTemplate, getFavoriteTemplates, duplicateTemplate, toggleFavorite } from "@/lib/actions/templates"
import { useToast } from "@/hooks/use-toast"
import { TemplateCard } from "./template-card"
import { AITemplateGenerator } from "./ai-template-generator"
import { useRouter } from 'next/navigation'

export function TemplateLibrary() {
  const [templates, setTemplates] = useState<any[]>([])
  const [filteredTemplates, setFilteredTemplates] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedIndustry, setSelectedIndustry] = useState<string>("all")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [activeTab, setActiveTab] = useState<'all' | 'system' | 'my-templates' | 'favorites'>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [showAIDialog, setShowAIDialog] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    loadTemplates()
  }, [activeTab])

  useEffect(() => {
    filterTemplates()
  }, [templates, searchQuery, selectedIndustry, selectedCategory])

  const loadTemplates = async () => {
    setIsLoading(true)
    try {
      let result: any[] = []
      
      if (activeTab === 'favorites') {
        const favResult = await getFavoriteTemplates()
        if (favResult.success && favResult.templates) {
          result = favResult.templates
        }
      } else if (activeTab === 'system') {
        const systemTemplates = await getSystemTemplates()
        result = systemTemplates as any[]
      } else if (activeTab === 'my-templates') {
        // Fetch only user templates (non-system)
        const allTemplates = await getTemplates()
        result = allTemplates.filter(t => !t.isSystemTemplate)
      } else {
        // Fetch all templates (both system and user)
        result = await getTemplates()
      }

      setTemplates(result)
    } catch (error) {
      toast({
        title: "Error loading templates",
        description: "Failed to load templates. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filterTemplates = () => {
    let filtered = templates

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(t => 
        t.name.toLowerCase().includes(query) ||
        t.subject.toLowerCase().includes(query) ||
        t.description?.toLowerCase().includes(query)
      )
    }

    // Filter by industry
    if (selectedIndustry && selectedIndustry !== 'all') {
      filtered = filtered.filter(t => t.industry === selectedIndustry)
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filtered.filter(t => t.category === selectedCategory)
    }

    setFilteredTemplates(filtered)
  }

  const handleDuplicate = async (templateId: string, isSystemTemplate: boolean) => {
    const result = isSystemTemplate 
      ? await cloneSystemTemplate(templateId)
      : await duplicateTemplate(templateId)
      
    if (result.success) {
      toast({
        title: "Template added",
        description: "The template has been added to your library"
      })
      // Navigate to the new template
      if (result.template) {
        router.push(`/dashboard/templates/${result.template.id}`)
      }
      loadTemplates()
    } else {
      toast({
        title: "Failed to add template",
        description: result.error,
        variant: "destructive"
      })
    }
  }

  const handleToggleFavorite = async (templateId: string) => {
    const result = await toggleFavorite(templateId)
    if (result.success) {
      loadTemplates()
    }
  }

  const handleUseTemplate = (templateId: string) => {
    router.push(`/dashboard/templates/${templateId}`)
  }

  // Get unique categories
  const categories = Array.from(new Set(templates.map(t => t.category).filter(Boolean)))

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full sm:w-auto">
          <TabsList className="grid w-full grid-cols-4 sm:w-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="system">Premium</TabsTrigger>
            <TabsTrigger value="my-templates">My Templates</TabsTrigger>
            <TabsTrigger value="favorites">
              <Star className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex gap-2">
          <Dialog open={showAIDialog} onOpenChange={setShowAIDialog}>
            <DialogTrigger asChild>
              <Button>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate with AI
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>AI Template Generator</DialogTitle>
                <DialogDescription>
                  Create custom email templates powered by AI
                </DialogDescription>
              </DialogHeader>
              <AITemplateGenerator />
            </DialogContent>
          </Dialog>

          <Button variant="outline" onClick={() => router.push('/dashboard/templates/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Create Manual
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-[1fr_200px_200px_auto]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
              <SelectTrigger>
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                {INDUSTRIES.map((ind) => (
                  <SelectItem key={ind.value} value={ind.value}>
                    {ind.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
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

            <div className="flex gap-1 border rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between text-sm">
        <p className="text-muted-foreground">
          {filteredTemplates.length} {filteredTemplates.length === 1 ? 'template' : 'templates'} found
        </p>
        {(searchQuery || selectedIndustry !== 'all' || selectedCategory !== 'all') && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchQuery("")
              setSelectedIndustry("all")
              setSelectedCategory("all")
            }}
          >
            Clear filters
          </Button>
        )}
      </div>

      {/* Templates Grid/List */}
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-40 bg-muted rounded-md" />
                <div className="h-4 bg-muted rounded w-3/4 mt-4" />
                <div className="h-3 bg-muted rounded w-1/2 mt-2" />
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : filteredTemplates.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Filter className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-2">No templates found</h3>
            <p className="text-muted-foreground text-center mb-4">
              Try adjusting your filters or create a new template
            </p>
            <Button onClick={() => setShowAIDialog(true)}>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate with AI
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className={viewMode === 'grid' 
          ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3'
          : 'space-y-4'
        }>
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              viewMode={viewMode}
              onDuplicate={() => handleDuplicate(template.id, template.isSystemTemplate)}
              onToggleFavorite={() => handleToggleFavorite(template.id)}
              onUse={() => handleUseTemplate(template.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
