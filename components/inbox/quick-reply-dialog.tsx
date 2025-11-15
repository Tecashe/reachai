// "use client"

// import { useState } from "react"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Loader2, Sparkles, Send } from "lucide-react"
// import { toast } from "sonner"

// interface QuickReplyDialogProps {
//   isOpen: boolean
//   onClose: () => void
//   replyId: string
//   prospectName: string
//   onSuccess: () => void
// }

// export function QuickReplyDialog({ isOpen, onClose, replyId, prospectName, onSuccess }: QuickReplyDialogProps) {
//   const [message, setMessage] = useState("")
//   const [tone, setTone] = useState<"professional" | "friendly" | "casual">("professional")
//   const [isGenerating, setIsGenerating] = useState(false)
//   const [isSending, setIsSending] = useState(false)

//   const generateReply = async () => {
//     setIsGenerating(true)
//     try {
//       const response = await fetch("/api/inbox/generate-reply", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ replyId, tone }),
//       })

//       if (!response.ok) throw new Error("Failed to generate reply")

//       const { suggestion } = await response.json()
//       setMessage(suggestion.body)
//       toast.success("AI reply generated!")
//     } catch (error) {
//       toast.error("Failed to generate reply")
//     } finally {
//       setIsGenerating(false)
//     }
//   }

//   const sendReply = async () => {
//     if (!message.trim()) {
//       toast.error("Please enter a message")
//       return
//     }

//     setIsSending(true)
//     try {
//       const response = await fetch("/api/inbox/actions/reply", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ replyId, message }),
//       })

//       if (!response.ok) throw new Error("Failed to send reply")

//       toast.success("Reply sent successfully!")
//       onSuccess()
//       onClose()
//     } catch (error) {
//       toast.error("Failed to send reply")
//     } finally {
//       setIsSending(false)
//     }
//   }

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-w-2xl">
//         <DialogHeader>
//           <DialogTitle>Reply to {prospectName}</DialogTitle>
//           <DialogDescription>Write your reply or use AI to generate one</DialogDescription>
//         </DialogHeader>

//         <div className="space-y-4">
//           <div className="flex items-center gap-2">
//             <Select value={tone} onValueChange={(value: any) => setTone(value)}>
//               <SelectTrigger className="w-[200px]">
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="professional">Professional</SelectItem>
//                 <SelectItem value="friendly">Friendly</SelectItem>
//                 <SelectItem value="casual">Casual</SelectItem>
//               </SelectContent>
//             </Select>

//             <Button onClick={generateReply} disabled={isGenerating} variant="outline" className="gap-2 bg-transparent">
//               {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
//               Generate with AI
//             </Button>
//           </div>

//           <Textarea
//             placeholder="Type your reply here..."
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             rows={12}
//             className="resize-none"
//           />

//           <div className="flex justify-end gap-2">
//             <Button variant="outline" onClick={onClose}>
//               Cancel
//             </Button>
//             <Button onClick={sendReply} disabled={isSending} className="gap-2">
//               {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
//               Send Reply
//             </Button>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   )
// }

"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Sparkles, Send } from 'lucide-react'
import { toast } from "sonner"

interface QuickReplyDialogProps {
  isOpen: boolean
  onClose: () => void
  replyId: string
  prospectName: string
  onSuccess: () => void
  useAI?: boolean
}

export function QuickReplyDialog({ isOpen, onClose, replyId, prospectName, onSuccess, useAI = false }: QuickReplyDialogProps) {
  const [message, setMessage] = useState("")
  const [tone, setTone] = useState<"professional" | "friendly" | "casual">("professional")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSending, setIsSending] = useState(false)

  useEffect(() => {
    if (isOpen && useAI && !message) {
      generateReply()
    }
  }, [isOpen, useAI])

  const generateReply = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch("/api/inbox/generate-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replyId, tone }),
      })

      if (!response.ok) throw new Error("Failed to generate reply")

      const { suggestion } = await response.json()
      setMessage(suggestion.body)
      toast.success("AI reply generated!")
    } catch (error) {
      toast.error("Failed to generate reply")
    } finally {
      setIsGenerating(false)
    }
  }

  const sendReply = async () => {
    if (!message.trim()) {
      toast.error("Please enter a message")
      return
    }

    setIsSending(true)
    try {
      const response = await fetch("/api/inbox/actions/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replyId, message }),
      })

      if (!response.ok) throw new Error("Failed to send reply")

      toast.success("Reply sent successfully!")
      onSuccess()
      onClose()
    } catch (error) {
      toast.error("Failed to send reply")
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Reply to {prospectName}</DialogTitle>
          <DialogDescription>Write your reply or use AI to generate one</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Select value={tone} onValueChange={(value: any) => setTone(value)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="friendly">Friendly</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={generateReply} disabled={isGenerating} variant="outline" className="gap-2 bg-transparent">
              {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              Generate with AI
            </Button>
          </div>

          <Textarea
            placeholder="Type your reply here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={12}
            className="resize-none"
          />

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={sendReply} disabled={isSending} className="gap-2">
              {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Send Reply
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
