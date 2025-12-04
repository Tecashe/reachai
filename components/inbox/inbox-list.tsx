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

// "use client"

// import { useState } from "react"
// import { Card } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Mail, MailOpen, Star, Archive, Trash2, Paperclip, Reply, Sparkles } from 'lucide-react'
// import type { InboxMessage } from "@/lib/services/unified-inbox"
// import { formatDistanceToNow } from "date-fns"
// import { AttachmentList } from "./attachment-list"
// import { QuickReplyDialog } from "./quick-reply-dialog"
// import { InboxActions } from "./inbox-actions"
// import { toast } from "react-toastify"

// interface InboxListProps {
//   messages: InboxMessage[]
// }

// export function InboxList({ messages }: InboxListProps) {
//   const [selectedMessage, setSelectedMessage] = useState<InboxMessage | null>(null)
//   const [filter, setFilter] = useState<string>("all")
//   const [selectedIds, setSelectedIds] = useState<string[]>([])
//   const [showReplyDialog, setShowReplyDialog] = useState(false)
//   const [showAiReplyDialog, setShowAiReplyDialog] = useState(false)
//   const [isProcessing, setIsProcessing] = useState(false)

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

//   const handleStar = async (messageId: string, e: React.MouseEvent) => {
//     e.stopPropagation()
//     toast.success("Starred")
//   }

//   const handleArchiveSingle = async (messageId: string, e: React.MouseEvent) => {
//     e.stopPropagation()
//     setIsProcessing(true)
//     try {
//       const response = await fetch("/api/inbox/actions/archive", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ replyIds: [messageId], archive: true }),
//       })

//       if (!response.ok) throw new Error()
//       toast.success("Archived")
//       window.location.reload()
//     } catch (error) {
//       toast.error("Failed to archive")
//     } finally {
//       setIsProcessing(false)
//     }
//   }

//   const handleDelete = async (messageId: string, e: React.MouseEvent) => {
//     e.stopPropagation()
//     if (!confirm("Are you sure you want to delete this message?")) return

//     setIsProcessing(true)
//     try {
//       const response = await fetch("/api/inbox/actions/delete", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ replyIds: [messageId] }),
//       })

//       if (!response.ok) throw new Error()
//       toast.success("Deleted")
//       window.location.reload()
//     } catch (error) {
//       toast.error("Failed to delete")
//     } finally {
//       setIsProcessing(false)
//     }
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
//                   <Button variant="ghost" size="icon" onClick={(e) => handleStar(selectedMessage.id, e)} disabled={isProcessing}>
//                     <Star className="h-4 w-4" />
//                   </Button>
//                   <Button variant="ghost" size="icon" onClick={(e) => handleArchiveSingle(selectedMessage.id, e)} disabled={isProcessing}>
//                     <Archive className="h-4 w-4" />
//                   </Button>
//                   <Button variant="ghost" size="icon" onClick={(e) => handleDelete(selectedMessage.id, e)} disabled={isProcessing}>
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
//                 <Button variant="outline" className="gap-2 bg-transparent" onClick={() => setShowAiReplyDialog(true)}>
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
//         <>
//           <QuickReplyDialog
//             isOpen={showReplyDialog}
//             onClose={() => setShowReplyDialog(false)}
//             replyId={selectedMessage.id}
//             prospectName={selectedMessage.prospectName}
//             onSuccess={() => {
//               window.location.reload()
//             }}
//           />
          
//           <QuickReplyDialog
//             isOpen={showAiReplyDialog}
//             onClose={() => setShowAiReplyDialog(false)}
//             replyId={selectedMessage.id}
//             prospectName={selectedMessage.prospectName}
//             onSuccess={() => {
//               window.location.reload()
//             }}
//             useAI={true}
//           />
//         </>
//       )}
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
// import { Mail, MailOpen, Star, Archive, Trash2, Paperclip, Reply, Sparkles } from 'lucide-react'
// import type { InboxMessage } from "@/lib/services/unified-inbox"
// import { formatDistanceToNow } from "date-fns"
// import { AttachmentList } from "./attachment-list"
// import { QuickReplyDialog } from "./quick-reply-dialog"
// import { InboxActions } from "./inbox-actions"
// import { toast } from "react-toastify"

// interface InboxListProps {
//   messages: InboxMessage[]
// }

// export function InboxList({ messages }: InboxListProps) {
//   const [selectedMessage, setSelectedMessage] = useState<InboxMessage | null>(null)
//   const [filter, setFilter] = useState<string>("all")
//   const [selectedIds, setSelectedIds] = useState<string[]>([])
//   const [showReplyDialog, setShowReplyDialog] = useState(false)
//   const [showAiReplyDialog, setShowAiReplyDialog] = useState(false)
//   const [isProcessing, setIsProcessing] = useState(false)

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

//   const handleStar = async (messageId: string, e: React.MouseEvent) => {
//     e.stopPropagation()
//     setIsProcessing(true)
//     try {
//       // Mark as read when starring
//       await fetch("/api/inbox/actions/mark-read", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ replyIds: [messageId], isRead: true }),
//       })
      
//       toast.success("Message starred")
//       // Update local state
//       if (selectedMessage?.id === messageId) {
//         setSelectedMessage({ ...selectedMessage, isRead: true })
//       }
//     } catch (error) {
//       toast.error("Failed to star message")
//     } finally {
//       setIsProcessing(false)
//     }
//   }

//   const handleArchiveSingle = async (messageId: string, e: React.MouseEvent) => {
//     e.stopPropagation()
//     setIsProcessing(true)
//     try {
//       const response = await fetch("/api/inbox/actions/archive", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ replyIds: [messageId], archive: true }),
//       })

//       if (!response.ok) throw new Error()
      
//       toast.success("Message archived")
      
//       // Remove from local state
//       if (selectedMessage?.id === messageId) {
//         setSelectedMessage(null)
//       }
      
//       // Reload to update list
//       setTimeout(() => window.location.reload(), 500)
//     } catch (error) {
//       toast.error("Failed to archive message")
//     } finally {
//       setIsProcessing(false)
//     }
//   }

//   const handleDelete = async (messageId: string, e: React.MouseEvent) => {
//     e.stopPropagation()
//     if (!confirm("Are you sure you want to delete this message? This action cannot be undone.")) return

//     setIsProcessing(true)
//     try {
//       const response = await fetch("/api/inbox/actions/delete", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ replyIds: [messageId] }),
//       })

//       if (!response.ok) throw new Error()
      
//       toast.success("Message deleted")
      
//       // Clear selection and reload
//       setSelectedMessage(null)
//       setTimeout(() => window.location.reload(), 500)
//     } catch (error) {
//       toast.error("Failed to delete message")
//     } finally {
//       setIsProcessing(false)
//     }
//   }

//   const handleSelectMessage = async (message: InboxMessage) => {
//     setSelectedMessage(message)
    
//     // Mark as read if unread
//     if (!message.isRead) {
//       try {
//         await fetch("/api/inbox/actions/mark-read", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ replyIds: [message.id], isRead: true }),
//         })
        
//         // Update local state
//         setSelectedMessage({ ...message, isRead: true })
//       } catch (error) {
//         console.error("Failed to mark as read:", error)
//       }
//     }
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

//                     <div className="flex-1" onClick={() => handleSelectMessage(message)}>
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
//                   <Button variant="ghost" size="icon" onClick={(e) => handleStar(selectedMessage.id, e)} disabled={isProcessing}>
//                     <Star className="h-4 w-4" />
//                   </Button>
//                   <Button variant="ghost" size="icon" onClick={(e) => handleArchiveSingle(selectedMessage.id, e)} disabled={isProcessing}>
//                     <Archive className="h-4 w-4" />
//                   </Button>
//                   <Button variant="ghost" size="icon" onClick={(e) => handleDelete(selectedMessage.id, e)} disabled={isProcessing}>
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
//                 <Button variant="outline" className="gap-2 bg-transparent" onClick={() => setShowAiReplyDialog(true)}>
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
//         <>
//           <QuickReplyDialog
//             isOpen={showReplyDialog}
//             onClose={() => setShowReplyDialog(false)}
//             replyId={selectedMessage.id}
//             prospectName={selectedMessage.prospectName}
//             onSuccess={() => {
//               window.location.reload()
//             }}
//           />
          
//           <QuickReplyDialog
//             isOpen={showAiReplyDialog}
//             onClose={() => setShowAiReplyDialog(false)}
//             replyId={selectedMessage.id}
//             prospectName={selectedMessage.prospectName}
//             onSuccess={() => {
//               window.location.reload()
//             }}
//             useAI={true}
//           />
//         </>
//       )}
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
// import { Mail, MailOpen, Star, Archive, Trash2, Paperclip, Reply, Sparkles, StickyNote } from 'lucide-react'
// import type { InboxMessage } from "@/lib/services/unified-inbox"
// import { formatDistanceToNow } from "date-fns"
// import { AttachmentList } from "./attachment-list"
// import { QuickReplyDialog } from "./quick-reply-dialog"
// import { InboxActions } from "./inbox-actions"
// import { toast } from "react-toastify"

// interface InboxListProps {
//   messages: InboxMessage[]
// }

// export function InboxList({ messages }: InboxListProps) {
//   const [selectedMessage, setSelectedMessage] = useState<InboxMessage | null>(null)
//   const [filter, setFilter] = useState<string>("all")
//   const [selectedIds, setSelectedIds] = useState<string[]>([])
//   const [showReplyDialog, setShowReplyDialog] = useState(false)
//   const [showAiReplyDialog, setShowAiReplyDialog] = useState(false)
//   const [isProcessing, setIsProcessing] = useState(false)

//   const filteredMessages = messages.filter((msg) => {
//     if (filter === "all") return true
//     if (filter === "unread") return !msg.isRead
//     if (filter === "high") return msg.priority === "HIGH"
//     if (filter === "starred") return msg.isStarred
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

//   const handleStar = async (messageId: string, currentlyStarred: boolean, e: React.MouseEvent) => {
//     e.stopPropagation()
//     setIsProcessing(true)
//     try {
//       const response = await fetch("/api/inbox/actions/star", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ replyIds: [messageId], starred: !currentlyStarred }),
//       })

//       if (!response.ok) throw new Error()
      
//       toast.success(currentlyStarred ? "Message unstarred" : "Message starred")
      
//       // Update local state
//       if (selectedMessage?.id === messageId) {
//         setSelectedMessage({ ...selectedMessage, isStarred: !currentlyStarred })
//       }
      
//       // Reload to update list
//       setTimeout(() => window.location.reload(), 500)
//     } catch (error) {
//       toast.error("Failed to star message")
//     } finally {
//       setIsProcessing(false)
//     }
//   }

//   const handleArchiveSingle = async (messageId: string, e: React.MouseEvent) => {
//     e.stopPropagation()
//     setIsProcessing(true)
//     try {
//       const response = await fetch("/api/inbox/actions/archive", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ replyIds: [messageId], archive: true }),
//       })

//       if (!response.ok) throw new Error()
      
//       toast.success("Message archived")
      
//       // Remove from local state
//       if (selectedMessage?.id === messageId) {
//         setSelectedMessage(null)
//       }
      
//       // Reload to update list
//       setTimeout(() => window.location.reload(), 500)
//     } catch (error) {
//       toast.error("Failed to archive message")
//     } finally {
//       setIsProcessing(false)
//     }
//   }

//   const handleDelete = async (messageId: string, e: React.MouseEvent) => {
//     e.stopPropagation()
//     if (!confirm("Are you sure you want to delete this message? This action cannot be undone.")) return

//     setIsProcessing(true)
//     try {
//       const response = await fetch("/api/inbox/actions/delete", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ replyIds: [messageId] }),
//       })

//       if (!response.ok) throw new Error()
      
//       toast.success("Message deleted")
      
//       // Clear selection and reload
//       setSelectedMessage(null)
//       setTimeout(() => window.location.reload(), 500)
//     } catch (error) {
//       toast.error("Failed to delete message")
//     } finally {
//       setIsProcessing(false)
//     }
//   }

//   const handleSelectMessage = async (message: InboxMessage) => {
//     setSelectedMessage(message)
    
//     // Mark as read if unread
//     if (!message.isRead) {
//       try {
//         await fetch("/api/inbox/actions/mark-read", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ replyIds: [message.id], isRead: true }),
//         })
        
//         // Update local state
//         setSelectedMessage({ ...message, isRead: true })
//       } catch (error) {
//         console.error("Failed to mark as read:", error)
//       }
//     }
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
//                 <TabsList className="grid grid-cols-4">
//                   <TabsTrigger value="all">All</TabsTrigger>
//                   <TabsTrigger value="unread">Unread</TabsTrigger>
//                   <TabsTrigger value="starred">Starred</TabsTrigger>
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

//                     <div className="flex-1" onClick={() => handleSelectMessage(message)}>
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
//                           {message.isStarred && (
//                             <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
//                           )}
//                           {message.notes && (
//                             <StickyNote className="h-3 w-3 text-blue-500" />
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
//                   <Button 
//                     variant="ghost" 
//                     size="icon" 
//                     onClick={(e) => handleStar(selectedMessage.id, selectedMessage.isStarred || false, e)} 
//                     disabled={isProcessing}
//                   >
//                     <Star className={`h-4 w-4 ${selectedMessage.isStarred ? 'fill-yellow-500 text-yellow-500' : ''}`} />
//                   </Button>
//                   <Button variant="ghost" size="icon" onClick={(e) => handleArchiveSingle(selectedMessage.id, e)} disabled={isProcessing}>
//                     <Archive className="h-4 w-4" />
//                   </Button>
//                   <Button variant="ghost" size="icon" onClick={(e) => handleDelete(selectedMessage.id, e)} disabled={isProcessing}>
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

//               {selectedMessage.notes && (
//                 <div className="mt-6 pt-6 border-t">
//                   <div className="flex items-start gap-2 bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
//                     <StickyNote className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
//                     <div className="flex-1">
//                       <p className="font-medium text-sm mb-1">Notes</p>
//                       <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedMessage.notes}</p>
//                     </div>
//                   </div>
//                 </div>
//               )}

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
//                 <Button variant="outline" className="gap-2 bg-transparent" onClick={() => setShowAiReplyDialog(true)}>
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
//         <>
//           <QuickReplyDialog
//             isOpen={showReplyDialog}
//             onClose={() => setShowReplyDialog(false)}
//             replyId={selectedMessage.id}
//             prospectName={selectedMessage.prospectName}
//             onSuccess={() => {
//               window.location.reload()
//             }}
//           />
          
//           <QuickReplyDialog
//             isOpen={showAiReplyDialog}
//             onClose={() => setShowAiReplyDialog(false)}
//             replyId={selectedMessage.id}
//             prospectName={selectedMessage.prospectName}
//             onSuccess={() => {
//               window.location.reload()
//             }}
//             useAI={true}
//           />
//         </>
//       )}
//     </div>
//   )
// }
"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Mail,
  Star,
  Archive,
  Trash2,
  Paperclip,
  Reply,
  Sparkles,
  StickyNote,
  CheckCircle2,
  Clock,
  AlertCircle,
  Inbox,
} from "lucide-react"
import type { InboxMessage } from "@/lib/services/unified-inbox"
import { formatDistanceToNow } from "date-fns"
import { AttachmentList } from "./attachment-list"
import { QuickReplyDialog } from "./quick-reply-dialog"
import { InboxActions } from "./inbox-actions"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

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
    if (filter === "starred") return msg.isStarred
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

  const getPriorityConfig = (priority?: string) => {
    switch (priority) {
      case "HIGH":
        return { variant: "destructive" as const, icon: AlertCircle, label: "High" }
      case "MEDIUM":
        return { variant: "default" as const, icon: Clock, label: "Medium" }
      case "LOW":
        return { variant: "secondary" as const, icon: CheckCircle2, label: "Low" }
      default:
        return { variant: "outline" as const, icon: Clock, label: priority || "Normal" }
    }
  }

  const getSentimentConfig = (sentiment?: string) => {
    switch (sentiment) {
      case "POSITIVE":
        return {
          bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
          text: "text-emerald-700 dark:text-emerald-300",
          border: "border-emerald-500/20",
        }
      case "NEUTRAL":
        return {
          bg: "bg-blue-500/10 dark:bg-blue-500/20",
          text: "text-blue-700 dark:text-blue-300",
          border: "border-blue-500/20",
        }
      case "NEGATIVE":
        return {
          bg: "bg-red-500/10 dark:bg-red-500/20",
          text: "text-red-700 dark:text-red-300",
          border: "border-red-500/20",
        }
      default:
        return {
          bg: "bg-muted",
          text: "text-muted-foreground",
          border: "border-border",
        }
    }
  }

  const getCategoryConfig = (category?: string) => {
    const configs: Record<string, { bg: string; dot: string }> = {
      INTERESTED: { bg: "bg-emerald-500/10", dot: "bg-emerald-500" },
      QUESTION: { bg: "bg-amber-500/10", dot: "bg-amber-500" },
      NOT_INTERESTED: { bg: "bg-red-500/10", dot: "bg-red-500" },
      OUT_OF_OFFICE: { bg: "bg-gray-500/10", dot: "bg-gray-500" },
      UNSUBSCRIBE: { bg: "bg-red-700/10", dot: "bg-red-700" },
      REFERRAL: { bg: "bg-purple-500/10", dot: "bg-purple-500" },
    }
    return configs[category || ""] || { bg: "bg-muted", dot: "bg-gray-400" }
  }

  const handleStar = async (messageId: string, currentlyStarred: boolean, e: React.MouseEvent) => {
    e.stopPropagation()
    setIsProcessing(true)
    try {
      const response = await fetch("/api/inbox/actions/star", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replyIds: [messageId], starred: !currentlyStarred }),
      })

      if (!response.ok) throw new Error()

      toast.success(currentlyStarred ? "Message unstarred" : "Message starred")

      if (selectedMessage?.id === messageId) {
        setSelectedMessage({ ...selectedMessage, isStarred: !currentlyStarred })
      }

      setTimeout(() => window.location.reload(), 500)
    } catch (error) {
      toast.error("Failed to star message")
    } finally {
      setIsProcessing(false)
    }
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

      toast.success("Message archived")

      if (selectedMessage?.id === messageId) {
        setSelectedMessage(null)
      }

      setTimeout(() => window.location.reload(), 500)
    } catch (error) {
      toast.error("Failed to archive message")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDelete = async (messageId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm("Are you sure you want to delete this message? This action cannot be undone.")) return

    setIsProcessing(true)
    try {
      const response = await fetch("/api/inbox/actions/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replyIds: [messageId] }),
      })

      if (!response.ok) throw new Error()

      toast.success("Message deleted")

      setSelectedMessage(null)
      setTimeout(() => window.location.reload(), 500)
    } catch (error) {
      toast.error("Failed to delete message")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSelectMessage = async (message: InboxMessage) => {
    setSelectedMessage(message)

    if (!message.isRead) {
      try {
        await fetch("/api/inbox/actions/mark-read", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ replyIds: [message.id], isRead: true }),
        })

        setSelectedMessage({ ...message, isRead: true })
      } catch (error) {
        console.error("Failed to mark as read:", error)
      }
    }
  }

  return (
    <div className="space-y-4">
      {/* Bulk Actions Bar */}
      {selectedIds.length > 0 && (
        <InboxActions
          selectedIds={selectedIds}
          onSuccess={() => {
            setSelectedIds([])
            window.location.reload()
          }}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Message List Panel */}
        <div className="lg:col-span-5 xl:col-span-4">
          <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm shadow-sm">
            {/* Filter Header */}
            <div className="p-4 border-b border-border/50 bg-muted/30">
              <div className="flex items-center justify-between gap-4">
                <Tabs value={filter} onValueChange={setFilter} className="flex-1">
                  <TabsList className="grid grid-cols-4 h-9 bg-background/50">
                    <TabsTrigger value="all" className="text-xs data-[state=active]:shadow-sm">
                      All
                    </TabsTrigger>
                    <TabsTrigger value="unread" className="text-xs data-[state=active]:shadow-sm">
                      Unread
                    </TabsTrigger>
                    <TabsTrigger value="starred" className="text-xs data-[state=active]:shadow-sm">
                      Starred
                    </TabsTrigger>
                    <TabsTrigger value="high" className="text-xs data-[state=active]:shadow-sm">
                      Priority
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <Checkbox
                  checked={selectedIds.length === filteredMessages.length && filteredMessages.length > 0}
                  onCheckedChange={toggleSelectAll}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            </div>

            {/* Message List */}
            <ScrollArea className="h-[calc(100vh-380px)] min-h-[400px]">
              <div className="divide-y divide-border/30">
                {filteredMessages.map((message) => {
                  const priorityConfig = getPriorityConfig(message.priority)
                  const sentimentConfig = getSentimentConfig(message.sentiment)
                  const categoryConfig = getCategoryConfig(message.category)
                  const isSelected = selectedMessage?.id === message.id
                  const isChecked = selectedIds.includes(message.id)

                  return (
                    <div
                      key={message.id}
                      className={cn(
                        "group relative p-4 cursor-pointer transition-all duration-200",
                        "hover:bg-accent/50",
                        isSelected && "bg-accent border-l-2 border-l-primary",
                        !message.isRead && "bg-primary/[0.02]",
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={() => toggleSelection(message.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="mt-1 data-[state=checked]:bg-primary"
                        />

                        <div className="flex-1 min-w-0" onClick={() => handleSelectMessage(message)}>
                          {/* Top Row: Name + Indicators */}
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <div className="flex items-center gap-2 min-w-0">
                              {/* Unread indicator */}
                              {!message.isRead && <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />}
                              <span className={cn("font-medium text-sm truncate", !message.isRead && "font-semibold")}>
                                {message.prospectName}
                              </span>
                              {message.attachments && message.attachments.length > 0 && (
                                <Paperclip className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                              )}
                              {message.isStarred && (
                                <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500 flex-shrink-0" />
                              )}
                              {message.notes && <StickyNote className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />}
                            </div>
                            <span className="text-xs text-muted-foreground flex-shrink-0">
                              {formatDistanceToNow(new Date(message.receivedAt), { addSuffix: true })}
                            </span>
                          </div>

                          {/* Subject */}
                          <p
                            className={cn(
                              "text-sm text-muted-foreground line-clamp-1 mb-2",
                              !message.isRead && "text-foreground",
                            )}
                          >
                            {message.subject}
                          </p>

                          {/* Badges Row */}
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {message.category && (
                              <Badge
                                variant="secondary"
                                className={cn("text-[10px] px-1.5 py-0 h-5 font-medium gap-1", categoryConfig.bg)}
                              >
                                <div className={cn("h-1.5 w-1.5 rounded-full", categoryConfig.dot)} />
                                {message.category.replace(/_/g, " ")}
                              </Badge>
                            )}
                            {message.sentiment && (
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-[10px] px-1.5 py-0 h-5 font-medium border",
                                  sentimentConfig.bg,
                                  sentimentConfig.text,
                                  sentimentConfig.border,
                                )}
                              >
                                {message.sentiment}
                              </Badge>
                            )}
                            {message.priority === "HIGH" && (
                              <Badge variant="destructive" className="text-[10px] px-1.5 py-0 h-5">
                                <AlertCircle className="h-3 w-3 mr-0.5" />
                                HIGH
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}

                {filteredMessages.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-16 px-4">
                    <div className="rounded-full bg-muted/50 p-4 mb-4">
                      <Inbox className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-medium text-sm mb-1">No messages found</h3>
                    <p className="text-xs text-muted-foreground text-center">
                      {filter === "all" ? "Your inbox is empty" : `No ${filter} messages to show`}
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </Card>
        </div>

        {/* Message Detail Panel */}
        <div className="lg:col-span-7 xl:col-span-8">
          {selectedMessage ? (
            <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm shadow-sm">
              {/* Header */}
              <div className="p-6 border-b border-border/50 bg-muted/20">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h2 className="text-xl font-semibold tracking-tight mb-2 line-clamp-2">
                      {selectedMessage.subject}
                    </h2>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
                      <span className="font-medium text-foreground">{selectedMessage.prospectName}</span>
                      <span className="text-muted-foreground/50">•</span>
                      <span>{selectedMessage.prospectEmail}</span>
                      <span className="text-muted-foreground/50">•</span>
                      <span>{new Date(selectedMessage.receivedAt).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-lg hover:bg-accent"
                      onClick={(e) => handleStar(selectedMessage.id, selectedMessage.isStarred || false, e)}
                      disabled={isProcessing}
                    >
                      <Star
                        className={cn(
                          "h-4 w-4 transition-colors",
                          selectedMessage.isStarred && "fill-amber-500 text-amber-500",
                        )}
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-lg hover:bg-accent"
                      onClick={(e) => handleArchiveSingle(selectedMessage.id, e)}
                      disabled={isProcessing}
                    >
                      <Archive className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-lg hover:bg-destructive/10 hover:text-destructive"
                      onClick={(e) => handleDelete(selectedMessage.id, e)}
                      disabled={isProcessing}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Metadata Badges */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {selectedMessage.category && (
                    <Badge
                      variant="secondary"
                      className={cn("gap-1.5", getCategoryConfig(selectedMessage.category).bg)}
                    >
                      <div className={cn("h-2 w-2 rounded-full", getCategoryConfig(selectedMessage.category).dot)} />
                      {selectedMessage.category.replace(/_/g, " ")}
                    </Badge>
                  )}
                  {selectedMessage.sentiment && (
                    <Badge
                      variant="outline"
                      className={cn(
                        getSentimentConfig(selectedMessage.sentiment).bg,
                        getSentimentConfig(selectedMessage.sentiment).text,
                        getSentimentConfig(selectedMessage.sentiment).border,
                      )}
                    >
                      {selectedMessage.sentiment}
                    </Badge>
                  )}
                  <Badge variant="outline" className="bg-background/50">
                    {selectedMessage.campaignName}
                  </Badge>
                  <Badge variant="outline" className="bg-background/50">
                    {selectedMessage.prospectCompany}
                  </Badge>
                </div>
              </div>

              {/* Body Content */}
              <div className="p-6">
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <div className="whitespace-pre-wrap bg-muted/30 p-5 rounded-xl border border-border/50 text-sm leading-relaxed">
                    {selectedMessage.body}
                  </div>
                </div>

                {/* Notes Section */}
                {selectedMessage.notes && (
                  <div className="mt-6">
                    <div className="flex items-start gap-3 bg-blue-500/5 dark:bg-blue-500/10 p-4 rounded-xl border border-blue-500/10">
                      <div className="rounded-lg bg-blue-500/10 p-2">
                        <StickyNote className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-blue-700 dark:text-blue-300 mb-1">Notes</p>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedMessage.notes}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Attachments */}
                {selectedMessage.attachments && selectedMessage.attachments.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-border/50">
                    <AttachmentList attachments={selectedMessage.attachments} />
                  </div>
                )}

                {/* Reply Actions */}
                <div className="mt-6 pt-6 border-t border-border/50 flex gap-3">
                  <Button
                    className="flex-1 gap-2 h-11 rounded-xl shadow-sm hover:shadow-md transition-all"
                    onClick={() => setShowReplyDialog(true)}
                  >
                    <Reply className="h-4 w-4" />
                    Reply
                  </Button>
                  <Button
                    variant="outline"
                    className="gap-2 h-11 rounded-xl bg-background/50 backdrop-blur-sm border-border/50 shadow-sm hover:shadow-md transition-all"
                    onClick={() => setShowAiReplyDialog(true)}
                  >
                    <Sparkles className="h-4 w-4" />
                    AI Reply
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="flex flex-col items-center justify-center min-h-[500px] border-border/50 bg-card/30 backdrop-blur-sm">
              <div className="rounded-full bg-muted/50 p-6 mb-6">
                <Mail className="h-12 w-12 text-muted-foreground/50" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Select a message</h3>
              <p className="text-sm text-muted-foreground text-center max-w-[240px]">
                Choose a message from the list to view its contents
              </p>
            </Card>
          )}
        </div>
      </div>

      {/* Reply Dialogs */}
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
