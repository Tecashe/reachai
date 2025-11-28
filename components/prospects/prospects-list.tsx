// "use client"

// import { useState, useEffect } from "react"
// import { Card, CardContent } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Mail, ExternalLink, AlertCircle, CheckCircle, AlertTriangle } from "lucide-react"
// import Link from "next/link"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { getProspects } from "@/lib/actions/prospects"
// import { ProspectActions } from "./prospect-actions"
// import { analyzeProspectQuality } from "@/lib/services/prospect-quality-analyzer"

// interface ProspectsListProps {
//   status?: string
//   folderId?: string | null
//   isTrashed?: boolean
//   searchQuery?: string
//   selectedProspects: string[]
//   onToggleSelect: (id: string) => void
//   onToggleSelectAll: (ids: string[]) => void
//   duplicateProspectIds?: string[]
// }

// export function ProspectsList({
//   status,
//   folderId,
//   isTrashed = false,
//   searchQuery = "",
//   selectedProspects,
//   onToggleSelect,
//   onToggleSelectAll,
//   duplicateProspectIds = [],
// }: ProspectsListProps) {
//   const [prospects, setProspects] = useState<any[]>([])
//   const [loading, setLoading] = useState(true)
//   const [qualityData, setQualityData] = useState<Map<string, any>>(new Map())

//   useEffect(() => {
//     async function fetchProspects() {
//       setLoading(true)
//       try {
//         const data = await getProspects(status, folderId, isTrashed, searchQuery)
//         setProspects(data)

//         // Analyze quality for each prospect
//         const qualityMap = new Map()
//         data.forEach((prospect) => {
//           const quality = analyzeProspectQuality(prospect)
//           qualityMap.set(prospect.id, quality)
//         })
//         setQualityData(qualityMap)
//       } catch (error) {
//         console.error("Failed to fetch prospects:", error)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchProspects()
//   }, [status, folderId, isTrashed, searchQuery])

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "REPLIED":
//         return "bg-green-500/10 text-green-700 dark:text-green-400"
//       case "CONTACTED":
//         return "bg-blue-500/10 text-blue-700 dark:text-blue-400"
//       case "ACTIVE":
//         return "bg-gray-500/10 text-gray-700 dark:text-gray-400"
//       case "BOUNCED":
//         return "bg-red-500/10 text-red-700 dark:text-red-400"
//       case "UNSUBSCRIBED":
//         return "bg-orange-500/10 text-orange-700 dark:text-orange-400"
//       default:
//         return "bg-gray-500/10 text-gray-700 dark:text-gray-400"
//     }
//   }

//   const getQualityIcon = (grade: string) => {
//     switch (grade) {
//       case "Excellent":
//         return <CheckCircle className="h-4 w-4 text-green-500" />
//       case "Good":
//         return <CheckCircle className="h-4 w-4 text-blue-500" />
//       case "Fair":
//         return <AlertTriangle className="h-4 w-4 text-yellow-500" />
//       case "Poor":
//         return <AlertCircle className="h-4 w-4 text-red-500" />
//       default:
//         return null
//     }
//   }

//   const allSelected = prospects.length > 0 && prospects.every((p) => selectedProspects.includes(p.id))

//   if (loading) {
//     return (
//       <Card>
//         <CardContent className="p-12 text-center">
//           <p className="text-muted-foreground">Loading prospects...</p>
//         </CardContent>
//       </Card>
//     )
//   }

//   return (
//     <div className="space-y-4">
//       <Card>
//         <CardContent className="p-0">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="border-b border-border bg-muted/50">
//                 <tr>
//                   <th className="p-4 text-left">
//                     <Checkbox
//                       checked={allSelected}
//                       onCheckedChange={() => onToggleSelectAll(prospects.map((p) => p.id))}
//                     />
//                   </th>
//                   <th className="p-4 text-left text-sm font-medium text-muted-foreground">Prospect</th>
//                   <th className="p-4 text-left text-sm font-medium text-muted-foreground">Company</th>
//                   <th className="p-4 text-left text-sm font-medium text-muted-foreground">Status</th>
//                   <th className="p-4 text-left text-sm font-medium text-muted-foreground">Quality</th>
//                   <th className="p-4 text-left text-sm font-medium text-muted-foreground">Engagement</th>
//                   <th className="p-4 text-left text-sm font-medium text-muted-foreground">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {prospects.map((prospect) => {
//                   const quality = qualityData.get(prospect.id)
//                   const isDuplicate = duplicateProspectIds.includes(prospect.id)

//                   return (
//                     <tr
//                       key={prospect.id}
//                       className={`border-b border-border hover:bg-muted/30 transition-all ${
//                         isDuplicate ? "animate-pulse bg-yellow-50 dark:bg-yellow-900/10" : ""
//                       }`}
//                     >
//                       <td className="p-4">
//                         <Checkbox
//                           checked={selectedProspects.includes(prospect.id)}
//                           onCheckedChange={() => onToggleSelect(prospect.id)}
//                         />
//                       </td>
//                       <td className="p-4">
//                         <Link
//                           href={`/dashboard/prospects/${prospect.id}`}
//                           className="flex items-center gap-3 hover:text-primary"
//                         >
//                           <Avatar className="h-10 w-10">
//                             <AvatarImage src={`/generic-placeholder-graphic.png?height=40&width=40`} />
//                             <AvatarFallback>
//                               {prospect.firstName?.[0] || ""}
//                               {prospect.lastName?.[0] || ""}
//                             </AvatarFallback>
//                           </Avatar>
//                           <div>
//                             <p className="font-medium">
//                               {prospect.firstName} {prospect.lastName}
//                             </p>
//                             <p className="text-sm text-muted-foreground">{prospect.email}</p>
//                           </div>
//                         </Link>
//                       </td>
//                       <td className="p-4">
//                         <div>
//                           <p className="font-medium">{prospect.company || "—"}</p>
//                           <p className="text-sm text-muted-foreground">{prospect.jobTitle || "—"}</p>
//                         </div>
//                       </td>
//                       <td className="p-4">
//                         <Badge variant="secondary" className={getStatusColor(prospect.status)}>
//                           {prospect.status.toLowerCase()}
//                         </Badge>
//                       </td>
//                       <td className="p-4">
//                         {quality && (
//                           <div className="flex items-center gap-2">
//                             {getQualityIcon(quality.grade)}
//                             <div>
//                               <div className="font-bold text-lg">{quality.score}</div>
//                               <div className="text-xs text-muted-foreground">{quality.grade}</div>
//                             </div>
//                           </div>
//                         )}
//                       </td>
//                       <td className="p-4">
//                         <div className="text-sm space-y-1">
//                           <div className="flex items-center gap-2">
//                             <Mail className="h-3 w-3 text-muted-foreground" />
//                             <span>
//                               {prospect.emailsOpened || 0}/{prospect.emailsReceived || 0} opened
//                             </span>
//                           </div>
//                           {(prospect.emailsReplied || 0) > 0 && (
//                             <Badge variant="secondary" className="text-xs">
//                               {prospect.emailsReplied} Replied
//                             </Badge>
//                           )}
//                         </div>
//                       </td>
//                       <td className="p-4">
//                         <div className="flex items-center gap-2">
//                           {prospect.linkedinUrl && (
//                             <Button variant="ghost" size="icon" asChild>
//                               <a href={prospect.linkedinUrl} target="_blank" rel="noopener noreferrer">
//                                 <ExternalLink className="h-4 w-4" />
//                               </a>
//                             </Button>
//                           )}
//                           <ProspectActions prospectId={prospect.id} />
//                         </div>
//                       </td>
//                     </tr>
//                   )
//                 })}
//               </tbody>
//             </table>
//           </div>
//         </CardContent>
//       </Card>

//       {prospects.length === 0 && (
//         <Card>
//           <CardContent className="p-12 text-center">
//             <p className="text-muted-foreground mb-4">No prospects found</p>
//             <Button asChild>
//               <Link href="/dashboard/prospects/new">Add Your First Prospect</Link>
//             </Button>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   )
// }

"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Mail, ExternalLink, AlertCircle, CheckCircle, AlertTriangle, Upload } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getProspects } from "@/lib/actions/prospects"
import { ProspectActions } from "./prospect-actions"
import { analyzeProspectQuality } from "@/lib/services/prospect-quality-analyzer"
import { SmartImportDialog } from "./smart-import-dialog"

interface ProspectsListProps {
  status?: string
  folderId?: string | null
  isTrashed?: boolean
  searchQuery?: string
  selectedProspects: string[]
  onToggleSelect: (id: string) => void
  onToggleSelectAll: (ids: string[]) => void
  duplicateProspectIds?: string[]
  refreshKey?: number
}

export function ProspectsList({
  status,
  folderId,
  isTrashed = false,
  searchQuery = "",
  selectedProspects,
  onToggleSelect,
  onToggleSelectAll,
  duplicateProspectIds = [],
  refreshKey = 0,
}: ProspectsListProps) {
  const [prospects, setProspects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [qualityData, setQualityData] = useState<Map<string, any>>(new Map())

  const fetchProspects = useCallback(async () => {
    setLoading(true)
    try {
      console.log("[v0] Fetching prospects for folder:", folderId, "status:", status)
      const data = await getProspects(status, folderId, isTrashed, searchQuery)
      console.log("[v0] Fetched prospects:", data.length)
      setProspects(data)

      const qualityMap = new Map()
      data.forEach((prospect) => {
        const quality = analyzeProspectQuality(prospect)
        qualityMap.set(prospect.id, quality)
      })
      setQualityData(qualityMap)
    } catch (error) {
      console.error("[v0] Failed to fetch prospects:", error)
    } finally {
      setLoading(false)
    }
  }, [status, folderId, isTrashed, searchQuery])

  useEffect(() => {
    fetchProspects()
  }, [fetchProspects, refreshKey])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "REPLIED":
        return "bg-green-500/10 text-green-700 dark:text-green-400"
      case "CONTACTED":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400"
      case "ACTIVE":
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400"
      case "BOUNCED":
        return "bg-red-500/10 text-red-700 dark:text-red-400"
      case "UNSUBSCRIBED":
        return "bg-orange-500/10 text-orange-700 dark:text-orange-400"
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400"
    }
  }

  const getQualityIcon = (grade: string) => {
    switch (grade) {
      case "Excellent":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "Good":
        return <CheckCircle className="h-4 w-4 text-blue-500" />
      case "Fair":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "Poor":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const allSelected = prospects.length > 0 && prospects.every((p) => selectedProspects.includes(p.id))

  if (loading) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-muted-foreground">Loading prospects...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="p-4 text-left">
                    <Checkbox
                      checked={allSelected}
                      onCheckedChange={() => onToggleSelectAll(prospects.map((p) => p.id))}
                    />
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">Prospect</th>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">Company</th>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">Status</th>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">Quality</th>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">Engagement</th>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {prospects.map((prospect) => {
                  const quality = qualityData.get(prospect.id)
                  const isDuplicate = duplicateProspectIds.includes(prospect.id)

                  return (
                    <tr
                      key={prospect.id}
                      className={`border-b border-border hover:bg-muted/30 transition-all ${
                        isDuplicate ? "animate-pulse bg-yellow-50 dark:bg-yellow-900/10" : ""
                      }`}
                    >
                      <td className="p-4">
                        <Checkbox
                          checked={selectedProspects.includes(prospect.id)}
                          onCheckedChange={() => onToggleSelect(prospect.id)}
                        />
                      </td>
                      <td className="p-4">
                        <Link
                          href={`/dashboard/prospects/${prospect.id}`}
                          className="flex items-center gap-3 hover:text-primary"
                        >
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={`/placeholder.svg?height=40&width=40&query=avatar`} />
                            <AvatarFallback>
                              {prospect.firstName?.[0] || ""}
                              {prospect.lastName?.[0] || ""}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {prospect.firstName} {prospect.lastName}
                            </p>
                            <p className="text-sm text-muted-foreground">{prospect.email}</p>
                          </div>
                        </Link>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{prospect.company || "—"}</p>
                          <p className="text-sm text-muted-foreground">{prospect.jobTitle || "—"}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="secondary" className={getStatusColor(prospect.status)}>
                          {prospect.status.toLowerCase()}
                        </Badge>
                      </td>
                      <td className="p-4">
                        {quality && (
                          <div className="flex items-center gap-2">
                            {getQualityIcon(quality.grade)}
                            <div>
                              <div className="font-bold text-lg">{quality.score}</div>
                              <div className="text-xs text-muted-foreground">{quality.grade}</div>
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="text-sm space-y-1">
                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span>
                              {prospect.emailsOpened || 0}/{prospect.emailsReceived || 0} opened
                            </span>
                          </div>
                          {(prospect.emailsReplied || 0) > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {prospect.emailsReplied} Replied
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {prospect.linkedinUrl && (
                            <Button variant="ghost" size="icon" asChild>
                              <a href={prospect.linkedinUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                          <ProspectActions prospectId={prospect.id} />
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {prospects.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground mb-4">
              {isTrashed ? "No trashed prospects" : "No prospects found in this folder"}
            </p>
            {!isTrashed && (
              <div className="flex items-center justify-center gap-3">
                <SmartImportDialog
                  folderId={folderId||""}
                  trigger={
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Import Prospects
                    </Button>
                  }
                />
                <Button asChild>
                  <Link href="/dashboard/prospects/new">Add Your First Prospect</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
