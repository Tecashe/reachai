"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, FileText, Save, Loader2 } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { updateTemplate } from "@/lib/actions/templates"
import { useRouter } from 'next/navigation'

interface VisualTemplateEditorProps {
  template: any
}

export function VisualTemplateEditor({ template }: VisualTemplateEditorProps) {
  const [name, setName] = useState(template.name)
  const [description, setDescription] = useState(template.description || '')
  const [subject, setSubject] = useState(template.subject)
  const [body, setBody] = useState(template.body)
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit')
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleSave = async () => {
    setIsSaving(true)

    try {
      const result = await updateTemplate(template.id, {
        name,
        subject,
        body
      })

      if (!result.success) {
        throw new Error(result.error)
      }

      toast({
        title: "Template saved",
        description: "Your template has been updated successfully"
      })

      router.push("/dashboard/templates")
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

  const renderEmailPreview = () => {
    return (
      <div className="max-w-2xl mx-auto">
        {/* Email Container */}
        <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
          {/* Email Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-white">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-medium opacity-90">From: you@yourcompany.com</div>
              <div className="text-xs opacity-90">To: recipient@email.com</div>
            </div>
            <div className="text-sm font-semibold">
              Subject: {subject}
            </div>
          </div>

          {/* Email Body */}
          <div 
            className="px-8 py-6 prose prose-sm max-w-none"
            style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
              lineHeight: '1.6',
              color: '#374151'
            }}
            dangerouslySetInnerHTML={{ __html: body }}
          />

          {/* Email Footer */}
          <div className="bg-gray-50 px-8 py-4 border-t text-center">
            <p className="text-xs text-gray-500">
              This is a preview of how your email will appear to recipients
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList>
            <TabsTrigger value="edit">
              <FileText className="mr-2 h-4 w-4" />
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

      {activeTab === 'edit' ? (
        <Card>
          <CardHeader>
            <CardTitle>Template Editor</CardTitle>
            <CardDescription>
              Customize your template content and personalization variables
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Template Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Amazing Template"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of when to use this template"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Email Subject</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Subject line with {{variables}}"
              />
              <p className="text-xs text-muted-foreground">
                Use {'{{variableName}}'} for personalization
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="body">Email Body (HTML)</Label>
              <Textarea
                id="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Email body with HTML formatting..."
                className="font-mono text-sm min-h-[400px]"
              />
              <p className="text-xs text-muted-foreground">
                You can use HTML tags and {'{{variables}}'} for personalization
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Email Preview</CardTitle>
            <CardDescription>
              This is how your email will appear to recipients
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {renderEmailPreview()}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
