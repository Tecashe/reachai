"use client"

import { useState } from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Type, ImageIcon, RectangleHorizontal, Minus, Space, Copy, Trash2, GripVertical, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export interface EmailBlock {
  id: string
  type: "text" | "image" | "button" | "divider" | "spacer"
  content: string
  settings: {
    alignment?: "left" | "center" | "right"
    padding?: string
    backgroundColor?: string
    textColor?: string
    fontSize?: string
    buttonUrl?: string
    imageUrl?: string
    imageAlt?: string
    spacerHeight?: string
  }
}

interface BlockBuilderProps {
  blocks: EmailBlock[]
  onChange: (blocks: EmailBlock[]) => void
  onSelectBlock?: (block: EmailBlock) => void
  className?: string
}

const BLOCK_TYPES = [
  {
    type: "text" as const,
    label: "Text",
    icon: Type,
    description: "Paragraph or heading text",
    defaultContent: "<p>Enter your text here...</p>",
  },
  {
    type: "image" as const,
    label: "Image",
    icon: ImageIcon,
    description: "Insert an image",
    defaultContent: "",
  },
  {
    type: "button" as const,
    label: "Button",
    icon: RectangleHorizontal,
    description: "Call-to-action button",
    defaultContent: "Click Here",
  },
  {
    type: "divider" as const,
    label: "Divider",
    icon: Minus,
    description: "Horizontal line separator",
    defaultContent: "",
  },
  {
    type: "spacer" as const,
    label: "Spacer",
    icon: Space,
    description: "Add vertical spacing",
    defaultContent: "",
  },
]

function SortableBlock({
  block,
  onDuplicate,
  onDelete,
  onSettings,
}: {
  block: EmailBlock
  onDuplicate: () => void
  onDelete: () => void
  onSettings: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const renderBlockContent = () => {
    switch (block.type) {
      case "text":
        return (
          <div
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: block.content || "<p>Empty text block</p>" }}
          />
        )
      case "image":
        return block.settings.imageUrl ? (
          <img
            src={block.settings.imageUrl || "/placeholder.svg"}
            alt={block.settings.imageAlt || "Email image"}
            className="max-w-full h-auto"
          />
        ) : (
          <div className="flex items-center justify-center h-32 bg-muted/50 rounded-lg border-2 border-dashed">
            <div className="text-center text-muted-foreground">
              <ImageIcon className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">No image selected</p>
            </div>
          </div>
        )
      case "button":
        return (
          <div className={cn("flex", `justify-${block.settings.alignment || "center"}`)}>
            <button
              className="px-6 py-3 rounded-lg font-medium"
              style={{
                backgroundColor: block.settings.backgroundColor || "hsl(var(--primary))",
                color: block.settings.textColor || "white",
              }}
            >
              {block.content || "Button"}
            </button>
          </div>
        )
      case "divider":
        return <hr className="border-t my-4" style={{ borderColor: block.settings.backgroundColor || undefined }} />
      case "spacer":
        return <div style={{ height: block.settings.spacerHeight || "32px" }} className="bg-muted/20" />
      default:
        return null
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative rounded-lg border border-border bg-background p-4 mb-2",
        isDragging && "opacity-50",
        "hover:border-primary/50 transition-colors",
      )}
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="w-5 h-5 text-muted-foreground" />
      </div>

      {/* Block content */}
      <div className="pl-6 pr-24" style={{ textAlign: block.settings.alignment || "left" }}>
        {renderBlockContent()}
      </div>

      {/* Action buttons */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onSettings}>
          <Settings className="w-3.5 h-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onDuplicate}>
          <Copy className="w-3.5 h-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={onDelete}>
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Block type badge */}
      <Badge variant="outline" className="absolute right-2 bottom-2 text-[10px] opacity-50 group-hover:opacity-100">
        {block.type}
      </Badge>
    </div>
  )
}

export function BlockBuilder({ blocks, onChange, onSelectBlock, className }: BlockBuilderProps) {
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((b) => b.id === active.id)
      const newIndex = blocks.findIndex((b) => b.id === over.id)

      onChange(arrayMove(blocks, oldIndex, newIndex))
    }

    setActiveId(null)
  }

  const handleAddBlock = (type: EmailBlock["type"]) => {
    const blockType = BLOCK_TYPES.find((bt) => bt.type === type)
    if (!blockType) return

    const newBlock: EmailBlock = {
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      content: blockType.defaultContent,
      settings: {
        alignment: "left",
        padding: "16px",
      },
    }

    onChange([...blocks, newBlock])
  }

  const handleDuplicateBlock = (blockId: string) => {
    const block = blocks.find((b) => b.id === blockId)
    if (!block) return

    const duplicatedBlock: EmailBlock = {
      ...block,
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    }

    const index = blocks.findIndex((b) => b.id === blockId)
    const newBlocks = [...blocks]
    newBlocks.splice(index + 1, 0, duplicatedBlock)
    onChange(newBlocks)
  }

  const handleDeleteBlock = (blockId: string) => {
    onChange(blocks.filter((b) => b.id !== blockId))
  }

  const handleSettingsClick = (block: EmailBlock) => {
    if (onSelectBlock) {
      onSelectBlock(block)
    }
  }

  const activeBlock = activeId ? blocks.find((b) => b.id === activeId) : null

  return (
    <div className={cn("flex h-full", className)}>
      {/* Blocks palette */}
      <div className="w-64 border-r border-border/50 bg-muted/20">
        <div className="px-4 py-3 border-b border-border/50">
          <h3 className="font-medium text-sm">Content Blocks</h3>
          <p className="text-xs text-muted-foreground mt-1">Drag blocks to build your email</p>
        </div>
        <ScrollArea className="h-[calc(100%-60px)]">
          <div className="p-3 space-y-2">
            {BLOCK_TYPES.map((blockType) => (
              <button
                key={blockType.type}
                onClick={() => handleAddBlock(blockType.type)}
                className={cn(
                  "w-full flex items-start gap-3 p-3 rounded-lg border border-border/50",
                  "hover:border-primary/50 hover:bg-primary/5 transition-colors",
                  "text-left group",
                )}
              >
                <div className="p-2 rounded-md bg-background group-hover:bg-primary/10 transition-colors">
                  <blockType.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{blockType.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{blockType.description}</div>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Canvas */}
      <div className="flex-1 overflow-hidden">
        <div className="px-4 py-3 border-b border-border/50 bg-background">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-sm">Email Canvas</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{blocks.length} blocks</p>
            </div>
          </div>
        </div>

        <ScrollArea className="h-[calc(100%-60px)]">
          <div className="p-6 max-w-3xl mx-auto">
            {blocks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <RectangleHorizontal className="w-12 h-12 text-muted-foreground/50 mb-4" />
                <h4 className="font-medium text-lg mb-2">Start building your email</h4>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Drag and drop blocks from the left panel to create your email template
                </p>
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
                  {blocks.map((block) => (
                    <SortableBlock
                      key={block.id}
                      block={block}
                      onDuplicate={() => handleDuplicateBlock(block.id)}
                      onDelete={() => handleDeleteBlock(block.id)}
                      onSettings={() => handleSettingsClick(block)}
                    />
                  ))}
                </SortableContext>

                <DragOverlay>
                  {activeBlock ? (
                    <div className="rounded-lg border border-primary bg-background p-4 shadow-lg opacity-90">
                      <Badge>{activeBlock.type}</Badge>
                    </div>
                  ) : null}
                </DragOverlay>
              </DndContext>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
