// "use client"

// import { useState, useEffect } from "react"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Loader2, Send, Wand2 } from "lucide-react"
// import { toast } from "sonner"
// import { cn } from "@/lib/utils"

// interface QuickReplyDialogProps {
//   isOpen: boolean
//   onClose: () => void
//   replyId: string
//   prospectName: string
//   onSuccess: () => void
//   useAI?: boolean
// }

// export function QuickReplyDialog({
//   isOpen,
//   onClose,
//   replyId,
//   prospectName,
//   onSuccess,
//   useAI = false,
// }: QuickReplyDialogProps) {
//   const [message, setMessage] = useState("")
//   const [tone, setTone] = useState<"professional" | "friendly" | "casual">("professional")
//   const [isGenerating, setIsGenerating] = useState(false)
//   const [isSending, setIsSending] = useState(false)

//   useEffect(() => {
//     if (isOpen && useAI && !message) {
//       generateReply()
//     }
//   }, [isOpen, useAI])

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
//       <DialogContent className="max-w-2xl rounded-2xl border-border/50 bg-background/95 backdrop-blur-xl">
//         <DialogHeader className="pb-4">
//           <DialogTitle className="text-xl">Reply to {prospectName}</DialogTitle>
//           <DialogDescription>Write your reply or use AI to generate one</DialogDescription>
//         </DialogHeader>

//         <div className="space-y-5">
//           {/* AI Controls */}
//           <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/30 border border-border/50">
//             <Select value={tone} onValueChange={(value: any) => setTone(value)}>
//               <SelectTrigger className="w-[160px] h-10 rounded-xl bg-background/50 border-border/50">
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent className="rounded-xl">
//                 <SelectItem value="professional" className="rounded-lg">
//                   Professional
//                 </SelectItem>
//                 <SelectItem value="friendly" className="rounded-lg">
//                   Friendly
//                 </SelectItem>
//                 <SelectItem value="casual" className="rounded-lg">
//                   Casual
//                 </SelectItem>
//               </SelectContent>
//             </Select>

//             <Button
//               onClick={generateReply}
//               disabled={isGenerating}
//               variant="outline"
//               className="gap-2 h-10 rounded-xl bg-background/50 border-border/50 hover:bg-accent"
//             >
//               {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
//               Generate with AI
//             </Button>
//           </div>

//           {/* Message Input */}
//           <Textarea
//             placeholder="Type your reply here..."
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             rows={10}
//             className={cn(
//               "resize-none rounded-xl border-border/50 bg-muted/20",
//               "focus-visible:ring-primary/20 focus-visible:border-primary/50",
//               "placeholder:text-muted-foreground/50",
//             )}
//           />

//           {/* Actions */}
//           <div className="flex justify-end gap-3 pt-2">
//             <Button
//               variant="outline"
//               onClick={onClose}
//               className="h-11 px-6 rounded-xl border-border/50 bg-transparent"
//             >
//               Cancel
//             </Button>
//             <Button
//               onClick={sendReply}
//               disabled={isSending}
//               className="h-11 px-6 rounded-xl gap-2 shadow-sm hover:shadow-md transition-all"
//             >
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
import { Loader2, Send, Wand2 } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { WaveLoader } from "../loader/wave-loader"

interface QuickReplyDialogProps {
  isOpen: boolean
  onClose: () => void
  replyId: string
  prospectName: string
  onSuccess: () => void
  useAI?: boolean
  initialContent?: string
}

export function QuickReplyDialog({
  isOpen,
  onClose,
  replyId,
  prospectName,
  onSuccess,
  useAI = false,
  initialContent = "",
}: QuickReplyDialogProps) {
  const [message, setMessage] = useState(initialContent)
  const [tone, setTone] = useState<"professional" | "friendly" | "casual">("professional")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSending, setIsSending] = useState(false)

  useEffect(() => {
    if (initialContent) {
      setMessage(initialContent)
    }
  }, [initialContent])

  useEffect(() => {
    if (isOpen && useAI && !message && !initialContent) {
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

  const handleClose = () => {
    setMessage("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl rounded-2xl border-border/50 bg-background/95 backdrop-blur-xl">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl">Reply to {prospectName}</DialogTitle>
          <DialogDescription>Write your reply or use AI to generate one</DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* AI Controls */}
          <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/30 border border-border/50">
            <Select value={tone} onValueChange={(value: any) => setTone(value)}>
              <SelectTrigger className="w-[160px] h-10 rounded-xl bg-background/50 border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="professional" className="rounded-lg">
                  Professional
                </SelectItem>
                <SelectItem value="friendly" className="rounded-lg">
                  Friendly
                </SelectItem>
                <SelectItem value="casual" className="rounded-lg">
                  Casual
                </SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={generateReply}
              disabled={isGenerating}
              variant="outline"
              className="gap-2 h-10 rounded-xl bg-background/50 border-border/50 hover:bg-accent"
            >
              {isGenerating ? <WaveLoader size="sm" bars={8} gap="tight" /> : <Wand2 className="h-4 w-4" />}
              Generate with AI
            </Button>
          </div>

          {/* Message Input */}
          <Textarea
            placeholder="Type your reply here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={10}
            className={cn(
              "resize-none rounded-xl border-border/50 bg-muted/20",
              "focus-visible:ring-primary/20 focus-visible:border-primary/50",
              "placeholder:text-muted-foreground/50",
            )}
          />

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={handleClose}
              className="h-11 px-6 rounded-xl border-border/50 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              onClick={sendReply}
              disabled={isSending}
              className="h-11 px-6 rounded-xl gap-2 shadow-sm hover:shadow-md transition-all"
            >
              {isSending ? <WaveLoader size="sm" bars={8} gap="tight" /> : <Send className="h-4 w-4" />}
              Send Reply
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
