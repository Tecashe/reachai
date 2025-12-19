
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AddProspectForm } from "@/components/prospects/add-prospect-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewProspectPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/prospects">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add Prospect</h1>
          <p className="text-muted-foreground">Manually add a new prospect to your database</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Prospect Information</CardTitle>
          <CardDescription>Enter the prospect's details. Email is required.</CardDescription>
        </CardHeader>
        <CardContent>
          <AddProspectForm />
        </CardContent>
      </Card>
    </div>
  )
}
