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

// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Search, Plus, Download } from "lucide-react"
// import Link from "next/link"
// import { ProspectsList } from "@/components/prospects/prospects-list"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { UploadProspectsDialog } from "@/components/prospects/upload-prospects-dialog"
// import { ApolloLeadFinderDialog } from "@/components/prospects/apollo-lead-finder-dialog"
// import { auth } from "@clerk/nextjs/server"
// import { db } from "@/lib/db"

// export default async function ProspectsPage() {
//   const { userId } = await auth()
//   const user = userId
//     ? await db.user.findUnique({
//         where: { clerkId: userId },
//         select: {
//           subscriptionTier: true,
//           researchCredits: true,
//         },
//       })
//     : null

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
//           <ApolloLeadFinderDialog
//             subscriptionTier={user?.subscriptionTier || "FREE"}
//             researchCredits={user?.researchCredits || 0}
//           />
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



// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Search, Plus, Download } from "lucide-react"
// import Link from "next/link"
// import { ProspectsList } from "@/components/prospects/prospects-list"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { UploadProspectsDialog } from "@/components/prospects/upload-prospects-dialog"
// import { ApolloLeadFinderDialog } from "@/components/prospects/apollo-lead-finder-dialog"
// import { CRMImportDialog } from "@/components/prospects/crm-import-dialog"
// import { auth } from "@clerk/nextjs/server"
// import { db } from "@/lib/db"

// export default async function ProspectsPage() {
//   const { userId } = await auth()
//   const user = userId
//     ? await db.user.findUnique({
//         where: { clerkId: userId },
//         select: {
//           subscriptionTier: true,
//           researchCredits: true,
//         },
//       })
//     : null

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
//           <CRMImportDialog onImportComplete={() => {}} />
//           <ApolloLeadFinderDialog
//             subscriptionTier={user?.subscriptionTier || "FREE"}
//             researchCredits={user?.researchCredits || 0}
//           />
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


// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Search, Plus, Download } from "lucide-react"
// import Link from "next/link"
// import { ProspectsList } from "@/components/prospects/prospects-list"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { UploadProspectsDialog } from "@/components/prospects/upload-prospects-dialog"
// import { ApolloLeadFinderDialog } from "@/components/prospects/apollo-lead-finder-dialog"
// import { CRMImportDialog } from "@/components/prospects/crm-import-dialog"
// import { auth } from "@clerk/nextjs/server"
// import { db } from "@/lib/db"

// export default async function ProspectsPage() {
//   const { userId } = await auth()
//   const user = userId
//     ? await db.user.findUnique({
//         where: { clerkId: userId },
//         select: {
//           subscriptionTier: true,
//           researchCredits: true,
//         },
//       })
//     : null

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
//           <CRMImportDialog />
//           <ApolloLeadFinderDialog
//             subscriptionTier={user?.subscriptionTier || "FREE"}
//             researchCredits={user?.researchCredits || 0}
//           />
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


"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Download, Loader2 } from "lucide-react"
import Link from "next/link"
import { ProspectsList } from "@/components/prospects/prospects-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UploadProspectsDialog } from "@/components/prospects/upload-prospects-dialog"
import { ApolloLeadFinderDialog } from "@/components/prospects/apollo-lead-finder-dialog"
import { CRMImportDialog } from "@/components/prospects/crm-import-dialog"
import { FolderSidebar } from "@/components/prospects/folder-sidebar"
import { getFolders } from "@/lib/actions/prospect-folders"
import { toast } from "sonner"

export default function ProspectsPage() {
  const [folders, setFolders] = useState<any[]>([])
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
  const [showTrash, setShowTrash] = useState(false)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    loadFolders()
  }, [])

  const loadFolders = async () => {
    setLoading(true)
    try {
      const data = await getFolders()
      setFolders(data)
    } catch (error) {
      toast.error("Failed to load folders")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-full">
      <FolderSidebar
        folders={folders}
        selectedFolderId={selectedFolderId}
        onSelectFolder={(id) => {
          setSelectedFolderId(id)
          setShowTrash(false)
        }}
        showTrash={showTrash}
        onShowTrash={() => {
          setShowTrash(true)
          setSelectedFolderId(null)
        }}
        trashedCount={0}
      />

      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {showTrash
                ? "Trash"
                : selectedFolderId
                  ? folders.find((f) => f.id === selectedFolderId)?.name
                  : "All Prospects"}
            </h1>
            <p className="text-muted-foreground">{showTrash ? "Deleted prospects" : "Manage your prospect database"}</p>
          </div>
          {!showTrash && (
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <CRMImportDialog />
              <ApolloLeadFinderDialog subscriptionTier="FREE" researchCredits={0} />
              <UploadProspectsDialog />
              <Button asChild>
                <Link href="/dashboard/prospects/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Prospect
                </Link>
              </Button>
            </div>
          )}
        </div>

        {!showTrash && (
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search prospects..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : showTrash ? (
          <ProspectsList folderId={null} isTrashed={true} searchQuery={searchQuery} />
        ) : (
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All Prospects</TabsTrigger>
              <TabsTrigger value="ACTIVE">Active</TabsTrigger>
              <TabsTrigger value="CONTACTED">Contacted</TabsTrigger>
              <TabsTrigger value="REPLIED">Replied</TabsTrigger>
              <TabsTrigger value="UNSUBSCRIBED">Unsubscribed</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <ProspectsList folderId={selectedFolderId} searchQuery={searchQuery} />
            </TabsContent>

            <TabsContent value="ACTIVE" className="space-y-4">
              <ProspectsList status="ACTIVE" folderId={selectedFolderId} searchQuery={searchQuery} />
            </TabsContent>

            <TabsContent value="CONTACTED" className="space-y-4">
              <ProspectsList status="CONTACTED" folderId={selectedFolderId} searchQuery={searchQuery} />
            </TabsContent>

            <TabsContent value="REPLIED" className="space-y-4">
              <ProspectsList status="REPLIED" folderId={selectedFolderId} searchQuery={searchQuery} />
            </TabsContent>

            <TabsContent value="UNSUBSCRIBED" className="space-y-4">
              <ProspectsList status="UNSUBSCRIBED" folderId={selectedFolderId} searchQuery={searchQuery} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}
