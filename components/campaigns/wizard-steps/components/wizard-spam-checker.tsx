
"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, CheckCircle2, ShieldAlert } from "lucide-react"
import { cn } from "@/lib/utils"
import type { SpamAnalysisResult } from "@/lib/services/spam-analysis"

interface WizardSpamCheckerProps {
    analysis: SpamAnalysisResult | null
    isLoading?: boolean
}

export function WizardSpamChecker({ analysis, isLoading }: WizardSpamCheckerProps) {
    if (isLoading) {
        return (
            <Card>
                <CardContent className="py-6 text-center text-muted-foreground animate-pulse">
                    Analyzing content for spam triggers...
                </CardContent>
            </Card>
        )
    }

    if (!analysis) return null

    const getScoreColor = (score: number) => {
        if (score < 40) return "text-green-600"
        if (score < 70) return "text-yellow-600"
        return "text-red-600"
    }

    const getProgressColor = (score: number) => {
        if (score < 40) return "bg-green-600"
        if (score < 70) return "bg-yellow-600"
        return "bg-red-600"
    }

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <ShieldAlert className="h-4 w-4" />
                        Spam Score
                    </div>
                    <span className={cn("text-lg font-bold", getScoreColor(analysis.score))}>
                        {analysis.score}/100
                    </span>
                </CardTitle>
                <CardDescription>
                    Risk Level: <span className="font-medium text-foreground">{analysis.riskLevel}</span>
                </CardDescription>
                <Progress
                    value={analysis.score}
                    className="h-2 mt-2"
                    indicatorClassName={getProgressColor(analysis.score)}
                />
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
                {(analysis.triggers.length > 0 || analysis.formattingIssues.length > 0) ? (
                    <div className="space-y-3">
                        {analysis.triggers.length > 0 && (
                            <div className="space-y-1">
                                <p className="text-xs font-semibold text-muted-foreground uppercase">Trigger Words</p>
                                <div className="flex flex-wrap gap-1">
                                    {analysis.triggers.map((t, i) => (
                                        <span key={i} className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                                            {t.word}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {analysis.formattingIssues.length > 0 && (
                            <div className="space-y-1">
                                <p className="text-xs font-semibold text-muted-foreground uppercase">Formatting Issues</p>
                                <ul className="text-xs space-y-1">
                                    {analysis.formattingIssues.map((issue, i) => (
                                        <li key={i} className="flex gap-2 text-yellow-700 dark:text-yellow-400">
                                            <AlertCircle className="h-3 w-3 shrink-0 mt-0.5" />
                                            <span>{issue.description}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                        <CheckCircle2 className="h-4 w-4" />
                        <p>No spam issues detected. Good job!</p>
                    </div>
                )}

                {analysis.suggestions.length > 0 && (
                    <div className="bg-muted/50 rounded-lg p-3 text-xs">
                        <p className="font-semibold mb-1">Suggestions</p>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                            {analysis.suggestions.map((s, i) => (
                                <li key={i}>{s}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
