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


"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, MailOpen, Star, Archive, Trash2, Paperclip } from "lucide-react"
import type { InboxMessage } from "@/lib/services/unified-inbox"
import { formatDistanceToNow } from "date-fns"
import { AttachmentList } from "./attachment-list"

interface InboxListProps {
  messages: InboxMessage[]
}

export function InboxList({ messages }: InboxListProps) {
  const [selectedMessage, setSelectedMessage] = useState<InboxMessage | null>(null)
  const [filter, setFilter] = useState<string>("all")

  const filteredMessages = messages.filter((msg) => {
    if (filter === "all") return true
    if (filter === "unread") return !msg.isRead
    if (filter === "high") return msg.priority === "HIGH"
    return msg.category?.toLowerCase() === filter.toLowerCase()
  })

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
        return "bg-green-100 text-green-800"
      case "NEUTRAL":
        return "bg-blue-100 text-blue-800"
      case "NEGATIVE":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Message List */}
      <div className="lg:col-span-1">
        <Card className="p-4">
          <Tabs value={filter} onValueChange={setFilter}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
              <TabsTrigger value="high">Priority</TabsTrigger>
            </TabsList>

            <div className="space-y-2">
              {filteredMessages.map((message) => (
                <div
                  key={message.id}
                  onClick={() => setSelectedMessage(message)}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors hover:bg-accent ${
                    selectedMessage?.id === message.id ? "bg-accent" : ""
                  }`}
                >
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
                    {message.sentiment && (
                      <Badge className={`text-xs ${getSentimentColor(message.sentiment)}`}>{message.sentiment}</Badge>
                    )}
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
          </Tabs>
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
                <Button variant="ghost" size="icon">
                  <Star className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Archive className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-2 mb-6">
              <Badge>{selectedMessage.category || "Uncategorized"}</Badge>
              <Badge variant="outline">{selectedMessage.campaignName}</Badge>
              <Badge variant="outline">{selectedMessage.prospectCompany}</Badge>
            </div>

            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap bg-muted p-4 rounded-lg">{selectedMessage.body}</div>
            </div>

            {selectedMessage.attachments && selectedMessage.attachments.length > 0 && (
              <div className="mt-6 pt-6 border-t">
                <AttachmentList attachments={selectedMessage.attachments} />
              </div>
            )}

            <div className="mt-6 pt-6 border-t">
              <Button className="w-full">Reply to {selectedMessage.prospectName}</Button>
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
  )
}
