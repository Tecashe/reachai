"use client"

import { useState, useMemo } from "react"
import { Search, Copy, Check, Plus, Braces, User, Building, Calendar, Link, Hash, X, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import type { TemplateVariable } from "@/lib/types"

interface VariablePanelProps {
  variables: TemplateVariable[]
  onInsertVariable: (variable: string) => void
  onClose?: () => void
  className?: string
}

// Group variables by category
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

export function VariablePanel({ variables, onInsertVariable, onClose, className }: VariablePanelProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [copiedVariable, setCopiedVariable] = useState<string | null>(null)
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["contact", "company"])

  // Organize variables into categories
  const organizedVariables = useMemo(() => {
    const result = VARIABLE_CATEGORIES.map((category) => {
      const categoryVars = variables.filter((v) => {
        return category.variables.includes(v.name)
      })

      // Add any remaining variables to custom category
      if (category.id === "custom") {
        const usedVars = VARIABLE_CATEGORIES.flatMap((c) => c.variables)
        const customVars = variables.filter((v) => !usedVars.includes(v.name))
        return { ...category, items: customVars }
      }

      return { ...category, items: categoryVars }
    })

    return result.filter((c) => c.items.length > 0)
  }, [variables])

  // Filter variables based on search
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
  }

  const handleCopy = (varName: string) => {
    navigator.clipboard.writeText(`{{${varName}}}`)
    setCopiedVariable(varName)
    setTimeout(() => setCopiedVariable(null), 2000)
  }

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  return (
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
        {onClose && (
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        )}
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
          Click a variable to insert at cursor, or drag and drop into the editor.
        </p>
      </div>
    </div>
  )
}
