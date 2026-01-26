
"use client"

import { useState } from "react"
import { WizardStepList } from "./wizard-step-list"
import { WizardStepEditor } from "./wizard-step-editor"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Sparkles, Wand2 } from "lucide-react"
import { toast } from "sonner"
import { nanoid } from "nanoid"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { UpgradePrompt } from "@/components/campaigns/common/upgrade-prompt"

interface SequenceStep {
    id: string
    subject: string
    body: string
    delayDays: number
}

interface WizardSequenceBuilderProps {
    initialSteps?: SequenceStep[]
    researchData?: any
    prospectsCount: number
    isPaidUser: boolean
    onNext: (steps: SequenceStep[]) => void
    onBack: () => void
}

export function WizardSequenceBuilder({
    initialSteps,
    researchData,
    prospectsCount,
    isPaidUser,
    onNext,
    onBack
}: WizardSequenceBuilderProps) {
    const [steps, setSteps] = useState<SequenceStep[]>(
        initialSteps?.length ? initialSteps : [
            { id: "1", subject: "", body: "", delayDays: 0 }
        ]
    )
    const [selectedStepId, setSelectedStepId] = useState<string>(steps[0].id)
    const [isGenerating, setIsGenerating] = useState(false)

    const selectedStep = steps.find(s => s.id === selectedStepId) || steps[0]

    const handleUpdateStep = (id: string, updates: Partial<SequenceStep>) => {
        setSteps(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s))
    }

    const handleAddStep = () => {
        const newStep = {
            id: nanoid(),
            subject: "",
            body: "",
            delayDays: 2
        }
        setSteps([...steps, newStep])
        setSelectedStepId(newStep.id)
    }

    const handleDeleteStep = (id: string) => {
        if (steps.length <= 1) {
            toast.error("You need at least one email in the sequence")
            return
        }
        const newSteps = steps.filter(s => s.id !== id)
        setSteps(newSteps)
        if (selectedStepId === id) {
            setSelectedStepId(newSteps[0].id)
        }
    }

    const handleAiGenerateSequence = async () => {
        if (!isPaidUser) return
        setIsGenerating(true)

        try {
            const response = await fetch("/api/ai/generate-sequence", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prospect: { firstName: "Sample", lastName: "Prospect", company: "Company" }, // Generic prompt context
                    researchData: researchData, // Pass research data for context
                    tone: "professional",
                    stepsCount: 3
                })
            })

            const data = await response.json()
            if (data.success && data.data.steps) {
                const generatedSteps = data.data.steps.map((s: any) => ({
                    id: nanoid(),
                    subject: s.subject,
                    body: s.body,
                    delayDays: s.delayDays
                }))
                setSteps(generatedSteps)
                setSelectedStepId(generatedSteps[0].id)
                toast.success("AI Sequence generated successfully!")
            } else {
                toast.error("Failed to generate sequence")
            }
        } catch (error) {
            toast.error("Error generating sequence")
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <div className="flex flex-col h-[calc(100vh-200px)] min-h-[600px] border rounded-lg bg-background overflow-hidden relative">
            <div className="flex flex-1 overflow-hidden">
                {/* Left Panel: Step List */}
                <WizardStepList
                    steps={steps}
                    selectedStepId={selectedStepId}
                    onSelectStep={setSelectedStepId}
                    onAddStep={handleAddStep}
                    onDeleteStep={handleDeleteStep}
                    onUpdateStep={handleUpdateStep}
                />

                {/* Center Panel: Editor */}
                <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-background">
                    {/* Editor Header */}
                    <div className="h-14 border-b flex items-center justify-between px-6 bg-muted/10">
                        <h3 className="font-semibold text-lg">Step {steps.findIndex(s => s.id === selectedStepId) + 1} Editor</h3>

                        <div className="flex items-center gap-2">
                            {isPaidUser ? (
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className="gap-2 bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200"
                                    onClick={handleAiGenerateSequence}
                                    disabled={isGenerating}
                                >
                                    <Wand2 className="h-3.5 w-3.5" />
                                    {isGenerating ? "Generating..." : "Generate Full Sequence"}
                                </Button>
                            ) : (
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" size="sm" className="gap-2">
                                            <Wand2 className="h-3.5 w-3.5" /> Generate Sequence
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent align="end">
                                        <UpgradePrompt featureName="AI Sequence Generator" />
                                    </PopoverContent>
                                </Popover>
                            )}
                        </div>
                    </div>

                    {/* Editor Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        <WizardStepEditor
                            step={selectedStep}
                            onUpdate={(updates) => handleUpdateStep(selectedStep.id, updates)}
                            isPaidUser={isPaidUser}
                        />
                    </div>
                </div>

                {/* Right Panel: Context/Preview (Simple for now) */}
                <div className="w-72 border-l bg-muted/10 p-4 hidden xl:block overflow-y-auto">
                    <h4 className="font-semibold mb-3 text-sm">Research Insights</h4>
                    {researchData ? (
                        <div className="space-y-4 text-xs text-muted-foreground">
                            {researchData.companyInfo && (
                                <div>
                                    <strong className="text-foreground block mb-1">Company Info</strong>
                                    <p>{researchData.companyInfo}</p>
                                </div>
                            )}
                            {researchData.recentNews && (
                                <div>
                                    <strong className="text-foreground block mb-1">Recent News</strong>
                                    <ul className="list-disc pl-3 space-y-1">
                                        {researchData.recentNews.map((n: string, i: number) => <li key={i}>{n}</li>)}
                                    </ul>
                                </div>
                            )}
                            {researchData.painPoints && (
                                <div>
                                    <strong className="text-foreground block mb-1">Pain Points</strong>
                                    <ul className="list-disc pl-3 space-y-1">
                                        {researchData.painPoints.map((p: string, i: number) => <li key={i}>{p}</li>)}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground italic">
                            No research data available. Contextual AI generation will use generic templates.
                        </p>
                    )}
                </div>
            </div>

            {/* Footer Navigation */}
            <div className="h-16 border-t bg-background flex items-center justify-between px-6 shrink-0">
                <Button variant="outline" onClick={onBack}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <div className="text-sm text-muted-foreground">
                    {prospectsCount} prospects will receive this sequence
                </div>
                <Button onClick={() => onNext(steps)}>
                    Next: Review & Launch
                </Button>
            </div>
        </div>
    )
}
