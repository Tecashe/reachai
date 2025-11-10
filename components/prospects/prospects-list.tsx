// import { Card, CardContent } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Checkbox } from "@/components/ui/checkbox"
// import { MoreVertical, Mail, ExternalLink, Trash2 } from "lucide-react"
// import Link from "next/link"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// const mockProspects = [
//   {
//     id: "1",
//     email: "sarah.chen@techflow.com",
//     firstName: "Sarah",
//     lastName: "Chen",
//     company: "TechFlow",
//     jobTitle: "Head of Sales",
//     linkedinUrl: "https://linkedin.com/in/sarahchen",
//     status: "REPLIED",
//     qualityScore: 92,
//     emailsReceived: 2,
//     emailsOpened: 2,
//     replied: true,
//   },
//   {
//     id: "2",
//     email: "marcus.rodriguez@growthlabs.io",
//     firstName: "Marcus",
//     lastName: "Rodriguez",
//     company: "GrowthLabs",
//     jobTitle: "Founder & CEO",
//     linkedinUrl: "https://linkedin.com/in/marcusrodriguez",
//     status: "CONTACTED",
//     qualityScore: 88,
//     emailsReceived: 1,
//     emailsOpened: 1,
//     replied: false,
//   },
//   {
//     id: "3",
//     email: "emily.watson@cloudscale.com",
//     firstName: "Emily",
//     lastName: "Watson",
//     company: "CloudScale",
//     jobTitle: "SDR Manager",
//     linkedinUrl: "https://linkedin.com/in/emilywatson",
//     status: "ACTIVE",
//     qualityScore: 85,
//     emailsReceived: 0,
//     emailsOpened: 0,
//     replied: false,
//   },
//   {
//     id: "4",
//     email: "david.kim@datasync.io",
//     firstName: "David",
//     lastName: "Kim",
//     company: "DataSync",
//     jobTitle: "VP of Sales",
//     linkedinUrl: "https://linkedin.com/in/davidkim",
//     status: "CONTACTED",
//     qualityScore: 90,
//     emailsReceived: 1,
//     emailsOpened: 0,
//     replied: false,
//   },
// ]

// interface ProspectsListProps {
//   status?: string
// }

// export function ProspectsList({ status }: ProspectsListProps) {
//   const filteredProspects = status ? mockProspects.filter((p) => p.status === status) : mockProspects

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "REPLIED":
//         return "bg-green-500/10 text-green-700 dark:text-green-400"
//       case "CONTACTED":
//         return "bg-blue-500/10 text-blue-700 dark:text-blue-400"
//       case "ACTIVE":
//         return "bg-gray-500/10 text-gray-700 dark:text-gray-400"
//       default:
//         return "bg-gray-500/10 text-gray-700 dark:text-gray-400"
//     }
//   }

//   const getQualityScoreColor = (score: number) => {
//     if (score >= 90) return "text-green-600 dark:text-green-400"
//     if (score >= 75) return "text-blue-600 dark:text-blue-400"
//     if (score >= 60) return "text-yellow-600 dark:text-yellow-400"
//     return "text-red-600 dark:text-red-400"
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
//                     <Checkbox />
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
//                 {filteredProspects.map((prospect) => (
//                   <tr key={prospect.id} className="border-b border-border hover:bg-muted/30 transition-colors">
//                     <td className="p-4">
//                       <Checkbox />
//                     </td>
//                     <td className="p-4">
//                       <Link
//                         href={`/dashboard/prospects/${prospect.id}`}
//                         className="flex items-center gap-3 hover:text-primary"
//                       >
//                         <Avatar className="h-10 w-10">
//                           <AvatarImage src={`/generic-placeholder-graphic.png?height=40&width=40`} />
//                           <AvatarFallback>
//                             {prospect.firstName[0]}
//                             {prospect.lastName[0]}
//                           </AvatarFallback>
//                         </Avatar>
//                         <div>
//                           <p className="font-medium">
//                             {prospect.firstName} {prospect.lastName}
//                           </p>
//                           <p className="text-sm text-muted-foreground">{prospect.email}</p>
//                         </div>
//                       </Link>
//                     </td>
//                     <td className="p-4">
//                       <div>
//                         <p className="font-medium">{prospect.company}</p>
//                         <p className="text-sm text-muted-foreground">{prospect.jobTitle}</p>
//                       </div>
//                     </td>
//                     <td className="p-4">
//                       <Badge variant="secondary" className={getStatusColor(prospect.status)}>
//                         {prospect.status.toLowerCase()}
//                       </Badge>
//                     </td>
//                     <td className="p-4">
//                       <div className="flex items-center gap-2">
//                         <div className={getQualityScoreColor(prospect.qualityScore)}>
//                           {prospect.qualityScore}
//                         </div>
//                         <span className="text-xs text-muted-foreground">/100</span>
//                       </div>
//                     </td>
//                     <td className="p-4">
//                       <div className="text-sm space-y-1">
//                         <div className="flex items-center gap-2">
//                           <Mail className="h-3 w-3 text-muted-foreground" />
//                           <span>
//                             {prospect.emailsOpened}/{prospect.emailsReceived} opened
//                           </span>
//                         </div>
//                         {prospect.replied && (
//                           <Badge variant="secondary" className="text-xs">
//                             Replied
//                           </Badge>
//                         )}
//                       </div>
//                     </td>
//                     <td className="p-4">
//                       <div className="flex items-center gap-2">
//                         {prospect.linkedinUrl && (
//                           <Button variant="ghost" size="icon" asChild>
//                             <a href={prospect.linkedinUrl} target="_blank" rel="noopener noreferrer">
//                               <ExternalLink className="h-4 w-4" />
//                             </a>
//                           </Button>
//                         )}
//                         <DropdownMenu>
//                           <DropdownMenuTrigger asChild>
//                             <Button variant="ghost" size="icon">
//                               <MoreVertical className="h-4 w-4" />
//                             </Button>
//                           </DropdownMenuTrigger>
//                           <DropdownMenuContent align="end">
//                             <DropdownMenuItem>View Details</DropdownMenuItem>
//                             <DropdownMenuItem>Send Email</DropdownMenuItem>
//                             <DropdownMenuItem>Edit</DropdownMenuItem>
//                             <DropdownMenuItem className="text-destructive">
//                               <Trash2 className="h-4 w-4 mr-2" />
//                               Delete
//                             </DropdownMenuItem>
//                           </DropdownMenuContent>
//                         </DropdownMenu>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </CardContent>
//       </Card>

//       {filteredProspects.length === 0 && (
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

// import { Card, CardContent } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Mail, ExternalLink } from "lucide-react"
// import Link from "next/link"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { getProspects } from "@/lib/actions/prospects"
// import { ProspectActions } from "./prospect-actions"

// interface ProspectsListProps {
//   status?: string
// }

// export async function ProspectsList({ status }: ProspectsListProps) {
//   const prospects = await getProspects(status)

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

//   const getQualityScoreColor = (score: number) => {
//     if (score >= 90) return "text-green-600 dark:text-green-400"
//     if (score >= 75) return "text-blue-600 dark:text-blue-400"
//     if (score >= 60) return "text-yellow-600 dark:text-yellow-400"
//     return "text-red-600 dark:text-red-400"
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
//                     <Checkbox />
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
//                 {prospects.map((prospect) => (
//                   <tr key={prospect.id} className="border-b border-border hover:bg-muted/30 transition-colors">
//                     <td className="p-4">
//                       <Checkbox />
//                     </td>
//                     <td className="p-4">
//                       <Link
//                         href={`/dashboard/prospects/${prospect.id}`}
//                         className="flex items-center gap-3 hover:text-primary"
//                       >
//                         <Avatar className="h-10 w-10">
//                           <AvatarImage src={`/generic-placeholder-graphic.png?height=40&width=40`} />
//                           <AvatarFallback>
//                             {prospect.firstName?.[0] || ""}
//                             {prospect.lastName?.[0] || ""}
//                           </AvatarFallback>
//                         </Avatar>
//                         <div>
//                           <p className="font-medium">
//                             {prospect.firstName} {prospect.lastName}
//                           </p>
//                           <p className="text-sm text-muted-foreground">{prospect.email}</p>
//                         </div>
//                       </Link>
//                     </td>
//                     <td className="p-4">
//                       <div>
//                         <p className="font-medium">{prospect.company || "—"}</p>
//                         <p className="text-sm text-muted-foreground">{prospect.jobTitle || "—"}</p>
//                       </div>
//                     </td>
//                     <td className="p-4">
//                       <Badge variant="secondary" className={getStatusColor(prospect.status)}>
//                         {prospect.status.toLowerCase()}
//                       </Badge>
//                     </td>
//                     <td className="p-4">
//                       <div className="flex items-center gap-2">
//                         <div className={`text-2xl font-bold ${getQualityScoreColor(prospect.qualityScore)}`}>
//                           {prospect.qualityScore}
//                         </div>
//                         <span className="text-xs text-muted-foreground">/100</span>
//                       </div>
//                     </td>
//                     <td className="p-4">
//                       <div className="text-sm space-y-1">
//                         <div className="flex items-center gap-2">
//                           <Mail className="h-3 w-3 text-muted-foreground" />
//                           <span>
//                             {prospect.emailsOpened}/{prospect.emailsReceived} opened
//                           </span>
//                         </div>
//                         {prospect.emailsReplied > 0 && (
//                           <Badge variant="secondary" className="text-xs">
//                             {prospect.emailsReplied} Replied
//                           </Badge>
//                         )}
//                       </div>
//                     </td>
//                     <td className="p-4">
//                       <div className="flex items-center gap-2">
//                         {prospect.linkedinUrl && (
//                           <Button variant="ghost" size="icon" asChild>
//                             <a href={prospect.linkedinUrl} target="_blank" rel="noopener noreferrer">
//                               <ExternalLink className="h-4 w-4" />
//                             </a>
//                           </Button>
//                         )}
//                         <ProspectActions prospectId={prospect.id} />
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
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

// import { Card, CardContent } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Mail, ExternalLink } from "lucide-react"
// import Link from "next/link"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { getProspects } from "@/lib/actions/prospects"
// import { ProspectActions } from "./prospect-actions"

// interface ProspectsListProps {
//   status?: string
// }

// export async function ProspectsList({ status }: ProspectsListProps) {
//   const prospects = await getProspects(status)

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

//   const getQualityScoreColor = (score: number) => {
//     if (score >= 90) return "text-green-600 dark:text-green-400"
//     if (score >= 75) return "text-blue-600 dark:text-blue-400"
//     if (score >= 60) return "text-yellow-600 dark:text-yellow-400"
//     return "text-red-600 dark:text-red-400"
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
//                     <Checkbox />
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
//                 {prospects.map((prospect) => (
//                   <tr key={prospect.id} className="border-b border-border hover:bg-muted/30 transition-colors">
//                     <td className="p-4">
//                       <Checkbox />
//                     </td>
//                     <td className="p-4">
//                       <Link
//                         href={`/dashboard/prospects/${prospect.id}`}
//                         className="flex items-center gap-3 hover:text-primary"
//                       >
//                         <Avatar className="h-10 w-10">
//                           <AvatarImage src={`/generic-placeholder-graphic.png?height=40&width=40`} />
//                           <AvatarFallback>
//                             {prospect.firstName?.[0] || ""}
//                             {prospect.lastName?.[0] || ""}
//                           </AvatarFallback>
//                         </Avatar>
//                         <div>
//                           <p className="font-medium">
//                             {prospect.firstName} {prospect.lastName}
//                           </p>
//                           <p className="text-sm text-muted-foreground">{prospect.email}</p>
//                         </div>
//                       </Link>
//                     </td>
//                     <td className="p-4">
//                       <div>
//                         <p className="font-medium">{prospect.company || "—"}</p>
//                         <p className="text-sm text-muted-foreground">{prospect.jobTitle || "—"}</p>
//                       </div>
//                     </td>
//                     <td className="p-4">
//                       <Badge variant="secondary" className={getStatusColor(prospect.status)}>
//                         {prospect.status.toLowerCase()}
//                       </Badge>
//                     </td>
//                     <td className="p-4">
//                       <div className="flex items-center gap-2">
//                         <div className={`text-2xl font-bold ${getQualityScoreColor(prospect.qualityScore || 0)}`}>
//                           {prospect.qualityScore || 0}
//                         </div>
//                         <span className="text-xs text-muted-foreground">/100</span>
//                       </div>
//                     </td>
//                     <td className="p-4">
//                       <div className="text-sm space-y-1">
//                         <div className="flex items-center gap-2">
//                           <Mail className="h-3 w-3 text-muted-foreground" />
//                           <span>
//                             {prospect.emailsOpened}/{prospect.emailsReceived} opened
//                           </span>
//                         </div>
//                         {prospect.emailsReplied > 0 && (
//                           <Badge variant="secondary" className="text-xs">
//                             {prospect.emailsReplied} Replied
//                           </Badge>
//                         )}
//                       </div>
//                     </td>
//                     <td className="p-4">
//                       <div className="flex items-center gap-2">
//                         {prospect.linkedinUrl && (
//                           <Button variant="ghost" size="icon" asChild>
//                             <a href={prospect.linkedinUrl} target="_blank" rel="noopener noreferrer">
//                               <ExternalLink className="h-4 w-4" />
//                             </a>
//                           </Button>
//                         )}
//                         <ProspectActions prospectId={prospect.id} />
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
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

// import { Card, CardContent } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Mail, ExternalLink } from "lucide-react"
// import Link from "next/link"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { getProspects } from "@/lib/actions/prospects"
// import { ProspectActions } from "./prospect-actions"

// interface ProspectsListProps {
//   status?: string
// }

// export async function ProspectsList({ status }: ProspectsListProps) {
//   const prospects = await getProspects(status)

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

//   const getQualityScoreColor = (score: number) => {
//     if (score >= 90) return "text-green-600 dark:text-green-400"
//     if (score >= 75) return "text-blue-600 dark:text-blue-400"
//     if (score >= 60) return "text-yellow-600 dark:text-yellow-400"
//     return "text-red-600 dark:text-red-400"
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
//                     <Checkbox />
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
//                 {prospects.map((prospect) => (
//                   <tr key={prospect.id} className="border-b border-border hover:bg-muted/30 transition-colors">
//                     <td className="p-4">
//                       <Checkbox />
//                     </td>
//                     <td className="p-4">
//                       <Link
//                         href={`/dashboard/prospects/${prospect.id}`}
//                         className="flex items-center gap-3 hover:text-primary"
//                       >
//                         <Avatar className="h-10 w-10">
//                           <AvatarImage src={`/generic-placeholder-graphic.png?height=40&width=40`} />
//                           <AvatarFallback>
//                             {prospect.firstName?.[0] || ""}
//                             {prospect.lastName?.[0] || ""}
//                           </AvatarFallback>
//                         </Avatar>
//                         <div>
//                           <p className="font-medium">
//                             {prospect.firstName} {prospect.lastName}
//                           </p>
//                           <p className="text-sm text-muted-foreground">{prospect.email}</p>
//                         </div>
//                       </Link>
//                     </td>
//                     <td className="p-4">
//                       <div>
//                         <p className="font-medium">{prospect.company || "—"}</p>
//                         <p className="text-sm text-muted-foreground">{prospect.jobTitle || "—"}</p>
//                       </div>
//                     </td>
//                     <td className="p-4">
//                       <Badge variant="secondary" className={getStatusColor(prospect.status)}>
//                         {prospect.status.toLowerCase()}
//                       </Badge>
//                     </td>
//                     <td className="p-4">
//                       <div className="flex items-center gap-2">
//                         <div className={`text-2xl font-bold ${getQualityScoreColor(prospect.qualityScore ?? 0)}`}>
//                           {prospect.qualityScore ?? 0}
//                         </div>
//                         <span className="text-xs text-muted-foreground">/100</span>
//                       </div>
//                     </td>
//                     <td className="p-4">
//                       <div className="text-sm space-y-1">
//                         <div className="flex items-center gap-2">
//                           <Mail className="h-3 w-3 text-muted-foreground" />
//                           <span>
//                             {prospect.emailsOpened}/{prospect.emailsReceived} opened
//                           </span>
//                         </div>
//                         {prospect.emailsReplied > 0 && (
//                           <Badge variant="secondary" className="text-xs">
//                             {prospect.emailsReplied} Replied
//                           </Badge>
//                         )}
//                       </div>
//                     </td>
//                     <td className="p-4">
//                       <div className="flex items-center gap-2">
//                         {prospect.linkedinUrl && (
//                           <Button variant="ghost" size="icon" asChild>
//                             <a href={prospect.linkedinUrl} target="_blank" rel="noopener noreferrer">
//                               <ExternalLink className="h-4 w-4" />
//                             </a>
//                           </Button>
//                         )}
//                         <ProspectActions prospectId={prospect.id} />
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
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

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Mail, ExternalLink } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getProspects } from "@/lib/actions/prospects"
import { ProspectActions } from "./prospect-actions"

interface ProspectsListProps {
  status?: string
  folderId?: string | null
  searchQuery?: string
  isTrashed?: boolean
}

export async function ProspectsList({ 
  status, 
  folderId, 
  searchQuery, 
  isTrashed 
}: ProspectsListProps) {
  // Pass all the parameters to getProspects
  const prospects = await getProspects(status, folderId, searchQuery, isTrashed)

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

  const getQualityScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 dark:text-green-400"
    if (score >= 75) return "text-blue-600 dark:text-blue-400"
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
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
                    <Checkbox />
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
                {prospects.map((prospect) => (
                  <tr key={prospect.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <Checkbox />
                    </td>
                    <td className="p-4">
                      <Link
                        href={`/dashboard/prospects/${prospect.id}`}
                        className="flex items-center gap-3 hover:text-primary"
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={`/generic-placeholder-graphic.png?height=40&width=40`} />
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
                      <div className="flex items-center gap-2">
                        <div className={`text-2xl font-bold ${getQualityScoreColor(prospect.qualityScore ?? 0)}`}>
                          {prospect.qualityScore ?? 0}
                        </div>
                        <span className="text-xs text-muted-foreground">/100</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm space-y-1">
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <span>
                            {prospect.emailsOpened}/{prospect.emailsReceived} opened
                          </span>
                        </div>
                        {prospect.emailsReplied > 0 && (
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
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {prospects.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground mb-4">No prospects found</p>
            <Button asChild>
              <Link href="/dashboard/prospects/new">Add Your First Prospect</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}