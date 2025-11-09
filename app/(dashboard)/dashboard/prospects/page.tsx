// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Search, Plus, Download } from "lucide-react"
// import Link from "next/link"
// import { ProspectsList } from "@/components/prospects/prospects-list"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { UploadProspectsDialog } from "@/components/prospects/upload-prospects-dialog"

// export default function ProspectsPage() {
//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">Prospects</h1>
//           <p className="text-muted-foreground">Manage your prospect database</p>
//         </div>
//         <div className="flex items-center gap-2">
//           <Button variant="outline">
//             <Download className="h-4 w-4 mr-2" />
//             Export
//           </Button>
//           <UploadProspectsDialog />
//           <Button asChild>
//             <Link href="/dashboard/prospects/new">
//               <Plus className="h-4 w-4 mr-2" />
//               Add Prospect
//             </Link>
//           </Button>
//         </div>
//       </div>

//       <div className="flex items-center gap-4">
//         <div className="relative flex-1 max-w-md">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//           <Input placeholder="Search prospects..." className="pl-9" />
//         </div>
//       </div>

//       <Tabs defaultValue="all" className="space-y-4">
//         <TabsList>
//           <TabsTrigger value="all">All Prospects</TabsTrigger>
//           <TabsTrigger value="active">Active</TabsTrigger>
//           <TabsTrigger value="contacted">Contacted</TabsTrigger>
//           <TabsTrigger value="replied">Replied</TabsTrigger>
//           <TabsTrigger value="unsubscribed">Unsubscribed</TabsTrigger>
//         </TabsList>

//         <TabsContent value="all" className="space-y-4">
//           <ProspectsList />
//         </TabsContent>

//         <TabsContent value="active" className="space-y-4">
//           <ProspectsList status="ACTIVE" />
//         </TabsContent>

//         <TabsContent value="contacted" className="space-y-4">
//           <ProspectsList status="CONTACTED" />
//         </TabsContent>

//         <TabsContent value="replied" className="space-y-4">
//           <ProspectsList status="REPLIED" />
//         </TabsContent>

//         <TabsContent value="unsubscribed" className="space-y-4">
//           <ProspectsList status="UNSUBSCRIBED" />
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }


// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Search, Plus, Download } from "lucide-react"
// import Link from "next/link"
// import { ProspectsList } from "@/components/prospects/prospects-list"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { UploadProspectsDialog } from "@/components/prospects/upload-prospects-dialog"

// export default function ProspectsPage() {
//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">Prospects</h1>
//           <p className="text-muted-foreground">Manage your prospect database</p>
//         </div>
//         <div className="flex items-center gap-2">
//           <Button variant="outline">
//             <Download className="h-4 w-4 mr-2" />
//             Export
//           </Button>
//           <UploadProspectsDialog />
//           <Button asChild>
//             <Link href="/dashboard/prospects/new">
//               <Plus className="h-4 w-4 mr-2" />
//               Add Prospect
//             </Link>
//           </Button>
//         </div>
//       </div>

//       <div className="flex items-center gap-4">
//         <div className="relative flex-1 max-w-md">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//           <Input placeholder="Search prospects..." className="pl-9" />
//         </div>
//       </div>

//       <Tabs defaultValue="all" className="space-y-4">
//         <TabsList>
//           <TabsTrigger value="all">All Prospects</TabsTrigger>
//           <TabsTrigger value="ACTIVE">Active</TabsTrigger>
//           <TabsTrigger value="CONTACTED">Contacted</TabsTrigger>
//           <TabsTrigger value="REPLIED">Replied</TabsTrigger>
//           <TabsTrigger value="UNSUBSCRIBED">Unsubscribed</TabsTrigger>
//         </TabsList>

//         <TabsContent value="all" className="space-y-4">
//           <ProspectsList />
//         </TabsContent>

//         <TabsContent value="ACTIVE" className="space-y-4">
//           <ProspectsList status="ACTIVE" />
//         </TabsContent>

//         <TabsContent value="CONTACTED" className="space-y-4">
//           <ProspectsList status="CONTACTED" />
//         </TabsContent>

//         <TabsContent value="REPLIED" className="space-y-4">
//           <ProspectsList status="REPLIED" />
//         </TabsContent>

//         <TabsContent value="UNSUBSCRIBED" className="space-y-4">
//           <ProspectsList status="UNSUBSCRIBED" />
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Download } from "lucide-react"
import Link from "next/link"
import { ProspectsList } from "@/components/prospects/prospects-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UploadProspectsDialog } from "@/components/prospects/upload-prospects-dialog"
import { ApolloLeadFinderDialog } from "@/components/prospects/apollo-lead-finder-dialog"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

export default async function ProspectsPage() {
  const { userId } = await auth()
  const user = userId
    ? await db.user.findUnique({
        where: { clerkId: userId },
        select: {
          subscriptionTier: true,
          researchCredits: true,
        },
      })
    : null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Prospects</h1>
          <p className="text-muted-foreground">Manage your prospect database</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <ApolloLeadFinderDialog
            subscriptionTier={user?.subscriptionTier || "FREE"}
            researchCredits={user?.researchCredits || 0}
          />
          <UploadProspectsDialog />
          <Button asChild>
            <Link href="/dashboard/prospects/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Prospect
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search prospects..." className="pl-9" />
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Prospects</TabsTrigger>
          <TabsTrigger value="ACTIVE">Active</TabsTrigger>
          <TabsTrigger value="CONTACTED">Contacted</TabsTrigger>
          <TabsTrigger value="REPLIED">Replied</TabsTrigger>
          <TabsTrigger value="UNSUBSCRIBED">Unsubscribed</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <ProspectsList />
        </TabsContent>

        <TabsContent value="ACTIVE" className="space-y-4">
          <ProspectsList status="ACTIVE" />
        </TabsContent>

        <TabsContent value="CONTACTED" className="space-y-4">
          <ProspectsList status="CONTACTED" />
        </TabsContent>

        <TabsContent value="REPLIED" className="space-y-4">
          <ProspectsList status="REPLIED" />
        </TabsContent>

        <TabsContent value="UNSUBSCRIBED" className="space-y-4">
          <ProspectsList status="UNSUBSCRIBED" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
