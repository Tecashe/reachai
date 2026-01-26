
"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ShieldAlert, Sparkles, Wand2 } from "lucide-react"
import { WizardSpamChecker } from "./wizard-spam-checker"
import { UpgradePrompt } from "../../common/upgrade-prompt"
import { toast } from "sonner"
import { analyzeSpamScore, SpamAnalysisResult } from "@/lib/services/spam-analysis"

interface WizardStepEditorProps {
    step: any
    onUpdate: (updates: any) => void
    isPaidUser: boolean
}

export function WizardStepEditor({ step, onUpdate, isPaidUser }: WizardStepEditorProps) {
    const [spamAnalysis, setSpamAnalysis] = useState<SpamAnalysisResult | null>(null)
    const [isAnalyzingSpam, setIsAnalyzingSpam] = useState(false)
    const [isGeneratingSpintax, setIsGeneratingSpintax] = useState(false)

    const handleSpamCheck = () => {
        if (!isPaidUser) return // Should be handled by UI state

        setIsAnalyzingSpam(true)
        // Simulate API delay or use client-side logic
        setTimeout(() => {
            const result = analyzeSpamScore(step.subject || "", step.body || "")
            setSpamAnalysis(result)
            setIsAnalyzingSpam(false)
        }, 600)
    }

    const handleGenerateSpintax = async () => {
        if (!step.body) return
        setIsGeneratingSpintax(true)

        try {
            const response = await fetch("/api/ai/spintax", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: step.body }),
            })

            const data = await response.json()
            if (data.success) {
                onUpdate({ body: data.data.spintaxText })
                toast.success("Spintax applied successfully!")
            } else {
                toast.error("Failed to generate spintax")
            }
        } catch (error) {
            toast.error("Error generating spintax")
        } finally {
            setIsGeneratingSpintax(false)
        }
    }

    return (
        <div className="space-y-4 h-full flex flex-col">
            <div className="space-y-2">
                <Label>Subject Line</Label>
                <Input
                    value={step.subject || ""}
                    onChange={(e) => onUpdate({ subject: e.target.value })}
                    placeholder="Quick question about {{company}}"
                />
            </div>

            <div className="space-y-2 flex-1 flex flex-col">
                <div className="flex items-center justify-between">
                    <Label>Email Body</Label>
                    <div className="flex gap-2">
                        {/* Spintax Button */}
                        {isPaidUser ? (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleGenerateSpintax}
                                disabled={isGeneratingSpintax || !step.body}
                                className="h-7 text-xs gap-1.5"
                            >
                                {isGeneratingSpintax ? (
                                    <Sparkles className="h-3 w-3 animate-spin" />
                                ) : (
                                    <Sparkles className="h-3 w-3 text-purple-500" />
                                )}
                                AI Spintax
                            </Button>
                        ) : (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5 opacity-70">
                                        <Sparkles className="h-3 w-3" /> AI Spintax
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-80 p-0" align="end">
                                    <UpgradePrompt featureName="AI Spintax Generator" />
                                </PopoverContent>
                            </Popover>
                        )}

                        {/* Spam Check Button */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => isPaidUser && handleSpamCheck()}
                                    className="h-7 text-xs gap-1.5"
                                >
                                    <ShieldAlert className="h-3 w-3 text-orange-500" />
                                    {spamAnalysis ? `Score: ${spamAnalysis.score}` : "Check Spam"}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-96 p-0" align="end">
                                {isPaidUser ? (
                                    <WizardSpamChecker analysis={spamAnalysis} isLoading={isAnalyzingSpam} />
                                ) : (
                                    <UpgradePrompt featureName="AI Spam Analysis" />
                                )}
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                <Textarea
                    value={step.body || ""}
                    onChange={(e) => onUpdate({ body: e.target.value })}
                    className="flex-1 resize-none font-mono text-sm min-h-[300px]"
                    placeholder="Hi {{firstName}}..."
                />
                <p className="text-xs text-muted-foreground mt-1">
                    Use {'{{firstName}}'}, {'{{company}}'} variables.
                    Use {'{Hi|Hello}'} for spintax.
                </p>
            </div>
        </div>
    )
}
