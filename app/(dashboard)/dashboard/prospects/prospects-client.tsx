"use client"

import { useState } from "react"
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

interface ProspectsPageClientProps {
  initialFolders: any[]
  initialTrashedCount: number
}

export function ProspectsPageClient({ 
  initialFolders, 
  initialTrashedCount 
}: ProspectsPageClientProps) {
  const [folders] = useState(initialFolders)
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
  const [showTrash, setShowTrash] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [trashedCount] = useState(initialTrashedCount)

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
        trashedCount={trashedCount}
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
            <p className="text-muted-foreground">
              {showTrash ? "Deleted prospects" : "Manage your prospect database"}
            </p>
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

        {showTrash ? (
          <ProspectsList 
            isTrashed={true} 
            searchQuery={searchQuery} 
          />
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
              <ProspectsList 
                folderId={selectedFolderId} 
                searchQuery={searchQuery} 
              />
            </TabsContent>

            <TabsContent value="ACTIVE" className="space-y-4">
              <ProspectsList 
                status="ACTIVE" 
                folderId={selectedFolderId} 
                searchQuery={searchQuery} 
              />
            </TabsContent>

            <TabsContent value="CONTACTED" className="space-y-4">
              <ProspectsList 
                status="CONTACTED" 
                folderId={selectedFolderId} 
                searchQuery={searchQuery} 
              />
            </TabsContent>

            <TabsContent value="REPLIED" className="space-y-4">
              <ProspectsList 
                status="REPLIED" 
                folderId={selectedFolderId} 
                searchQuery={searchQuery} 
              />
            </TabsContent>

            <TabsContent value="UNSUBSCRIBED" className="space-y-4">
              <ProspectsList 
                status="UNSUBSCRIBED" 
                folderId={selectedFolderId} 
                searchQuery={searchQuery} 
              />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}