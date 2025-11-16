// "use client"

// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Badge } from "@/components/ui/badge"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// import { Search, Plus, Sparkles, Grid3x3, List, Star, Filter } from 'lucide-react'
// import { INDUSTRIES } from "@/lib/types"
// import { getTemplates, getTemplatesByIndustry, getFavoriteTemplates, duplicateTemplate, toggleFavorite } from "@/lib/actions/templates"
// import { useToast } from "@/hooks/use-toast"
// import { TemplateCard } from "./template-card"
// import { AITemplateGenerator } from "./ai-template-generator"
// import { useRouter } from 'next/navigation'

// export function TemplateLibrary() {
//   const [templates, setTemplates] = useState<any[]>([])
//   const [filteredTemplates, setFilteredTemplates] = useState<any[]>([])
//   const [searchQuery, setSearchQuery] = useState("")
//   const [selectedIndustry, setSelectedIndustry] = useState<string>("all")
//   const [selectedCategory, setSelectedCategory] = useState<string>("all")
//   const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
//   const [activeTab, setActiveTab] = useState<'all' | 'system' | 'my-templates' | 'favorites'>('all')
//   const [isLoading, setIsLoading] = useState(true)
//   const [showAIDialog, setShowAIDialog] = useState(false)
//   const { toast } = useToast()
//   const router = useRouter()

//   useEffect(() => {
//     loadTemplates()
//   }, [activeTab])

//   useEffect(() => {
//     filterTemplates()
//   }, [templates, searchQuery, selectedIndustry, selectedCategory])

//   const loadTemplates = async () => {
//     setIsLoading(true)
//     try {
//       let result
//       if (activeTab === 'favorites') {
//         result = await getFavoriteTemplates()
//       } else {
//         result = { success: true, templates: await getTemplates() }
//       }

//       if (result.success && result.templates) {
//         setTemplates(result.templates)
//       }
//     } catch (error) {
//       toast({
//         title: "Error loading templates",
//         description: "Failed to load templates. Please try again.",
//         variant: "destructive"
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const filterTemplates = () => {
//     let filtered = templates

//     // Filter by tab
//     if (activeTab === 'system') {
//       filtered = filtered.filter(t => t.isSystemTemplate)
//     } else if (activeTab === 'my-templates') {
//       filtered = filtered.filter(t => !t.isSystemTemplate)
//     }

//     // Filter by search
//     if (searchQuery) {
//       const query = searchQuery.toLowerCase()
//       filtered = filtered.filter(t => 
//         t.name.toLowerCase().includes(query) ||
//         t.subject.toLowerCase().includes(query) ||
//         t.description?.toLowerCase().includes(query)
//       )
//     }

//     // Filter by industry
//     if (selectedIndustry && selectedIndustry !== 'all') {
//       filtered = filtered.filter(t => t.industry === selectedIndustry)
//     }

//     // Filter by category
//     if (selectedCategory && selectedCategory !== 'all') {
//       filtered = filtered.filter(t => t.category === selectedCategory)
//     }

//     setFilteredTemplates(filtered)
//   }

//   const handleDuplicate = async (templateId: string) => {
//     const result = await duplicateTemplate(templateId)
//     if (result.success) {
//       toast({
//         title: "Template duplicated",
//         description: "The template has been added to your library"
//       })
//       loadTemplates()
//     } else {
//       toast({
//         title: "Duplication failed",
//         description: result.error,
//         variant: "destructive"
//       })
//     }
//   }

//   const handleToggleFavorite = async (templateId: string) => {
//     const result = await toggleFavorite(templateId)
//     if (result.success) {
//       loadTemplates()
//     }
//   }

//   const handleUseTemplate = (templateId: string) => {
//     router.push(`/dashboard/templates/${templateId}`)
//   }

//   // Get unique categories
//   const categories = Array.from(new Set(templates.map(t => t.category).filter(Boolean)))

//   return (
//     <div className="space-y-6">
//       {/* Header Actions */}
//       <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//         <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full sm:w-auto">
//           <TabsList className="grid w-full grid-cols-4 sm:w-auto">
//             <TabsTrigger value="all">All</TabsTrigger>
//             <TabsTrigger value="system">Premium</TabsTrigger>
//             <TabsTrigger value="my-templates">My Templates</TabsTrigger>
//             <TabsTrigger value="favorites">
//               <Star className="h-4 w-4" />
//             </TabsTrigger>
//           </TabsList>
//         </Tabs>

//         <div className="flex gap-2">
//           <Dialog open={showAIDialog} onOpenChange={setShowAIDialog}>
//             <DialogTrigger asChild>
//               <Button>
//                 <Sparkles className="mr-2 h-4 w-4" />
//                 Generate with AI
//               </Button>
//             </DialogTrigger>
//             <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
//               <DialogHeader>
//                 <DialogTitle>AI Template Generator</DialogTitle>
//                 <DialogDescription>
//                   Create custom email templates powered by AI
//                 </DialogDescription>
//               </DialogHeader>
//               <AITemplateGenerator />
//             </DialogContent>
//           </Dialog>

//           <Button variant="outline" onClick={() => router.push('/dashboard/templates/new')}>
//             <Plus className="mr-2 h-4 w-4" />
//             Create Manual
//           </Button>
//         </div>
//       </div>

//       {/* Filters */}
//       <Card>
//         <CardContent className="pt-6">
//           <div className="grid gap-4 md:grid-cols-[1fr_200px_200px_auto]">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//               <Input
//                 placeholder="Search templates..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="pl-9"
//               />
//             </div>

//             <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Industry" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Industries</SelectItem>
//                 {INDUSTRIES.map((ind) => (
//                   <SelectItem key={ind.value} value={ind.value}>
//                     {ind.label}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>

//             <Select value={selectedCategory} onValueChange={setSelectedCategory}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Category" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Categories</SelectItem>
//                 {categories.map((cat) => (
//                   <SelectItem key={cat} value={cat}>
//                     {cat}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>

//             <div className="flex gap-1 border rounded-md">
//               <Button
//                 variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
//                 size="sm"
//                 onClick={() => setViewMode('grid')}
//               >
//                 <Grid3x3 className="h-4 w-4" />
//               </Button>
//               <Button
//                 variant={viewMode === 'list' ? 'secondary' : 'ghost'}
//                 size="sm"
//                 onClick={() => setViewMode('list')}
//               >
//                 <List className="h-4 w-4" />
//               </Button>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Results Count */}
//       <div className="flex items-center justify-between text-sm">
//         <p className="text-muted-foreground">
//           {filteredTemplates.length} {filteredTemplates.length === 1 ? 'template' : 'templates'} found
//         </p>
//         {(searchQuery || selectedIndustry !== 'all' || selectedCategory !== 'all') && (
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={() => {
//               setSearchQuery("")
//               setSelectedIndustry("all")
//               setSelectedCategory("all")
//             }}
//           >
//             Clear filters
//           </Button>
//         )}
//       </div>

//       {/* Templates Grid/List */}
//       {isLoading ? (
//         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//           {[...Array(6)].map((_, i) => (
//             <Card key={i} className="animate-pulse">
//               <CardHeader>
//                 <div className="h-40 bg-muted rounded-md" />
//                 <div className="h-4 bg-muted rounded w-3/4 mt-4" />
//                 <div className="h-3 bg-muted rounded w-1/2 mt-2" />
//               </CardHeader>
//             </Card>
//           ))}
//         </div>
//       ) : filteredTemplates.length === 0 ? (
//         <Card>
//           <CardContent className="flex flex-col items-center justify-center py-12">
//             <Filter className="h-12 w-12 text-muted-foreground mb-4" />
//             <h3 className="font-semibold text-lg mb-2">No templates found</h3>
//             <p className="text-muted-foreground text-center mb-4">
//               Try adjusting your filters or create a new template
//             </p>
//             <Button onClick={() => setShowAIDialog(true)}>
//               <Sparkles className="mr-2 h-4 w-4" />
//               Generate with AI
//             </Button>
//           </CardContent>
//         </Card>
//       ) : (
//         <div className={viewMode === 'grid' 
//           ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3'
//           : 'space-y-4'
//         }>
//           {filteredTemplates.map((template) => (
//             <TemplateCard
//               key={template.id}
//               template={template}
//               viewMode={viewMode}
//               onDuplicate={() => handleDuplicate(template.id)}
//               onToggleFavorite={() => handleToggleFavorite(template.id)}
//               onUse={() => handleUseTemplate(template.id)}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }





// "use client"

// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Badge } from "@/components/ui/badge"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// import { Search, Plus, Sparkles, Grid3x3, List, Star, Filter } from 'lucide-react'
// import { INDUSTRIES } from "@/lib/types"
// import { getTemplates, getSystemTemplates, cloneSystemTemplate, getFavoriteTemplates, duplicateTemplate, toggleFavorite } from "@/lib/actions/templates"
// import { useToast } from "@/hooks/use-toast"
// import { TemplateCard } from "./template-card"
// import { AITemplateGenerator } from "./ai-template-generator"
// import { useRouter } from 'next/navigation'

// export function TemplateLibrary() {
//   const [templates, setTemplates] = useState<any[]>([])
//   const [filteredTemplates, setFilteredTemplates] = useState<any[]>([])
//   const [searchQuery, setSearchQuery] = useState("")
//   const [selectedIndustry, setSelectedIndustry] = useState<string>("all")
//   const [selectedCategory, setSelectedCategory] = useState<string>("all")
//   const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
//   const [activeTab, setActiveTab] = useState<'all' | 'system' | 'my-templates' | 'favorites'>('all')
//   const [isLoading, setIsLoading] = useState(true)
//   const [showAIDialog, setShowAIDialog] = useState(false)
//   const { toast } = useToast()
//   const router = useRouter()

//   useEffect(() => {
//     loadTemplates()
//   }, [activeTab])

//   useEffect(() => {
//     filterTemplates()
//   }, [templates, searchQuery, selectedIndustry, selectedCategory])

//   const loadTemplates = async () => {
//     setIsLoading(true)
//     try {
//       let result: any[] = []
      
//       if (activeTab === 'favorites') {
//         const favResult = await getFavoriteTemplates()
//         if (favResult.success && favResult.templates) {
//           result = favResult.templates
//         }
//       } else if (activeTab === 'system') {
//         // Fetch only system templates
//         result = await getSystemTemplates()
//       } else if (activeTab === 'my-templates') {
//         // Fetch only user templates (non-system)
//         const allTemplates = await getTemplates()
//         result = allTemplates.filter(t => !t.isSystemTemplate)
//       } else {
//         // Fetch all templates (both system and user)
//         result = await getTemplates()
//       }

//       setTemplates(result)
//     } catch (error) {
//       toast({
//         title: "Error loading templates",
//         description: "Failed to load templates. Please try again.",
//         variant: "destructive"
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const filterTemplates = () => {
//     let filtered = templates

//     // Filter by search
//     if (searchQuery) {
//       const query = searchQuery.toLowerCase()
//       filtered = filtered.filter(t => 
//         t.name.toLowerCase().includes(query) ||
//         t.subject.toLowerCase().includes(query) ||
//         t.description?.toLowerCase().includes(query)
//       )
//     }

//     // Filter by industry
//     if (selectedIndustry && selectedIndustry !== 'all') {
//       filtered = filtered.filter(t => t.industry === selectedIndustry)
//     }

//     // Filter by category
//     if (selectedCategory && selectedCategory !== 'all') {
//       filtered = filtered.filter(t => t.category === selectedCategory)
//     }

//     setFilteredTemplates(filtered)
//   }

//   const handleDuplicate = async (templateId: string, isSystemTemplate: boolean) => {
//     const result = isSystemTemplate 
//       ? await cloneSystemTemplate(templateId)
//       : await duplicateTemplate(templateId)
      
//     if (result.success) {
//       toast({
//         title: "Template added",
//         description: "The template has been added to your library"
//       })
//       // Navigate to the new template
//       if (result.template) {
//         router.push(`/dashboard/templates/${result.template.id}`)
//       }
//       loadTemplates()
//     } else {
//       toast({
//         title: "Failed to add template",
//         description: result.error,
//         variant: "destructive"
//       })
//     }
//   }

//   const handleToggleFavorite = async (templateId: string) => {
//     const result = await toggleFavorite(templateId)
//     if (result.success) {
//       loadTemplates()
//     }
//   }

//   const handleUseTemplate = (templateId: string) => {
//     router.push(`/dashboard/templates/${templateId}`)
//   }

//   // Get unique categories
//   const categories = Array.from(new Set(templates.map(t => t.category).filter(Boolean)))

//   return (
//     <div className="space-y-6">
//       {/* Header Actions */}
//       <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//         <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full sm:w-auto">
//           <TabsList className="grid w-full grid-cols-4 sm:w-auto">
//             <TabsTrigger value="all">All</TabsTrigger>
//             <TabsTrigger value="system">Premium</TabsTrigger>
//             <TabsTrigger value="my-templates">My Templates</TabsTrigger>
//             <TabsTrigger value="favorites">
//               <Star className="h-4 w-4" />
//             </TabsTrigger>
//           </TabsList>
//         </Tabs>

//         <div className="flex gap-2">
//           <Dialog open={showAIDialog} onOpenChange={setShowAIDialog}>
//             <DialogTrigger asChild>
//               <Button>
//                 <Sparkles className="mr-2 h-4 w-4" />
//                 Generate with AI
//               </Button>
//             </DialogTrigger>
//             <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
//               <DialogHeader>
//                 <DialogTitle>AI Template Generator</DialogTitle>
//                 <DialogDescription>
//                   Create custom email templates powered by AI
//                 </DialogDescription>
//               </DialogHeader>
//               <AITemplateGenerator />
//             </DialogContent>
//           </Dialog>

//           <Button variant="outline" onClick={() => router.push('/dashboard/templates/new')}>
//             <Plus className="mr-2 h-4 w-4" />
//             Create Manual
//           </Button>
//         </div>
//       </div>

//       {/* Filters */}
//       <Card>
//         <CardContent className="pt-6">
//           <div className="grid gap-4 md:grid-cols-[1fr_200px_200px_auto]">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//               <Input
//                 placeholder="Search templates..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="pl-9"
//               />
//             </div>

//             <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Industry" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Industries</SelectItem>
//                 {INDUSTRIES.map((ind) => (
//                   <SelectItem key={ind.value} value={ind.value}>
//                     {ind.label}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>

//             <Select value={selectedCategory} onValueChange={setSelectedCategory}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Category" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Categories</SelectItem>
//                 {categories.map((cat) => (
//                   <SelectItem key={cat} value={cat}>
//                     {cat}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>

//             <div className="flex gap-1 border rounded-md">
//               <Button
//                 variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
//                 size="sm"
//                 onClick={() => setViewMode('grid')}
//               >
//                 <Grid3x3 className="h-4 w-4" />
//               </Button>
//               <Button
//                 variant={viewMode === 'list' ? 'secondary' : 'ghost'}
//                 size="sm"
//                 onClick={() => setViewMode('list')}
//               >
//                 <List className="h-4 w-4" />
//               </Button>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Results Count */}
//       <div className="flex items-center justify-between text-sm">
//         <p className="text-muted-foreground">
//           {filteredTemplates.length} {filteredTemplates.length === 1 ? 'template' : 'templates'} found
//         </p>
//         {(searchQuery || selectedIndustry !== 'all' || selectedCategory !== 'all') && (
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={() => {
//               setSearchQuery("")
//               setSelectedIndustry("all")
//               setSelectedCategory("all")
//             }}
//           >
//             Clear filters
//           </Button>
//         )}
//       </div>

//       {/* Templates Grid/List */}
//       {isLoading ? (
//         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//           {[...Array(6)].map((_, i) => (
//             <Card key={i} className="animate-pulse">
//               <CardHeader>
//                 <div className="h-40 bg-muted rounded-md" />
//                 <div className="h-4 bg-muted rounded w-3/4 mt-4" />
//                 <div className="h-3 bg-muted rounded w-1/2 mt-2" />
//               </CardHeader>
//             </Card>
//           ))}
//         </div>
//       ) : filteredTemplates.length === 0 ? (
//         <Card>
//           <CardContent className="flex flex-col items-center justify-center py-12">
//             <Filter className="h-12 w-12 text-muted-foreground mb-4" />
//             <h3 className="font-semibold text-lg mb-2">No templates found</h3>
//             <p className="text-muted-foreground text-center mb-4">
//               Try adjusting your filters or create a new template
//             </p>
//             <Button onClick={() => setShowAIDialog(true)}>
//               <Sparkles className="mr-2 h-4 w-4" />
//               Generate with AI
//             </Button>
//           </CardContent>
//         </Card>
//       ) : (
//         <div className={viewMode === 'grid' 
//           ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3'
//           : 'space-y-4'
//         }>
//           {filteredTemplates.map((template) => (
//             <TemplateCard
//               key={template.id}
//               template={template}
//               viewMode={viewMode}
//               onDuplicate={() => handleDuplicate(template.id, template.isSystemTemplate)}
//               onToggleFavorite={() => handleToggleFavorite(template.id)}
//               onUse={() => handleUseTemplate(template.id)}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }


// "use client"

// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Badge } from "@/components/ui/badge"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// import { Search, Plus, Sparkles, Grid3x3, List, Star, Filter } from 'lucide-react'
// import { INDUSTRIES } from "@/lib/types"
// import { getTemplates, getSystemTemplates, cloneSystemTemplate, getFavoriteTemplates, duplicateTemplate, toggleFavorite } from "@/lib/actions/templates"
// import { useToast } from "@/hooks/use-toast"
// import { TemplateCard } from "./template-card"
// import { AITemplateGenerator } from "./ai-template-generator"
// import { useRouter } from 'next/navigation'

// export function TemplateLibrary() {
//   const [templates, setTemplates] = useState<any[]>([])
//   const [filteredTemplates, setFilteredTemplates] = useState<any[]>([])
//   const [searchQuery, setSearchQuery] = useState("")
//   const [selectedIndustry, setSelectedIndustry] = useState<string>("all")
//   const [selectedCategory, setSelectedCategory] = useState<string>("all")
//   const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
//   const [activeTab, setActiveTab] = useState<'all' | 'system' | 'my-templates' | 'favorites'>('all')
//   const [isLoading, setIsLoading] = useState(true)
//   const [showAIDialog, setShowAIDialog] = useState(false)
//   const { toast } = useToast()
//   const router = useRouter()

//   useEffect(() => {
//     loadTemplates()
//   }, [activeTab])

//   useEffect(() => {
//     filterTemplates()
//   }, [templates, searchQuery, selectedIndustry, selectedCategory])

//   const loadTemplates = async () => {
//     console.log("[v0] TemplateLibrary: Starting to load templates for tab:", activeTab)
//     setIsLoading(true)
//     try {
//       let result: any[] = []
      
//       if (activeTab === 'favorites') {
//         console.log("[v0] TemplateLibrary: Loading favorites...")
//         const favResult = await getFavoriteTemplates()
//         if (favResult.success && favResult.templates) {
//           result = favResult.templates
//         }
//       } else if (activeTab === 'system') {
//         console.log("[v0] TemplateLibrary: Loading system templates...")
//         const systemTemplates = await getSystemTemplates()
//         result = systemTemplates as any[]
//       } else if (activeTab === 'my-templates') {
//         console.log("[v0] TemplateLibrary: Loading user templates...")
//         // Fetch only user templates (non-system)
//         const allTemplates = await getTemplates()
//         result = allTemplates.filter(t => !t.isSystemTemplate)
//       } else {
//         console.log("[v0] TemplateLibrary: Loading all templates...")
//         // Fetch all templates (both system and user)
//         result = await getTemplates()
//       }

//       console.log(`[v0] TemplateLibrary: Loaded ${result.length} templates`)
//       if (result.length > 0) {
//         console.log("[v0] TemplateLibrary: First template sample:", {
//           id: result[0].id,
//           name: result[0].name,
//           industry: result[0].industry,
//           isSystemTemplate: result[0].isSystemTemplate,
//           hasThumbnail: !!result[0].thumbnailUrl,
//           thumbnailUrl: result[0].thumbnailUrl
//         })
//       } else {
//         console.log("[v0] TemplateLibrary: WARNING - No templates loaded!")
//       }

//       setTemplates(result)
//     } catch (error) {
//       console.error("[v0] TemplateLibrary: Error loading templates:", error)
//       toast({
//         title: "Error loading templates",
//         description: "Failed to load templates. Please try again.",
//         variant: "destructive"
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const filterTemplates = () => {
//     console.log("[v0] TemplateLibrary: Filtering templates with:", {
//       searchQuery,
//       selectedIndustry,
//       selectedCategory,
//       totalTemplates: templates.length
//     })
    
//     let filtered = templates

//     // Filter by search
//     if (searchQuery) {
//       const query = searchQuery.toLowerCase()
//       filtered = filtered.filter(t => 
//         t.name.toLowerCase().includes(query) ||
//         t.subject.toLowerCase().includes(query) ||
//         t.description?.toLowerCase().includes(query)
//       )
//     }

//     // Filter by industry
//     if (selectedIndustry && selectedIndustry !== 'all') {
//       filtered = filtered.filter(t => t.industry === selectedIndustry)
//     }

//     // Filter by category
//     if (selectedCategory && selectedCategory !== 'all') {
//       filtered = filtered.filter(t => t.category === selectedCategory)
//     }

//     console.log(`[v0] TemplateLibrary: After filtering: ${filtered.length} templates`)
//     setFilteredTemplates(filtered)
//   }

//   const handleDuplicate = async (templateId: string, isSystemTemplate: boolean) => {
//     const result = isSystemTemplate 
//       ? await cloneSystemTemplate(templateId)
//       : await duplicateTemplate(templateId)
      
//     if (result.success) {
//       toast({
//         title: "Template added",
//         description: "The template has been added to your library"
//       })
//       // Navigate to the new template
//       if (result.template) {
//         router.push(`/dashboard/templates/${result.template.id}`)
//       }
//       loadTemplates()
//     } else {
//       toast({
//         title: "Failed to add template",
//         description: result.error,
//         variant: "destructive"
//       })
//     }
//   }

//   const handleToggleFavorite = async (templateId: string) => {
//     const result = await toggleFavorite(templateId)
//     if (result.success) {
//       loadTemplates()
//     }
//   }

//   const handleUseTemplate = (templateId: string) => {
//     router.push(`/dashboard/templates/${templateId}`)
//   }

//   // Get unique categories
//   const categories = Array.from(new Set(templates.map(t => t.category).filter(Boolean)))

//   return (
//     <div className="space-y-6">
//       {/* Header Actions */}
//       <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//         <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full sm:w-auto">
//           <TabsList className="grid w-full grid-cols-4 sm:w-auto">
//             <TabsTrigger value="all">All</TabsTrigger>
//             <TabsTrigger value="system">Premium</TabsTrigger>
//             <TabsTrigger value="my-templates">My Templates</TabsTrigger>
//             <TabsTrigger value="favorites">
//               <Star className="h-4 w-4" />
//             </TabsTrigger>
//           </TabsList>
//         </Tabs>

//         <div className="flex gap-2">
//           <Dialog open={showAIDialog} onOpenChange={setShowAIDialog}>
//             <DialogTrigger asChild>
//               <Button>
//                 <Sparkles className="mr-2 h-4 w-4" />
//                 Generate with AI
//               </Button>
//             </DialogTrigger>
//             <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
//               <DialogHeader>
//                 <DialogTitle>AI Template Generator</DialogTitle>
//                 <DialogDescription>
//                   Create custom email templates powered by AI
//                 </DialogDescription>
//               </DialogHeader>
//               <AITemplateGenerator />
//             </DialogContent>
//           </Dialog>

//           <Button variant="outline" onClick={() => router.push('/dashboard/templates/new')}>
//             <Plus className="mr-2 h-4 w-4" />
//             Create Manual
//           </Button>
//         </div>
//       </div>

//       {/* Filters */}
//       <Card>
//         <CardContent className="pt-6">
//           <div className="grid gap-4 md:grid-cols-[1fr_200px_200px_auto]">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//               <Input
//                 placeholder="Search templates..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="pl-9"
//               />
//             </div>

//             <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Industry" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Industries</SelectItem>
//                 {INDUSTRIES.map((ind) => (
//                   <SelectItem key={ind.value} value={ind.value}>
//                     {ind.label}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>

//             <Select value={selectedCategory} onValueChange={setSelectedCategory}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Category" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Categories</SelectItem>
//                 {categories.map((cat) => (
//                   <SelectItem key={cat} value={cat}>
//                     {cat}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>

//             <div className="flex gap-1 border rounded-md">
//               <Button
//                 variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
//                 size="sm"
//                 onClick={() => setViewMode('grid')}
//               >
//                 <Grid3x3 className="h-4 w-4" />
//               </Button>
//               <Button
//                 variant={viewMode === 'list' ? 'secondary' : 'ghost'}
//                 size="sm"
//                 onClick={() => setViewMode('list')}
//               >
//                 <List className="h-4 w-4" />
//               </Button>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Results Count */}
//       <div className="flex items-center justify-between text-sm">
//         <p className="text-muted-foreground">
//           {filteredTemplates.length} {filteredTemplates.length === 1 ? 'template' : 'templates'} found
//         </p>
//         {(searchQuery || selectedIndustry !== 'all' || selectedCategory !== 'all') && (
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={() => {
//               setSearchQuery("")
//               setSelectedIndustry("all")
//               setSelectedCategory("all")
//             }}
//           >
//             Clear filters
//           </Button>
//         )}
//       </div>

//       {/* Templates Grid/List */}
//       {isLoading ? (
//         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//           {[...Array(6)].map((_, i) => (
//             <Card key={i} className="animate-pulse">
//               <CardHeader>
//                 <div className="h-40 bg-muted rounded-md" />
//                 <div className="h-4 bg-muted rounded w-3/4 mt-4" />
//                 <div className="h-3 bg-muted rounded w-1/2 mt-2" />
//               </CardHeader>
//             </Card>
//           ))}
//         </div>
//       ) : filteredTemplates.length === 0 ? (
//         <Card>
//           <CardContent className="flex flex-col items-center justify-center py-12">
//             <Filter className="h-12 w-12 text-muted-foreground mb-4" />
//             <h3 className="font-semibold text-lg mb-2">No templates found</h3>
//             <p className="text-muted-foreground text-center mb-4">
//               Try adjusting your filters or create a new template
//             </p>
//             <Button onClick={() => setShowAIDialog(true)}>
//               <Sparkles className="mr-2 h-4 w-4" />
//               Generate with AI
//             </Button>
//           </CardContent>
//         </Card>
//       ) : (
//         <div className={viewMode === 'grid' 
//           ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3'
//           : 'space-y-4'
//         }>
//           {filteredTemplates.map((template) => (
//             <TemplateCard
//               key={template.id}
//               template={template}
//               viewMode={viewMode}
//               onDuplicate={() => handleDuplicate(template.id, template.isSystemTemplate)}
//               onToggleFavorite={() => handleToggleFavorite(template.id)}
//               onUse={() => handleUseTemplate(template.id)}
//             />
//           ))}
//         </div>
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
    console.log("[v0] TemplateLibrary: Starting to load templates for tab:", activeTab)
    setIsLoading(true)
    try {
      let result: any[] = []
      
      if (activeTab === 'favorites') {
        console.log("[v0] TemplateLibrary: Loading favorites...")
        const favResult = await getFavoriteTemplates()
        if (favResult.success && favResult.templates) {
          result = favResult.templates
        }
      } else if (activeTab === 'system') {
        console.log("[v0] TemplateLibrary: Loading system templates...")
        const systemTemplates = await getSystemTemplates()
        result = systemTemplates as any[]
      } else if (activeTab === 'my-templates') {
        console.log("[v0] TemplateLibrary: Loading user templates...")
        // Fetch only user templates (non-system)
        const allTemplates = await getTemplates()
        result = allTemplates.filter(t => !t.isSystemTemplate)
      } else {
        console.log("[v0] TemplateLibrary: Loading all templates...")
        // Fetch all templates (both system and 
        result = await getTemplates()
      }

      console.log(`[v0] TemplateLibrary: Loaded ${result.length} templates`)
      if (result.length > 0) {
        console.log("[v0] TemplateLibrary: First template sample:", {
          id: result[0].id,
          name: result[0].name,
          industry: result[0].industry,
          isSystemTemplate: result[0].isSystemTemplate,
          hasThumbnail: !!result[0].thumbnailUrl,
          thumbnailUrl: result[0].thumbnailUrl
        })
      } else {
        console.log("[v0] TemplateLibrary: WARNING - No templates loaded!")
      }

      setTemplates(result)
    } catch (error) {
      console.error("[v0] TemplateLibrary: Error loading templates:", error)
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
    console.log("[v0] TemplateLibrary: Filtering templates with:", {
      searchQuery,
      selectedIndustry,
      selectedCategory,
      totalTemplates: templates.length
    })
    
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

    console.log(`[v0] TemplateLibrary: After filtering: ${filtered.length} templates`)
    setFilteredTemplates(filtered)
  }

  const handleDuplicate = async (templateId: string, isSystemTemplate: boolean) => {
    const result = isSystemTemplate 
      ? await cloneSystemTemplate(templateId)
      : await duplicateTemplate(templateId)
      
    if (result.success) {
      toast({
        title: "Template added to your library",
        description: "You can now customize and use this template"
      })
      loadTemplates()
    } else {
      toast({
        title: "Failed to add template",
        description: result.error,
        variant: "destructive"
      })
    }
  }

  const handleUseTemplate = async (templateId: string, isSystemTemplate: boolean) => {
    if (isSystemTemplate) {
      // Clone system template first, then navigate to editor
      const result = await cloneSystemTemplate(templateId)
      if (result.success && result.template) {
        toast({
          title: "Template ready to customize",
          description: "Opening editor..."
        })
        router.push(`/dashboard/templates/${result.template.id}/edit`)
      } else {
        toast({
          title: "Failed to load template",
          description: result.error,
          variant: "destructive"
        })
      }
    } else {
      // User template - just open in editor
      router.push(`/dashboard/templates/${templateId}/edit`)
    }
  }

  const handleToggleFavorite = async (templateId: string) => {
    const result = await toggleFavorite(templateId)
    if (result.success) {
      loadTemplates()
    }
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
              onUse={() => handleUseTemplate(template.id, template.isSystemTemplate)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
