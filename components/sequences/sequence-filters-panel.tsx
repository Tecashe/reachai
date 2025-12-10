"use client"

import * as React from "react"
import { Tag, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"

interface SequenceFiltersPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tags: string[]
  selectedTags: string[]
  onTagsChange: (tags: string[]) => void
  onApply: () => void
  onReset: () => void
}

export function SequenceFiltersPanel({
  open,
  onOpenChange,
  tags,
  selectedTags,
  onTagsChange,
  onApply,
  onReset,
}: SequenceFiltersPanelProps) {
  const [minOpenRate, setMinOpenRate] = React.useState([0])
  const [minReplyRate, setMinReplyRate] = React.useState([0])
  const [minEnrolled, setMinEnrolled] = React.useState([0])
  const [hasABTesting, setHasABTesting] = React.useState(false)
  const [hasAI, setHasAI] = React.useState(false)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-80">
        <SheetHeader>
          <SheetTitle>Advanced Filters</SheetTitle>
          <SheetDescription>Filter sequences by performance and features</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Tags */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Tag className="h-4 w-4" />
              Tags
            </Label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => {
                    if (selectedTags.includes(tag)) {
                      onTagsChange(selectedTags.filter((t) => t !== tag))
                    } else {
                      onTagsChange([...selectedTags, tag])
                    }
                  }}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Performance filters*/}
          <div className="space-y-4">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <TrendingUp className="h-4 w-4" />
              Performance
            </Label>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Min. Open Rate</span>
                <span className="text-sm font-medium">{minOpenRate[0]}%</span>
              </div>
              <Slider value={minOpenRate} onValueChange={setMinOpenRate} max={100} step={5} />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Min. Reply Rate</span>
                <span className="text-sm font-medium">{minReplyRate[0]}%</span>
              </div>
              <Slider value={minReplyRate} onValueChange={setMinReplyRate} max={100} step={5} />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Min. Enrolled</span>
                <span className="text-sm font-medium">{minEnrolled[0]}</span>
              </div>
              <Slider value={minEnrolled} onValueChange={setMinEnrolled} max={1000} step={50} />
            </div>
          </div>

          <Separator />

          {/* Feature filters */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Features</Label>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="ab-testing"
                  checked={hasABTesting}
                  onCheckedChange={(checked) => setHasABTesting(checked as boolean)}
                />
                <label htmlFor="ab-testing" className="text-sm text-muted-foreground">
                  A/B Testing enabled
                </label>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox id="ai" checked={hasAI} onCheckedChange={(checked) => setHasAI(checked as boolean)} />
                <label htmlFor="ai" className="text-sm text-muted-foreground">
                  AI personalization
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 border-t border-border bg-background p-4">
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={onReset}>
              Reset
            </Button>
            <Button className="flex-1" onClick={onApply}>
              Apply Filters
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
