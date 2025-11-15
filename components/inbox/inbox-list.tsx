// "use client"

// import { useState } from "react"
// import { Card } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Mail, MailOpen, Star, Archive, Trash2 } from "lucide-react"
// import type { InboxMessage } from "@/lib/services/unified-inbox"
// import { formatDistanceToNow } from "date-fns"

// interface InboxListProps {
//   messages: InboxMessage[]
// }

// export function InboxList({ messages }: InboxListProps) {
//   const [selectedMessage, setSelectedMessage] = useState<InboxMessage | null>(null)
//   const [filter, setFilter] = useState<string>("all")

//   const filteredMessages = messages.filter((msg) => {
//     if (filter === "all") return true
//     if (filter === "unread") return !msg.isRead
//     if (filter === "high") return msg.priority === "HIGH"
//     return msg.category?.toLowerCase() === filter.toLowerCase()
//   })

//   const getPriorityColor = (priority?: string) => {
//     switch (priority) {
//       case "HIGH":
//         return "destructive"
//       case "MEDIUM":
//         return "default"
//       case "LOW":
//         return "secondary"
//       default:
//         return "outline"
//     }
//   }

//   const getSentimentColor = (sentiment?: string) => {
//     switch (sentiment) {
//       case "POSITIVE":
//         return "bg-green-100 text-green-800"
//       case "NEUTRAL":
//         return "bg-blue-100 text-blue-800"
//       case "NEGATIVE":
//         return "bg-red-100 text-red-800"
//       default:
//         return "bg-gray-100 text-gray-800"
//     }
//   }

//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//       {/* Message List */}
//       <div className="lg:col-span-1">
//         <Card className="p-4">
//           <Tabs value={filter} onValueChange={setFilter}>
//             <TabsList className="grid grid-cols-3 mb-4">
//               <TabsTrigger value="all">All</TabsTrigger>
//               <TabsTrigger value="unread">Unread</TabsTrigger>
//               <TabsTrigger value="high">Priority</TabsTrigger>
//             </TabsList>

//             <div className="space-y-2">
//               {filteredMessages.map((message) => (
//                 <div
//                   key={message.id}
//                   onClick={() => setSelectedMessage(message)}
//                   className={`p-3 rounded-lg border cursor-pointer transition-colors hover:bg-accent ${
//                     selectedMessage?.id === message.id ? "bg-accent" : ""
//                   }`}
//                 >
//                   <div className="flex items-start justify-between mb-2">
//                     <div className="flex items-center gap-2">
//                       {message.isRead ? (
//                         <MailOpen className="h-4 w-4 text-muted-foreground" />
//                       ) : (
//                         <Mail className="h-4 w-4 text-primary" />
//                       )}
//                       <span className="font-medium text-sm">{message.prospectName}</span>
//                     </div>
//                     <Badge variant={getPriorityColor(message.priority)} className="text-xs">
//                       {message.priority}
//                     </Badge>
//                   </div>

//                   <p className="text-sm text-muted-foreground mb-2 line-clamp-1">{message.subject}</p>

//                   <div className="flex items-center justify-between">
//                     <span className="text-xs text-muted-foreground">
//                       {formatDistanceToNow(new Date(message.receivedAt), { addSuffix: true })}
//                     </span>
//                     {message.sentiment && (
//                       <Badge className={`text-xs ${getSentimentColor(message.sentiment)}`}>{message.sentiment}</Badge>
//                     )}
//                   </div>
//                 </div>
//               ))}

//               {filteredMessages.length === 0 && (
//                 <div className="text-center py-8 text-muted-foreground">
//                   <Mail className="h-12 w-12 mx-auto mb-2 opacity-50" />
//                   <p>No messages found</p>
//                 </div>
//               )}
//             </div>
//           </Tabs>
//         </Card>
//       </div>

//       {/* Message Detail */}
//       <div className="lg:col-span-2">
//         {selectedMessage ? (
//           <Card className="p-6">
//             <div className="flex items-start justify-between mb-6">
//               <div>
//                 <h2 className="text-2xl font-bold mb-2">{selectedMessage.subject}</h2>
//                 <div className="flex items-center gap-4 text-sm text-muted-foreground">
//                   <span>
//                     From: <strong>{selectedMessage.prospectEmail}</strong>
//                   </span>
//                   <span>•</span>
//                   <span>{new Date(selectedMessage.receivedAt).toLocaleString()}</span>
//                 </div>
//               </div>

//               <div className="flex gap-2">
//                 <Button variant="ghost" size="icon">
//                   <Star className="h-4 w-4" />
//                 </Button>
//                 <Button variant="ghost" size="icon">
//                   <Archive className="h-4 w-4" />
//                 </Button>
//                 <Button variant="ghost" size="icon">
//                   <Trash2 className="h-4 w-4" />
//                 </Button>
//               </div>
//             </div>

//             <div className="flex gap-2 mb-6">
//               <Badge>{selectedMessage.category || "Uncategorized"}</Badge>
//               <Badge variant="outline">{selectedMessage.campaignName}</Badge>
//               <Badge variant="outline">{selectedMessage.prospectCompany}</Badge>
//             </div>

//             <div className="prose max-w-none">
//               <div className="whitespace-pre-wrap bg-muted p-4 rounded-lg">{selectedMessage.body}</div>
//             </div>

//             <div className="mt-6 pt-6 border-t">
//               <Button className="w-full">Reply to {selectedMessage.prospectName}</Button>
//             </div>
//           </Card>
//         ) : (
//           <Card className="p-12 text-center">
//             <Mail className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
//             <h3 className="text-xl font-semibold mb-2">Select a message</h3>
//             <p className="text-muted-foreground">Choose a message from the list to view its contents</p>
//           </Card>
//         )}
//       </div>
//     </div>
//   )
// }


// "use client"

// import { useState } from "react"
// import { Card } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Mail, MailOpen, Star, Archive, Trash2, Paperclip } from "lucide-react"
// import type { InboxMessage } from "@/lib/services/unified-inbox"
// import { formatDistanceToNow } from "date-fns"
// import { AttachmentList } from "./attachment-list"

// interface InboxListProps {
//   messages: InboxMessage[]
// }

// export function InboxList({ messages }: InboxListProps) {
//   const [selectedMessage, setSelectedMessage] = useState<InboxMessage | null>(null)
//   const [filter, setFilter] = useState<string>("all")

//   const filteredMessages = messages.filter((msg) => {
//     if (filter === "all") return true
//     if (filter === "unread") return !msg.isRead
//     if (filter === "high") return msg.priority === "HIGH"
//     return msg.category?.toLowerCase() === filter.toLowerCase()
//   })

//   const getPriorityColor = (priority?: string) => {
//     switch (priority) {
//       case "HIGH":
//         return "destructive"
//       case "MEDIUM":
//         return "default"
//       case "LOW":
//         return "secondary"
//       default:
//         return "outline"
//     }
//   }

//   const getSentimentColor = (sentiment?: string) => {
//     switch (sentiment) {
//       case "POSITIVE":
//         return "bg-green-100 text-green-800"
//       case "NEUTRAL":
//         return "bg-blue-100 text-blue-800"
//       case "NEGATIVE":
//         return "bg-red-100 text-red-800"
//       default:
//         return "bg-gray-100 text-gray-800"
//     }
//   }

//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//       {/* Message List */}
//       <div className="lg:col-span-1">
//         <Card className="p-4">
//           <Tabs value={filter} onValueChange={setFilter}>
//             <TabsList className="grid grid-cols-3 mb-4">
//               <TabsTrigger value="all">All</TabsTrigger>
//               <TabsTrigger value="unread">Unread</TabsTrigger>
//               <TabsTrigger value="high">Priority</TabsTrigger>
//             </TabsList>

//             <div className="space-y-2">
//               {filteredMessages.map((message) => (
//                 <div
//                   key={message.id}
//                   onClick={() => setSelectedMessage(message)}
//                   className={`p-3 rounded-lg border cursor-pointer transition-colors hover:bg-accent ${
//                     selectedMessage?.id === message.id ? "bg-accent" : ""
//                   }`}
//                 >
//                   <div className="flex items-start justify-between mb-2">
//                     <div className="flex items-center gap-2">
//                       {message.isRead ? (
//                         <MailOpen className="h-4 w-4 text-muted-foreground" />
//                       ) : (
//                         <Mail className="h-4 w-4 text-primary" />
//                       )}
//                       <span className="font-medium text-sm">{message.prospectName}</span>
//                       {message.attachments && message.attachments.length > 0 && (
//                         <Paperclip className="h-3 w-3 text-muted-foreground" />
//                       )}
//                     </div>
//                     <Badge variant={getPriorityColor(message.priority)} className="text-xs">
//                       {message.priority}
//                     </Badge>
//                   </div>

//                   <p className="text-sm text-muted-foreground mb-2 line-clamp-1">{message.subject}</p>

//                   <div className="flex items-center justify-between">
//                     <span className="text-xs text-muted-foreground">
//                       {formatDistanceToNow(new Date(message.receivedAt), { addSuffix: true })}
//                     </span>
//                     {message.sentiment && (
//                       <Badge className={`text-xs ${getSentimentColor(message.sentiment)}`}>{message.sentiment}</Badge>
//                     )}
//                   </div>
//                 </div>
//               ))}

//               {filteredMessages.length === 0 && (
//                 <div className="text-center py-8 text-muted-foreground">
//                   <Mail className="h-12 w-12 mx-auto mb-2 opacity-50" />
//                   <p>No messages found</p>
//                 </div>
//               )}
//             </div>
//           </Tabs>
//         </Card>
//       </div>

//       {/* Message Detail */}
//       <div className="lg:col-span-2">
//         {selectedMessage ? (
//           <Card className="p-6">
//             <div className="flex items-start justify-between mb-6">
//               <div>
//                 <h2 className="text-2xl font-bold mb-2">{selectedMessage.subject}</h2>
//                 <div className="flex items-center gap-4 text-sm text-muted-foreground">
//                   <span>
//                     From: <strong>{selectedMessage.prospectEmail}</strong>
//                   </span>
//                   <span>•</span>
//                   <span>{new Date(selectedMessage.receivedAt).toLocaleString()}</span>
//                 </div>
//               </div>

//               <div className="flex gap-2">
//                 <Button variant="ghost" size="icon">
//                   <Star className="h-4 w-4" />
//                 </Button>
//                 <Button variant="ghost" size="icon">
//                   <Archive className="h-4 w-4" />
//                 </Button>
//                 <Button variant="ghost" size="icon">
//                   <Trash2 className="h-4 w-4" />
//                 </Button>
//               </div>
//             </div>

//             <div className="flex gap-2 mb-6">
//               <Badge>{selectedMessage.category || "Uncategorized"}</Badge>
//               <Badge variant="outline">{selectedMessage.campaignName}</Badge>
//               <Badge variant="outline">{selectedMessage.prospectCompany}</Badge>
//             </div>

//             <div className="prose max-w-none">
//               <div className="whitespace-pre-wrap bg-muted p-4 rounded-lg">{selectedMessage.body}</div>
//             </div>

//             {selectedMessage.attachments && selectedMessage.attachments.length > 0 && (
//               <div className="mt-6 pt-6 border-t">
//                 <AttachmentList attachments={selectedMessage.attachments} />
//               </div>
//             )}

//             <div className="mt-6 pt-6 border-t">
//               <Button className="w-full">Reply to {selectedMessage.prospectName}</Button>
//             </div>
//           </Card>
//         ) : (
//           <Card className="p-12 text-center">
//             <Mail className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
//             <h3 className="text-xl font-semibold mb-2">Select a message</h3>
//             <p className="text-muted-foreground">Choose a message from the list to view its contents</p>
//           </Card>
//         )}
//       </div>
//     </div>
//   )
// }


// "use client"

// import { useState } from "react"
// import { Card } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Mail, MailOpen, Star, Archive, Trash2, Paperclip, Reply, Sparkles } from "lucide-react"
// import type { InboxMessage } from "@/lib/services/unified-inbox"
// import { formatDistanceToNow } from "date-fns"
// import { AttachmentList } from "./attachment-list"
// import { QuickReplyDialog } from "./quick-reply-dialog"
// import { InboxActions } from "./inbox-actions"

// interface InboxListProps {
//   messages: InboxMessage[]
// }

// export function InboxList({ messages }: InboxListProps) {
//   const [selectedMessage, setSelectedMessage] = useState<InboxMessage | null>(null)
//   const [filter, setFilter] = useState<string>("all")
//   const [selectedIds, setSelectedIds] = useState<string[]>([])
//   const [showReplyDialog, setShowReplyDialog] = useState(false)

//   const filteredMessages = messages.filter((msg) => {
//     if (filter === "all") return true
//     if (filter === "unread") return !msg.isRead
//     if (filter === "high") return msg.priority === "HIGH"
//     return msg.category?.toLowerCase() === filter.toLowerCase()
//   })

//   const toggleSelection = (id: string) => {
//     setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
//   }

//   const toggleSelectAll = () => {
//     if (selectedIds.length === filteredMessages.length) {
//       setSelectedIds([])
//     } else {
//       setSelectedIds(filteredMessages.map((m) => m.id))
//     }
//   }

//   const getPriorityColor = (priority?: string) => {
//     switch (priority) {
//       case "HIGH":
//         return "destructive"
//       case "MEDIUM":
//         return "default"
//       case "LOW":
//         return "secondary"
//       default:
//         return "outline"
//     }
//   }

//   const getSentimentColor = (sentiment?: string) => {
//     switch (sentiment) {
//       case "POSITIVE":
//         return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
//       case "NEUTRAL":
//         return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
//       case "NEGATIVE":
//         return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
//       default:
//         return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
//     }
//   }

//   const getCategoryBadge = (category?: string) => {
//     const colors: Record<string, string> = {
//       INTERESTED: "bg-green-500",
//       QUESTION: "bg-yellow-500",
//       NOT_INTERESTED: "bg-red-500",
//       OUT_OF_OFFICE: "bg-gray-500",
//       UNSUBSCRIBE: "bg-red-700",
//       REFERRAL: "bg-purple-500",
//     }
//     return colors[category || ""] || "bg-gray-400"
//   }

//   return (
//     <div className="space-y-4">
//       {selectedIds.length > 0 && (
//         <InboxActions
//           selectedIds={selectedIds}
//           onSuccess={() => {
//             setSelectedIds([])
//             window.location.reload()
//           }}
//         />
//       )}

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Message List */}
//         <div className="lg:col-span-1">
//           <Card className="p-4">
//             <div className="flex items-center justify-between mb-4">
//               <Tabs value={filter} onValueChange={setFilter} className="flex-1">
//                 <TabsList className="grid grid-cols-3">
//                   <TabsTrigger value="all">All</TabsTrigger>
//                   <TabsTrigger value="unread">Unread</TabsTrigger>
//                   <TabsTrigger value="high">Priority</TabsTrigger>
//                 </TabsList>
//               </Tabs>

//               <Checkbox checked={selectedIds.length === filteredMessages.length} onCheckedChange={toggleSelectAll} />
//             </div>

//             <div className="space-y-2">
//               {filteredMessages.map((message) => (
//                 <div
//                   key={message.id}
//                   className={`p-3 rounded-lg border cursor-pointer transition-colors hover:bg-accent ${
//                     selectedMessage?.id === message.id ? "bg-accent border-primary" : ""
//                   }`}
//                 >
//                   <div className="flex items-start gap-2">
//                     <Checkbox
//                       checked={selectedIds.includes(message.id)}
//                       onCheckedChange={() => toggleSelection(message.id)}
//                       onClick={(e) => e.stopPropagation()}
//                     />

//                     <div className="flex-1" onClick={() => setSelectedMessage(message)}>
//                       <div className="flex items-start justify-between mb-2">
//                         <div className="flex items-center gap-2">
//                           {message.isRead ? (
//                             <MailOpen className="h-4 w-4 text-muted-foreground" />
//                           ) : (
//                             <Mail className="h-4 w-4 text-primary" />
//                           )}
//                           <span className="font-medium text-sm">{message.prospectName}</span>
//                           {message.attachments && message.attachments.length > 0 && (
//                             <Paperclip className="h-3 w-3 text-muted-foreground" />
//                           )}
//                         </div>
//                         <Badge variant={getPriorityColor(message.priority)} className="text-xs">
//                           {message.priority}
//                         </Badge>
//                       </div>

//                       <p className="text-sm text-muted-foreground mb-2 line-clamp-1">{message.subject}</p>

//                       <div className="flex items-center justify-between">
//                         <span className="text-xs text-muted-foreground">
//                           {formatDistanceToNow(new Date(message.receivedAt), { addSuffix: true })}
//                         </span>
//                         <div className="flex gap-1">
//                           {message.category && (
//                             <div className={`h-2 w-2 rounded-full ${getCategoryBadge(message.category)}`} />
//                           )}
//                           {message.sentiment && (
//                             <Badge className={`text-xs ${getSentimentColor(message.sentiment)}`}>
//                               {message.sentiment}
//                             </Badge>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}

//               {filteredMessages.length === 0 && (
//                 <div className="text-center py-8 text-muted-foreground">
//                   <Mail className="h-12 w-12 mx-auto mb-2 opacity-50" />
//                   <p>No messages found</p>
//                 </div>
//               )}
//             </div>
//           </Card>
//         </div>

//         {/* Message Detail */}
//         <div className="lg:col-span-2">
//           {selectedMessage ? (
//             <Card className="p-6">
//               <div className="flex items-start justify-between mb-6">
//                 <div>
//                   <h2 className="text-2xl font-bold mb-2">{selectedMessage.subject}</h2>
//                   <div className="flex items-center gap-4 text-sm text-muted-foreground">
//                     <span>
//                       From: <strong>{selectedMessage.prospectEmail}</strong>
//                     </span>
//                     <span>•</span>
//                     <span>{new Date(selectedMessage.receivedAt).toLocaleString()}</span>
//                   </div>
//                 </div>

//                 <div className="flex gap-2">
//                   <Button variant="ghost" size="icon">
//                     <Star className="h-4 w-4" />
//                   </Button>
//                   <Button variant="ghost" size="icon">
//                     <Archive className="h-4 w-4" />
//                   </Button>
//                   <Button variant="ghost" size="icon">
//                     <Trash2 className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>

//               <div className="flex gap-2 mb-6">
//                 {selectedMessage.category && (
//                   <Badge className="flex items-center gap-1">
//                     <div className={`h-2 w-2 rounded-full ${getCategoryBadge(selectedMessage.category)}`} />
//                     {selectedMessage.category}
//                   </Badge>
//                 )}
//                 {selectedMessage.sentiment && (
//                   <Badge className={getSentimentColor(selectedMessage.sentiment)}>{selectedMessage.sentiment}</Badge>
//                 )}
//                 <Badge variant="outline">{selectedMessage.campaignName}</Badge>
//                 <Badge variant="outline">{selectedMessage.prospectCompany}</Badge>
//               </div>

//               <div className="prose max-w-none dark:prose-invert">
//                 <div className="whitespace-pre-wrap bg-muted p-4 rounded-lg">{selectedMessage.body}</div>
//               </div>

//               {selectedMessage.attachments && selectedMessage.attachments.length > 0 && (
//                 <div className="mt-6 pt-6 border-t">
//                   <AttachmentList attachments={selectedMessage.attachments} />
//                 </div>
//               )}

//               <div className="mt-6 pt-6 border-t flex gap-2">
//                 <Button className="flex-1 gap-2" onClick={() => setShowReplyDialog(true)}>
//                   <Reply className="h-4 w-4" />
//                   Reply
//                 </Button>
//                 <Button variant="outline" className="gap-2 bg-transparent">
//                   <Sparkles className="h-4 w-4" />
//                   AI Reply
//                 </Button>
//               </div>
//             </Card>
//           ) : (
//             <Card className="p-12 text-center">
//               <Mail className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
//               <h3 className="text-xl font-semibold mb-2">Select a message</h3>
//               <p className="text-muted-foreground">Choose a message from the list to view its contents</p>
//             </Card>
//           )}
//         </div>
//       </div>

//       {selectedMessage && (
//         <QuickReplyDialog
//           isOpen={showReplyDialog}
//           onClose={() => setShowReplyDialog(false)}
//           replyId={selectedMessage.id}
//           prospectName={selectedMessage.prospectName}
//           onSuccess={() => {
//             window.location.reload()
//           }}
//         />
//       )}
//     </div>
//   )
// }

"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Mail, MailOpen, Star, Archive, Trash2, Paperclip, Reply, Sparkles } from 'lucide-react'
import type { InboxMessage } from "@/lib/services/unified-inbox"
import { formatDistanceToNow } from "date-fns"
import { AttachmentList } from "./attachment-list"
import { QuickReplyDialog } from "./quick-reply-dialog"
import { InboxActions } from "./inbox-actions"
import { toast } from "react-toastify"

interface InboxListProps {
  messages: InboxMessage[]
}

export function InboxList({ messages }: InboxListProps) {
  const [selectedMessage, setSelectedMessage] = useState<InboxMessage | null>(null)
  const [filter, setFilter] = useState<string>("all")
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [showReplyDialog, setShowReplyDialog] = useState(false)
  const [showAiReplyDialog, setShowAiReplyDialog] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const filteredMessages = messages.filter((msg) => {
    if (filter === "all") return true
    if (filter === "unread") return !msg.isRead
    if (filter === "high") return msg.priority === "HIGH"
    return msg.category?.toLowerCase() === filter.toLowerCase()
  })

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredMessages.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredMessages.map((m) => m.id))
    }
  }

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "HIGH":
        return "destructive"
      case "MEDIUM":
        return "default"
      case "LOW":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case "POSITIVE":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
      case "NEUTRAL":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
      case "NEGATIVE":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
    }
  }

  const getCategoryBadge = (category?: string) => {
    const colors: Record<string, string> = {
      INTERESTED: "bg-green-500",
      QUESTION: "bg-yellow-500",
      NOT_INTERESTED: "bg-red-500",
      OUT_OF_OFFICE: "bg-gray-500",
      UNSUBSCRIBE: "bg-red-700",
      REFERRAL: "bg-purple-500",
    }
    return colors[category || ""] || "bg-gray-400"
  }

  const handleStar = async (messageId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    toast.success("Starred")
  }

  const handleArchiveSingle = async (messageId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setIsProcessing(true)
    try {
      const response = await fetch("/api/inbox/actions/archive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replyIds: [messageId], archive: true }),
      })

      if (!response.ok) throw new Error()
      toast.success("Archived")
      window.location.reload()
    } catch (error) {
      toast.error("Failed to archive")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDelete = async (messageId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm("Are you sure you want to delete this message?")) return

    setIsProcessing(true)
    try {
      const response = await fetch("/api/inbox/actions/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replyIds: [messageId] }),
      })

      if (!response.ok) throw new Error()
      toast.success("Deleted")
      window.location.reload()
    } catch (error) {
      toast.error("Failed to delete")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-4">
      {selectedIds.length > 0 && (
        <InboxActions
          selectedIds={selectedIds}
          onSuccess={() => {
            setSelectedIds([])
            window.location.reload()
          }}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Message List */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <Tabs value={filter} onValueChange={setFilter} className="flex-1">
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="unread">Unread</TabsTrigger>
                  <TabsTrigger value="high">Priority</TabsTrigger>
                </TabsList>
              </Tabs>

              <Checkbox checked={selectedIds.length === filteredMessages.length} onCheckedChange={toggleSelectAll} />
            </div>

            <div className="space-y-2">
              {filteredMessages.map((message) => (
                <div
                  key={message.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors hover:bg-accent ${
                    selectedMessage?.id === message.id ? "bg-accent border-primary" : ""
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <Checkbox
                      checked={selectedIds.includes(message.id)}
                      onCheckedChange={() => toggleSelection(message.id)}
                      onClick={(e) => e.stopPropagation()}
                    />

                    <div className="flex-1" onClick={() => setSelectedMessage(message)}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {message.isRead ? (
                            <MailOpen className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Mail className="h-4 w-4 text-primary" />
                          )}
                          <span className="font-medium text-sm">{message.prospectName}</span>
                          {message.attachments && message.attachments.length > 0 && (
                            <Paperclip className="h-3 w-3 text-muted-foreground" />
                          )}
                        </div>
                        <Badge variant={getPriorityColor(message.priority)} className="text-xs">
                          {message.priority}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground mb-2 line-clamp-1">{message.subject}</p>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(message.receivedAt), { addSuffix: true })}
                        </span>
                        <div className="flex gap-1">
                          {message.category && (
                            <div className={`h-2 w-2 rounded-full ${getCategoryBadge(message.category)}`} />
                          )}
                          {message.sentiment && (
                            <Badge className={`text-xs ${getSentimentColor(message.sentiment)}`}>
                              {message.sentiment}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {filteredMessages.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Mail className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No messages found</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <Card className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{selectedMessage.subject}</h2>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>
                      From: <strong>{selectedMessage.prospectEmail}</strong>
                    </span>
                    <span>•</span>
                    <span>{new Date(selectedMessage.receivedAt).toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={(e) => handleStar(selectedMessage.id, e)} disabled={isProcessing}>
                    <Star className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={(e) => handleArchiveSingle(selectedMessage.id, e)} disabled={isProcessing}>
                    <Archive className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={(e) => handleDelete(selectedMessage.id, e)} disabled={isProcessing}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-2 mb-6">
                {selectedMessage.category && (
                  <Badge className="flex items-center gap-1">
                    <div className={`h-2 w-2 rounded-full ${getCategoryBadge(selectedMessage.category)}`} />
                    {selectedMessage.category}
                  </Badge>
                )}
                {selectedMessage.sentiment && (
                  <Badge className={getSentimentColor(selectedMessage.sentiment)}>{selectedMessage.sentiment}</Badge>
                )}
                <Badge variant="outline">{selectedMessage.campaignName}</Badge>
                <Badge variant="outline">{selectedMessage.prospectCompany}</Badge>
              </div>

              <div className="prose max-w-none dark:prose-invert">
                <div className="whitespace-pre-wrap bg-muted p-4 rounded-lg">{selectedMessage.body}</div>
              </div>

              {selectedMessage.attachments && selectedMessage.attachments.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <AttachmentList attachments={selectedMessage.attachments} />
                </div>
              )}

              <div className="mt-6 pt-6 border-t flex gap-2">
                <Button className="flex-1 gap-2" onClick={() => setShowReplyDialog(true)}>
                  <Reply className="h-4 w-4" />
                  Reply
                </Button>
                <Button variant="outline" className="gap-2 bg-transparent" onClick={() => setShowAiReplyDialog(true)}>
                  <Sparkles className="h-4 w-4" />
                  AI Reply
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="p-12 text-center">
              <Mail className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold mb-2">Select a message</h3>
              <p className="text-muted-foreground">Choose a message from the list to view its contents</p>
            </Card>
          )}
        </div>
      </div>

      {selectedMessage && (
        <>
          <QuickReplyDialog
            isOpen={showReplyDialog}
            onClose={() => setShowReplyDialog(false)}
            replyId={selectedMessage.id}
            prospectName={selectedMessage.prospectName}
            onSuccess={() => {
              window.location.reload()
            }}
          />
          
          <QuickReplyDialog
            isOpen={showAiReplyDialog}
            onClose={() => setShowAiReplyDialog(false)}
            replyId={selectedMessage.id}
            prospectName={selectedMessage.prospectName}
            onSuccess={() => {
              window.location.reload()
            }}
            useAI={true}
          />
        </>
      )}
    </div>
  )
}
