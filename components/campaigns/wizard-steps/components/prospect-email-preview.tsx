"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, User, Building2, Sparkles, Mail, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import type { SequenceStep } from "@/lib/types/sequence"

interface Prospect {
    id: string
    email: string
    firstName?: string | null
    lastName?: string | null
    company?: string | null
    jobTitle?: string | null
    researchData?: {
        companyInfo?: string
        recentNews?: string[]
        painPoints?: string[]
        talkingPoints?: string[]
        competitorTools?: string[]
        qualityScore?: number
    } | null
}

interface ProspectEmailPreviewProps {
    prospects: Prospect[]
    steps: SequenceStep[]
    className?: string
}

export function ProspectEmailPreview({ prospects, steps, className }: ProspectEmailPreviewProps) {
    const [currentProspectIndex, setCurrentProspectIndex] = React.useState(0)
    const [currentStepIndex, setCurrentStepIndex] = React.useState(0)

    const currentProspect = prospects[currentProspectIndex]
    const currentStep = steps[currentStepIndex]

    if (!currentProspect || !currentStep) {
        return (
            <Card className={cn("", className)}>
                <CardContent className="py-12 text-center text-muted-foreground">
                    No prospects or steps to preview
                </CardContent>
            </Card>
        )
    }

    // Build variables from prospect data
    const variables = buildVariables(currentProspect)

    // Render the email content with variables replaced
    const renderedSubject = replaceVariables(currentStep.subject || "", variables)
    const renderedBody = replaceVariables(currentStep.body || "", variables)

    const handlePrevProspect = () => {
        setCurrentProspectIndex((prev) => (prev > 0 ? prev - 1 : prospects.length - 1))
    }

    const handleNextProspect = () => {
        setCurrentProspectIndex((prev) => (prev < prospects.length - 1 ? prev + 1 : 0))
    }

    return (
        <Card className={cn("flex flex-col h-full", className)}>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            Email Preview
                        </CardTitle>
                        <CardDescription>
                            Preview how emails will look for each prospect
                        </CardDescription>
                    </div>
                    <Badge variant="secondary" className="font-mono">
                        {currentProspectIndex + 1} / {prospects.length}
                    </Badge>
                </div>
            </CardHeader>

            <Separator />

            {/* Prospect Selector */}
            <div className="flex items-center gap-3 p-4 border-b bg-muted/30">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    onClick={handlePrevProspect}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Avatar className="h-10 w-10 shrink-0">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-primary/10 text-primary text-sm">
                            {getInitials(currentProspect.firstName, currentProspect.lastName)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                        <div className="font-medium text-sm truncate">
                            {currentProspect.firstName} {currentProspect.lastName}
                        </div>
                        <div className="text-xs text-muted-foreground truncate flex items-center gap-1.5">
                            {currentProspect.jobTitle && (
                                <>
                                    <span>{currentProspect.jobTitle}</span>
                                    {currentProspect.company && <span>•</span>}
                                </>
                            )}
                            {currentProspect.company && (
                                <span className="flex items-center gap-1">
                                    <Building2 className="h-3 w-3" />
                                    {currentProspect.company}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    onClick={handleNextProspect}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>

            {/* Step Selector */}
            {steps.length > 1 && (
                <div className="px-4 pt-3">
                    <Tabs
                        value={currentStepIndex.toString()}
                        onValueChange={(v) => setCurrentStepIndex(parseInt(v))}
                    >
                        <TabsList className="h-8 w-full justify-start overflow-x-auto">
                            {steps.map((step, index) => (
                                <TabsTrigger
                                    key={step.id}
                                    value={index.toString()}
                                    className="text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                                >
                                    Step {index + 1}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>
                </div>
            )}

            {/* Email Preview */}
            <ScrollArea className="flex-1 p-4">
                {currentStep.stepType === "EMAIL" ? (
                    <div className="space-y-4">
                        {/* Subject Preview */}
                        <div className="space-y-1">
                            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Subject
                            </div>
                            <div className="p-3 rounded-lg border bg-card">
                                <span className="text-sm font-medium">{renderedSubject || "No subject"}</span>
                            </div>
                        </div>

                        {/* Body Preview */}
                        <div className="space-y-1">
                            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Body
                            </div>
                            <div className="p-4 rounded-lg border bg-card">
                                <div
                                    className="text-sm whitespace-pre-wrap leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: formatBody(renderedBody) }}
                                />
                            </div>
                        </div>

                        {/* Variables Used */}
                        <div className="pt-2">
                            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                                Variables Used
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {Object.entries(variables)
                                    .filter(([_, value]) => value)
                                    .map(([key, value]) => (
                                        <Badge
                                            key={key}
                                            variant="outline"
                                            className="text-[10px] font-mono bg-purple-50 dark:bg-purple-950/30"
                                        >
                                            <Sparkles className="h-2.5 w-2.5 mr-1 text-purple-500" />
                                            {`{{${key}}}`}: {truncate(value, 15)}
                                        </Badge>
                                    ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
                        Preview not available for {currentStep.stepType} steps
                    </div>
                )}
            </ScrollArea>

            {/* Research Quality */}
            {currentProspect.researchData?.qualityScore && (
                <div className="p-3 border-t bg-muted/20 flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">Research Quality</div>
                    <Badge
                        variant={currentProspect.researchData.qualityScore >= 70 ? "default" : "secondary"}
                        className={cn(
                            currentProspect.researchData.qualityScore >= 70
                                ? "bg-green-500/10 text-green-600 border-green-500/20"
                                : ""
                        )}
                    >
                        {currentProspect.researchData.qualityScore}%
                    </Badge>
                </div>
            )}
        </Card>
    )
}

// Helper: Build variables from prospect data including research
function buildVariables(prospect: Prospect): Record<string, string> {
    const research = prospect.researchData || {}

    return {
        firstName: prospect.firstName || "there",
        lastName: prospect.lastName || "",
        fullName: [prospect.firstName, prospect.lastName].filter(Boolean).join(" ") || "there",
        email: prospect.email,
        company: prospect.company || "your company",
        jobTitle: prospect.jobTitle || "",
        // AI Research variables
        icebreaker: research.talkingPoints?.[0] || "",
        painPoint: research.painPoints?.[0] || "",
        companyInfo: research.companyInfo || "",
        recentNews: research.recentNews?.[0] || "",
        talkingPoints: research.talkingPoints?.[0] || "",
        competitorInfo: research.competitorTools?.join(", ") || "",
        valueProposition: "", // Would come from sender settings
    }
}

// Helper: Replace template variables with values
function replaceVariables(template: string, variables: Record<string, string>): string {
    if (!template) return ""

    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
        return variables[key] ?? match
    })
}

// Helper: Get initials from name
function getInitials(firstName?: string | null, lastName?: string | null): string {
    const first = firstName?.charAt(0) || ""
    const last = lastName?.charAt(0) || ""
    return (first + last).toUpperCase() || "?"
}

// Helper: Format body with line breaks
function formatBody(text: string): string {
    if (!text) return ""
    // Convert newlines to <br> and escape HTML
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\n/g, "<br>")
}

// Helper: Truncate text
function truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + "..."
}
