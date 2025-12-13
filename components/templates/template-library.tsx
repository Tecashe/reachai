// "use client"

// import { useEffect } from "react"
// import { useState, useCallback, useMemo, useTransition } from "react"
// import { useRouter } from "next/navigation"
// import { Search, Plus, SlidersHorizontal, ChevronDown } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuTrigger,
//   DropdownMenuSeparator,
//   DropdownMenuCheckboxItem,
// } from "@/components/ui/dropdown-menu"
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { TemplateCard } from "./template-card"
// import { TemplatePreviewDialog } from "./template-preview-dialog"
// import { TemplateLibrarySkeleton } from "./template-library-skeleton"
// import type { EnhancedEmailTemplate, TemplateCategory } from "@/lib/types"
// import { deleteTemplate, duplicateTemplate, toggleTemplateFavorite } from "@/lib/actions/template-actions"
// import { toast } from "sonner"

// interface TemplateLibraryProps {
//   templates: EnhancedEmailTemplate[]
//   categories: TemplateCategory[]
//   isLoading?: boolean
//   onRefresh?: () => void
// }

// export function TemplateLibrary({
//   templates: initialTemplates,
//   categories: initialCategories,
//   isLoading = false,
//   onRefresh,
// }: TemplateLibraryProps) {
//   const router = useRouter()
//   const [templates, setTemplates] = useState<EnhancedEmailTemplate[]>(initialTemplates)
//   const [filteredTemplates, setFilteredTemplates] = useState<EnhancedEmailTemplate[]>([])
//   const [searchQuery, setSearchQuery] = useState("")
//   const [selectedCategory, setSelectedCategory] = useState<string>("all")
//   const [selectedIndustry, setSelectedIndustry] = useState<string>("all")
//   const [isPending, startTransition] = useTransition()
//   const [previewTemplate, setPreviewTemplate] = useState<EnhancedEmailTemplate | null>(null)

//   const categories = useMemo(() => ["all", ...initialCategories.map((cat) => cat.name)], [initialCategories])

//   const industries = [
//     "SaaS",
//     "E-commerce",
//     "Real Estate",
//     "Recruiting",
//     "Healthcare",
//     "Finance",
//     "Education",
//     "Nonprofit",
//     "Technology",
//     "Consulting",
//     "Marketing",
//     "Sales",
//   ]

//   useEffect(() => {
//     setTemplates(initialTemplates)
//   }, [initialTemplates])

//   useEffect(() => {
//     filterTemplates()
//   }, [templates, searchQuery, selectedCategory, selectedIndustry])

//   const filterTemplates = useCallback(() => {
//     let filtered = templates

//     if (selectedCategory !== "all") {
//       filtered = filtered.filter((t) => t.category === selectedCategory)
//     }

//     if (selectedIndustry !== "all") {
//       filtered = filtered.filter((t) => t.industry === selectedIndustry)
//     }

//     if (searchQuery) {
//       const query = searchQuery.toLowerCase()
//       filtered = filtered.filter(
//         (t) =>
//           t.name.toLowerCase().includes(query) ||
//           t.description?.toLowerCase().includes(query) ||
//           t.subject.toLowerCase().includes(query) ||
//           t.tags.some((tag) => tag.toLowerCase().includes(query)),
//       )
//     }

//     setFilteredTemplates(filtered)
//   }, [templates, searchQuery, selectedCategory, selectedIndustry])

//   const handleDuplicate = useCallback(
//     async (templateId: string) => {
//       const result = await duplicateTemplate(templateId, templateId)
//       if (result.success) {
//         toast.success("Template duplicated", { description: "The template has been added to your library." })
//         startTransition(() => {
//           if (onRefresh) {
//             onRefresh()
//           }
//         })
//       } else {
//         toast.error("Error", { description: result.message || "Failed to duplicate template" })
//       }
//     },
//     [onRefresh],
//   )

//   const handleDelete = useCallback(
//     async (templateId: string) => {
//       if (!confirm("Are you sure you want to delete this template?")) return

//       const result = await deleteTemplate(templateId, templateId)
//       if (result.success) {
//         toast.success("Template deleted", { description: "The template has been removed from your library." })
//         startTransition(() => {
//           if (onRefresh) {
//             onRefresh()
//           }
//         })
//       } else {
//         toast.error("Error", { description: result.message || "Failed to delete template" })
//       }
//     },
//     [onRefresh],
//   )

//   const handleToggleFavorite = useCallback(async (templateId: string) => {
//     const result = await toggleTemplateFavorite(templateId, templateId)
//     if (result.success) {
//       setTemplates((prev) =>
//         prev.map((t) => (t.id === templateId ? { ...t, isFavorite: result.isFavorite || false } : t)),
//       )
//     }
//   }, [])

//   const handleUseTemplate = useCallback(
//     (template: EnhancedEmailTemplate) => {
//       console.log("[v0] handleUseTemplate called with template:", template.name)
//       router.push(`/campaigns/new?templateId=${template.id}`)
//     },
//     [router],
//   )

//   const handleEditTemplate = useCallback(
//     (templateId: string) => {
//       router.push(`/templates/${templateId}`)
//     },
//     [router],
//   )

//   const handleCreateTemplate = useCallback(() => {
//     router.push("/templates/new")
//   }, [router])

//   // Added handlePreview to open the preview dialog
//   const handlePreview = useCallback((template: EnhancedEmailTemplate) => {
//     setPreviewTemplate(template)
//   }, [])

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-2xl font-bold tracking-tight">Email Templates</h2>
//           <p className="text-muted-foreground">Browse and use high-converting email templates for your campaigns</p>
//         </div>
//         <Button onClick={handleCreateTemplate} className="gap-2">
//           <Plus className="h-4 w-4" />
//           Create Template
//         </Button>
//       </div>

//       {/* Filters */}
//       <div className="flex flex-col gap-4 md:flex-row md:items-center">
//         <div className="relative flex-1">
//           <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//           <Input
//             placeholder="Search templates..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="pl-9"
//           />
//         </div>
//         <div className="flex gap-2">
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="outline" className="gap-2 bg-transparent">
//                 <SlidersHorizontal className="h-4 w-4" />
//                 Filters
//                 <ChevronDown className="h-4 w-4" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               <DropdownMenuCheckboxItem
//                 checked={selectedCategory === "all"}
//                 onCheckedChange={() => setSelectedCategory("all")}
//               >
//                 All Categories
//               </DropdownMenuCheckboxItem>
//               {categories
//                 .filter((cat) => cat !== "all")
//                 .map((cat) => (
//                   <DropdownMenuCheckboxItem
//                     key={cat}
//                     checked={selectedCategory === cat}
//                     onCheckedChange={() => setSelectedCategory(cat)}
//                   >
//                     {cat}
//                   </DropdownMenuCheckboxItem>
//                 ))}
//               <DropdownMenuSeparator />
//               <DropdownMenuCheckboxItem
//                 checked={selectedIndustry === "all"}
//                 onCheckedChange={() => setSelectedIndustry("all")}
//               >
//                 All Industries
//               </DropdownMenuCheckboxItem>
//               {industries.map((ind) => (
//                 <DropdownMenuCheckboxItem
//                   key={ind}
//                   checked={selectedIndustry === ind}
//                   onCheckedChange={() => setSelectedIndustry(ind)}
//                 >
//                   {ind}
//                 </DropdownMenuCheckboxItem>
//               ))}
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       </div>

//       {/* Tabs */}
//       <Tabs defaultValue="all">
//         <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
//           <TabsTrigger value="all">All Templates</TabsTrigger>
//           <TabsTrigger value="favorites">Favorites</TabsTrigger>
//           <TabsTrigger value="my-templates">My Templates</TabsTrigger>
//           <TabsTrigger value="system">Pre-built</TabsTrigger>
//         </TabsList>

//         {/* Template Grid */}
//         <div className="mt-6">
//           {isLoading || isPending ? (
//             <TemplateLibrarySkeleton />
//           ) : filteredTemplates.length === 0 ? (
//             <div className="flex flex-col items-center justify-center py-12">
//               <p className="text-muted-foreground">No templates found</p>
//               <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
//             </div>
//           ) : (
//             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//               {/* Updated prop names from onEdit/onUse to onPreview */}
//               {filteredTemplates.map((template) => (
//                 <TemplateCard
//                   key={template.id}
//                   template={template}
//                   onToggleFavorite={handleToggleFavorite}
//                   onDuplicate={handleDuplicate}
//                   onDelete={handleDelete}
//                   onPreview={handlePreview}
//                 />
//               ))}
//             </div>
//           )}
//         </div>
//       </Tabs>

//       {/* Preview Dialog */}
//       {previewTemplate && (
//         <TemplatePreviewDialog
//           template={previewTemplate}
//           open={!!previewTemplate}
//           onOpenChange={(open) => !open && setPreviewTemplate(null)}
//           onUseTemplate={() => {
//             handleUseTemplate(previewTemplate)
//             setPreviewTemplate(null)
//           }}
//         />
//       )}
//     </div>
//   )
// }

// "use client"

// import { useEffect } from "react"
// import { useState, useCallback, useMemo, useTransition } from "react"
// import { useRouter } from "next/navigation"
// import { Search, Plus, SlidersHorizontal, ChevronDown } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuTrigger,
//   DropdownMenuSeparator,
//   DropdownMenuCheckboxItem,
// } from "@/components/ui/dropdown-menu"
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { TemplateCard } from "./template-card"
// import { TemplatePreviewDialog } from "./template-preview-dialog"
// import { TemplateLibrarySkeleton } from "./template-library-skeleton"
// import type { EnhancedEmailTemplate, TemplateCategory } from "@/lib/types"
// import { deleteTemplate, duplicateTemplate, toggleTemplateFavorite } from "@/lib/actions/template-actions"
// import { toast } from "sonner"

// interface TemplateLibraryProps {
//   templates: EnhancedEmailTemplate[]
//   categories: TemplateCategory[]
//   isLoading?: boolean
//   onRefresh?: () => void
//   userId?: string
//   onSelectTemplate?: (template: EnhancedEmailTemplate) => void
//   onClose?: () => void
// }

// export function TemplateLibrary({
//   templates: initialTemplates,
//   categories: initialCategories,
//   isLoading = false,
//   onRefresh,
//   userId,
//   onSelectTemplate,
//   onClose,
// }: TemplateLibraryProps) {
//   const router = useRouter()
//   const [templates, setTemplates] = useState<EnhancedEmailTemplate[]>(initialTemplates)
//   const [filteredTemplates, setFilteredTemplates] = useState<EnhancedEmailTemplate[]>([])
//   const [searchQuery, setSearchQuery] = useState("")
//   const [selectedCategory, setSelectedCategory] = useState<string>("all")
//   const [selectedIndustry, setSelectedIndustry] = useState<string>("all")
//   const [activeTab, setActiveTab] = useState<string>("all")
//   const [isPending, startTransition] = useTransition()
//   const [previewTemplate, setPreviewTemplate] = useState<EnhancedEmailTemplate | null>(null)

//   const categories = useMemo(() => ["all", ...initialCategories.map((cat) => cat.name)], [initialCategories])

//   const industries = [
//     "SaaS",
//     "E-commerce",
//     "Real Estate",
//     "Recruiting",
//     "Healthcare",
//     "Finance",
//     "Education",
//     "Nonprofit",
//     "Technology",
//     "Consulting",
//     "Marketing",
//     "Sales",
//   ]

//   useEffect(() => {
//     setTemplates(initialTemplates)
//   }, [initialTemplates])

//   useEffect(() => {
//     filterTemplates()
//   }, [templates, searchQuery, selectedCategory, selectedIndustry, activeTab])

//   const filterTemplates = useCallback(() => {
//     let filtered = templates

//     if (activeTab === "favorites") {
//       filtered = filtered.filter((t) => t.isFavorite)
//     } else if (activeTab === "my-templates") {
//       filtered = filtered.filter((t) => t.userId === userId && !t.isSystemTemplate)
//     } else if (activeTab === "system") {
//       filtered = filtered.filter((t) => t.isSystemTemplate)
//     }

//     if (selectedCategory !== "all") {
//       filtered = filtered.filter((t) => t.category === selectedCategory)
//     }

//     if (selectedIndustry !== "all") {
//       filtered = filtered.filter((t) => t.industry === selectedIndustry)
//     }

//     if (searchQuery) {
//       const query = searchQuery.toLowerCase()
//       filtered = filtered.filter(
//         (t) =>
//           t.name.toLowerCase().includes(query) ||
//           t.description?.toLowerCase().includes(query) ||
//           t.subject.toLowerCase().includes(query) ||
//           t.tags.some((tag) => tag.toLowerCase().includes(query)),
//       )
//     }

//     setFilteredTemplates(filtered)
//   }, [templates, searchQuery, selectedCategory, selectedIndustry, activeTab, userId])

//   const handleDuplicate = useCallback(
//     async (templateId: string) => {
//       const result = await duplicateTemplate(templateId, templateId)
//       if (result.success) {
//         toast.success("Template duplicated", { description: "The template has been added to your library." })
//         startTransition(() => {
//           if (onRefresh) {
//             onRefresh()
//           }
//         })
//       } else {
//         toast.error("Error", { description: result.message || "Failed to duplicate template" })
//       }
//     },
//     [onRefresh],
//   )

//   const handleDelete = useCallback(
//     async (templateId: string) => {
//       if (!confirm("Are you sure you want to delete this template?")) return

//       const result = await deleteTemplate(templateId, templateId)
//       if (result.success) {
//         toast.success("Template deleted", { description: "The template has been removed from your library." })
//         startTransition(() => {
//           if (onRefresh) {
//             onRefresh()
//           }
//         })
//       } else {
//         toast.error("Error", { description: result.message || "Failed to delete template" })
//       }
//     },
//     [onRefresh],
//   )

//   const handleToggleFavorite = useCallback(async (templateId: string) => {
//     const result = await toggleTemplateFavorite(templateId, templateId)
//     if (result.success) {
//       setTemplates((prev) =>
//         prev.map((t) => (t.id === templateId ? { ...t, isFavorite: result.isFavorite || false } : t)),
//       )
//     }
//   }, [])

//   const handleUseTemplate = useCallback(
//     (template: EnhancedEmailTemplate) => {
//       console.log("[v0] handleUseTemplate called with template:", template.name)
//       if (onSelectTemplate) {
//         onSelectTemplate(template)
//         onClose?.()
//       } else {
//         router.push(`/campaigns/new?templateId=${template.id}`)
//       }
//     },
//     [router, onSelectTemplate, onClose],
//   )

//   const handleEditTemplate = useCallback(
//     (templateId: string) => {
//       router.push(`/templates/${templateId}`)
//     },
//     [router],
//   )

//   const handleCreateTemplate = useCallback(() => {
//     router.push("/templates/new")
//   }, [router])

//   const handlePreview = useCallback((template: EnhancedEmailTemplate) => {
//     setPreviewTemplate(template)
//   }, [])

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-2xl font-bold tracking-tight">Email Templates</h2>
//           <p className="text-muted-foreground">Browse and use high-converting email templates for your campaigns</p>
//         </div>
//         <Button onClick={handleCreateTemplate} className="gap-2">
//           <Plus className="h-4 w-4" />
//           Create Template
//         </Button>
//       </div>

//       {/* Filters */}
//       <div className="flex flex-col gap-4 md:flex-row md:items-center">
//         <div className="relative flex-1">
//           <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//           <Input
//             placeholder="Search templates..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="pl-9"
//           />
//         </div>
//         <div className="flex gap-2">
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="outline" className="gap-2 bg-transparent">
//                 <SlidersHorizontal className="h-4 w-4" />
//                 Filters
//                 <ChevronDown className="h-4 w-4" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               <DropdownMenuCheckboxItem
//                 checked={selectedCategory === "all"}
//                 onCheckedChange={() => setSelectedCategory("all")}
//               >
//                 All Categories
//               </DropdownMenuCheckboxItem>
//               {categories
//                 .filter((cat) => cat !== "all")
//                 .map((cat) => (
//                   <DropdownMenuCheckboxItem
//                     key={cat}
//                     checked={selectedCategory === cat}
//                     onCheckedChange={() => setSelectedCategory(cat)}
//                   >
//                     {cat}
//                   </DropdownMenuCheckboxItem>
//                 ))}
//               <DropdownMenuSeparator />
//               <DropdownMenuCheckboxItem
//                 checked={selectedIndustry === "all"}
//                 onCheckedChange={() => setSelectedIndustry("all")}
//               >
//                 All Industries
//               </DropdownMenuCheckboxItem>
//               {industries.map((ind) => (
//                 <DropdownMenuCheckboxItem
//                   key={ind}
//                   checked={selectedIndustry === ind}
//                   onCheckedChange={() => setSelectedIndustry(ind)}
//                 >
//                   {ind}
//                 </DropdownMenuCheckboxItem>
//               ))}
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       </div>

//       {/* Tabs */}
//       <Tabs value={activeTab} onValueChange={setActiveTab}>
//         <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
//           <TabsTrigger value="all">All Templates</TabsTrigger>
//           <TabsTrigger value="favorites">Favorites</TabsTrigger>
//           <TabsTrigger value="my-templates">My Templates</TabsTrigger>
//           <TabsTrigger value="system">Pre-built</TabsTrigger>
//         </TabsList>

//         {/* Template Grid */}
//         <div className="mt-6">
//           {isLoading || isPending ? (
//             <TemplateLibrarySkeleton />
//           ) : filteredTemplates.length === 0 ? (
//             <div className="flex flex-col items-center justify-center py-12">
//               <p className="text-muted-foreground">No templates found</p>
//               <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
//             </div>
//           ) : (
//             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//               {filteredTemplates.map((template) => (
//                 <TemplateCard
//                   key={template.id}
//                   template={template}
//                   onToggleFavorite={handleToggleFavorite}
//                   onDuplicate={handleDuplicate}
//                   onDelete={handleDelete}
//                   onPreview={handlePreview}
//                 />
//               ))}
//             </div>
//           )}
//         </div>
//       </Tabs>

//       {/* Preview Dialog */}
//       {previewTemplate && (
//         <TemplatePreviewDialog
//           template={previewTemplate}
//           open={!!previewTemplate}
//           onOpenChange={(open) => !open && setPreviewTemplate(null)}
//           onUseTemplate={() => {
//             handleUseTemplate(previewTemplate)
//             setPreviewTemplate(null)
//           }}
//         />
//       )}
//     </div>
//   )
// }


// "use client"

// import { useEffect } from "react"
// import { useState, useCallback, useMemo, useTransition } from "react"
// import { useRouter } from "next/navigation"
// import { Search, Plus, SlidersHorizontal, ChevronDown } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuTrigger,
//   DropdownMenuSeparator,
//   DropdownMenuCheckboxItem,
// } from "@/components/ui/dropdown-menu"
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { TemplateCard } from "./template-card"
// import { TemplatePreviewDialog } from "./template-preview-dialog"
// import { TemplateLibrarySkeleton } from "./template-library-skeleton"
// import type { EnhancedEmailTemplate, TemplateCategory } from "@/lib/types"
// import { deleteTemplate, duplicateTemplate, toggleTemplateFavorite } from "@/lib/actions/template-actions"
// import { toast } from "sonner"

// interface TemplateLibraryProps {
//   templates: EnhancedEmailTemplate[]
//   categories: TemplateCategory[]
//   isLoading?: boolean
//   onRefresh?: () => void
//   userId?: string
//   onSelectTemplate?: (template: EnhancedEmailTemplate) => void
//   onClose?: () => void
//   isEmbedded?: boolean
// }

// export function TemplateLibrary({
//   templates: initialTemplates,
//   categories: initialCategories,
//   isLoading = false,
//   onRefresh,
//   userId,
//   onSelectTemplate,
//   onClose,
//   isEmbedded = false,
// }: TemplateLibraryProps) {
//   const router = useRouter()
//   const [templates, setTemplates] = useState<EnhancedEmailTemplate[]>(initialTemplates)
//   const [filteredTemplates, setFilteredTemplates] = useState<EnhancedEmailTemplate[]>([])
//   const [searchQuery, setSearchQuery] = useState("")
//   const [selectedCategory, setSelectedCategory] = useState<string>("all")
//   const [selectedIndustry, setSelectedIndustry] = useState<string>("all")
//   const [activeTab, setActiveTab] = useState<string>("all")
//   const [isPending, startTransition] = useTransition()
//   const [previewTemplate, setPreviewTemplate] = useState<EnhancedEmailTemplate | null>(null)

//   const categories = useMemo(() => ["all", ...initialCategories.map((cat) => cat.name)], [initialCategories])

//   const industries = [
//     "SaaS",
//     "E-commerce",
//     "Real Estate",
//     "Recruiting",
//     "Healthcare",
//     "Finance",
//     "Education",
//     "Nonprofit",
//     "Technology",
//     "Consulting",
//     "Marketing",
//     "Sales",
//   ]

//   useEffect(() => {
//     setTemplates(initialTemplates)
//   }, [initialTemplates])

//   useEffect(() => {
//     filterTemplates()
//   }, [templates, searchQuery, selectedCategory, selectedIndustry, activeTab])

//   const filterTemplates = useCallback(() => {
//     let filtered = templates

//     if (activeTab === "favorites") {
//       filtered = filtered.filter((t) => t.isFavorite)
//     } else if (activeTab === "my-templates") {
//       filtered = filtered.filter((t) => t.userId === userId && !t.isSystemTemplate)
//     } else if (activeTab === "system") {
//       filtered = filtered.filter((t) => t.isSystemTemplate)
//     }

//     if (selectedCategory !== "all") {
//       filtered = filtered.filter((t) => t.category === selectedCategory)
//     }

//     if (selectedIndustry !== "all") {
//       filtered = filtered.filter((t) => t.industry === selectedIndustry)
//     }

//     if (searchQuery) {
//       const query = searchQuery.toLowerCase()
//       filtered = filtered.filter(
//         (t) =>
//           t.name.toLowerCase().includes(query) ||
//           t.description?.toLowerCase().includes(query) ||
//           t.subject.toLowerCase().includes(query) ||
//           t.tags.some((tag) => tag.toLowerCase().includes(query)),
//       )
//     }

//     setFilteredTemplates(filtered)
//   }, [templates, searchQuery, selectedCategory, selectedIndustry, activeTab, userId])

//   const handleDuplicate = useCallback(
//     async (templateId: string) => {
//       const result = await duplicateTemplate(templateId, templateId)
//       if (result.success) {
//         toast.success("Template duplicated", { description: "The template has been added to your library." })
//         startTransition(() => {
//           if (onRefresh) {
//             onRefresh()
//           }
//         })
//       } else {
//         toast.error("Error", { description: result.message || "Failed to duplicate template" })
//       }
//     },
//     [onRefresh],
//   )

//   const handleDelete = useCallback(
//     async (templateId: string) => {
//       if (!confirm("Are you sure you want to delete this template?")) return

//       const result = await deleteTemplate(templateId, templateId)
//       if (result.success) {
//         toast.success("Template deleted", { description: "The template has been removed from your library." })
//         startTransition(() => {
//           if (onRefresh) {
//             onRefresh()
//           }
//         })
//       } else {
//         toast.error("Error", { description: result.message || "Failed to delete template" })
//       }
//     },
//     [onRefresh],
//   )

//   const handleToggleFavorite = useCallback(async (templateId: string) => {
//     const result = await toggleTemplateFavorite(templateId, templateId)
//     if (result.success) {
//       setTemplates((prev) =>
//         prev.map((t) => (t.id === templateId ? { ...t, isFavorite: result.isFavorite || false } : t)),
//       )
//     }
//   }, [])

//   const handleUseTemplate = useCallback(
//     (template: EnhancedEmailTemplate) => {
//       console.log("[v0] handleUseTemplate called with template:", template.name)
//       if (onSelectTemplate) {
//         onSelectTemplate(template)
//         onClose?.()
//       } else {
//         router.push(`/campaigns/new?templateId=${template.id}`)
//       }
//     },
//     [router, onSelectTemplate, onClose],
//   )

//   const handleEditTemplate = useCallback(
//     (templateId: string) => {
//       if (isEmbedded) {
//         toast("Please close the email composer to edit templates")
//         return
//       }
//       router.push(`/dashboard/templates/${templateId}/edit`)
//     },
//     [router, isEmbedded],
//   )

//   const handleCreateTemplate = useCallback(() => {
//     router.push("/templates/new")
//   }, [router])

//   const handlePreview = useCallback((template: EnhancedEmailTemplate) => {
//     setPreviewTemplate(template)
//   }, [])

//   return (
//     <div className="space-y-6">
//       {!isEmbedded && (
//         <div className="flex items-center justify-between">
//           <div>
//             <h2 className="text-2xl font-bold tracking-tight">Email Templates</h2>
//             <p className="text-muted-foreground">Browse and use high-converting email templates for your campaigns</p>
//           </div>
//           <Button onClick={handleCreateTemplate} className="gap-2">
//             <Plus className="h-4 w-4" />
//             Create Template
//           </Button>
//         </div>
//       )}

//       <div className="flex flex-col gap-4 md:flex-row md:items-center">
//         <div className="relative flex-1">
//           <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//           <Input
//             placeholder="Search templates..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="pl-9"
//           />
//         </div>
//         <div className="flex gap-2">
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="outline" className="gap-2 bg-transparent">
//                 <SlidersHorizontal className="h-4 w-4" />
//                 Filters
//                 <ChevronDown className="h-4 w-4" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               <DropdownMenuCheckboxItem
//                 checked={selectedCategory === "all"}
//                 onCheckedChange={() => setSelectedCategory("all")}
//               >
//                 All Categories
//               </DropdownMenuCheckboxItem>
//               {categories
//                 .filter((cat) => cat !== "all")
//                 .map((cat) => (
//                   <DropdownMenuCheckboxItem
//                     key={cat}
//                     checked={selectedCategory === cat}
//                     onCheckedChange={() => setSelectedCategory(cat)}
//                   >
//                     {cat}
//                   </DropdownMenuCheckboxItem>
//                 ))}
//               <DropdownMenuSeparator />
//               <DropdownMenuCheckboxItem
//                 checked={selectedIndustry === "all"}
//                 onCheckedChange={() => setSelectedIndustry("all")}
//               >
//                 All Industries
//               </DropdownMenuCheckboxItem>
//               {industries.map((ind) => (
//                 <DropdownMenuCheckboxItem
//                   key={ind}
//                   checked={selectedIndustry === ind}
//                   onCheckedChange={() => setSelectedIndustry(ind)}
//                 >
//                   {ind}
//                 </DropdownMenuCheckboxItem>
//               ))}
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       </div>

//       <Tabs value={activeTab} onValueChange={setActiveTab}>
//         {!isEmbedded ? (
//           <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
//             <TabsTrigger value="all">All Templates</TabsTrigger>
//             <TabsTrigger value="favorites">Favorites</TabsTrigger>
//             <TabsTrigger value="my-templates">My Templates</TabsTrigger>
//             <TabsTrigger value="system">Pre-built</TabsTrigger>
//           </TabsList>
//         ) : (
//           <TabsList className="grid w-full grid-cols-2">
//             <TabsTrigger value="my-templates">My Templates</TabsTrigger>
//             <TabsTrigger value="favorites">Favorites</TabsTrigger>
//           </TabsList>
//         )}

//         <div className="mt-6">
//           {isLoading || isPending ? (
//             <TemplateLibrarySkeleton />
//           ) : filteredTemplates.length === 0 ? (
//             <div className="flex flex-col items-center justify-center py-12">
//               <p className="text-muted-foreground">No templates found</p>
//               <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
//             </div>
//           ) : (
//             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//               {filteredTemplates.map((template) => (
//                 <TemplateCard
//                   key={template.id}
//                   template={template}
//                   onToggleFavorite={handleToggleFavorite}
//                   onDuplicate={handleDuplicate}
//                   onDelete={handleDelete}
//                   onPreview={handlePreview}
//                 />
//               ))}
//             </div>
//           )}
//         </div>
//       </Tabs>

//       {previewTemplate && (
//         <TemplatePreviewDialog
//           template={previewTemplate}
//           open={!!previewTemplate}
//           onOpenChange={(open) => !open && setPreviewTemplate(null)}
//           onUseTemplate={() => {
//             handleUseTemplate(previewTemplate)
//             setPreviewTemplate(null)
//           }}
//         />
//       )}
//     </div>
//   )
// }


"use client"

import { useEffect } from "react"
import { useState, useCallback, useMemo, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Search, Plus, SlidersHorizontal, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TemplateCard } from "./template-card"
import { TemplatePreviewDialog } from "./template-preview-dialog"
import { TemplateLibrarySkeleton } from "./template-library-skeleton"
import type { EnhancedEmailTemplate, TemplateCategory } from "@/lib/types"
import { deleteTemplate, duplicateTemplate, toggleTemplateFavorite } from "@/lib/actions/template-actions"
import { toast } from "sonner"

interface TemplateLibraryProps {
  templates: EnhancedEmailTemplate[]
  categories: TemplateCategory[]
  isLoading?: boolean
  onRefresh?: () => void
  userId?: string
  onSelectTemplate?: (template: EnhancedEmailTemplate) => void
  onClose?: () => void
  isEmbedded?: boolean
}

export function TemplateLibrary({
  templates: initialTemplates,
  categories: initialCategories,
  isLoading = false,
  onRefresh,
  userId,
  onSelectTemplate,
  onClose,
  isEmbedded = false,
}: TemplateLibraryProps) {
  const router = useRouter()
  const [templates, setTemplates] = useState<EnhancedEmailTemplate[]>(initialTemplates)
  const [filteredTemplates, setFilteredTemplates] = useState<EnhancedEmailTemplate[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedIndustry, setSelectedIndustry] = useState<string>("all")
  const [activeTab, setActiveTab] = useState<string>("all")
  const [isPending, startTransition] = useTransition()
  const [previewTemplate, setPreviewTemplate] = useState<EnhancedEmailTemplate | null>(null)

  const categories = useMemo(() => ["all", ...initialCategories.map((cat) => cat.name)], [initialCategories])

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
    setTemplates(initialTemplates)
  }, [initialTemplates])

  useEffect(() => {
    filterTemplates()
  }, [templates, searchQuery, selectedCategory, selectedIndustry, activeTab])

  const filterTemplates = useCallback(() => {
    let filtered = templates

    if (activeTab === "favorites") {
      filtered = filtered.filter((t) => t.isFavorite)
    } else if (activeTab === "my-templates") {
      filtered = filtered.filter((t) => t.userId === userId && !t.isSystemTemplate)
    } else if (activeTab === "system") {
      filtered = filtered.filter((t) => t.isSystemTemplate)
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((t) => t.category === selectedCategory)
    }

    if (selectedIndustry !== "all") {
      filtered = filtered.filter((t) => t.industry === selectedIndustry)
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

    setFilteredTemplates(filtered)
  }, [templates, searchQuery, selectedCategory, selectedIndustry, activeTab, userId])

  const handleDuplicate = useCallback(
    async (templateId: string) => {
      const result = await duplicateTemplate(templateId, templateId)
      if (result.success) {
        toast.success("Template duplicated", { description: "The template has been added to your library." })
        startTransition(() => {
          if (onRefresh) {
            onRefresh()
          }
        })
      } else {
        toast.error("Error", { description: result.message || "Failed to duplicate template" })
      }
    },
    [onRefresh],
  )

  const handleDelete = useCallback(
    async (templateId: string) => {
      if (!confirm("Are you sure you want to delete this template?")) return

      const result = await deleteTemplate(templateId, templateId)
      if (result.success) {
        toast.success("Template deleted", { description: "The template has been removed from your library." })
        startTransition(() => {
          if (onRefresh) {
            onRefresh()
          }
        })
      } else {
        toast.error("Error", { description: result.message || "Failed to delete template" })
      }
    },
    [onRefresh],
  )

  const handleToggleFavorite = useCallback(async (templateId: string) => {
    const result = await toggleTemplateFavorite(templateId, templateId)
    if (result.success) {
      setTemplates((prev) =>
        prev.map((t) => (t.id === templateId ? { ...t, isFavorite: result.isFavorite || false } : t)),
      )
    }
  }, [])

  const handleUseTemplate = useCallback(
    (template: EnhancedEmailTemplate) => {
      console.log("[v0] handleUseTemplate called with template:", template.name)
      if (onSelectTemplate) {
        console.log("[v0] Calling onSelectTemplate callback")
        onSelectTemplate(template)
        onClose?.()
      } else {
        router.push(`/campaigns/new?templateId=${template.id}`)
      }
    },
    [router, onSelectTemplate, onClose],
  )

  const handleEditTemplate = useCallback(
    (templateId: string) => {
      if (isEmbedded) {
        toast("Please close the email composer to edit templates")
        return
      }
      router.push(`/dashboard/templates/${templateId}/edit`)
    },
    [router, isEmbedded],
  )

  const handleCreateTemplate = useCallback(() => {
    router.push("/templates/new")
  }, [router])

  const handlePreview = useCallback((template: EnhancedEmailTemplate) => {
    setPreviewTemplate(template)
  }, [])

  return (
    <div className="space-y-6">
      {!isEmbedded && (
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
      )}

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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 bg-transparent">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuCheckboxItem
                checked={selectedCategory === "all"}
                onCheckedChange={() => setSelectedCategory("all")}
              >
                All Categories
              </DropdownMenuCheckboxItem>
              {categories
                .filter((cat) => cat !== "all")
                .map((cat) => (
                  <DropdownMenuCheckboxItem
                    key={cat}
                    checked={selectedCategory === cat}
                    onCheckedChange={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </DropdownMenuCheckboxItem>
                ))}
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={selectedIndustry === "all"}
                onCheckedChange={() => setSelectedIndustry("all")}
              >
                All Industries
              </DropdownMenuCheckboxItem>
              {industries.map((ind) => (
                <DropdownMenuCheckboxItem
                  key={ind}
                  checked={selectedIndustry === ind}
                  onCheckedChange={() => setSelectedIndustry(ind)}
                >
                  {ind}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        {!isEmbedded ? (
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="all">All Templates</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="my-templates">My Templates</TabsTrigger>
            <TabsTrigger value="system">Pre-built</TabsTrigger>
          </TabsList>
        ) : (
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="my-templates">My Templates</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
          </TabsList>
        )}

        <div className="mt-6">
          {isLoading || isPending ? (
            <TemplateLibrarySkeleton />
          ) : filteredTemplates.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground">No templates found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onToggleFavorite={handleToggleFavorite}
                  onDuplicate={handleDuplicate}
                  onDelete={handleDelete}
                  onPreview={handlePreview}
                  onSelect={onSelectTemplate ? handleUseTemplate : undefined}
                />
              ))}
            </div>
          )}
        </div>
      </Tabs>

      {previewTemplate && (
        <TemplatePreviewDialog
          template={previewTemplate}
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
