"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Loader2 } from "lucide-react"
import { createTemplate } from "@/lib/actions/templates"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function CreateTemplateDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const subject = formData.get("subject") as string
    const body = formData.get("body") as string
    const category = formData.get("category") as string

    try {
      const result = await createTemplate({
        name,
        subject,
        body,
        category,
        variables: [],
      })

      if (result.success) {
        toast.success("Template created successfully")
        setOpen(false)
        router.refresh()
      } else {
        toast.error(result.error || "Failed to create template")
      }
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Template
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Email Template</DialogTitle>
            <DialogDescription>Create a reusable email template with variables</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Template Name</Label>
              <Input id="name" name="name" placeholder="Cold Outreach Template" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select name="category" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="COLD_OUTREACH">Cold Outreach</SelectItem>
                  <SelectItem value="FOLLOW_UP">Follow Up</SelectItem>
                  <SelectItem value="MEETING_REQUEST">Meeting Request</SelectItem>
                  <SelectItem value="INTRODUCTION">Introduction</SelectItem>
                  <SelectItem value="THANK_YOU">Thank You</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subject">Subject Line</Label>
              <Input id="subject" name="subject" placeholder="Quick question about {{company}}" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="body">Email Body</Label>
              <Textarea
                id="body"
                name="body"
                placeholder="Hi {{firstName}},&#10;&#10;I noticed that {{company}} is..."
                rows={8}
                required
              />
              <p className="text-xs text-muted-foreground">
                Use variables like {`{{firstName}}`}, {`{{company}}`}, {`{{role}}`} for personalization
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Template
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
