// "use client"

// import type React from "react"
// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Loader2 } from "lucide-react"
// import { createTemplate } from "@/lib/actions/templates"
// import { useRouter } from "next/navigation"
// import { toast } from "sonner"

// export function CreateTemplateForm() {
//   const [loading, setLoading] = useState(false)
//   const router = useRouter()

//   async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
//     e.preventDefault()
//     setLoading(true)

//     const formData = new FormData(e.currentTarget)
//     const name = formData.get("name") as string
//     const subject = formData.get("subject") as string
//     const body = formData.get("body") as string
//     const category = formData.get("category") as string

//     try {
//       const result = await createTemplate({
//         name,
//         subject,
//         body,
//         category,
//         variables: [],
//       })

//       if (result.success) {
//         toast.success("Template created successfully")
//         router.push("/dashboard/templates")
//       } else {
//         toast.error(result.error || "Failed to create template")
//       }
//     } catch (error) {
//       toast.error("An error occurred")
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       <div className="grid gap-2">
//         <Label htmlFor="name">Template Name</Label>
//         <Input id="name" name="name" placeholder="Cold Outreach Template" required />
//       </div>
//       <div className="grid gap-2">
//         <Label htmlFor="category">Category</Label>
//         <Select name="category" required>
//           <SelectTrigger>
//             <SelectValue placeholder="Select category" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="COLD_OUTREACH">Cold Outreach</SelectItem>
//             <SelectItem value="FOLLOW_UP">Follow Up</SelectItem>
//             <SelectItem value="MEETING_REQUEST">Meeting Request</SelectItem>
//             <SelectItem value="INTRODUCTION">Introduction</SelectItem>
//             <SelectItem value="THANK_YOU">Thank You</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>
//       <div className="grid gap-2">
//         <Label htmlFor="subject">Subject Line</Label>
//         <Input id="subject" name="subject" placeholder="Quick question about {{company}}" required />
//       </div>
//       <div className="grid gap-2">
//         <Label htmlFor="body">Email Body</Label>
//         <Textarea
//           id="body"
//           name="body"
//           placeholder="Hi {{firstName}},&#10;&#10;I noticed that {{company}} is..."
//           rows={12}
//           required
//         />
//         <p className="text-xs text-muted-foreground">
//           Use variables like {`{{firstName}}`}, {`{{company}}`}, {`{{role}}`} for personalization
//         </p>
//       </div>
//       <div className="flex justify-end gap-3">
//         <Button type="button" variant="outline" onClick={() => router.back()}>
//           Cancel
//         </Button>
//         <Button type="submit" disabled={loading}>
//           {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//           Create Template
//         </Button>
//       </div>
//     </form>
//   )
// }


"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { createTemplate } from "@/lib/actions/templates"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { EnhancedTemplateEditor } from "./enhanced-template-editor"

export function CreateTemplateForm() {
  const [loading, setLoading] = useState(false)
  const [body, setBody] = useState("")
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const subject = formData.get("subject") as string
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
        router.push("/dashboard/templates")
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
    <form onSubmit={handleSubmit} className="space-y-6">
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

      <EnhancedTemplateEditor
        value={body}
        onChange={setBody}
        placeholder="Hi {{firstName}},&#10;&#10;I noticed that {{company}} is..."
      />

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Template
        </Button>
      </div>
    </form>
  )
}
