"use client"

import { TemplateBlock, BlockType } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { GripVertical, Trash2, Settings } from 'lucide-react'

interface BlockRendererProps {
  block: TemplateBlock
  onUpdate: (block: TemplateBlock) => void
  onDelete: () => void
  isEditing: boolean
}

export function BlockRenderer({ block, onUpdate, onDelete, isEditing }: BlockRendererProps) {
  const updateContent = (key: string, value: any) => {
    onUpdate({
      ...block,
      content: { ...block.content, [key]: value }
    })
  }

  const updateStyling = (key: string, value: any) => {
    onUpdate({
      ...block,
      styling: { ...block.styling, [key]: value }
    })
  }

  const renderEditMode = () => {
    switch (block.type) {
      case 'HEADER':
        return (
          <div className="space-y-2">
            <Input
              placeholder="Header title"
              value={block.content.title || ''}
              onChange={(e) => updateContent('title', e.target.value)}
              className="font-bold text-lg"
            />
            <Input
              placeholder="Subtitle (optional)"
              value={block.content.subtitle || ''}
              onChange={(e) => updateContent('subtitle', e.target.value)}
              className="text-sm"
            />
          </div>
        )

      case 'PARAGRAPH':
        return (
          <Textarea
            placeholder="Paragraph text... Use {{variableName}} for personalization"
            value={block.content.text || ''}
            onChange={(e) => updateContent('text', e.target.value)}
            rows={4}
            className="resize-none"
          />
        )

      case 'BUTTON':
        return (
          <div className="space-y-2">
            <Input
              placeholder="Button text"
              value={block.content.text || ''}
              onChange={(e) => updateContent('text', e.target.value)}
            />
            <Input
              placeholder="Button URL or {{variable}}"
              value={block.content.url || ''}
              onChange={(e) => updateContent('url', e.target.value)}
              type="url"
            />
          </div>
        )

      case 'IMAGE':
        return (
          <div className="space-y-2">
            <Input
              placeholder="Image URL"
              value={block.content.src || ''}
              onChange={(e) => updateContent('src', e.target.value)}
              type="url"
            />
            <Input
              placeholder="Alt text"
              value={block.content.alt || ''}
              onChange={(e) => updateContent('alt', e.target.value)}
            />
          </div>
        )

      case 'PERSONALIZATION':
        return (
          <div className="space-y-2">
            <Input
              placeholder="Variable name (e.g., firstName)"
              value={block.content.variable || ''}
              onChange={(e) => updateContent('variable', e.target.value)}
            />
            <Input
              placeholder="Fallback text"
              value={block.content.fallback || ''}
              onChange={(e) => updateContent('fallback', e.target.value)}
            />
          </div>
        )

      case 'SIGNATURE':
        return (
          <div className="space-y-2">
            <Input
              placeholder="Name"
              value={block.content.name || ''}
              onChange={(e) => updateContent('name', e.target.value)}
            />
            <Input
              placeholder="Title"
              value={block.content.title || ''}
              onChange={(e) => updateContent('title', e.target.value)}
            />
            <Input
              placeholder="Company"
              value={block.content.company || ''}
              onChange={(e) => updateContent('company', e.target.value)}
            />
          </div>
        )

      default:
        return <div className="text-muted-foreground">Configure {block.type} block</div>
    }
  }

  const renderPreviewMode = () => {
    switch (block.type) {
      case 'HEADER':
        return (
          <div className="space-y-1">
            <h2 className="text-2xl font-bold" style={{ color: block.styling?.textColor }}>
              {block.content.title || 'Header Title'}
            </h2>
            {block.content.subtitle && (
              <p className="text-muted-foreground">{block.content.subtitle}</p>
            )}
          </div>
        )

      case 'PARAGRAPH':
        return (
          <p 
            className="leading-relaxed" 
            style={{ 
              color: block.styling?.textColor,
              textAlign: block.styling?.alignment as any
            }}
          >
            {block.content.text || 'Enter your paragraph text...'}
          </p>
        )

      case 'BUTTON':
        return (
          <Button
            style={{
              backgroundColor: block.styling?.backgroundColor || undefined,
              color: block.styling?.textColor || undefined,
            }}
          >
            {block.content.text || 'Button Text'}
          </Button>
        )

      case 'IMAGE':
        return (
          <img
            src={block.content.src || '/placeholder.svg?height=200&width=400&query=email-image'}
            alt={block.content.alt || 'Email image'}
            className="rounded-md w-full max-h-64 object-cover"
          />
        )

      case 'DIVIDER':
        return <hr className="border-border" />

      case 'PERSONALIZATION':
        return (
          <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded text-sm font-mono">
            {`{{${block.content.variable || 'variableName'}}}`}
          </span>
        )

      case 'SIGNATURE':
        return (
          <div className="space-y-1 pt-4 border-t">
            <p className="font-medium">{block.content.name || 'Your Name'}</p>
            <p className="text-sm text-muted-foreground">{block.content.title || 'Your Title'}</p>
            <p className="text-sm text-muted-foreground">{block.content.company || 'Company Name'}</p>
          </div>
        )

      case 'SPACER':
        return <div style={{ height: block.content.height || '24px' }} />

      default:
        return <div className="text-muted-foreground">{block.type} Block</div>
    }
  }

  return (
    <Card className="p-4 group hover:border-primary/50 transition-colors">
      <div className="flex items-start gap-3">
        <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
            aria-label="Drag to reorder"
          >
            <GripVertical className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1">
          {isEditing ? renderEditMode() : renderPreviewMode()}
        </div>

        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="h-8 w-8 p-0"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
