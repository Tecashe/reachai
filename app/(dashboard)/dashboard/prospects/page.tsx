import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Download } from "lucide-react"
import Link from "next/link"
import { ProspectsList } from "@/components/prospects/prospects-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UploadProspectsDialog } from "@/components/prospects/upload-prospects-dialog"

export default function ProspectsPage() {
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
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="contacted">Contacted</TabsTrigger>
          <TabsTrigger value="replied">Replied</TabsTrigger>
          <TabsTrigger value="unsubscribed">Unsubscribed</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <ProspectsList />
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <ProspectsList status="ACTIVE" />
        </TabsContent>

        <TabsContent value="contacted" className="space-y-4">
          <ProspectsList status="CONTACTED" />
        </TabsContent>

        <TabsContent value="replied" className="space-y-4">
          <ProspectsList status="REPLIED" />
        </TabsContent>

        <TabsContent value="unsubscribed" className="space-y-4">
          <ProspectsList status="UNSUBSCRIBED" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
