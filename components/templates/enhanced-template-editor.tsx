"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { VariablePalette } from "./variable-palette"


interface EnhancedTemplateEditorProps {
  value: string
  onChange: (value: string) => void
  label?: string
  placeholder?: string
  rows?: number
}

export function EnhancedTemplateEditor({
  value,
  onChange,
  label = "Email Body",
  placeholder = "Write your email...",
  rows = 12,
}: EnhancedTemplateEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [customVariables, setCustomVariables] = useState<Array<{ name: string; label: string; value: string }>>([])

  const handleInsertVariable = (variableName: string) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const textBefore = value.substring(0, start)
    const textAfter = value.substring(end)

    // Check if it's a custom variable with a value
    const customVar = customVariables.find((v) => v.name === variableName)
    const insertText = customVar?.value || `{{${variableName}}}`

    const newValue = textBefore + insertText + textAfter
    onChange(newValue)

    // Set cursor position after inserted text
    setTimeout(() => {
      textarea.focus()
      const newPosition = start + insertText.length
      textarea.setSelectionRange(newPosition, newPosition)
    }, 0)
  }

  const handleDrop = (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault()
    const droppedText = e.dataTransfer.getData("text/plain")
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const textBefore = value.substring(0, start)
    const textAfter = value.substring(end)

    const newValue = textBefore + droppedText + textAfter
    onChange(newValue)
  }

  const handleDragOver = (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "copy"
  }

  const handleAddCustomVariable = (variable: { name: string; label: string; value: string }) => {
    setCustomVariables([...customVariables, variable])
  }

  return (
    <div className="grid lg:grid-cols-[1fr_400px] gap-6">
      <div className="space-y-2">
        <Label htmlFor="body">{label}</Label>
        <Textarea
          ref={textareaRef}
          id="body"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          placeholder={placeholder}
          rows={rows}
          required
          className="font-mono text-sm"
        />
        <p className="text-xs text-muted-foreground">
          Drag variables from the right panel or click to insert at cursor position
        </p>
      </div>

      <div className="lg:sticky lg:top-6 h-fit">
        <VariablePalette
          onInsertVariable={handleInsertVariable}
          customVariables={customVariables}
          onAddCustomVariable={handleAddCustomVariable}
        />
      </div>
    </div>
  )
}
