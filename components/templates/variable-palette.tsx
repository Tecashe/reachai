"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  User,
  Building2,
  Briefcase,
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  Link2,
  Sparkles,
  Plus,
  GripVertical,
} from "lucide-react"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Variable {
  name: string
  label: string
  icon: any
  example: string
  category: "prospect" | "company" | "custom" | "booking"
}

const defaultVariables: Variable[] = [
  // Prospect Variables
  { name: "firstName", label: "First Name", icon: User, example: "John", category: "prospect" },
  { name: "lastName", label: "Last Name", icon: User, example: "Doe", category: "prospect" },
  { name: "fullName", label: "Full Name", icon: User, example: "John Doe", category: "prospect" },
  { name: "email", label: "Email", icon: Mail, example: "john@example.com", category: "prospect" },
  { name: "phone", label: "Phone", icon: Phone, example: "+1234567890", category: "prospect" },
  { name: "jobTitle", label: "Job Title", icon: Briefcase, example: "CEO", category: "prospect" },
  { name: "location", label: "Location", icon: MapPin, example: "San Francisco", category: "prospect" },

  // Company Variables
  { name: "company", label: "Company Name", icon: Building2, example: "Acme Inc", category: "company" },
  { name: "companyWebsite", label: "Company Website", icon: Globe, example: "acme.com", category: "company" },
  { name: "industry", label: "Industry", icon: Building2, example: "SaaS", category: "company" },
  { name: "companySize", label: "Company Size", icon: Building2, example: "50-200", category: "company" },
]

interface VariablePaletteProps {
  onInsertVariable: (variable: string) => void
  customVariables?: Array<{ name: string; label: string; value: string }>
  onAddCustomVariable?: (variable: { name: string; label: string; value: string }) => void
}

export function VariablePalette({ onInsertVariable, customVariables = [], onAddCustomVariable }: VariablePaletteProps) {
  const [calendlyUrl, setCalendlyUrl] = useState("")
  const [customVarName, setCustomVarName] = useState("")
  const [customVarLabel, setCustomVarLabel] = useState("")
  const [customVarValue, setCustomVarValue] = useState("")
  const [addCustomOpen, setAddCustomOpen] = useState(false)
  const [addCalendlyOpen, setAddCalendlyOpen] = useState(false)

  const handleDragStart = (e: React.DragEvent, variableName: string) => {
    e.dataTransfer.setData("text/plain", `{{${variableName}}}`)
    e.dataTransfer.effectAllowed = "copy"
  }

  const handleAddCustomVariable = () => {
    if (customVarName && customVarLabel && onAddCustomVariable) {
      onAddCustomVariable({
        name: customVarName,
        label: customVarLabel,
        value: customVarValue || `{{${customVarName}}}`,
      })
      setCustomVarName("")
      setCustomVarLabel("")
      setCustomVarValue("")
      setAddCustomOpen(false)
    }
  }

  const handleAddCalendly = () => {
    if (calendlyUrl && onAddCustomVariable) {
      onAddCustomVariable({
        name: "calendlyLink",
        label: "Calendly Booking Link",
        value: calendlyUrl,
      })
      setCalendlyUrl("")
      setAddCalendlyOpen(false)
    }
  }

  const VariableCard = ({ variable, isDraggable = true }: { variable: Variable; isDraggable?: boolean }) => {
    const Icon = variable.icon
    return (
      <div
        draggable={isDraggable}
        onDragStart={isDraggable ? (e) => handleDragStart(e, variable.name) : undefined}
        onClick={() => onInsertVariable(variable.name)}
        className="group flex items-center gap-3 p-3 bg-card border rounded-lg cursor-pointer hover:bg-accent hover:border-primary/50 transition-all"
      >
        {isDraggable && <GripVertical className="h-4 w-4 text-muted-foreground group-hover:text-primary" />}
        <div className="flex-shrink-0 p-2 bg-primary/10 rounded-md">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm">{variable.label}</p>
          <p className="text-xs text-muted-foreground truncate">{`{{${variable.name}}}`}</p>
        </div>
        <div className="text-xs text-muted-foreground hidden sm:block">{variable.example}</div>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Variables
        </CardTitle>
        <CardDescription>
          Drag and drop variables into your email, or click to insert at cursor position
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="prospect">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="prospect">Prospect</TabsTrigger>
            <TabsTrigger value="company">Company</TabsTrigger>
            <TabsTrigger value="booking">Booking</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
          </TabsList>

          <TabsContent value="prospect" className="space-y-2">
            <ScrollArea className="h-[400px] pr-4">
              {defaultVariables
                .filter((v) => v.category === "prospect")
                .map((variable) => (
                  <div key={variable.name} className="mb-2">
                    <VariableCard variable={variable} />
                  </div>
                ))}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="company" className="space-y-2">
            <ScrollArea className="h-[400px] pr-4">
              {defaultVariables
                .filter((v) => v.category === "company")
                .map((variable) => (
                  <div key={variable.name} className="mb-2">
                    <VariableCard variable={variable} />
                  </div>
                ))}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="booking" className="space-y-3">
            <div className="p-4 bg-muted/50 rounded-lg space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <h4 className="font-medium">Calendar Booking Links</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Add your Calendly or other booking links that prospects can use to schedule calls with you.
              </p>
            </div>

            <Dialog open={addCalendlyOpen} onOpenChange={setAddCalendlyOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full bg-transparent">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Booking Link
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Booking Link</DialogTitle>
                  <DialogDescription>Add your Calendly, Cal.com, or other booking link</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="calendly-url">Booking URL</Label>
                    <Input
                      id="calendly-url"
                      placeholder="https://calendly.com/your-name/30min"
                      value={calendlyUrl}
                      onChange={(e) => setCalendlyUrl(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      This will be inserted as a clickable link in your emails
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAddCalendly} disabled={!calendlyUrl}>
                      Add Link
                    </Button>
                    <Button variant="outline" onClick={() => setAddCalendlyOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <ScrollArea className="h-[300px] pr-4">
              {customVariables
                .filter((v) => v.name === "calendlyLink")
                .map((variable, index) => (
                  <div key={index} className="mb-2">
                    <div
                      draggable
                      onDragStart={(e) => handleDragStart(e, variable.name)}
                      onClick={() => onInsertVariable(variable.name)}
                      className="group flex items-center gap-3 p-3 bg-card border rounded-lg cursor-pointer hover:bg-accent hover:border-primary/50 transition-all"
                    >
                      <GripVertical className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                      <div className="flex-shrink-0 p-2 bg-primary/10 rounded-md">
                        <Calendar className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{variable.label}</p>
                        <p className="text-xs text-muted-foreground truncate">{variable.value}</p>
                      </div>
                    </div>
                  </div>
                ))}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="custom" className="space-y-3">
            <div className="p-4 bg-muted/50 rounded-lg space-y-3">
              <div className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                <h4 className="font-medium">Custom Variables</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Create your own custom variables for links, text snippets, or any reusable content.
              </p>
            </div>

            <Dialog open={addCustomOpen} onOpenChange={setAddCustomOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full bg-transparent">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Custom Variable
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Custom Variable</DialogTitle>
                  <DialogDescription>Define a custom variable to reuse across your templates</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="var-name">Variable Name</Label>
                    <Input
                      id="var-name"
                      placeholder="e.g., meetingLink, signature, caseStudy"
                      value={customVarName}
                      onChange={(e) => setCustomVarName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="var-label">Display Label</Label>
                    <Input
                      id="var-label"
                      placeholder="e.g., Meeting Link, Email Signature"
                      value={customVarLabel}
                      onChange={(e) => setCustomVarLabel(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="var-value">Value (Optional)</Label>
                    <Input
                      id="var-value"
                      placeholder="URL, text, or leave empty for dynamic value"
                      value={customVarValue}
                      onChange={(e) => setCustomVarValue(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      If left empty, it will use {`{{variableName}}`} syntax
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAddCustomVariable} disabled={!customVarName || !customVarLabel}>
                      Create Variable
                    </Button>
                    <Button variant="outline" onClick={() => setAddCustomOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <ScrollArea className="h-[300px] pr-4">
              {customVariables
                .filter((v) => v.name !== "calendlyLink")
                .map((variable, index) => (
                  <div key={index} className="mb-2">
                    <div
                      draggable
                      onDragStart={(e) => handleDragStart(e, variable.name)}
                      onClick={() => onInsertVariable(variable.name)}
                      className="group flex items-center gap-3 p-3 bg-card border rounded-lg cursor-pointer hover:bg-accent hover:border-primary/50 transition-all"
                    >
                      <GripVertical className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                      <div className="flex-shrink-0 p-2 bg-primary/10 rounded-md">
                        <Link2 className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{variable.label}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {variable.value || `{{${variable.name}}}`}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
