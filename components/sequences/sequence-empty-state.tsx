"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, FileText, ArrowRight, AlertCircle } from 'lucide-react'
import Link from "next/link"
import { CreateSequenceDialog } from "./create-sequence-dialog"

interface SequencesEmptyStateProps {
  hasTemplates: boolean
}

export function SequencesEmptyState({ hasTemplates }: SequencesEmptyStateProps) {
  if (!hasTemplates) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          <div className="rounded-full bg-muted p-4 mb-4">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          
          <h3 className="text-lg font-semibold mb-2">Create Templates First</h3>
          <p className="text-sm text-muted-foreground max-w-md mb-6">
            Before creating sequences, you need to create email templates. Templates are the foundation of your automated follow-up campaigns.
          </p>

          <Alert className="max-w-md mb-6 border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950">
            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <AlertDescription className="text-sm text-amber-800 dark:text-amber-200">
              <strong>Quick Start:</strong> Go to Templates and create your first email template. You can use our template library or create your own from scratch.
            </AlertDescription>
          </Alert>

          <Link href="/dashboard/templates">
            <Button size="lg">
              <FileText className="h-4 w-4 mr-2" />
              Go to Templates
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center p-12 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <Mail className="h-8 w-8 text-muted-foreground" />
        </div>
        
        <h3 className="text-lg font-semibold mb-2">No Sequences Yet</h3>
        <p className="text-sm text-muted-foreground max-w-md mb-6">
          Create your first email sequence to automatically follow up with prospects. Sequences help you stay top-of-mind without manual work.
        </p>

        <div className="bg-muted/50 rounded-lg p-4 max-w-md mb-6">
          <h4 className="font-medium text-sm mb-2">How sequences work:</h4>
          <ol className="text-left text-sm text-muted-foreground space-y-1">
            <li>1. Choose a campaign and template</li>
            <li>2. Set the delay between emails</li>
            <li>3. Add conditions (skip if replied, etc.)</li>
            <li>4. Emails send automatically</li>
          </ol>
        </div>

        <CreateSequenceDialog />
      </CardContent>
    </Card>
  )
}
