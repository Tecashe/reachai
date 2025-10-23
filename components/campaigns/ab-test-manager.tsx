"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Plus, Trash2, TrendingUp, Users, Mail, Target } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ABTestManagerProps {
  campaignId: string
}

interface EmailVariant {
  id: string
  name: string
  subject: string
  body: string
  sent: number
  opened: number
  clicked: number
  replied: number
  openRate: number
  clickRate: number
  replyRate: number
  isWinner?: boolean
}

export function ABTestManager({ campaignId }: ABTestManagerProps) {
  const [variants, setVariants] = useState<EmailVariant[]>([])
  const [newVariant, setNewVariant] = useState({ name: "", subject: "", body: "" })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const addVariant = () => {
    if (!newVariant.name || !newVariant.subject || !newVariant.body) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    const variant: EmailVariant = {
      id: Math.random().toString(36).substr(2, 9),
      ...newVariant,
      sent: 0,
      opened: 0,
      clicked: 0,
      replied: 0,
      openRate: 0,
      clickRate: 0,
      replyRate: 0,
    }

    setVariants([...variants, variant])
    setNewVariant({ name: "", subject: "", body: "" })

    toast({
      title: "Variant added",
      description: `${variant.name} has been added to the A/B test`,
    })
  }

  const removeVariant = (id: string) => {
    setVariants(variants.filter((v) => v.id !== id))
  }

  const startABTest = async () => {
    if (variants.length < 2) {
      toast({
        title: "Not enough variants",
        description: "You need at least 2 variants to run an A/B test",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      // In production, this would call the API to start the A/B test
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "A/B test started",
        description: `Testing ${variants.length} variants. Results will be analyzed automatically.`,
      })
    } catch (error) {
      toast({
        title: "Failed to start test",
        description: "Could not start A/B test",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>A/B Test Manager</CardTitle>
          <CardDescription>
            Create multiple email variants and automatically determine which performs best
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Variant Name</Label>
              <Input
                placeholder="e.g., Variant A, Short Subject, etc."
                value={newVariant.name}
                onChange={(e) => setNewVariant({ ...newVariant, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Subject Line</Label>
              <Input
                placeholder="Enter subject line"
                value={newVariant.subject}
                onChange={(e) => setNewVariant({ ...newVariant, subject: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Email Body</Label>
              <Textarea
                placeholder="Enter email body"
                value={newVariant.body}
                onChange={(e) => setNewVariant({ ...newVariant, body: e.target.value })}
                rows={6}
              />
            </div>

            <Button onClick={addVariant} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Variant
            </Button>
          </div>
        </CardContent>
      </Card>

      {variants.length > 0 && (
        <>
          <div className="grid gap-4">
            {variants.map((variant) => (
              <Card key={variant.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{variant.name}</CardTitle>
                      <CardDescription className="mt-1">{variant.subject}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {variant.isWinner && (
                        <Badge className="gap-1">
                          <Target className="h-3 w-3" />
                          Winner
                        </Badge>
                      )}
                      <Button variant="ghost" size="icon" onClick={() => removeVariant(variant.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        Sent
                      </div>
                      <p className="text-2xl font-bold">{variant.sent}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        Open Rate
                      </div>
                      <p className="text-2xl font-bold">{variant.openRate}%</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <TrendingUp className="h-4 w-4" />
                        Click Rate
                      </div>
                      <p className="text-2xl font-bold">{variant.clickRate}%</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Target className="h-4 w-4" />
                        Reply Rate
                      </div>
                      <p className="text-2xl font-bold">{variant.replyRate}%</p>
                    </div>
                  </div>

                  {variant.sent > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Performance</span>
                        <span>{Math.round((variant.openRate + variant.clickRate + variant.replyRate) / 3)}%</span>
                      </div>
                      <Progress value={(variant.openRate + variant.clickRate + variant.replyRate) / 3} />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <Button onClick={startABTest} disabled={loading || variants.length < 2} className="w-full" size="lg">
            {loading ? "Starting Test..." : `Start A/B Test with ${variants.length} Variants`}
          </Button>
        </>
      )}
    </div>
  )
}
