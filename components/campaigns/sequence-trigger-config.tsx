"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, Save } from 'lucide-react'
import { toast } from "react-toastify"

interface SequenceTrigger {
  id?: string
  name: string
  conditions: {
    category?: string[]
    sentiment?: string[]
    minOpens?: number
    maxDaysSinceContact?: number
  }
  targetSequenceId?: string
  delayHours: number
  isActive: boolean
}

interface SequenceTriggerConfigProps {
  campaignId: string
  triggers: SequenceTrigger[]
  availableSequences: { id: string; name: string }[]
}

export function SequenceTriggerConfig({ campaignId, triggers: initialTriggers, availableSequences }: SequenceTriggerConfigProps) {
  const [triggers, setTriggers] = useState<SequenceTrigger[]>(initialTriggers)
  const [isSaving, setIsSaving] = useState(false)

  const addTrigger = () => {
    setTriggers([
      ...triggers,
      {
        name: "New Trigger",
        conditions: {},
        targetSequenceId: availableSequences[0]?.id || "",
        delayHours: 24,
        isActive: true,
      },
    ])
  }

  const updateTrigger = (index: number, updates: Partial<SequenceTrigger>) => {
    const newTriggers = [...triggers]
    newTriggers[index] = { ...newTriggers[index], ...updates }
    setTriggers(newTriggers)
  }

  const removeTrigger = (index: number) => {
    setTriggers(triggers.filter((_, i) => i !== index))
  }

  const saveTriggers = async () => {
    setIsSaving(true)
    try {
      const response = await fetch(`/api/campaigns/${campaignId}/sequence-triggers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ triggers }),
      })

      if (!response.ok) throw new Error()

      toast.success("Sequence triggers saved successfully")
    } catch (error) {
      toast.error("Failed to save sequence triggers")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Auto-Add to Sequence</h3>
          <p className="text-sm text-muted-foreground">Automatically move prospects to sequences based on their behavior</p>
        </div>
        <Button onClick={addTrigger} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Trigger
        </Button>
      </div>

      {triggers.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">No sequence triggers configured</p>
          <Button onClick={addTrigger} variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            Create Your First Trigger
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {triggers.map((trigger, index) => (
            <Card key={index} className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Input
                    placeholder="Trigger name"
                    value={trigger.name}
                    onChange={(e) => updateTrigger(index, { name: e.target.value })}
                    className="max-w-xs"
                  />
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={trigger.isActive}
                      onCheckedChange={(checked) => updateTrigger(index, { isActive: checked })}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeTrigger(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>When reply category is</Label>
                    <Select
                      value={trigger.conditions.category?.[0] || ""}
                      onValueChange={(value) =>
                        updateTrigger(index, {
                          conditions: { ...trigger.conditions, category: [value] },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="INTERESTED">Interested</SelectItem>
                        <SelectItem value="QUESTION">Question</SelectItem>
                        <SelectItem value="NOT_INTERESTED">Not Interested</SelectItem>
                        <SelectItem value="OUT_OF_OFFICE">Out of Office</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Add to sequence</Label>
                    <Select
                      value={trigger.targetSequenceId || ""}
                      onValueChange={(value) => updateTrigger(index, { targetSequenceId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select sequence" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableSequences.map((seq) => (
                          <SelectItem key={seq.id} value={seq.id}>
                            {seq.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Delay (hours)</Label>
                    <Input
                      type="number"
                      min="0"
                      value={trigger.delayHours}
                      onChange={(e) => updateTrigger(index, { delayHours: parseInt(e.target.value) || 0 })}
                    />
                  </div>

                  <div>
                    <Label>Minimum opens required</Label>
                    <Input
                      type="number"
                      min="0"
                      value={trigger.conditions.minOpens || 0}
                      onChange={(e) =>
                        updateTrigger(index, {
                          conditions: { ...trigger.conditions, minOpens: parseInt(e.target.value) || 0 },
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </Card>
          ))}

          <Button onClick={saveTriggers} disabled={isSaving} className="w-full gap-2">
            <Save className="h-4 w-4" />
            {isSaving ? "Saving..." : "Save Triggers"}
          </Button>
        </div>
      )}
    </div>
  )
}
