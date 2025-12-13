import { notFound } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Pencil,
  Copy,
  Trash2,
  Star,
  Clock,
  Eye,
  TrendingUp,
  Mail,
  Sparkles,
  Monitor,
  Smartphone,
  Tablet,
  MoreHorizontal,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getTemplate } from "@/lib/actions/templates"
import type { TemplateVariable } from "@/lib/types"

interface TemplateDetailPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: TemplateDetailPageProps) {
  const { id } = await params
  const result = await getTemplate(id)

  return {
    title: result.template?.name || "Template",
    description: result.template?.subject || "View email template",
  }
}

export default async function TemplateDetailPage({ params }: TemplateDetailPageProps) {
  const { id } = await params
  const result = await getTemplate(id)

  if (result.error || !result.template) {
    notFound()
  }

  const template = result.template
  const openRate = template.avgOpenRate ?? 0
  const replyRate = template.avgReplyRate ?? 0

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      welcome: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      newsletter: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
      promotional: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
      transactional: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      followup: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
      notification: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    }
    return colors[category?.toLowerCase()] || "bg-muted text-muted-foreground border-border"
  }

  const renderContent = () => {
    if (!template.body) {
      return <div className="flex items-center justify-center h-48 text-muted-foreground">No content</div>
    }

    if (template.body.includes("<") && (template.body.includes("</") || template.body.includes("/>"))) {
      return (
        <div
          className="prose prose-sm dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: template.body }}
        />
      )
    }

    return <div className="whitespace-pre-wrap text-sm leading-relaxed">{template.body}</div>
  }

  const variables: TemplateVariable[] = Array.isArray(template.variables)
    ? (template.variables as unknown as TemplateVariable[])
    : []

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
            <Link href="/dashboard/templates">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <div className="flex items-center gap-3">
            {template.aiGenerated && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10">
                <Sparkles className="w-3 h-3 text-primary" />
                <span className="text-[10px] font-medium text-primary">AI</span>
              </div>
            )}
            {template.category && (
              <Badge variant="outline" className={getCategoryColor(template.category)}>
                {template.category}
              </Badge>
            )}
            {template.isFavorite && <Star className="w-4 h-4 text-amber-500 fill-amber-500" />}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/templates/${id}/edit`}>
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Copy className="w-4 h-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Star className="w-4 h-4 mr-2" />
                {template.isFavorite ? "Remove from favorites" : "Add to favorites"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main content */}
      <div className="container max-w-6xl py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Template info and preview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div>
              <h1 className="text-2xl font-semibold tracking-tight mb-2">{template.name}</h1>
              <p className="text-muted-foreground">{template.subject || "No subject line"}</p>
            </div>

            {/* Email preview */}
            <div className="rounded-xl border border-border overflow-hidden">
              {/* Preview header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-muted/30">
                <span className="text-sm font-medium">Email Preview</span>
                <div className="flex items-center gap-1 p-1 rounded-lg bg-background/50">
                  <Button variant="secondary" size="icon" className="h-6 w-6">
                    <Monitor className="w-3.5 h-3.5 text-primary" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Tablet className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Smartphone className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>

              {/* Email frame */}
              <div className="p-6 bg-muted/20">
                <div className="max-w-[600px] mx-auto bg-background rounded-lg shadow-lg border border-border overflow-hidden">
                  {/* Email header */}
                  <div className="px-4 py-3 border-b border-border/50 bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{template.subject || "No subject"}</p>
                        <p className="text-xs text-muted-foreground">From: Your Company</p>
                      </div>
                    </div>
                  </div>
                  {/* Email body */}
                  <div className="p-6">{renderContent()}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Sidebar */}
          <div className="space-y-6">
            {/* Performance */}
            <div className="rounded-xl border border-border/50 p-4">
              <h3 className="font-medium mb-4">Performance</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-muted/50">
                  <div className="flex items-center gap-2 mb-1">
                    <Eye className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Open Rate</span>
                  </div>
                  <p className="text-2xl font-semibold">{openRate.toFixed(1)}%</p>
                </div>
                <div className="p-3 rounded-xl bg-muted/50">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Reply Rate</span>
                  </div>
                  <p className="text-2xl font-semibold">{replyRate.toFixed(1)}%</p>
                </div>
              </div>
              {template.timesUsed && template.timesUsed > 0 && (
                <p className="text-xs text-muted-foreground mt-3 text-center">
                  Used {template.timesUsed.toLocaleString()} times
                </p>
              )}
            </div>

            {/* Details */}
            <div className="rounded-xl border border-border/50 p-4">
              <h3 className="font-medium mb-4">Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span>
                    {new Date(template.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Updated</span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    {new Date(template.updatedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                {template.category && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Category</span>
                    <Badge variant="secondary">{template.category}</Badge>
                  </div>
                )}
              </div>
            </div>

            {/* Variables */}
            {variables.length > 0 && (
              <div className="rounded-xl border border-border/50 p-4">
                <h3 className="font-medium mb-4">Variables ({variables.length})</h3>
                <div className="flex flex-wrap gap-1.5">
                  {variables.map((variable: TemplateVariable, i: number) => (
                    <Badge key={i} variant="outline" className="text-xs font-mono">
                      {`{{${variable.name}}}`}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Quick actions */}
            <div className="space-y-2">
              <Button className="w-full" asChild>
                <Link href={`/dashboard/templates/${id}/edit`}>
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit Template
                </Link>
              </Button>
              <Button variant="outline" className="w-full bg-transparent">
                <Copy className="w-4 h-4 mr-2" />
                Duplicate
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
