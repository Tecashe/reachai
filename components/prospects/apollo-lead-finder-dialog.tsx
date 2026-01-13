
"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles, Search, Loader2, CheckCircle2, Rocket, Star, TrendingUp, DollarSign, Lock, AlertCircle } from "lucide-react"
import { findLeadsWithApollo, enrichLeadsWithAI } from "@/lib/actions/lead-finder"
import { deductResearchCredits } from "@/lib/actions/user"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { WaveLoader } from "../loader/wave-loader"

interface ApolloLeadFinderDialogProps {
  subscriptionTier: string
  researchCredits: number
  onCreditsChange?: () => void
}

export function ApolloLeadFinderDialog({
  subscriptionTier,
  researchCredits,
  onCreditsChange,
}: ApolloLeadFinderDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<"input" | "searching" | "results">("input")
  const [debugMode, setDebugMode] = useState(false)

  // Form inputs
  const [targetDescription, setTargetDescription] = useState("")
  const [jobTitles, setJobTitles] = useState("")
  const [locations, setLocations] = useState("")
  const [companySize, setCompanySize] = useState("")
  const [industries, setIndustries] = useState("")
  const [limit, setLimit] = useState(50)

  // Results
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [enrichedResults, setEnrichedResults] = useState<any[]>([])
  const [progress, setProgress] = useState(0)

  // Improved subscription tier checking with normalization
  const normalizedTier = subscriptionTier?.toString().trim().toUpperCase() || "FREE"
  const canUseApollo = normalizedTier !== "FREE" && normalizedTier !== "" && normalizedTier !== "UNDEFINED" && normalizedTier !== "NULL"
  
  const costPerLead = 1 // 1 research credit per lead
  const totalCost = limit * costPerLead
  const hasEnoughCredits = researchCredits >= totalCost

  // Debug logging on mount and when props change
  useEffect(() => {
    console.group("🔍 Apollo Lead Finder Debug Info")
    console.log("Raw subscriptionTier prop:", subscriptionTier)
    console.log("Normalized tier:", normalizedTier)
    console.log("Can use Apollo:", canUseApollo)
    console.log("Research credits:", researchCredits)
    console.log("Total cost:", totalCost)
    console.log("Has enough credits:", hasEnoughCredits)
    console.groupEnd()
  }, [subscriptionTier, researchCredits, totalCost, normalizedTier, canUseApollo, hasEnoughCredits])

  const handleSearch = async () => {
    if (!canUseApollo) {
      toast.error("Apollo lead finder is only available on paid plans")
      console.error("Access denied - subscription tier:", normalizedTier)
      return
    }

    if (!hasEnoughCredits) {
      toast.error(`You need ${totalCost} research credits. You have ${researchCredits}.`)
      return
    }

    if (!targetDescription.trim()) {
      toast.error("Please describe your ideal customer")
      return
    }

    setLoading(true)
    setStep("searching")
    setProgress(10)

    try {
      // Phase 1: Search Apollo
      setProgress(30)
      toast.info("Searching Apollo.io for matching leads...")

      const searchResult = await findLeadsWithApollo({
        targetDescription,
        jobTitles: jobTitles
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        locations: locations
          .split(",")
          .map((l) => l.trim())
          .filter(Boolean),
        companySize,
        industries: industries
          .split(",")
          .map((i) => i.trim())
          .filter(Boolean),
        limit,
      })

      if (!searchResult.success) {
        toast.error(searchResult.error || "Failed to search Apollo")
        setStep("input")
        return
      }

      setSearchResults(searchResult.leads || [])
      setProgress(60)

      // Phase 2: Enrich with AI
      toast.info("Enriching leads with AI insights...")
      const enrichResult = await enrichLeadsWithAI(searchResult.leads || [])

      if (!enrichResult.success) {
        toast.error(enrichResult.error || "Failed to enrich leads")
        return
      }

      setEnrichedResults(enrichResult.enrichedLeads || [])
      setProgress(100)
      setStep("results")

      // Deduct credits after successful search
      try {
        const creditsUsed = searchResult.leads?.length || 0
        await deductResearchCredits(creditsUsed)
        console.log(`Deducted ${creditsUsed} research credits`)
      } catch (creditError) {
        console.error("Failed to deduct credits:", creditError)
        // Don't fail the whole operation if credit deduction fails
      }

      toast.success(`Found and enriched ${enrichResult.enrichedLeads?.length || 0} high-quality leads!`)

      if (onCreditsChange) {
        onCreditsChange()
      }
    } catch (error: any) {
      console.error("Lead search error:", error)
      toast.error(error.message || "Failed to find leads")
      setStep("input")
    } finally {
      setLoading(false)
    }
  }

  const handleImportLeads = async () => {
    // TODO: Implement import to campaign
    toast.success(`Importing ${enrichedResults.length} leads to your campaign...`)
    setOpen(false)
  }

  const handleUpgrade = () => {
    router.push("/dashboard/billing")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="relative bg-transparent">
          <Sparkles className="mr-2 h-4 w-4" />
          Find Leads with AI
          {!canUseApollo && (
            <Badge variant="secondary" className="ml-2">
              <Lock className="mr-1 h-3 w-3" />
              Pro
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Lead Finder
            {/* Debug toggle button */}
            </DialogTitle>
          <DialogDescription>
            Describe your ideal customer
          </DialogDescription>
        </DialogHeader>
        
        {/* Free user upgrade prompt */}
        {!canUseApollo && (
          <Alert className="border-primary bg-primary/5">
            <Lock className="h-4 w-4" />
            <AlertTitle>Upgrade to use Apollo Lead Finder</AlertTitle>
            <AlertDescription>
              <p className="mb-3">
                This feature is available on paid plans. Get access to millions of leads from Apollo.io with AI
                enrichment.
              </p>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleUpgrade}>
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Upgrade to Pro
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Insufficient credits warning */}
        {canUseApollo && !hasEnoughCredits && (
          <Alert className="border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <AlertTitle className="text-orange-900 dark:text-orange-100">Insufficient Credits</AlertTitle>
            <AlertDescription className="text-orange-900 dark:text-orange-100">
              You need {totalCost} credits but only have {researchCredits}. Please reduce the number of leads or purchase more credits.
            </AlertDescription>
          </Alert>
        )}

        {/* Credit display */}
        {canUseApollo && (
          <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Research Credits Available</p>
                <p className="text-2xl font-bold">{researchCredits}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Cost for this search</p>
              <p className={cn("text-xl font-bold", hasEnoughCredits ? "text-green-600" : "text-red-600")}>
                {totalCost} credits
              </p>
              <p className="text-xs text-muted-foreground">{costPerLead} credit per lead</p>
            </div>
          </div>
        )}

        {/* Input Step */}
        {step === "input" && (
          <Tabs defaultValue="simple" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="simple">Simple Description</TabsTrigger>
              <TabsTrigger value="advanced">Advanced Filters</TabsTrigger>
            </TabsList>

            <TabsContent value="simple" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Describe Your Ideal Customer</Label>
                <Textarea
                  id="description"
                  placeholder="E.g., 'I'm looking for Marketing Directors at B2B SaaS companies in the US with 50-200 employees'"
                  value={targetDescription}
                  onChange={(e) => setTargetDescription(e.target.value)}
                  rows={4}
                  disabled={!canUseApollo}
                />
                <p className="text-sm text-muted-foreground">
                  Our AI will automatically extract job titles, locations, company sizes, and industries from your
                  description
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="limit">Number of Leads</Label>
                <Input
                  id="limit"
                  type="number"
                  min={10}
                  max={500}
                  value={limit}
                  onChange={(e) => setLimit(Number.parseInt(e.target.value) || 50)}
                  disabled={!canUseApollo}
                />
                <p className="text-sm text-muted-foreground">
                  We'll find up to {limit} leads ({limit * costPerLead} credits)
                </p>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="jobTitles">Job Titles (comma separated)</Label>
                  <Input
                    id="jobTitles"
                    placeholder="CEO, Founder, VP Sales"
                    value={jobTitles}
                    onChange={(e) => setJobTitles(e.target.value)}
                    disabled={!canUseApollo}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="locations">Locations (comma separated)</Label>
                  <Input
                    id="locations"
                    placeholder="San Francisco, New York, Remote"
                    value={locations}
                    onChange={(e) => setLocations(e.target.value)}
                    disabled={!canUseApollo}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companySize">Company Size</Label>
                  <Input
                    id="companySize"
                    placeholder="1-10, 11-50, 51-200"
                    value={companySize}
                    onChange={(e) => setCompanySize(e.target.value)}
                    disabled={!canUseApollo}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="industries">Industries (comma separated)</Label>
                  <Input
                    id="industries"
                    placeholder="Software, Marketing, SaaS"
                    value={industries}
                    onChange={(e) => setIndustries(e.target.value)}
                    disabled={!canUseApollo}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="limit-advanced">Number of Leads</Label>
                <Input
                  id="limit-advanced"
                  type="number"
                  min={10}
                  max={500}
                  value={limit}
                  onChange={(e) => setLimit(Number.parseInt(e.target.value) || 50)}
                  disabled={!canUseApollo}
                />
              </div>
            </TabsContent>
          </Tabs>
        )}

        {/* Searching Step */}
        {step === "searching" && (
          <div className="space-y-6 py-8">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="rounded-full bg-primary/10 p-4">
                <WaveLoader size="sm" bars={8} gap="tight" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold">Finding Your Perfect Leads</h3>
                <p className="text-sm text-muted-foreground">Searching Apollo.io and enriching with AI insights...</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <div className="space-y-2">
              {progress >= 30 && (
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Apollo.io search complete</span>
                </div>
              )}
              {progress >= 60 && (
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>AI enrichment in progress</span>
                </div>
              )}
              {progress >= 100 && (
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Quality scoring complete</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Results Step */}
        {step === "results" && (
          <div className="space-y-4">
            <Alert className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-900 dark:text-green-100">
                Found {enrichedResults.length} High-Quality Leads
              </AlertTitle>
              <AlertDescription className="text-green-900 dark:text-green-100">
                Each lead has been enriched with AI insights and scored for quality
              </AlertDescription>
            </Alert>

            <div className="max-h-96 space-y-2 overflow-y-auto">
              {enrichedResults.slice(0, 5).map((lead, index) => (
                <div key={index} className="flex items-start justify-between rounded-lg border p-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">
                        {lead.firstName} {lead.lastName}
                      </p>
                      <Badge variant="outline">{lead.jobTitle}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{lead.company}</p>
                    <p className="text-sm">{lead.email}</p>
                    {lead.aiInsights && (
                      <p className="text-xs text-muted-foreground italic">{lead.aiInsights.substring(0, 100)}...</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{lead.qualityScore}</span>
                  </div>
                </div>
              ))}
              {enrichedResults.length > 5 && (
                <p className="text-center text-sm text-muted-foreground">+{enrichedResults.length - 5} more leads</p>
              )}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep("input")} className="flex-1">
                Search Again
              </Button>
              <Button onClick={handleImportLeads} className="flex-1">
                <Rocket className="mr-2 h-4 w-4" />
                Import to Campaign
              </Button>
            </div>
          </div>
        )}

        {/* Action buttons for input step */}
        {step === "input" && (
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSearch}
              disabled={!canUseApollo || !hasEnoughCredits || !targetDescription.trim() || loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {!loading && <Search className="mr-2 h-4 w-4" />}
              Find Leads ({totalCost} credits)
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}