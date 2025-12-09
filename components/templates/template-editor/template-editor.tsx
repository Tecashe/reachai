// "use client"

// import { useState, useRef, useCallback, useTransition, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import {
//   ArrowLeft,
//   Save,
//   Braces,
//   Eye,
//   EyeOff,
//   Settings2,
//   Bold,
//   Italic,
//   Link,
//   List,
//   Heading,
//   Loader2,
//   Check,
// } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
// import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
// import { Separator } from "@/components/ui/separator"
// import { cn } from "@/lib/utils"
// import { EmailPreview } from "./email-preview"
// import { VariablePanel } from "./variable-panel"
// import type { EnhancedEmailTemplate, TemplateCategory, TemplateVariable } from "@/lib/types"
// import { updateTemplate, createTemplate } from "@/lib/actions/templates"
// import { toast } from "sonner"

// interface TemplateEditorProps {
//   template?: EnhancedEmailTemplate | null
//   categories: TemplateCategory[]
//   variables: TemplateVariable[]
//   mode: "create" | "edit"
// }

// // Default sample data for preview
// const DEFAULT_SAMPLE_DATA: Record<string, string> = {
//   firstName: "John",
//   lastName: "Doe",
//   email: "john@example.com",
//   fullName: "John Doe",
//   companyName: "Acme Inc",
//   currentDate: new Date().toLocaleDateString(),
//   currentMonth: new Date().toLocaleString("default", { month: "long" }),
//   currentYear: new Date().getFullYear().toString(),
// }

// export function TemplateEditor({ template, categories, variables, mode }: TemplateEditorProps) {
//   const router = useRouter()
//   const [isPending, startTransition] = useTransition()
//   const textareaRef = useRef<HTMLTextAreaElement>(null)

//   // Form state - use body instead of content
//   const [name, setName] = useState(template?.name || "")
//   const [subject, setSubject] = useState(template?.subject || "")
//   const [body, setBody] = useState(template?.body || "")
//   const [category, setCategory] = useState(template?.category || "")

//   // UI state
//   const [showPreview, setShowPreview] = useState(true)
//   const [showVariables, setShowVariables] = useState(true)
//   const [devicePreview, setDevicePreview] = useState<"desktop" | "tablet" | "mobile">("desktop")
//   const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
//   const [lastSaved, setLastSaved] = useState<Date | null>(null)

//   // Track changes
//   useEffect(() => {
//     if (mode === "edit" && template) {
//       const hasChanges =
//         name !== template.name ||
//         subject !== template.subject ||
//         body !== template.body ||
//         category !== template.category
//       setHasUnsavedChanges(hasChanges)
//     } else if (mode === "create") {
//       setHasUnsavedChanges(name || subject || body ? true : false)
//     }
//   }, [name, subject, body, category, template, mode])

//   // Insert variable at cursor position
//   const handleInsertVariable = useCallback(
//     (variable: string) => {
//       const textarea = textareaRef.current
//       if (!textarea) {
//         setBody((prev) => prev + variable)
//         return
//       }

//       const start = textarea.selectionStart
//       const end = textarea.selectionEnd
//       const newBody = body.substring(0, start) + variable + body.substring(end)
//       setBody(newBody)

//       // Restore cursor position after variable
//       setTimeout(() => {
//         textarea.focus()
//         textarea.setSelectionRange(start + variable.length, start + variable.length)
//       }, 0)
//     },
//     [body],
//   )

//   // Insert formatting
//   const handleInsertFormatting = (type: string) => {
//     const textarea = textareaRef.current
//     if (!textarea) return

//     const start = textarea.selectionStart
//     const end = textarea.selectionEnd
//     const selectedText = body.substring(start, end)

//     let newText = ""
//     switch (type) {
//       case "bold":
//         newText = `**${selectedText || "bold text"}**`
//         break
//       case "italic":
//         newText = `*${selectedText || "italic text"}*`
//         break
//       case "link":
//         newText = `[${selectedText || "link text"}](url)`
//         break
//       case "list":
//         newText = `\n- ${selectedText || "list item"}\n`
//         break
//       case "heading":
//         newText = `\n## ${selectedText || "Heading"}\n`
//         break
//       default:
//         return
//     }

//     const newBody = body.substring(0, start) + newText + body.substring(end)
//     setBody(newBody)

//     setTimeout(() => {
//       textarea.focus()
//       textarea.setSelectionRange(start + newText.length, start + newText.length)
//     }, 0)
//   }

//   // Save template - use body instead of content
//   const handleSave = async () => {
//     if (!name.trim()) {
//       toast.error("Please enter a template name")
//       return
//     }

//     startTransition(async () => {
//       if (mode === "edit" && template) {
//         const result = await updateTemplate(template.id, {
//           name,
//           subject,
//           body,
//           category,
//         })
//         if (result.error) {
//           toast.error(result.error)
//         } else {
//           toast.success("Template saved")
//           setLastSaved(new Date())
//           setHasUnsavedChanges(false)
//         }
//       } else {
//         const result = await createTemplate({
//           name,
//           subject,
//           body,
//           category,
//         })
//         if (result.error) {
//           toast.error(result.error)
//         } else {
//           toast.success("Template created")
//           router.push(`/dashboard/templates/${result.template?.id}/edit`)
//         }
//       }
//     })
//   }

//   return (
//     <div className="h-screen flex flex-col bg-background">
//       {/* Header */}
//       <header className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex-shrink-0">
//         <div className="flex items-center gap-3">
//           <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => router.push("/dashboard/templates")}>
//             <ArrowLeft className="w-4 h-4" />
//           </Button>
//           <Separator orientation="vertical" className="h-6" />
//           <div className="flex flex-col">
//             <h1 className="text-sm font-medium leading-tight">{mode === "edit" ? "Edit Template" : "New Template"}</h1>
//             {lastSaved && (
//               <span className="text-[11px] text-muted-foreground flex items-center gap-1">
//                 <Check className="w-3 h-3 text-emerald-500" />
//                 Saved {lastSaved.toLocaleTimeString()}
//               </span>
//             )}
//           </div>
//         </div>

//         <div className="flex items-center gap-2">
//           {/* Toggle buttons */}
//           <div className="hidden md:flex items-center gap-1 p-1 rounded-lg bg-muted/50">
//             <TooltipProvider>
//               <Tooltip>
//                 <TooltipTrigger asChild>
//                   <Button
//                     variant={showVariables ? "secondary" : "ghost"}
//                     size="icon"
//                     className="h-7 w-7"
//                     onClick={() => setShowVariables(!showVariables)}
//                   >
//                     <Braces className="w-4 h-4" />
//                   </Button>
//                 </TooltipTrigger>
//                 <TooltipContent>Variables panel</TooltipContent>
//               </Tooltip>
//             </TooltipProvider>

//             <TooltipProvider>
//               <Tooltip>
//                 <TooltipTrigger asChild>
//                   <Button
//                     variant={showPreview ? "secondary" : "ghost"}
//                     size="icon"
//                     className="h-7 w-7"
//                     onClick={() => setShowPreview(!showPreview)}
//                   >
//                     {showPreview ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
//                   </Button>
//                 </TooltipTrigger>
//                 <TooltipContent>Toggle preview</TooltipContent>
//               </Tooltip>
//             </TooltipProvider>
//           </div>

//           {/* Settings sheet for mobile */}
//           <Sheet>
//             <SheetTrigger asChild>
//               <Button variant="outline" size="icon" className="h-8 w-8 md:hidden bg-transparent">
//                 <Settings2 className="w-4 h-4" />
//               </Button>
//             </SheetTrigger>
//             <SheetContent side="right" className="w-80">
//               <SheetHeader>
//                 <SheetTitle>Template Settings</SheetTitle>
//               </SheetHeader>
//               <div className="mt-6 space-y-4">
//                 <div className="space-y-2">
//                   <Label>Name</Label>
//                   <Input value={name} onChange={(e) => setName(e.target.value)} />
//                 </div>
//                 <div className="space-y-2">
//                   <Label>Category</Label>
//                   <Select value={category} onValueChange={setCategory}>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select category" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {categories.map((cat) => (
//                         <SelectItem key={cat.id} value={cat.name}>
//                           {cat.name}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
//             </SheetContent>
//           </Sheet>

//           {/* Save button */}
//           <Button
//             onClick={handleSave}
//             disabled={isPending || !hasUnsavedChanges}
//             className={cn("h-8 px-4", hasUnsavedChanges && "shadow-lg shadow-primary/20")}
//           >
//             {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
//             {isPending ? "Saving..." : "Save"}
//           </Button>
//         </div>
//       </header>

//       {/* Main content */}
//       <div className="flex-1 flex overflow-hidden">
//         {/* Editor panel */}
//         <div className="flex-1 flex flex-col min-w-0">
//           {/* Template settings bar */}
//           <div className="flex items-center gap-4 px-4 py-3 border-b border-border/50 bg-muted/30 flex-shrink-0">
//             <div className="flex-1 min-w-0">
//               <Input
//                 placeholder="Template name"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 className="h-9 font-medium bg-background/50 border-border/50 focus:bg-background"
//               />
//             </div>
//             <div className="hidden md:block w-48">
//               <Select value={category} onValueChange={setCategory}>
//                 <SelectTrigger className="h-9 bg-background/50 border-border/50">
//                   <SelectValue placeholder="Category" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {categories.map((cat) => (
//                     <SelectItem key={cat.id} value={cat.name}>
//                       {cat.name}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           {/* Subject line */}
//           <div className="px-4 py-3 border-b border-border/50 flex-shrink-0">
//             <div className="flex items-center gap-3">
//               <Label className="text-sm text-muted-foreground w-16 flex-shrink-0">Subject</Label>
//               <Input
//                 placeholder="Enter email subject line..."
//                 value={subject}
//                 onChange={(e) => setSubject(e.target.value)}
//                 className="h-9 bg-background/50 border-border/50 focus:bg-background"
//               />
//             </div>
//           </div>

//           {/* Formatting toolbar */}
//           <div className="flex items-center gap-1 px-4 py-2 border-b border-border/50 bg-muted/20 flex-shrink-0">
//             <TooltipProvider>
//               <Tooltip>
//                 <TooltipTrigger asChild>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="h-7 w-7"
//                     onClick={() => handleInsertFormatting("bold")}
//                   >
//                     <Bold className="w-4 h-4" />
//                   </Button>
//                 </TooltipTrigger>
//                 <TooltipContent>Bold</TooltipContent>
//               </Tooltip>
//             </TooltipProvider>

//             <TooltipProvider>
//               <Tooltip>
//                 <TooltipTrigger asChild>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="h-7 w-7"
//                     onClick={() => handleInsertFormatting("italic")}
//                   >
//                     <Italic className="w-4 h-4" />
//                   </Button>
//                 </TooltipTrigger>
//                 <TooltipContent>Italic</TooltipContent>
//               </Tooltip>
//             </TooltipProvider>

//             <Separator orientation="vertical" className="h-5 mx-1" />

//             <TooltipProvider>
//               <Tooltip>
//                 <TooltipTrigger asChild>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="h-7 w-7"
//                     onClick={() => handleInsertFormatting("heading")}
//                   >
//                     <Heading className="w-4 h-4" />
//                   </Button>
//                 </TooltipTrigger>
//                 <TooltipContent>Heading</TooltipContent>
//               </Tooltip>
//             </TooltipProvider>

//             <TooltipProvider>
//               <Tooltip>
//                 <TooltipTrigger asChild>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="h-7 w-7"
//                     onClick={() => handleInsertFormatting("list")}
//                   >
//                     <List className="w-4 h-4" />
//                   </Button>
//                 </TooltipTrigger>
//                 <TooltipContent>List</TooltipContent>
//               </Tooltip>
//             </TooltipProvider>

//             <TooltipProvider>
//               <Tooltip>
//                 <TooltipTrigger asChild>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="h-7 w-7"
//                     onClick={() => handleInsertFormatting("link")}
//                   >
//                     <Link className="w-4 h-4" />
//                   </Button>
//                 </TooltipTrigger>
//                 <TooltipContent>Link</TooltipContent>
//               </Tooltip>
//             </TooltipProvider>

//             <div className="flex-1" />

//             {/* Mobile toggle for variables */}
//             <Button
//               variant="ghost"
//               size="sm"
//               className="h-7 md:hidden"
//               onClick={() => setShowVariables(!showVariables)}
//             >
//               <Braces className="w-4 h-4 mr-1.5" />
//               Variables
//             </Button>
//           </div>

//           {/* Content textarea */}
//           <div className="flex-1 overflow-hidden">
//             <Textarea
//               ref={textareaRef}
//               placeholder="Write your email content here...

// Use {{firstName}} syntax to insert dynamic variables.
// The preview will update as you type."
//               value={body}
//               onChange={(e) => setBody(e.target.value)}
//               className={cn(
//                 "h-full resize-none rounded-none border-0 p-4",
//                 "focus-visible:ring-0 focus-visible:ring-offset-0",
//                 "font-mono text-sm leading-relaxed",
//                 "bg-background",
//               )}
//             />
//           </div>
//         </div>

//         {/* Variables panel */}
//         {showVariables && (
//           <div className="hidden md:block w-64 flex-shrink-0">
//             <VariablePanel variables={variables} onInsertVariable={handleInsertVariable} />
//           </div>
//         )}

//         {/* Mobile variables sheet */}
//         {showVariables && (
//           <Sheet open={showVariables} onOpenChange={setShowVariables}>
//             <SheetContent side="right" className="w-80 p-0 md:hidden">
//               <VariablePanel
//                 variables={variables}
//                 onInsertVariable={handleInsertVariable}
//                 onClose={() => setShowVariables(false)}
//               />
//             </SheetContent>
//           </Sheet>
//         )}

//         {/* Preview panel */}
//         {showPreview && (
//           <div className="hidden lg:block w-[45%] flex-shrink-0 border-l border-border/50">
//             <EmailPreview
//               subject={subject}
//               content={body}
//               sampleData={DEFAULT_SAMPLE_DATA}
//               devicePreview={devicePreview}
//               onDeviceChange={setDevicePreview}
//             />
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

"use client"

import { useState, useRef, useCallback, useTransition, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Save,
  Eye,
  EyeOff,
  Bold,
  Italic,
  Link,
  List,
  Heading,
  Loader2,
  Check,
  Command,
  Sparkles,
  Monitor,
  Tablet,
  Smartphone,
  Search,
  User,
  Building,
  Calendar,
  Hash,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import type { EnhancedEmailTemplate, TemplateCategory, TemplateVariable } from "@/lib/types"
import { updateTemplate, createTemplate } from "@/lib/actions/templates"
import { toast } from "sonner"

interface TemplateEditorProps {
  template?: EnhancedEmailTemplate | null
  categories: TemplateCategory[]
  variables: TemplateVariable[]
  mode: "create" | "edit"
}

const DEFAULT_SAMPLE_DATA: Record<string, string> = {
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  fullName: "John Doe",
  companyName: "Acme Inc",
  currentDate: new Date().toLocaleDateString(),
  currentMonth: new Date().toLocaleString("default", { month: "long" }),
  currentYear: new Date().getFullYear().toString(),
}

const VARIABLE_CATEGORIES = [
  { id: "contact", name: "Contact", icon: User, variables: ["firstName", "lastName", "email", "phone", "fullName"] },
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
  { id: "custom", name: "Custom", icon: Hash, variables: [] },
]

export function TemplateEditor({ template, categories, variables, mode }: TemplateEditorProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const commandPaletteRef = useRef<HTMLDivElement>(null)

  // Form state
  const [name, setName] = useState(template?.name || "")
  const [subject, setSubject] = useState(template?.subject || "")
  const [body, setBody] = useState(template?.body || "")
  const [category, setCategory] = useState(template?.category || "")

  // UI state
  const [showPreview, setShowPreview] = useState(false)
  const [devicePreview, setDevicePreview] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  // Command palette state
  const [showCommandPalette, setShowCommandPalette] = useState(false)
  const [commandSearch, setCommandSearch] = useState("")
  const [selectedCommandIndex, setSelectedCommandIndex] = useState(0)

  // Floating toolbar state
  const [showFloatingToolbar, setShowFloatingToolbar] = useState(false)
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 })
  const [hasSelection, setHasSelection] = useState(false)

  // Track changes
  useEffect(() => {
    if (mode === "edit" && template) {
      const hasChanges =
        name !== template.name ||
        subject !== template.subject ||
        body !== template.body ||
        category !== template.category
      setHasUnsavedChanges(hasChanges)
    } else if (mode === "create") {
      setHasUnsavedChanges(!!(name || subject || body))
    }
  }, [name, subject, body, category, template, mode])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + J for command palette
      if ((e.metaKey || e.ctrlKey) && e.key === "j") {
        e.preventDefault()
        setShowCommandPalette(true)
        setCommandSearch("")
        setSelectedCommandIndex(0)
      }
      // Escape to close
      if (e.key === "Escape") {
        setShowCommandPalette(false)
        setShowFloatingToolbar(false)
      }
      // Cmd/Ctrl + S to save
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault()
        handleSave()
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Handle text selection for floating toolbar
  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection()
      const textarea = textareaRef.current
      if (!textarea || !selection) return

      const start = textarea.selectionStart
      const end = textarea.selectionEnd

      if (start !== end && document.activeElement === textarea) {
        setHasSelection(true)
        // Position toolbar above selection
        const rect = textarea.getBoundingClientRect()
        setToolbarPosition({
          top: rect.top - 50,
          left: rect.left + rect.width / 2 - 100,
        })
        setShowFloatingToolbar(true)
      } else {
        setHasSelection(false)
        setShowFloatingToolbar(false)
      }
    }

    document.addEventListener("selectionchange", handleSelectionChange)
    return () => document.removeEventListener("selectionchange", handleSelectionChange)
  }, [])

  // Filter variables for command palette
  const filteredVariables = useMemo(() => {
    const query = commandSearch.toLowerCase()
    return variables.filter((v) => v.name.toLowerCase().includes(query) || v.description?.toLowerCase().includes(query))
  }, [variables, commandSearch])

  // Navigate command palette with keyboard
  useEffect(() => {
    if (!showCommandPalette) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedCommandIndex((i) => Math.min(i + 1, filteredVariables.length - 1))
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedCommandIndex((i) => Math.max(i - 1, 0))
      } else if (e.key === "Enter") {
        e.preventDefault()
        if (filteredVariables[selectedCommandIndex]) {
          handleInsertVariable(`{{${filteredVariables[selectedCommandIndex].name}}}`)
          setShowCommandPalette(false)
        }
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [showCommandPalette, selectedCommandIndex, filteredVariables])

  // Insert variable at cursor
  const handleInsertVariable = useCallback(
    (variable: string) => {
      const textarea = textareaRef.current
      if (!textarea) {
        setBody((prev) => prev + variable)
        return
      }
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newBody = body.substring(0, start) + variable + body.substring(end)
      setBody(newBody)
      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(start + variable.length, start + variable.length)
      }, 0)
    },
    [body],
  )

  // Insert formatting
  const handleInsertFormatting = (type: string) => {
    const textarea = textareaRef.current
    if (!textarea) return
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = body.substring(start, end)

    let newText = ""
    switch (type) {
      case "bold":
        newText = `**${selectedText || "bold text"}**`
        break
      case "italic":
        newText = `*${selectedText || "italic text"}*`
        break
      case "link":
        newText = `[${selectedText || "link text"}](url)`
        break
      case "list":
        newText = `\n- ${selectedText || "list item"}\n`
        break
      case "heading":
        newText = `\n## ${selectedText || "Heading"}\n`
        break
      default:
        return
    }

    const newBody = body.substring(0, start) + newText + body.substring(end)
    setBody(newBody)
    setShowFloatingToolbar(false)
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + newText.length, start + newText.length)
    }, 0)
  }

  // Save template
  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Please enter a template name")
      return
    }
    startTransition(async () => {
      if (mode === "edit" && template) {
        const result = await updateTemplate(template.id, { name, subject, body, category })
        if (result.error) {
          toast.error(result.error)
        } else {
          toast.success("Template saved")
          setLastSaved(new Date())
          setHasUnsavedChanges(false)
        }
      } else {
        const result = await createTemplate({ name, subject, body, category })
        if (result.error) {
          toast.error(result.error)
        } else {
          toast.success("Template created")
          router.push(`/dashboard/templates/${result.template?.id}/edit`)
        }
      }
    })
  }

  // Process content for preview
  const processedContent = useMemo(() => {
    if (!body) return ""
    return body.replace(/\{\{(\w+)\}\}/g, (_, varName) => DEFAULT_SAMPLE_DATA[varName] || `[${varName}]`)
  }, [body])

  const processedSubject = useMemo(() => {
    if (!subject) return "No subject"
    return subject.replace(/\{\{(\w+)\}\}/g, (_, varName) => DEFAULT_SAMPLE_DATA[varName] || `[${varName}]`)
  }, [subject])

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Minimal Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border/50 glass-liquid flex-shrink-0">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full hover:bg-muted"
            onClick={() => router.push("/dashboard/templates")}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>

          <div className="flex items-center gap-3">
            <Input
              placeholder="Untitled template"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-9 w-64 bg-transparent border-none text-base font-medium focus-visible:ring-0 focus-visible:ring-offset-0 px-0 placeholder:text-muted-foreground/50"
            />
            {lastSaved && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Check className="w-3 h-3 text-success" />
                Saved
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Category selector */}
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="h-9 w-36 bg-muted/50 border-border/50">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.name}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Separator orientation="vertical" className="h-6" />

          {/* Variable shortcut hint */}
          <button
            onClick={() => setShowCommandPalette(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 hover:bg-muted text-xs text-muted-foreground transition-colors"
          >
            <Command className="w-3 h-3" />
            <span>J</span>
            <span className="text-foreground/60">Variables</span>
          </button>

          {/* Preview toggle */}
          <Button
            variant={showPreview ? "secondary" : "ghost"}
            size="sm"
            className="h-9 gap-2"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            Preview
          </Button>

          {/* Save button */}
          <Button
            onClick={handleSave}
            disabled={isPending || !hasUnsavedChanges}
            className={cn("h-9 px-5 btn-press", hasUnsavedChanges && "shadow-lg shadow-primary/20")}
          >
            {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            {isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor panel */}
        <div
          className={cn("flex-1 flex flex-col min-w-0 transition-all duration-300", showPreview ? "w-1/2" : "w-full")}
        >
          {/* Subject line - clean inline input */}
          <div className="px-8 py-4 border-b border-border/30">
            <div className="flex items-center gap-3 max-w-3xl mx-auto">
              <span className="text-sm text-muted-foreground font-medium">Subject</span>
              <Input
                placeholder="Enter your email subject line..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="flex-1 h-10 bg-transparent border-none text-base focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
              />
            </div>
          </div>

          {/* Content textarea - full focus */}
          <div className="flex-1 overflow-hidden relative">
            <Textarea
              ref={textareaRef}
              placeholder="Start writing your email...

Type / or press ⌘J to insert variables like {{firstName}}"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "/" && !e.shiftKey) {
                  e.preventDefault()
                  setShowCommandPalette(true)
                  setCommandSearch("")
                  setSelectedCommandIndex(0)
                }
              }}
              className={cn(
                "h-full w-full resize-none rounded-none border-0 p-8",
                "focus-visible:ring-0 focus-visible:ring-offset-0",
                "text-base leading-relaxed",
                "bg-transparent",
                "max-w-3xl mx-auto",
              )}
            />
          </div>
        </div>

        {/* Preview panel - slides in */}
        <div
          className={cn(
            "border-l border-border/50 bg-muted/20 transition-all duration-300 overflow-hidden",
            showPreview ? "w-1/2 opacity-100" : "w-0 opacity-0",
          )}
        >
          {showPreview && (
            <div className="h-full flex flex-col">
              {/* Preview header */}
              <div className="flex items-center justify-between px-6 py-3 border-b border-border/50">
                <span className="text-sm text-muted-foreground">Live Preview</span>
                <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/50">
                  {[
                    { value: "desktop", icon: Monitor },
                    { value: "tablet", icon: Tablet },
                    { value: "mobile", icon: Smartphone },
                  ].map(({ value, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => setDevicePreview(value as typeof devicePreview)}
                      className={cn(
                        "p-1.5 rounded-md transition-colors",
                        devicePreview === value ? "bg-background shadow-sm" : "hover:bg-muted",
                      )}
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview content */}
              <div className="flex-1 overflow-auto p-6">
                <div
                  className={cn(
                    "mx-auto transition-all duration-300",
                    devicePreview === "mobile" && "max-w-[375px]",
                    devicePreview === "tablet" && "max-w-[600px]",
                    devicePreview === "desktop" && "max-w-[700px]",
                  )}
                >
                  {/* Email frame */}
                  <div className="bg-background rounded-xl shadow-layered-lg border border-border overflow-hidden">
                    {/* Email header */}
                    <div className="px-5 py-4 border-b border-border/50 bg-muted/30">
                      <p className="text-sm font-medium">{processedSubject}</p>
                      <p className="text-xs text-muted-foreground mt-1">From: Your Company</p>
                    </div>
                    {/* Email body */}
                    <div className="p-6 min-h-[200px]">
                      {processedContent ? (
                        <div className="whitespace-pre-wrap text-sm leading-relaxed">{processedContent}</div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                          <Eye className="w-6 h-6 mb-2 opacity-50" />
                          <p className="text-sm">Start typing to see preview</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating formatting toolbar */}
      {showFloatingToolbar && hasSelection && (
        <div
          style={{ top: toolbarPosition.top, left: toolbarPosition.left }}
          className="fixed z-50 flex items-center gap-1 px-2 py-1.5 rounded-lg glass-strong shadow-layered-lg animate-in fade-in-0 zoom-in-95 duration-150"
        >
          {[
            { type: "bold", icon: Bold },
            { type: "italic", icon: Italic },
            { type: "link", icon: Link },
            { type: "heading", icon: Heading },
            { type: "list", icon: List },
          ].map(({ type, icon: Icon }) => (
            <button
              key={type}
              onClick={() => handleInsertFormatting(type)}
              className="p-1.5 rounded hover:bg-muted/50 transition-colors"
            >
              <Icon className="w-4 h-4" />
            </button>
          ))}
        </div>
      )}

      {/* Command palette for variables */}
      {showCommandPalette && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setShowCommandPalette(false)}
          />
          <div
            ref={commandPaletteRef}
            className="fixed top-1/4 left-1/2 -translate-x-1/2 w-full max-w-lg z-50 animate-in fade-in-0 slide-in-from-top-4 duration-200"
          >
            <div className="glass-strong rounded-xl shadow-layered-lg overflow-hidden">
              {/* Search input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border/50">
                <Search className="w-5 h-5 text-muted-foreground" />
                <input
                  autoFocus
                  placeholder="Search variables..."
                  value={commandSearch}
                  onChange={(e) => {
                    setCommandSearch(e.target.value)
                    setSelectedCommandIndex(0)
                  }}
                  className="flex-1 bg-transparent border-none outline-none text-base placeholder:text-muted-foreground/50"
                />
                <kbd className="px-2 py-0.5 rounded bg-muted text-xs text-muted-foreground">esc</kbd>
              </div>

              {/* Variable list */}
              <div className="max-h-80 overflow-auto p-2">
                {filteredVariables.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No variables found</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filteredVariables.map((variable, index) => (
                      <button
                        key={variable.name}
                        onClick={() => {
                          handleInsertVariable(`{{${variable.name}}}`)
                          setShowCommandPalette(false)
                        }}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors",
                          index === selectedCommandIndex ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                        )}
                      >
                        <code
                          className={cn(
                            "text-xs font-mono px-2 py-0.5 rounded",
                            index === selectedCommandIndex ? "bg-primary-foreground/20" : "bg-primary/10 text-primary",
                          )}
                        >
                          {`{{${variable.name}}}`}
                        </code>
                        <span className="flex-1 text-sm truncate">{variable.description || variable.name}</span>
                        <ChevronRight className="w-4 h-4 opacity-50" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer hint */}
              <div className="px-4 py-2 border-t border-border/50 bg-muted/30">
                <p className="text-xs text-muted-foreground">
                  <kbd className="px-1 py-0.5 rounded bg-muted text-[10px] mr-1">↑↓</kbd> navigate
                  <kbd className="px-1 py-0.5 rounded bg-muted text-[10px] mx-1">↵</kbd> insert
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
