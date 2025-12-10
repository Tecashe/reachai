// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { Label } from "@/components/ui/label"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Send, Loader2 } from "lucide-react"
// import { useToast } from "@/hooks/use-toast"

// interface SendEmailDialogProps {
//   prospectId: string
//   prospectEmail: string
//   prospectName: string
//   campaignId?: string
// }

// export function SendEmailDialog({ prospectId, prospectEmail, prospectName, campaignId }: SendEmailDialogProps) {
//   const [open, setOpen] = useState(false)
//   const [loading, setLoading] = useState(false)
//   const [subject, setSubject] = useState("")
//   const [body, setBody] = useState("")
//   const { toast } = useToast()

//   const handleSend = async () => {
//     if (!subject || !body) {
//       toast({
//         title: "Missing fields",
//         description: "Please fill in subject and body",
//         variant: "destructive",
//       })
//       return
//     }

//     setLoading(true)

//     try {
//       const response = await fetch("/api/emails/send", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           prospectId,
//           campaignId,
//           subject,
//           html: body.replace(/\n/g, "<br>"),
//           text: body,
//         }),
//       })

//       const data = await response.json()

//       if (!response.ok) {
//         throw new Error(data.error || "Failed to send email")
//       }

//       toast({
//         title: "Email sent",
//         description: `Email sent successfully to ${prospectEmail}`,
//       })

//       setOpen(false)
//       setSubject("")
//       setBody("")
//     } catch (error) {
//       toast({
//         title: "Send failed",
//         description: error instanceof Error ? error.message : "Unknown error",
//         variant: "destructive",
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button size="sm">
//           <Send className="h-4 w-4 mr-2" />
//           Send Email
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="max-w-2xl">
//         <DialogHeader>
//           <DialogTitle>Send Email to {prospectName}</DialogTitle>
//           <DialogDescription>Compose and send an email to {prospectEmail}</DialogDescription>
//         </DialogHeader>

//         <div className="space-y-4 py-4">
//           <div className="space-y-2">
//             <Label htmlFor="subject">Subject</Label>
//             <Input
//               id="subject"
//               placeholder="Enter email subject"
//               value={subject}
//               onChange={(e) => setSubject(e.target.value)}
//             />
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="body">Message</Label>
//             <Textarea
//               id="body"
//               placeholder="Enter email body"
//               value={body}
//               onChange={(e) => setBody(e.target.value)}
//               rows={12}
//             />
//           </div>
//         </div>

//         <DialogFooter>
//           <Button variant="outline" onClick={() => setOpen(false)}>
//             Cancel
//           </Button>
//           <Button onClick={handleSend} disabled={loading}>
//             {loading ? (
//               <>
//                 <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                 Sending...
//               </>
//             ) : (
//               <>
//                 <Send className="h-4 w-4 mr-2" />
//                 Send Email
//               </>
//             )}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   )
// }

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Send, Loader2, CalendarIcon, AlertTriangle, CheckCircle2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { WaveLoader } from "../loader/wave-loader"

interface SendEmailDialogProps {
  prospectId: string
  prospectEmail: string
  prospectName: string
  campaignId?: string
}

export function SendEmailDialog({ prospectId, prospectEmail, prospectName, campaignId }: SendEmailDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [validating, setValidating] = useState(false)
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [scheduledDate, setScheduledDate] = useState<Date>()
  const [validationResult, setValidationResult] = useState<any>(null)
  const { toast } = useToast()

  const handleValidate = async () => {
    if (!subject || !body) {
      toast({
        title: "Missing fields",
        description: "Please fill in subject and body to validate",
        variant: "destructive",
      })
      return
    }

    setValidating(true)
    try {
      const response = await fetch("/api/emails/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          html: body.replace(/\n/g, "<br>"),
          prospectName,
        }),
      })

      const data = await response.json()
      setValidationResult(data)

      if (data.score < 70) {
        toast({
          title: "Validation Warning",
          description: `Email score: ${data.score}/100. Consider improving before sending.`,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Validation Passed",
          description: `Email score: ${data.score}/100. Ready to send!`,
        })
      }
    } catch (error) {
      toast({
        title: "Validation failed",
        description: "Could not validate email",
        variant: "destructive",
      })
    } finally {
      setValidating(false)
    }
  }

  const handleSend = async () => {
    if (!subject || !body) {
      toast({
        title: "Missing fields",
        description: "Please fill in subject and body",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/emails/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prospectId,
          campaignId,
          subject,
          html: body.replace(/\n/g, "<br>"),
          text: body,
          scheduledAt: scheduledDate?.toISOString(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send email")
      }

      toast({
        title: scheduledDate ? "Email scheduled" : "Email sent",
        description: scheduledDate
          ? `Email scheduled for ${format(scheduledDate, "PPP 'at' p")}`
          : `Email sent successfully to ${prospectEmail}`,
      })

      setOpen(false)
      setSubject("")
      setBody("")
      setScheduledDate(undefined)
      setValidationResult(null)
    } catch (error) {
      toast({
        title: "Send failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Send className="h-4 w-4 mr-2" />
          Send Email
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Send Email to {prospectName}</DialogTitle>
          <DialogDescription>Compose and send an email to {prospectEmail}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {validationResult && (
            <Alert variant={validationResult.score >= 70 ? "default" : "destructive"}>
              <div className="flex items-start gap-3">
                {validationResult.score >= 70 ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                ) : (
                  <AlertTriangle className="h-5 w-5 mt-0.5" />
                )}
                <div className="flex-1 space-y-2">
                  <AlertDescription className="font-semibold">
                    Deliverability Score: {validationResult.score}/100
                  </AlertDescription>
                  {validationResult.issues.length > 0 && (
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      {validationResult.issues.map((issue: string, i: number) => (
                        <li key={i}>{issue}</li>
                      ))}
                    </ul>
                  )}
                  {validationResult.suggestions.length > 0 && (
                    <div className="text-sm">
                      <p className="font-medium">Suggestions:</p>
                      <ul className="space-y-1 list-disc list-inside">
                        {validationResult.suggestions.map((suggestion: string, i: number) => (
                          <li key={i}>{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="Enter email subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="body">Message</Label>
            <Textarea
              id="body"
              placeholder="Enter email body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={12}
            />
          </div>

          <div className="space-y-2">
            <Label>Schedule Send (Optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !scheduledDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {scheduledDate ? format(scheduledDate, "PPP 'at' p") : "Send immediately"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={scheduledDate} onSelect={setScheduledDate} initialFocus />
                {scheduledDate && (
                  <div className="p-3 border-t">
                    <Label className="text-xs">Time</Label>
                    <Input
                      type="time"
                      value={scheduledDate ? format(scheduledDate, "HH:mm") : ""}
                      onChange={(e) => {
                        if (scheduledDate && e.target.value) {
                          const [hours, minutes] = e.target.value.split(":")
                          const newDate = new Date(scheduledDate)
                          newDate.setHours(Number.parseInt(hours), Number.parseInt(minutes))
                          setScheduledDate(newDate)
                        }
                      }}
                      className="mt-1"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => setScheduledDate(undefined)}
                    >
                      Clear
                    </Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="outline" onClick={handleValidate} disabled={validating || loading}>
            {validating ? (
              <>
                {/* <Loader2 className="h-4 w-4 mr-2 animate-spin" /> */}
                <WaveLoader size="sm" bars={8} gap="tight" />
                Validating...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Validate
              </>
            )}
          </Button>
          <Button onClick={handleSend} disabled={loading}>
            {loading ? (
              <>
                {/* <Loader2 className="h-4 w-4 mr-2 animate-spin" /> */}
                <WaveLoader size="sm" bars={8} gap="tight" />
                {scheduledDate ? "Scheduling..." : "Sending..."}
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                {scheduledDate ? "Schedule" : "Send Now"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
