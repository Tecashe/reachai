"use client"

import { useState, useEffect, useCallback } from "react"
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
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sparkles,
  Search,
  Loader2,
  CheckCircle2,
  Rocket,
  Star,
  TrendingUp,
  DollarSign,
  Lock,
  AlertCircle,
  ArrowLeft,
  Users,
  Building2,
  MapPin,
} from "lucide-react"
import { findLeadsWithApollo, enrichAndImportSelectedLeads } from "@/lib/actions/lead-finder"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { WaveLoader } from "../loader/wave-loader"

// Lead type for better type safety
interface ApolloLead {
  id: string
  firstName: string
  lastName: string
  email: string
  title: string
  company: {
    name: string
    website?: string
    industry?: string
    size?: string
  }
  linkedinUrl?: string
  location?: string
  phoneNumber?: string
}

interface ApolloLeadFinderDialogProps {
  subscriptionTier: string
  researchCredits: number
  campaignId?: string
  onCreditsChange?: () => void
  onLeadsImported?: () => void
}

const COMPANY_SIZE_OPTIONS = [
  { value: "1-10", label: "1-10 employees" },
  { value: "11-50", label: "11-50 employees" },
  { value: "51-200", label: "51-200 employees" },
  { value: "201-500", label: "201-500 employees" },
  { value: "501-1000", label: "501-1000 employees" },
  { value: "1001-5000", label: "1001-5000 employees" },
  { value: "5001+", label: "5000+ employees" },
]

export function ApolloLeadFinderDialog({
  subscriptionTier,
  researchCredits,
  campaignId,
  onCreditsChange,
  onLeadsImported,
}: ApolloLeadFinderDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<"input" | "searching" | "results" | "importing">("input")

  // Form inputs
  const [targetDescription, setTargetDescription] = useState("")
  const [jobTitles, setJobTitles] = useState("")
  const [locations, setLocations] = useState("")
  const [companySize, setCompanySize] = useState("")
  const [industries, setIndustries] = useState("")
  const [limit, setLimit] = useState(25)

  // Results & Selection
  const [searchResults, setSearchResults] = useState<ApolloLead[]>([])
  const [selectedLeadIds, setSelectedLeadIds] = useState<Set<string>>(new Set())
  const [progress, setProgress] = useState(0)

  // Improved subscription tier checking with normalization
  const normalizedTier = subscriptionTier?.toString().trim().toUpperCase() || "FREE"
  const canUseApollo =
    normalizedTier !== "FREE" &&
    normalizedTier !== "" &&
    normalizedTier !== "UNDEFINED" &&
    normalizedTier !== "NULL"

  const searchCostPerLead = 1
  const enrichmentCostPerLead = 1
  const searchCost = limit * searchCostPerLead
  const hasEnoughCreditsForSearch = researchCredits >= searchCost

  const selectedCount = selectedLeadIds.size
  const enrichmentCost = selectedCount * enrichmentCostPerLead
  const hasEnoughCreditsForEnrichment = researchCredits >= enrichmentCost

  // Debug logging
  useEffect(() => {
    console.group("🔍 Apollo Lead Finder Debug Info")
    console.log("Normalized tier:", normalizedTier)
    console.log("Can use Apollo:", canUseApollo)
    console.log("Research credits:", researchCredits)
    console.groupEnd()
  }, [normalizedTier, canUseApollo, researchCredits])

  const handleSearch = async () => {
    if (!canUseApollo) {
      toast.error("Apollo lead finder is only available on paid plans")
      return
    }

    if (!hasEnoughCreditsForSearch) {
      toast.error(`You need ${searchCost} research credits. You have ${researchCredits}.`)
      return
    }

    if (!targetDescription.trim() && !jobTitles.trim()) {
      toast.error("Please describe your ideal customer or enter job titles")
      return
    }

    setStep("searching")
    setProgress(10)
    setSelectedLeadIds(new Set())

    try {
      setProgress(40)
      toast.info("Searching Apollo.io for matching leads...")

      const searchResult = await findLeadsWithApollo({
        targetDescription: targetDescription.trim() || undefined,
        jobTitles: jobTitles
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        locations: locations
          .split(",")
          .map((l) => l.trim())
          .filter(Boolean),
        companySize: companySize || undefined,
        industries: industries
          .split(",")
          .map((i) => i.trim())
          .filter(Boolean),
        limit,
      })

      setProgress(100)

      if (!searchResult.success) {
        toast.error(searchResult.error || "Failed to search Apollo")
        setStep("input")
        return
      }

      setSearchResults(searchResult.leads || [])
      setStep("results")

      toast.success(`Found ${searchResult.leads?.length || 0} leads! Select the ones to import.`)

      if (onCreditsChange) {
        onCreditsChange()
      }
    } catch (error: any) {
      console.error("Lead search error:", error)
      toast.error(error.message || "Failed to find leads")
      setStep("input")
    }
  }

  const handleToggleLead = (leadId: string) => {
    setSelectedLeadIds((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(leadId)) {
        newSet.delete(leadId)
      } else {
        newSet.add(leadId)
      }
      return newSet
    })
  }

  const handleToggleAll = () => {
    if (selectedLeadIds.size === searchResults.length) {
      setSelectedLeadIds(new Set())
    } else {
      setSelectedLeadIds(new Set(searchResults.map((l) => l.id)))
    }
  }

  const handleImportSelected = async () => {
    if (selectedCount === 0) {
      toast.error("Please select at least one lead to import")
      return
    }

    if (!campaignId) {
      toast.error("No campaign selected. Please select a campaign first.")
      return
    }

    if (!hasEnoughCreditsForEnrichment) {
      toast.error(
        `You need ${enrichmentCost} credits for AI enrichment. You have ${researchCredits}.`,
      )
      return
    }

    setStep("importing")
    setProgress(10)

    try {
      const selectedLeads = searchResults.filter((l) => selectedLeadIds.has(l.id))

      setProgress(30)
      toast.info(`Enriching ${selectedCount} leads with AI insights...`)

      const result = await enrichAndImportSelectedLeads(selectedLeads, campaignId)

      setProgress(100)

      if (!result.success) {
        toast.error(result.error || "Failed to import leads")
        setStep("results")
        return
      }

      toast.success(`Successfully imported ${result.imported} leads to your campaign!`)

      if (onCreditsChange) {
        onCreditsChange()
      }

      if (onLeadsImported) {
        onLeadsImported()
      }

      setOpen(false)
      resetForm()
    } catch (error: any) {
      console.error("Import error:", error)
      toast.error(error.message || "Failed to import leads")
      setStep("results")
    }
  }

  const resetForm = () => {
    setStep("input")
    setTargetDescription("")
    setJobTitles("")
    setLocations("")
    setCompanySize("")
    setIndustries("")
    setLimit(25)
    setSearchResults([])
    setSelectedLeadIds(new Set())
    setProgress(0)
  }

  const handleUpgrade = () => {
    router.push("/dashboard/billing")
    setOpen(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen)
        if (!isOpen) resetForm()
      }}
    >
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
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Lead Finder
          </DialogTitle>
          <DialogDescription>
            {step === "input" && "Describe your ideal customer to find matching leads."}
            {step === "searching" && "Searching for leads..."}
            {step === "results" && `Found ${searchResults.length} leads. Select the ones to import.`}
            {step === "importing" && "Enriching and importing selected leads..."}
          </DialogDescription>
        </DialogHeader>

        {/* Free user upgrade prompt */}
        {!canUseApollo && (
          <Alert className="border-primary bg-primary/5">
            <Lock className="h-4 w-4" />
            <AlertTitle>Upgrade to use Apollo Lead Finder</AlertTitle>
            <AlertDescription>
              <p className="mb-3">
                This feature is available on paid plans. Get access to millions of leads from
                Apollo.io with AI enrichment.
              </p>
              <Button size="sm" onClick={handleUpgrade}>
                <TrendingUp className="mr-2 h-4 w-4" />
                Upgrade to Pro
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Credit display (only on input or results step) */}
        {canUseApollo && (step === "input" || step === "results") && (
          <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Research Credits</p>
                <p className="text-2xl font-bold">{researchCredits}</p>
              </div>
            </div>
            <div className="text-right">
              {step === "input" && (
                <>
                  <p className="text-sm text-muted-foreground">Search cost</p>
                  <p
                    className={cn(
                      "text-xl font-bold",
                      hasEnoughCreditsForSearch ? "text-green-600" : "text-red-600",
                    )}
                  >
                    {searchCost} credits
                  </p>
                </>
              )}
              {step === "results" && selectedCount > 0 && (
                <>
                  <p className="text-sm text-muted-foreground">Import cost ({selectedCount} leads)</p>
                  <p
                    className={cn(
                      "text-xl font-bold",
                      hasEnoughCreditsForEnrichment ? "text-green-600" : "text-red-600",
                    )}
                  >
                    {enrichmentCost} credits
                  </p>
                </>
              )}
            </div>
          </div>
        )}

        {/* Insufficient credits warning for search */}
        {canUseApollo && step === "input" && !hasEnoughCreditsForSearch && (
          <Alert className="border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <AlertTitle className="text-orange-900 dark:text-orange-100">
              Insufficient Credits
            </AlertTitle>
            <AlertDescription className="text-orange-900 dark:text-orange-100">
              You need {searchCost} credits but only have {researchCredits}. Please reduce the
              number of leads or purchase more credits.
            </AlertDescription>
          </Alert>
        )}

        {/* ======================= INPUT STEP ======================= */}
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
                  Our AI will automatically extract job titles, locations, company sizes, and
                  industries from your description
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="limit">Number of Leads to Find</Label>
                <Input
                  id="limit"
                  type="number"
                  min={10}
                  max={100}
                  value={limit}
                  onChange={(e) => setLimit(Math.min(100, Math.max(10, parseInt(e.target.value) || 25)))}
                  disabled={!canUseApollo}
                />
                <p className="text-sm text-muted-foreground">
                  We'll find up to {limit} leads ({limit * searchCostPerLead} credits)
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
                  <Select value={companySize} onValueChange={setCompanySize} disabled={!canUseApollo}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any size" />
                    </SelectTrigger>
                    <SelectContent>
                      {COMPANY_SIZE_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  max={100}
                  value={limit}
                  onChange={(e) => setLimit(Math.min(100, Math.max(10, parseInt(e.target.value) || 25)))}
                  disabled={!canUseApollo}
                />
              </div>
            </TabsContent>
          </Tabs>
        )}

        {/* ======================= SEARCHING STEP ======================= */}
        {step === "searching" && (
          <div className="space-y-6 py-8">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="rounded-full bg-primary/10 p-4">
                <WaveLoader size="sm" bars={8} gap="tight" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold">Searching Apollo.io</h3>
                <p className="text-sm text-muted-foreground">Finding leads matching your criteria...</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>
        )}

        {/* ======================= RESULTS STEP ======================= */}
        {step === "results" && (
          <div className="space-y-4">
            {searchResults.length === 0 ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No leads found</AlertTitle>
                <AlertDescription>
                  Try adjusting your search criteria or description.
                </AlertDescription>
              </Alert>
            ) : (
              <>
                {/* Selection summary bar */}
                <div className="flex items-center justify-between rounded-lg border bg-muted/30 px-4 py-2">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="select-all"
                      checked={selectedLeadIds.size === searchResults.length && searchResults.length > 0}
                      onCheckedChange={handleToggleAll}
                    />
                    <Label htmlFor="select-all" className="text-sm font-medium cursor-pointer">
                      {selectedLeadIds.size === searchResults.length ? "Deselect All" : "Select All"}
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {selectedCount} of {searchResults.length} selected
                    </span>
                  </div>
                </div>

                {/* Results table */}
                <div className="rounded-lg border max-h-[400px] overflow-y-auto">
                  <Table>
                    <TableHeader className="sticky top-0 bg-background z-10">
                      <TableRow>
                        <TableHead className="w-[50px]"></TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Location</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {searchResults.map((lead) => (
                        <TableRow
                          key={lead.id}
                          className={cn(
                            "cursor-pointer transition-colors",
                            selectedLeadIds.has(lead.id) && "bg-primary/5",
                          )}
                          onClick={() => handleToggleLead(lead.id)}
                        >
                          <TableCell>
                            <Checkbox
                              checked={selectedLeadIds.has(lead.id)}
                              onCheckedChange={() => handleToggleLead(lead.id)}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            {lead.firstName} {lead.lastName}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-normal">
                              {lead.title || "N/A"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5">
                              <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                              <span className="truncate max-w-[150px]">
                                {lead.company?.name || "Unknown"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5">
                              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                              <span className="truncate max-w-[150px]">{lead.location || "N/A"}</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}
          </div>
        )}

        {/* ======================= IMPORTING STEP ======================= */}
        {step === "importing" && (
          <div className="space-y-6 py-8">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="rounded-full bg-green-500/10 p-4">
                <WaveLoader size="sm" bars={8} gap="tight" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold">Enriching & Importing Leads</h3>
                <p className="text-sm text-muted-foreground">
                  Running AI enrichment on {selectedCount} leads...
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>
        )}

        {/* ======================= ACTION BUTTONS ======================= */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          {step === "input" && (
            <>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSearch}
                disabled={
                  !canUseApollo ||
                  !hasEnoughCreditsForSearch ||
                  (!targetDescription.trim() && !jobTitles.trim())
                }
              >
                <Search className="mr-2 h-4 w-4" />
                Find Leads ({searchCost} credits)
              </Button>
            </>
          )}

          {step === "results" && (
            <>
              <Button variant="outline" onClick={() => setStep("input")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Search
              </Button>
              <Button
                onClick={handleImportSelected}
                disabled={selectedCount === 0 || !hasEnoughCreditsForEnrichment || !campaignId}
              >
                <Rocket className="mr-2 h-4 w-4" />
                Import {selectedCount} Lead{selectedCount !== 1 ? "s" : ""} ({enrichmentCost} credits)
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}