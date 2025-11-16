"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Type, Heading1, ImageIcon, MousePointerClick, Minus, User, Sparkles, Space } from 'lucide-react'
import { BlockType } from "@/lib/types"

interface BlockPaletteProps {
  onAddBlock: (type: BlockType) => void
}

const BLOCK_TYPES = [
  { type: 'HEADER' as BlockType, label: 'Header', icon: Heading1, description: 'Title and subtitle' },
  { type: 'PARAGRAPH' as BlockType, label: 'Paragraph', icon: Type, description: 'Text content' },
  { type: 'IMAGE' as BlockType, label: 'Image', icon: ImageIcon, description: 'Add an image' },
  { type: 'BUTTON' as BlockType, label: 'Button', icon: MousePointerClick, description: 'Call-to-action' },
  { type: 'DIVIDER' as BlockType, label: 'Divider', icon: Minus, description: 'Horizontal line' },
  { type: 'PERSONALIZATION' as BlockType, label: 'Variable', icon: Sparkles, description: 'Dynamic content' },
  { type: 'SIGNATURE' as BlockType, label: 'Signature', icon: User, description: 'Email signature' },
  { type: 'SPACER' as BlockType, label: 'Spacer', icon: Space, description: 'Vertical spacing' },
]

export function BlockPalette({ onAddBlock }: BlockPaletteProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Blocks</CardTitle>
        <CardDescription>Drag blocks to build your template</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          {BLOCK_TYPES.map((block) => {
            const Icon = block.icon
            return (
              <Button
                key={block.type}
                variant="outline"
                className="justify-start h-auto py-3"
                onClick={() => onAddBlock(block.type)}
              >
                <Icon className="mr-3 h-4 w-4 shrink-0" />
                <div className="text-left">
                  <div className="font-medium">{block.label}</div>
                  <div className="text-xs text-muted-foreground">{block.description}</div>
                </div>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
