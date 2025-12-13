"use client"

import { useState, useMemo } from "react"
import {
  Search,
  Copy,
  Check,
  Plus,
  Braces,
  User,
  Building,
  Calendar,
  Link,
  Hash,
  X,
  ChevronRight,
  Edit2,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import type { TemplateVariable } from "@/lib/types"
import { toast } from "sonner"

interface VariablePanelProps {
  variables: TemplateVariable[]
  onInsertVariable: (variable: string) => void
  onCreateVariable?: (variable: Omit<TemplateVariable, "id">) => void
  onUpdateVariable?: (id: string, updates: Partial<TemplateVariable>) => void
  onDeleteVariable?: (id: string) => void
  onClose?: () => void
  className?: string
  editable?: boolean
}

const VARIABLE_CATEGORIES = [
  {
    id: "contact",
    name: "Contact",
    icon: User,
    variables: ["firstName", "lastName", "email", "phone", "fullName"],
  },
  {
    id: "company",
    name: "Company",
    icon: Building,
    variables: ["companyName", "companyUrl", "companyAddress", "industry"],
  },
  {
    id: "dates",
    name: "Dates",
    icon: Calendar,
    variables: ["currentDate", "currentMonth", "currentYear", "appointmentDate"],
  },
  {
    id: "links",
    name: "Links",
    icon: Link,
    variables: ["unsubscribeUrl", "preferencesUrl", "viewInBrowserUrl", "ctaUrl"],
  },
  {
    id: "custom",
    name: "Custom",
    icon: Hash,
    variables: [],
  },
]

export function VariablePanel({
  variables,
  onInsertVariable,
  onCreateVariable,
  onUpdateVariable,
  onDeleteVariable,
  onClose,
  className,
  editable = false,
}: VariablePanelProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [copiedVariable, setCopiedVariable] = useState<string | null>(null)
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["contact", "company"])

  const [showVariableDialog, setShowVariableDialog] = useState(false)
  const [editingVariable, setEditingVariable] = useState<TemplateVariable | null>(null)
  const [variableForm, setVariableForm] = useState({
    name: "",
    description: "",
    defaultValue: "",
    required: false,
  })

  const organizedVariables = useMemo(() => {
    const result = VARIABLE_CATEGORIES.map((category) => {
      const categoryVars = variables.filter((v) => {
        return category.variables.includes(v.name)
      })

      if (category.id === "custom") {
        const usedVars = VARIABLE_CATEGORIES.flatMap((c) => c.variables)
        const customVars = variables.filter((v) => !usedVars.includes(v.name))
        return { ...category, items: customVars }
      }

      return { ...category, items: categoryVars }
    })

    return result.filter((c) => c.items.length > 0)
  }, [variables])

  const filteredCategories = useMemo(() => {
    if (!searchQuery) return organizedVariables

    const query = searchQuery.toLowerCase()
    return organizedVariables
      .map((category) => ({
        ...category,
        items: category.items.filter((v) => {
          return v.name.toLowerCase().includes(query) || v.description?.toLowerCase().includes(query)
        }),
      }))
      .filter((c) => c.items.length > 0)
  }, [organizedVariables, searchQuery])

  const handleInsert = (varName: string) => {
    onInsertVariable(`{{${varName}}}`)
    toast.success(`Inserted {{${varName}}}`)
  }

  const handleCopy = (varName: string) => {
    navigator.clipboard.writeText(`{{${varName}}}`)
    setCopiedVariable(varName)
    setTimeout(() => setCopiedVariable(null), 2000)
    toast.success("Copied to clipboard")
  }

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  const handleOpenCreateDialog = () => {
    setEditingVariable(null)
    setVariableForm({ name: "", description: "", defaultValue: "", required: false })
    setShowVariableDialog(true)
  }

  const handleOpenEditDialog = (variable: TemplateVariable) => {
    setEditingVariable(variable)
    setVariableForm({
      name: variable.name,
      description: variable.description || "",
      defaultValue: variable.defaultValue || "",
      required: variable.required || false,
    })
    setShowVariableDialog(true)
  }

  const handleSaveVariable = () => {
    if (!variableForm.name.trim()) {
      toast.error("Variable name is required")
      return
    }

    // Validate variable name (alphanumeric and underscores only)
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(variableForm.name)) {
      toast.error("Variable name must start with a letter and contain only letters, numbers, and underscores")
      return
    }

    if (editingVariable && onUpdateVariable) {
      onUpdateVariable(editingVariable.id, variableForm)
      toast.success("Variable updated")
    } else if (onCreateVariable) {
      onCreateVariable(variableForm)
      toast.success("Variable created")
    }

    setShowVariableDialog(false)
  }

  const handleDeleteVariable = (variable: TemplateVariable) => {
    if (onDeleteVariable) {
      onDeleteVariable(variable.id)
      toast.success("Variable deleted")
    }
  }

  return (
    <>
      <div className={cn("flex flex-col h-full bg-background border-l border-border/50", className)}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Braces className="w-4 h-4 text-primary" />
            <h3 className="font-medium text-sm">Variables</h3>
            <Badge variant="secondary" className="text-xs">
              {variables.length}
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            {editable && onCreateVariable && (
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleOpenCreateDialog}>
                <Plus className="w-4 h-4" />
              </Button>
            )}
            {onClose && (
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="px-4 py-3 border-b border-border/50 flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search variables..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 text-sm bg-muted/50 border-border/50"
            />
          </div>
        </div>

        {/* Variable list */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            {filteredCategories.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <Braces className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-sm">No variables found</p>
                {editable && onCreateVariable && (
                  <Button variant="outline" size="sm" className="mt-4 bg-transparent" onClick={handleOpenCreateDialog}>
                    <Plus className="w-3 h-3 mr-2" />
                    Create Variable
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-1">
                {filteredCategories.map((category) => (
                  <Collapsible
                    key={category.id}
                    open={expandedCategories.includes(category.id) || !!searchQuery}
                    onOpenChange={() => toggleCategory(category.id)}
                  >
                    <CollapsibleTrigger asChild>
                      <button
                        className={cn(
                          "w-full flex items-center gap-2 px-2 py-2 rounded-lg text-sm",
                          "hover:bg-muted/50 transition-colors",
                          "text-left",
                        )}
                      >
                        <ChevronRight
                          className={cn(
                            "w-4 h-4 text-muted-foreground transition-transform",
                            (expandedCategories.includes(category.id) || searchQuery) && "rotate-90",
                          )}
                        />
                        <category.icon className="w-4 h-4 text-muted-foreground" />
                        <span className="flex-1 font-medium">{category.name}</span>
                        <Badge variant="secondary" className="text-[10px] h-5">
                          {category.items.length}
                        </Badge>
                      </button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="ml-6 pl-2 border-l border-border/50 space-y-0.5 py-1">
                        {category.items.map((variable) => {
                          const varName = variable.name
                          const varDescription = variable.description
                          const isCopied = copiedVariable === varName

                          return (
                            <div
                              key={varName}
                              className={cn(
                                "group flex items-center gap-2 px-2 py-1.5 rounded-lg",
                                "hover:bg-muted/50 transition-colors cursor-pointer",
                              )}
                              onClick={() => handleInsert(varName)}
                            >
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <code className="text-xs font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                                    {`{{${varName}}}`}
                                  </code>
                                  {variable.required && (
                                    <Badge variant="destructive" className="text-[9px] h-4 px-1">
                                      Required
                                    </Badge>
                                  )}
                                </div>
                                {varDescription && (
                                  <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{varDescription}</p>
                                )}
                              </div>
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleCopy(varName)
                                  }}
                                >
                                  {isCopied ? (
                                    <Check className="w-3 h-3 text-emerald-500" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </Button>
                                {editable && category.id === "custom" && onUpdateVariable && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleOpenEditDialog(variable)
                                    }}
                                  >
                                    <Edit2 className="w-3 h-3" />
                                  </Button>
                                )}
                                {editable && category.id === "custom" && onDeleteVariable && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-destructive"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleDeleteVariable(variable)
                                    }}
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleInsert(varName)
                                  }}
                                >
                                  <Plus className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Quick tip */}
        <div className="px-4 py-3 border-t border-border/50 bg-muted/30 flex-shrink-0">
          <p className="text-[11px] text-muted-foreground">
            Click a variable to insert at cursor{editable && ", or create custom variables for your needs"}.
          </p>
        </div>
      </div>

      <Dialog open={showVariableDialog} onOpenChange={setShowVariableDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingVariable ? "Edit Variable" : "Create Variable"}</DialogTitle>
            <DialogDescription>
              {editingVariable
                ? "Update the variable details below."
                : "Create a new custom variable for your template."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="var-name">Variable Name *</Label>
              <Input
                id="var-name"
                placeholder="e.g., customField"
                value={variableForm.name}
                onChange={(e) => setVariableForm({ ...variableForm, name: e.target.value })}
                disabled={!!editingVariable}
              />
              <p className="text-xs text-muted-foreground">
                Use in template as: {`{{${variableForm.name || "variableName"}}}`}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="var-description">Description</Label>
              <Textarea
                id="var-description"
                placeholder="Brief description of this variable"
                value={variableForm.description}
                onChange={(e) => setVariableForm({ ...variableForm, description: e.target.value })}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="var-default">Default Value</Label>
              <Input
                id="var-default"
                placeholder="Optional default value"
                value={variableForm.defaultValue}
                onChange={(e) => setVariableForm({ ...variableForm, defaultValue: e.target.value })}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="var-required"
                checked={variableForm.required}
                onChange={(e) => setVariableForm({ ...variableForm, required: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="var-required" className="text-sm font-normal">
                Required field
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowVariableDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveVariable}>{editingVariable ? "Update" : "Create"} Variable</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
