"use client"

import type React from "react"

import { useState, useCallback, useMemo, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  Search,
  Plus,
  LayoutGrid,
  List,
  SlidersHorizontal,
  Star,
  Sparkles,
  X,
  ChevronDown,
  FolderOpen,
  Clock,
  TrendingUp,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { TemplateCard } from "./template-card"
import { TemplatePreviewDialog } from "./template-preview-dialog"
import { TemplateLibrarySkeleton } from "./template-library-skeleton"
import type { EnhancedEmailTemplate, TemplateCategory } from "@/lib/types"
import { deleteTemplate, duplicateTemplate, toggleFavorite } from "@/lib/actions/templates"
import { toast } from "sonner"

interface TemplateLibraryProps {
  templates: EnhancedEmailTemplate[]
  categories: TemplateCategory[]
  isLoading?: boolean
  onRefresh?: () => void
}

type SortOption = "recent" | "name" | "performance" | "favorites"
type FilterTab = "all" | "favorites" | "ai-generated"

export function TemplateLibrary({ templates, categories, isLoading = false, onRefresh }: TemplateLibraryProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // UI State
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<SortOption>("recent")
  const [filterTab, setFilterTab] = useState<FilterTab>("all")
  const [previewTemplate, setPreviewTemplate] = useState<EnhancedEmailTemplate | null>(null)

  // Filter and sort templates
  const filteredTemplates = useMemo(() => {
    let result = [...templates]

    // Tab filter - use aiGenerated instead of isAiGenerated
    if (filterTab === "favorites") {
      result = result.filter((t) => t.isFavorite)
    } else if (filterTab === "ai-generated") {
      result = result.filter((t) => t.aiGenerated)
    }

    // Category filter
    if (selectedCategory) {
      result = result.filter((t) => t.category?.toLowerCase() === selectedCategory.toLowerCase())
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(query) ||
          t.subject?.toLowerCase().includes(query) ||
          t.category?.toLowerCase().includes(query),
      )
    }

    // Sort - use avgOpenRate/avgReplyRate instead of stats
    switch (sortBy) {
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "performance":
        result.sort((a, b) => {
          const aScore = ((a.avgOpenRate ?? 0) + (a.avgReplyRate ?? 0)) / 2
          const bScore = ((b.avgOpenRate ?? 0) + (b.avgReplyRate ?? 0)) / 2
          return bScore - aScore
        })
        break
      case "favorites":
        result.sort((a, b) => {
          if (a.isFavorite && !b.isFavorite) return -1
          if (!a.isFavorite && b.isFavorite) return 1
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        })
        break
      case "recent":
      default:
        result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    }

    return result
  }, [templates, filterTab, selectedCategory, searchQuery, sortBy])

  // Handlers
  const handleToggleFavorite = useCallback(
    async (id: string) => {
      startTransition(async () => {
        const result = await toggleFavorite(id)
        if (result.error) {
          toast.error(result.error)
        } else {
          onRefresh?.()
        }
      })
    },
    [onRefresh],
  )

  const handleDuplicate = useCallback(
    async (id: string) => {
      startTransition(async () => {
        const result = await duplicateTemplate(id)
        if (result.error) {
          toast.error(result.error)
        } else {
          toast.success("Template duplicated")
          onRefresh?.()
        }
      })
    },
    [onRefresh],
  )

  const handleDelete = useCallback(
    async (id: string) => {
      startTransition(async () => {
        const result = await deleteTemplate(id)
        if (result.error) {
          toast.error(result.error)
        } else {
          toast.success("Template deleted")
          onRefresh?.()
        }
      })
    },
    [onRefresh],
  )

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory(null)
    setFilterTab("all")
    setSortBy("recent")
  }

  const hasActiveFilters = searchQuery || selectedCategory || filterTab !== "all" || sortBy !== "recent"

  const sortOptions: { value: SortOption; label: string; icon: React.ReactNode }[] = [
    { value: "recent", label: "Most Recent", icon: <Clock className="w-4 h-4" /> },
    { value: "name", label: "Name A-Z", icon: <span className="w-4 h-4 text-xs font-bold">Az</span> },
    { value: "performance", label: "Best Performance", icon: <TrendingUp className="w-4 h-4" /> },
    { value: "favorites", label: "Favorites First", icon: <Star className="w-4 h-4" /> },
  ]

  if (isLoading) {
    return <TemplateLibrarySkeleton />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Templates</h1>
          <p className="text-muted-foreground mt-1">
            {filteredTemplates.length} template{filteredTemplates.length !== 1 && "s"}
            {hasActiveFilters && " found"}
          </p>
        </div>
        <Button
          onClick={() => router.push("/dashboard/templates/new")}
          className="shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Template
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col gap-3">
        {/* Top row: Tabs and View Toggle */}
        <div className="flex items-center justify-between">
          <Tabs value={filterTab} onValueChange={(v) => setFilterTab(v as FilterTab)}>
            <TabsList className="h-9 p-1 bg-muted/50">
              <TabsTrigger value="all" className="text-xs px-3 h-7 rounded-md">
                All
              </TabsTrigger>
              <TabsTrigger value="favorites" className="text-xs px-3 h-7 rounded-md">
                <Star className="w-3 h-3 mr-1.5" />
                Favorites
              </TabsTrigger>
              <TabsTrigger value="ai-generated" className="text-xs px-3 h-7 rounded-md">
                <Sparkles className="w-3 h-3 mr-1.5" />
                AI Generated
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/50">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              className="h-7 w-7 rounded-md"
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              className="h-7 w-7 rounded-md"
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Bottom row: Search, Category, Sort */}
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 bg-background/50 border-border/50 focus:bg-background"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                onClick={() => setSearchQuery("")}
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>

          {/* Category Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "h-9 px-3 justify-between min-w-[140px]",
                  "bg-background/50 border-border/50 hover:bg-background",
                  selectedCategory && "border-primary/50",
                )}
              >
                <span className="flex items-center gap-2">
                  <FolderOpen className="w-4 h-4" />
                  {selectedCategory || "Category"}
                </span>
                <ChevronDown className="w-4 h-4 ml-2 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem onClick={() => setSelectedCategory(null)}>All Categories</DropdownMenuItem>
              <DropdownMenuSeparator />
              {categories.map((category) => (
                <DropdownMenuCheckboxItem
                  key={category.id}
                  checked={selectedCategory === category.name}
                  onCheckedChange={() => setSelectedCategory(selectedCategory === category.name ? null : category.name)}
                >
                  {category.name}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-9 px-3 justify-between min-w-[160px] bg-background/50 border-border/50 hover:bg-background"
              >
                <span className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  {sortOptions.find((o) => o.value === sortBy)?.label}
                </span>
                <ChevronDown className="w-4 h-4 ml-2 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {sortOptions.map((option) => (
                <DropdownMenuCheckboxItem
                  key={option.value}
                  checked={sortBy === option.value}
                  onCheckedChange={() => setSortBy(option.value)}
                >
                  <span className="flex items-center gap-2">
                    {option.icon}
                    {option.label}
                  </span>
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              className="h-9 px-3 text-muted-foreground hover:text-foreground"
              onClick={clearFilters}
            >
              <X className="w-3 h-3 mr-1.5" />
              Clear
            </Button>
          )}
        </div>

        {/* Active filter badges */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2">
            {selectedCategory && (
              <Badge
                variant="secondary"
                className="pl-2 pr-1 py-1 gap-1 cursor-pointer hover:bg-secondary/80"
                onClick={() => setSelectedCategory(null)}
              >
                {selectedCategory}
                <X className="w-3 h-3" />
              </Badge>
            )}
            {filterTab !== "all" && (
              <Badge
                variant="secondary"
                className="pl-2 pr-1 py-1 gap-1 cursor-pointer hover:bg-secondary/80"
                onClick={() => setFilterTab("all")}
              >
                {filterTab === "favorites" ? "Favorites" : "AI Generated"}
                <X className="w-3 h-3" />
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Template Grid/List */}
      {filteredTemplates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
            {hasActiveFilters ? (
              <AlertCircle className="w-8 h-8 text-muted-foreground" />
            ) : (
              <FolderOpen className="w-8 h-8 text-muted-foreground" />
            )}
          </div>
          <h3 className="text-lg font-medium mb-1">{hasActiveFilters ? "No templates found" : "No templates yet"}</h3>
          <p className="text-muted-foreground text-center max-w-sm mb-4">
            {hasActiveFilters
              ? "Try adjusting your filters or search query"
              : "Create your first email template to get started"}
          </p>
          {hasActiveFilters ? (
            <Button variant="outline" onClick={clearFilters}>
              Clear filters
            </Button>
          ) : (
            <Button onClick={() => router.push("/dashboard/templates/new")}>
              <Plus className="w-4 h-4 mr-2" />
              Create Template
            </Button>
          )}
        </div>
      ) : (
        <div
          className={cn(
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              : "flex flex-col gap-2",
          )}
        >
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              viewMode={viewMode}
              onToggleFavorite={handleToggleFavorite}
              onDuplicate={handleDuplicate}
              onDelete={handleDelete}
              onPreview={setPreviewTemplate}
            />
          ))}
        </div>
      )}

      {/* Preview Dialog */}
      <TemplatePreviewDialog
        template={previewTemplate}
        open={!!previewTemplate}
        onOpenChange={(open) => !open && setPreviewTemplate(null)}
      />

      {/* Loading overlay */}
      {isPending && (
        <div className="fixed inset-0 bg-background/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
        </div>
      )}
    </div>
  )
}
