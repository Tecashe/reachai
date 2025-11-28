"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  FolderIcon,
  Users,
  Mail,
  TrendingUp,
  MoreHorizontal,
  Plus,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Layers,
  CreditCard,
  Columns,
  PanelLeftClose,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Sample folder data
const sampleFolders = [
  { id: "1", name: "Hot Leads", color: "#EF4444", prospectCount: 156, verified: 142, responseRate: 34 },
  { id: "2", name: "Enterprise", color: "#3B82F6", prospectCount: 89, verified: 78, responseRate: 28 },
  { id: "3", name: "Startups", color: "#10B981", prospectCount: 234, verified: 201, responseRate: 22 },
  { id: "4", name: "Nurturing", color: "#F59E0B", prospectCount: 67, verified: 54, responseRate: 18 },
  { id: "5", name: "Cold Outreach", color: "#8B5CF6", prospectCount: 312, verified: 289, responseRate: 12 },
  { id: "6", name: "Partners", color: "#EC4899", prospectCount: 45, verified: 41, responseRate: 45 },
]

// Option A: Staggered Masonry Grid
function MasonryGrid() {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
      {sampleFolders.map((folder, index) => {
        const height = folder.prospectCount > 150 ? "h-72" : folder.prospectCount > 80 ? "h-56" : "h-44"

        return (
          <div
            key={folder.id}
            className={cn(
              "break-inside-avoid rounded-xl border bg-card p-5 cursor-pointer transition-all duration-300",
              height,
              hoveredId === folder.id && "shadow-lg -translate-y-1",
            )}
            style={{
              boxShadow: hoveredId === folder.id ? `0 20px 40px -15px ${folder.color}30` : undefined,
            }}
            onMouseEnter={() => setHoveredId(folder.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${folder.color}15` }}
              >
                <FolderIcon className="h-5 w-5" style={{ color: folder.color }} />
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 -mt-1">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>

            <h3 className="font-semibold text-base mb-1">{folder.name}</h3>
            <p className="text-2xl font-bold mb-1" style={{ color: folder.color }}>
              {folder.prospectCount}
            </p>
            <p className="text-xs text-muted-foreground mb-3">prospects</p>

            {folder.prospectCount > 80 && (
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Verified</span>
                  <span className="text-foreground font-medium">{folder.verified}</span>
                </div>
                <div className="flex justify-between">
                  <span>Response Rate</span>
                  <span className="text-foreground font-medium">{folder.responseRate}%</span>
                </div>
              </div>
            )}

            {folder.prospectCount > 150 && (
              <div className="mt-4 pt-3 border-t">
                <p className="text-xs text-muted-foreground mb-2">Top Companies</p>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="secondary" className="text-xs">
                    Acme Inc
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    TechCorp
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    +3
                  </Badge>
                </div>
              </div>
            )}

            <div
              className="absolute bottom-0 left-0 right-0 h-1 rounded-b-xl transition-all duration-300"
              style={{
                backgroundColor: folder.color,
                opacity: hoveredId === folder.id ? 1 : 0.3,
              }}
            />
          </div>
        )
      })}
    </div>
  )
}

// Option B: Horizontal Carousel with Depth
function DepthCarousel() {
  const [activeIndex, setActiveIndex] = useState(2)

  return (
    <div className="relative py-8">
      <div className="flex items-center justify-center gap-4">
        <Button
          variant="outline"
          size="icon"
          className="absolute left-4 z-10 bg-transparent"
          onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center justify-center" style={{ perspective: "1000px" }}>
          {sampleFolders.map((folder, index) => {
            const offset = index - activeIndex
            const isActive = index === activeIndex
            const absOffset = Math.abs(offset)

            if (absOffset > 2) return null

            return (
              <div
                key={folder.id}
                className={cn(
                  "absolute rounded-xl border bg-card p-6 cursor-pointer transition-all duration-500 ease-out",
                  "w-[260px] h-[320px]",
                  isActive && "shadow-2xl z-20",
                )}
                style={{
                  transform: `
                    translateX(${offset * 180}px) 
                    translateZ(${isActive ? 0 : -100 * absOffset}px)
                    scale(${isActive ? 1 : 0.85 - absOffset * 0.1})
                  `,
                  opacity: isActive ? 1 : 0.6 - absOffset * 0.2,
                  filter: isActive ? "none" : "blur(1px)",
                }}
                onClick={() => setActiveIndex(index)}
              >
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-xl mb-4"
                  style={{ backgroundColor: `${folder.color}15` }}
                >
                  <FolderIcon className="h-7 w-7" style={{ color: folder.color }} />
                </div>

                <h3 className="font-semibold text-lg mb-2">{folder.name}</h3>
                <p className="text-4xl font-bold mb-1" style={{ color: folder.color }}>
                  {folder.prospectCount}
                </p>
                <p className="text-sm text-muted-foreground mb-6">prospects</p>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Mail className="h-4 w-4" /> Verified
                    </span>
                    <span className="font-medium">{folder.verified}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" /> Response
                    </span>
                    <span className="font-medium">{folder.responseRate}%</span>
                  </div>
                </div>

                <div
                  className="absolute bottom-0 left-0 right-0 h-1.5 rounded-b-xl"
                  style={{ backgroundColor: folder.color }}
                />
              </div>
            )
          })}
        </div>

        <Button
          variant="outline"
          size="icon"
          className="absolute right-4 z-10 bg-transparent"
          onClick={() => setActiveIndex(Math.min(sampleFolders.length - 1, activeIndex + 1))}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Dots indicator */}
      <div className="flex justify-center gap-2 mt-8">
        {sampleFolders.map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              index === activeIndex ? "bg-primary w-6" : "bg-muted-foreground/30",
            )}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>
    </div>
  )
}

// Option C: Floating Cards with Subtle Tilt
function FloatingCards() {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const getRandomTilt = (id: string) => {
    const hash = id.charCodeAt(0) + id.charCodeAt(id.length - 1)
    return (hash % 5) - 2 // Returns -2 to 2
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {sampleFolders.map((folder) => {
        const tilt = getRandomTilt(folder.id)
        const isHovered = hoveredId === folder.id

        return (
          <div
            key={folder.id}
            className={cn(
              "relative rounded-xl border bg-card p-5 cursor-pointer transition-all duration-300 ease-out",
              "h-48",
            )}
            style={{
              transform: isHovered ? "rotate(0deg) translateY(-8px) scale(1.02)" : `rotate(${tilt}deg)`,
              boxShadow: isHovered
                ? `0 25px 50px -12px ${folder.color}25, 0 0 0 1px ${folder.color}30`
                : "0 10px 30px -10px rgba(0,0,0,0.15)",
            }}
            onMouseEnter={() => setHoveredId(folder.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div className="flex items-start justify-between">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${folder.color}15` }}
              >
                <FolderIcon className="h-5 w-5" style={{ color: folder.color }} />
              </div>
              <Badge
                variant="outline"
                className="text-xs font-medium"
                style={{ borderColor: folder.color, color: folder.color }}
              >
                {folder.responseRate}% response
              </Badge>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold text-base">{folder.name}</h3>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-bold" style={{ color: folder.color }}>
                  {folder.prospectCount}
                </span>
                <span className="text-sm text-muted-foreground">prospects</span>
              </div>
            </div>

            <div className="absolute bottom-4 left-5 right-5 flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {folder.verified} verified
              </span>
            </div>

            {/* Decorative corner accent */}
            <div
              className="absolute top-0 right-0 w-16 h-16 rounded-tr-xl rounded-bl-[40px] opacity-10"
              style={{ backgroundColor: folder.color }}
            />
          </div>
        )
      })}
    </div>
  )
}

// Option D: Kanban-Style Columns
function KanbanColumns() {
  const columns = [
    { name: "Active", folders: sampleFolders.slice(0, 2) },
    { name: "Nurturing", folders: sampleFolders.slice(2, 4) },
    { name: "Archive", folders: sampleFolders.slice(4, 6) },
  ]

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {columns.map((column) => (
        <div key={column.name} className="flex-shrink-0 w-[300px]">
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">{column.name}</h3>
            <Badge variant="secondary" className="text-xs">
              {column.folders.length}
            </Badge>
          </div>

          <div className="space-y-3 bg-muted/30 rounded-xl p-3 min-h-[400px]">
            {column.folders.map((folder) => (
              <div
                key={folder.id}
                className="rounded-lg border bg-card p-4 cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${folder.color}15` }}
                  >
                    <FolderIcon className="h-4 w-4" style={{ color: folder.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{folder.name}</h4>
                    <p className="text-xs text-muted-foreground">{folder.prospectCount} prospects</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7 -mr-1">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{folder.verified} verified</span>
                  <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                  <span>{folder.responseRate}% response</span>
                </div>

                <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      backgroundColor: folder.color,
                      width: `${(folder.verified / folder.prospectCount) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}

            <Button variant="ghost" className="w-full h-10 border-dashed border text-muted-foreground">
              <Plus className="h-4 w-4 mr-2" />
              Add Folder
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

// Option E: Compact List + Preview Panel
function ListWithPreview() {
  const [selectedId, setSelectedId] = useState(sampleFolders[0].id)
  const selectedFolder = sampleFolders.find((f) => f.id === selectedId)!

  return (
    <div className="flex gap-6 h-[450px]">
      {/* Left: Folder List */}
      <div className="w-[280px] flex-shrink-0 border rounded-xl overflow-hidden">
        <div className="p-3 border-b bg-muted/30">
          <h3 className="font-semibold text-sm">All Folders</h3>
        </div>
        <div className="divide-y">
          {sampleFolders.map((folder) => (
            <div
              key={folder.id}
              className={cn(
                "flex items-center gap-3 p-3 cursor-pointer transition-colors",
                selectedId === folder.id ? "bg-primary/5 border-l-2 border-l-primary" : "hover:bg-muted/50",
              )}
              onClick={() => setSelectedId(folder.id)}
            >
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${folder.color}15` }}
              >
                <FolderIcon className="h-4 w-4" style={{ color: folder.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{folder.name}</p>
                <p className="text-xs text-muted-foreground">{folder.prospectCount} prospects</p>
              </div>
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: folder.color }} />
            </div>
          ))}
        </div>
      </div>

      {/* Right: Preview Panel */}
      <div className="flex-1 border rounded-xl p-6 bg-gradient-to-br from-card to-muted/20">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-xl"
              style={{ backgroundColor: `${selectedFolder.color}15` }}
            >
              <FolderIcon className="h-8 w-8" style={{ color: selectedFolder.color }} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{selectedFolder.name}</h2>
              <p className="text-muted-foreground">{selectedFolder.prospectCount} total prospects</p>
            </div>
          </div>
          <Button>Open Folder</Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground mb-1">Total Prospects</p>
            <p className="text-2xl font-bold" style={{ color: selectedFolder.color }}>
              {selectedFolder.prospectCount}
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground mb-1">Verified Emails</p>
            <p className="text-2xl font-bold">{selectedFolder.verified}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground mb-1">Response Rate</p>
            <p className="text-2xl font-bold">{selectedFolder.responseRate}%</p>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Email Verification</span>
              <span className="font-medium">
                {Math.round((selectedFolder.verified / selectedFolder.prospectCount) * 100)}%
              </span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  backgroundColor: selectedFolder.color,
                  width: `${(selectedFolder.verified / selectedFolder.prospectCount) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-6 pt-6 border-t">
          <h4 className="font-semibold text-sm mb-3">Recent Activity</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>12 new prospects added today</p>
            <p>5 emails verified in the last hour</p>
            <p>3 responses received</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function FolderLayoutPreview() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Folder Layout Options</h1>
        <p className="text-muted-foreground">
          Preview different folder arrangement styles. Choose the one you like best.
        </p>
      </div>

      <Tabs defaultValue="masonry" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 h-auto p-1">
          <TabsTrigger value="masonry" className="flex items-center gap-2 py-2">
            <LayoutGrid className="h-4 w-4" />
            <span className="hidden sm:inline">Masonry</span>
          </TabsTrigger>
          <TabsTrigger value="carousel" className="flex items-center gap-2 py-2">
            <Layers className="h-4 w-4" />
            <span className="hidden sm:inline">Carousel</span>
          </TabsTrigger>
          <TabsTrigger value="floating" className="flex items-center gap-2 py-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Floating</span>
          </TabsTrigger>
          <TabsTrigger value="kanban" className="flex items-center gap-2 py-2">
            <Columns className="h-4 w-4" />
            <span className="hidden sm:inline">Kanban</span>
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-2 py-2">
            <PanelLeftClose className="h-4 w-4" />
            <span className="hidden sm:inline">List+Preview</span>
          </TabsTrigger>
        </TabsList>

        <div className="rounded-xl border bg-card/50 p-6 min-h-[500px]">
          <TabsContent value="masonry" className="mt-0">
            <div className="mb-4">
              <h2 className="font-semibold mb-1">Option A: Staggered Masonry Grid</h2>
              <p className="text-sm text-muted-foreground">
                Pinterest-style layout. Folder card height varies based on prospect count - more prospects = taller card
                with more details.
              </p>
            </div>
            <MasonryGrid />
          </TabsContent>

          <TabsContent value="carousel" className="mt-0">
            <div className="mb-4">
              <h2 className="font-semibold mb-1">Option B: Horizontal Carousel with Depth</h2>
              <p className="text-sm text-muted-foreground">
                Netflix-style 3D carousel. Active folder is prominent, others recede into background. Use arrows or
                click folders to navigate.
              </p>
            </div>
            <DepthCarousel />
          </TabsContent>

          <TabsContent value="floating" className="mt-0">
            <div className="mb-4">
              <h2 className="font-semibold mb-1">Option C: Floating Cards with Subtle Tilt</h2>
              <p className="text-sm text-muted-foreground">
                Each card has a slight random rotation creating a natural, scattered-papers feel. Cards straighten and
                lift on hover.
              </p>
            </div>
            <FloatingCards />
          </TabsContent>

          <TabsContent value="kanban" className="mt-0">
            <div className="mb-4">
              <h2 className="font-semibold mb-1">Option D: Kanban-Style Columns</h2>
              <p className="text-sm text-muted-foreground">
                Folders grouped by status in scrollable columns. Professional productivity-tool aesthetic. Drag folders
                between columns.
              </p>
            </div>
            <KanbanColumns />
          </TabsContent>

          <TabsContent value="list" className="mt-0">
            <div className="mb-4">
              <h2 className="font-semibold mb-1">Option E: Compact List + Preview Panel</h2>
              <p className="text-sm text-muted-foreground">
                Split view with folder list on left, detailed preview on right. Power-user friendly with quick
                navigation.
              </p>
            </div>
            <ListWithPreview />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
