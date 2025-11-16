"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TemplateBlock, BlockType } from "@/lib/types"
import { BlockRenderer } from "./block-renderer"
import { BlockPalette } from "./block-palette"
import { Eye, Code, Save, Loader2 } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { updateTemplate } from "@/lib/actions/templates"

interface VisualTemplateEditorProps {
  templateId: string
  initialBlocks?: TemplateBlock[]
  onSave?: () => void
}

export function VisualTemplateEditor({ 
  templateId, 
  initialBlocks = [],
  onSave 
}: VisualTemplateEditorProps) {
  const [blocks, setBlocks] = useState<TemplateBlock[]>(initialBlocks)
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit')
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  const addBlock = (type: BlockType) => {
    const newBlock: TemplateBlock = {
      id: `block_${Date.now()}`,
      type,
      order: blocks.length,
      content: getDefaultContent(type),
      styling: {}
    }
    setBlocks([...blocks, newBlock])
  }

  const getDefaultContent = (type: BlockType): Record<string, any> => {
    switch (type) {
      case 'HEADER':
        return { title: 'Header Title', subtitle: '' }
      case 'PARAGRAPH':
        return { text: 'Enter your text here...' }
      case 'BUTTON':
        return { text: 'Click Here', url: '' }
      case 'IMAGE':
        return { src: '', alt: '' }
      case 'DIVIDER':
        return {}
      case 'PERSONALIZATION':
        return { variable: 'firstName', fallback: '' }
      case 'SIGNATURE':
        return { name: '', title: '', company: '' }
      case 'SPACER':
        return { height: '24px' }
      default:
        return {}
    }
  }

  const updateBlock = (index: number, updatedBlock: TemplateBlock) => {
    const newBlocks = [...blocks]
    newBlocks[index] = updatedBlock
    setBlocks(newBlocks)
  }

  const deleteBlock = (index: number) => {
    const newBlocks = blocks.filter((_, i) => i !== index)
    // Update order
    const reorderedBlocks = newBlocks.map((block, i) => ({
      ...block,
      order: i
    }))
    setBlocks(reorderedBlocks)
  }

  const moveBlock = (fromIndex: number, toIndex: number) => {
    const newBlocks = [...blocks]
    const [removed] = newBlocks.splice(fromIndex, 1)
    newBlocks.splice(toIndex, 0, removed)
    // Update order
    const reorderedBlocks = newBlocks.map((block, i) => ({
      ...block,
      order: i
    }))
    setBlocks(reorderedBlocks)
  }

  const handleSave = async () => {
    setIsSaving(true)

    try {
      const result = await updateTemplate(templateId, {
        editorBlocks: {
          version: '1.0',
          blocks
        }
      })

      if (!result.success) {
        throw new Error(result.error)
      }

      toast({
        title: "Template saved",
        description: "Your visual template has been updated"
      })

      onSave?.()
    } catch (error) {
      toast({
        title: "Save failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const generateHTML = () => {
    // Simple HTML generation for preview
    return blocks.map((block) => {
      switch (block.type) {
        case 'HEADER':
          return `<h1>${block.content.title}</h1>${block.content.subtitle ? `<p>${block.content.subtitle}</p>` : ''}`
        case 'PARAGRAPH':
          return `<p>${block.content.text}</p>`
        case 'BUTTON':
          return `<a href="${block.content.url}" style="display: inline-block; padding: 12px 24px; background: #3b82f6; color: white; text-decoration: none; border-radius: 6px;">${block.content.text}</a>`
        case 'IMAGE':
          return `<img src="${block.content.src}" alt="${block.content.alt}" style="max-width: 100%;" />`
        case 'DIVIDER':
          return '<hr style="border: 1px solid #e5e7eb;" />'
        case 'PERSONALIZATION':
          return `{{${block.content.variable}}}`
        case 'SIGNATURE':
          return `<div><p><strong>${block.content.name}</strong></p><p>${block.content.title}</p><p>${block.content.company}</p></div>`
        case 'SPACER':
          return `<div style="height: ${block.content.height};"></div>`
        default:
          return ''
      }
    }).join('\n')
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
      {/* Block Palette Sidebar */}
      <div className="space-y-4">
        <BlockPalette onAddBlock={addBlock} />
      </div>

      {/* Editor Canvas */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
            <TabsList>
              <TabsTrigger value="edit">
                <Code className="mr-2 h-4 w-4" />
                Edit
              </TabsTrigger>
              <TabsTrigger value="preview">
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Template
              </>
            )}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Template Canvas</CardTitle>
            <CardDescription>
              {activeTab === 'edit' 
                ? 'Build your template by adding and configuring blocks' 
                : 'Preview how your template will look'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {blocks.length === 0 ? (
              <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg">
                <div className="text-center space-y-2">
                  <p className="text-muted-foreground">No blocks yet</p>
                  <p className="text-sm text-muted-foreground">Add blocks from the palette to get started</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {blocks.map((block, index) => (
                  <BlockRenderer
                    key={block.id}
                    block={block}
                    onUpdate={(updated) => updateBlock(index, updated)}
                    onDelete={() => deleteBlock(index)}
                    isEditing={activeTab === 'edit'}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {activeTab === 'preview' && blocks.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>HTML Output</CardTitle>
              <CardDescription>Copy this HTML for use in email clients</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
                <code>{generateHTML()}</code>
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
