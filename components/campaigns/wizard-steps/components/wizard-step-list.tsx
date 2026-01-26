
"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, GripVertical, Mail, Plus, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface Step {
    id: string
    subject: string
    body: string
    delayDays: number
}

interface WizardStepListProps {
    steps: Step[]
    selectedStepId: string | null
    onSelectStep: (id: string) => void
    onAddStep: () => void
    onDeleteStep: (id: string) => void
    onUpdateStep: (id: string, updates: Partial<Step>) => void
}

export function WizardStepList({
    steps,
    selectedStepId,
    onSelectStep,
    onAddStep,
    onDeleteStep,
    onUpdateStep
}: WizardStepListProps) {
    return (
        <div className="flex flex-col h-full bg-muted/30 border-r w-80 shrink-0">
            <div className="p-4 border-b bg-background/50 backdrop-blur-sm sticky top-0 z-10">
                <h3 className="font-semibold mb-1">Sequence Steps</h3>
                <p className="text-xs text-muted-foreground">Define your outreach timeline</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {steps.map((step, index) => (
                    <div key={step.id} className="relative group">
                        {/* Connector Line */}
                        {index < steps.length - 1 && (
                            <div className="absolute left-[1.65rem] top-12 bottom-[-1rem] w-0.5 bg-border -z-10" />
                        )}

                        <div className="flex items-start gap-3">
                            {/* Step Number Bubble */}
                            <div
                                className={cn(
                                    "flex items-center justify-center w-8 h-8 rounded-full border text-xs font-medium bg-background shrink-0 mt-2 transition-colors",
                                    selectedStepId === step.id
                                        ? "border-primary text-primary ring-2 ring-primary/20"
                                        : "border-muted-foreground/30 text-muted-foreground"
                                )}
                            >
                                {index + 1}
                            </div>

                            {/* Step Card */}
                            <Card
                                className={cn(
                                    "flex-1 cursor-pointer transition-all hover:shadow-md border-transparent ring-1 ring-border",
                                    selectedStepId === step.id ? "ring-primary shadow-sm bg-primary/5" : "hover:bg-card"
                                )}
                                onClick={() => onSelectStep(step.id)}
                            >
                                <CardContent className="p-3 space-y-3">
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                                            <span className="text-sm font-medium">Email {index + 1}</span>
                                        </div>
                                        {steps.length > 1 && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    onDeleteStep(step.id)
                                                }}
                                            >
                                                <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                                            </Button>
                                        )}
                                    </div>

                                    <div className="text-xs text-muted-foreground truncate font-mono bg-muted/50 p-1.5 rounded">
                                        {step.subject || "(No subject)"}
                                    </div>

                                    {index > 0 && (
                                        <div className="flex items-center gap-2 pt-1 border-t text-xs text-muted-foreground">
                                            <Clock className="h-3 w-3" />
                                            Wait
                                            <input
                                                type="number"
                                                min="0"
                                                className="w-10 h-5 bg-transparent border rounded text-center text-foreground font-medium focus:ring-1 focus:ring-primary outline-none"
                                                value={step.delayDays}
                                                onClick={(e) => e.stopPropagation()}
                                                onChange={(e) => onUpdateStep(step.id, { delayDays: parseInt(e.target.value) || 0 })}
                                            />
                                            days
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                ))}

                <Button
                    variant="outline"
                    className="w-full border-dashed gap-2 text-muted-foreground hover:text-primary hover:border-primary/50"
                    onClick={onAddStep}
                >
                    <Plus className="h-4 w-4" />
                    Add Step
                </Button>
            </div>
        </div>
    )
}
