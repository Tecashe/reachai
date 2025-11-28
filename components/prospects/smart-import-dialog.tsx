"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Upload,
  FileSpreadsheet,
  ArrowRight,
  Check,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Sparkles,
  AlertCircle,
} from "lucide-react"
import { parseFile, type ParsedFile } from "@/lib/utils/file-parser"
import {
  detectFieldMappings,
  STANDARD_FIELDS,
  applyFieldMappings,
  type FieldMapping,
  type MappingResult,
} from "@/lib/services/import-field-mapper"
import { cleanAndValidateData, type CleaningResult, type ValidationIssue } from "@/lib/services/data-cleaner"
import { toast } from "sonner"

interface SmartImportDialogProps {
  trigger?: React.ReactNode
  folderId?: string
  folderName?: string
  onImportComplete?: () => void
}

export function SmartImportDialog({ trigger, folderId, folderName, onImportComplete }: SmartImportDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<"upload" | "mapping" | "cleaning" | "importing" | "complete" | "upgrade">("upload")
  const [file, setFile] = useState<File | null>(null)
  const [headers, setHeaders] = useState<string[]>([])
  const [rows, setRows] = useState<string[][]>([])
  const [parseError, setParseError] = useState<string | null>(null)
  const [mappingResult, setMappingResult] = useState<MappingResult | null>(null)
  const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>([])
  const [cleaningResult, setCleaningResult] = useState<CleaningResult | null>(null)
  const [cleaningOptions, setCleaningOptions] = useState({
    removeDuplicates: true,
    fixEmails: true,
    fixUrls: true,
    removeInvalidEmails: true,
    removeRoleBasedEmails: false,
    removeDisposableEmails: false,
  })
  const [importProgress, setImportProgress] = useState(0)
  const [importResult, setImportResult] = useState<{ success: number; failed: number } | null>(null)
  const [existingDuplicates, setExistingDuplicates] = useState<string[]>([])
  const [upgradeInfo, setUpgradeInfo] = useState<{ current: number; limit: number; plan: string } | null>(null)

  // Reset state when dialog closes
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (!isOpen) {
      setStep("upload")
      setFile(null)
      setHeaders([])
      setRows([])
      setParseError(null)
      setMappingResult(null)
      setFieldMappings([])
      setCleaningResult(null)
      setImportProgress(0)
      setImportResult(null)
      setExistingDuplicates([])
      setUpgradeInfo(null)
    }
  }

  // Handle file selection and parsing
  const handleFileSelect = useCallback(async (selectedFile: File) => {
    setFile(selectedFile)
    setParseError(null)

    try {
      const parsed: ParsedFile = await parseFile(selectedFile)
      const parsedHeaders = parsed.headers
      const parsedRows = parsed.rows

      if (parsedHeaders.length === 0) {
        throw new Error("No headers found in file")
      }

      if (parsedRows.length === 0) {
        throw new Error("No data rows found in file")
      }

      setHeaders(parsedHeaders)
      setRows(parsedRows)

      const result = detectFieldMappings(parsedHeaders)
      setMappingResult(result)
      setFieldMappings(result.mappings)

      setStep("mapping")
    } catch (err) {
      setParseError(err instanceof Error ? err.message : "Failed to parse file")
    }
  }, [])

  // Handle drag and drop
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile) {
        handleFileSelect(droppedFile)
      }
    },
    [handleFileSelect],
  )

  // Update a specific field mapping
  const updateMapping = (sourceField: string, targetField: string) => {
    setFieldMappings((prev) => {
      // Remove any existing mapping for this source field
      const filtered = prev.filter((m) => m.sourceField !== sourceField)

      if (targetField === "skip") {
        return filtered
      }

      // Add new mapping
      return [
        ...filtered,
        {
          sourceField,
          targetField,
          confidence: 1.0,
          isCustomField: targetField.startsWith("custom_"),
        },
      ]
    })
  }

  // Proceed to cleaning step
  const proceedToCleaning = async () => {
    // Apply mappings to transform data
    const transformedRecords = applyFieldMappings(headers, rows, fieldMappings)

    // Clean and validate the data
    const result = cleanAndValidateData(transformedRecords, cleaningOptions)
    setCleaningResult(result)

    // Check for duplicates against existing database
    try {
      const emails = result.validRecords.map((r) => r.email).filter(Boolean)
      const response = await fetch("/api/prospects/check-duplicates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emails, folderId }),
      })

      if (response.ok) {
        const data = await response.json()
        setExistingDuplicates(data.duplicates || [])

        if (data.duplicates && data.duplicates.length > 0) {
          toast.warning(`${data.duplicates.length} prospects already exist in your database`)
        }
      }
    } catch (err) {
      console.error("Failed to check duplicates:", err)
    }

    setStep("cleaning")
  }

  // Re-run cleaning with updated options
  const rerunCleaning = () => {
    const transformedRecords = applyFieldMappings(headers, rows, fieldMappings)
    const result = cleanAndValidateData(transformedRecords, cleaningOptions)
    setCleaningResult(result)
  }

  // Perform the import
  const performImport = async () => {
    if (!cleaningResult) return

    setStep("importing")
    setImportProgress(0)

    try {
      // Filter out existing duplicates if user chose to skip them
      let recordsToImport = cleaningResult.validRecords
      if (existingDuplicates.length > 0) {
        const existingSet = new Set(existingDuplicates.map((e) => e.toLowerCase()))
        recordsToImport = recordsToImport.filter((r) => !existingSet.has(r.email?.toLowerCase()))
      }

      // Send to API
      const response = await fetch("/api/prospects/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prospects: recordsToImport,
          folderId,
          skipExistingDuplicates: true,
        }),
      })

      const data = await response.json()

      if (response.status === 402) {
        // Subscription limit exceeded
        setUpgradeInfo({
          current: data.currentCount || 0,
          limit: data.limit || 50,
          plan: data.plan || "FREE",
        })
        setStep("upgrade")
        return
      }

      if (!response.ok) {
        throw new Error(data.error || "Import failed")
      }

      setImportProgress(100)
      setImportResult({
        success: data.imported || 0,
        failed: data.failed || 0,
      })
      setStep("complete")

      // Notify parent to refresh
      onImportComplete?.()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Import failed")
      setStep("cleaning")
    }
  }

  // Get the current mapping for a header
  const getMappingForHeader = (header: string): string => {
    const mapping = fieldMappings.find((m) => m.sourceField === header)
    return mapping?.targetField || "skip"
  }

  // Get sample values for a header
  const getSampleValues = (header: string): string[] => {
    const headerIndex = headers.indexOf(header)
    if (headerIndex === -1) return []
    return rows
      .slice(0, 3)
      .map((row) => row[headerIndex] || "")
      .filter(Boolean)
  }

  // Collect all issues from invalidRecords
  const getAllIssues = (): ValidationIssue[] => {
    if (!cleaningResult) return []
    return cleaningResult.invalidRecords.flatMap((r) => r.issues)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Smart Import {folderName && `to "${folderName}"`}
          </DialogTitle>
        </DialogHeader>

        {/* Step indicator */}
        <div className="flex items-center gap-2 py-2">
          {["upload", "mapping", "cleaning", "importing", "complete"].map((s, i) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === s
                    ? "bg-primary text-primary-foreground"
                    : ["upload", "mapping", "cleaning", "importing", "complete"].indexOf(step) > i
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {["upload", "mapping", "cleaning", "importing", "complete"].indexOf(step) > i ? (
                  <Check className="h-4 w-4" />
                ) : (
                  i + 1
                )}
              </div>
              {i < 4 && <div className="w-12 h-0.5 bg-muted mx-1" />}
            </div>
          ))}
        </div>

        <ScrollArea className="flex-1 pr-4">
          {/* Step 1: Upload */}
          {step === "upload" && (
            <div className="space-y-4 py-4">
              <div
                className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => document.getElementById("file-input")?.click()}
              >
                <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-medium">Drop your file here or click to browse</p>
                <p className="text-sm text-muted-foreground mt-1">Supports CSV and TXT files</p>
                <Input
                  id="file-input"
                  type="file"
                  accept=".csv,.txt"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (f) handleFileSelect(f)
                  }}
                />
              </div>

              {parseError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Parse Error</AlertTitle>
                  <AlertDescription>{parseError}</AlertDescription>
                </Alert>
              )}

              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Smart Field Detection
                </h4>
                <p className="text-sm text-muted-foreground">
                  Our AI will automatically detect and map your columns. You can import any CSV structure - we will
                  match common fields like email, name, company, and store any custom fields for personalization.
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Field Mapping */}
          {step === "mapping" && mappingResult && (
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Map Your Fields</h3>
                  <p className="text-sm text-muted-foreground">
                    We detected {headers.length} columns. Review and adjust the mappings below.
                  </p>
                </div>
                <Badge variant={mappingResult.confidence > 0.7 ? "default" : "secondary"}>
                  {Math.round(mappingResult.confidence * 100)}% confidence
                </Badge>
              </div>

              <div className="space-y-3">
                {headers.map((header) => {
                  const currentMapping = getMappingForHeader(header)
                  const samples = getSampleValues(header)
                  const suggestedMapping = mappingResult.suggestedMappings.find((m) => m.sourceField === header)

                  return (
                    <Card key={header}>
                      <CardContent className="py-3">
                        <div className="flex items-center gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium truncate">{header}</span>
                              {suggestedMapping && suggestedMapping.confidence >= 0.8 && (
                                <Badge variant="outline" className="text-xs">
                                  <Check className="h-3 w-3 mr-1" />
                                  Auto-detected
                                </Badge>
                              )}
                            </div>
                            {samples.length > 0 && (
                              <p className="text-xs text-muted-foreground truncate mt-1">
                                Sample: {samples.slice(0, 2).join(", ")}
                                {samples.length > 2 && "..."}
                              </p>
                            )}
                          </div>

                          <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />

                          <Select value={currentMapping} onValueChange={(value) => updateMapping(header, value)}>
                            <SelectTrigger className="w-48">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="skip">
                                <span className="text-muted-foreground">Skip this column</span>
                              </SelectItem>
                              <Separator className="my-1" />
                              {STANDARD_FIELDS.map((field) => (
                                <SelectItem key={field.key} value={field.key}>
                                  <div className="flex items-center gap-2">
                                    {field.label}
                                    {field.required && (
                                      <Badge variant="destructive" className="text-xs">
                                        Required
                                      </Badge>
                                    )}
                                  </div>
                                </SelectItem>
                              ))}
                              <Separator className="my-1" />
                              <SelectItem value={`custom_${header.toLowerCase().replace(/[^a-z0-9]/g, "_")}`}>
                                <span className="text-blue-600">Keep as custom field</span>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {/* Check if email is mapped */}
              {!fieldMappings.some((m) => m.targetField === "email") && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Email Required</AlertTitle>
                  <AlertDescription>You must map at least one column to Email to proceed.</AlertDescription>
                </Alert>
              )}

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep("upload")}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button onClick={proceedToCleaning} disabled={!fieldMappings.some((m) => m.targetField === "email")}>
                  Continue to Cleaning
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Data Cleaning */}
          {step === "cleaning" && cleaningResult && (
            <div className="space-y-4 py-4">
              <Tabs defaultValue="summary">
                <TabsList>
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                  <TabsTrigger value="issues">Issues ({getAllIssues().length})</TabsTrigger>
                  <TabsTrigger value="options">Options</TabsTrigger>
                </TabsList>

                <TabsContent value="summary" className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="pt-4">
                        <div className="text-2xl font-bold">{cleaningResult.summary.total}</div>
                        <p className="text-sm text-muted-foreground">Total Records</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <div className="text-2xl font-bold text-green-600">{cleaningResult.summary.valid}</div>
                        <p className="text-sm text-muted-foreground">Valid</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <div className="text-2xl font-bold text-red-600">{cleaningResult.summary.invalid}</div>
                        <p className="text-sm text-muted-foreground">Invalid</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <div className="text-2xl font-bold text-yellow-600">
                          {cleaningResult.summary.duplicatesRemoved}
                        </div>
                        <p className="text-sm text-muted-foreground">Duplicates</p>
                      </CardContent>
                    </Card>
                  </div>

                  {cleaningResult.summary.emailsFixed > 0 && (
                    <Alert>
                      <CheckCircle2 className="h-4 w-4" />
                      <AlertTitle>Auto-Fixed</AlertTitle>
                      <AlertDescription>
                        {cleaningResult.summary.emailsFixed} email addresses were automatically corrected.
                      </AlertDescription>
                    </Alert>
                  )}

                  {existingDuplicates.length > 0 && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Existing Duplicates Found</AlertTitle>
                      <AlertDescription>
                        {existingDuplicates.length} prospects already exist in your database and will be skipped.
                      </AlertDescription>
                    </Alert>
                  )}
                </TabsContent>

                <TabsContent value="issues" className="space-y-2">
                  {getAllIssues().length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <CheckCircle2 className="h-12 w-12 mx-auto mb-2 text-green-500" />
                      No issues found!
                    </div>
                  ) : (
                    <ScrollArea className="h-64">
                      {getAllIssues().map((issue: ValidationIssue, idx: number) => (
                        <div key={idx} className="flex items-start gap-2 p-2 border-b">
                          {issue.severity === "error" ? (
                            <XCircle className="h-4 w-4 text-red-500 mt-0.5" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm">
                              Row {issue.row}: {issue.field} - {issue.issue.replace(/_/g, " ")}
                            </p>
                            {issue.suggestion && <p className="text-xs text-muted-foreground">{issue.suggestion}</p>}
                          </div>
                        </div>
                      ))}
                    </ScrollArea>
                  )}
                </TabsContent>

                <TabsContent value="options" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Remove duplicates</Label>
                        <p className="text-sm text-muted-foreground">Skip rows with duplicate email addresses</p>
                      </div>
                      <Switch
                        checked={cleaningOptions.removeDuplicates}
                        onCheckedChange={(checked) => {
                          setCleaningOptions((prev) => ({ ...prev, removeDuplicates: checked }))
                          setTimeout(rerunCleaning, 0)
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Auto-fix emails</Label>
                        <p className="text-sm text-muted-foreground">Correct common typos in email domains</p>
                      </div>
                      <Switch
                        checked={cleaningOptions.fixEmails}
                        onCheckedChange={(checked) => {
                          setCleaningOptions((prev) => ({ ...prev, fixEmails: checked }))
                          setTimeout(rerunCleaning, 0)
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Remove invalid emails</Label>
                        <p className="text-sm text-muted-foreground">Skip rows with malformed email addresses</p>
                      </div>
                      <Switch
                        checked={cleaningOptions.removeInvalidEmails}
                        onCheckedChange={(checked) => {
                          setCleaningOptions((prev) => ({ ...prev, removeInvalidEmails: checked }))
                          setTimeout(rerunCleaning, 0)
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Filter role-based emails</Label>
                        <p className="text-sm text-muted-foreground">Skip info@, support@, sales@, etc.</p>
                      </div>
                      <Switch
                        checked={cleaningOptions.removeRoleBasedEmails}
                        onCheckedChange={(checked) => {
                          setCleaningOptions((prev) => ({ ...prev, removeRoleBasedEmails: checked }))
                          setTimeout(rerunCleaning, 0)
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Filter disposable emails</Label>
                        <p className="text-sm text-muted-foreground">Skip temporary/throwaway email addresses</p>
                      </div>
                      <Switch
                        checked={cleaningOptions.removeDisposableEmails}
                        onCheckedChange={(checked) => {
                          setCleaningOptions((prev) => ({ ...prev, removeDisposableEmails: checked }))
                          setTimeout(rerunCleaning, 0)
                        }}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep("mapping")}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button onClick={performImport} disabled={cleaningResult.summary.valid === 0}>
                  Import {cleaningResult.summary.valid} Prospects
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Importing */}
          {step === "importing" && (
            <div className="space-y-4 py-8 text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
              <h3 className="text-lg font-medium">Importing prospects...</h3>
              <Progress value={importProgress} className="max-w-md mx-auto" />
              <p className="text-sm text-muted-foreground">This may take a moment for large files.</p>
            </div>
          )}

          {/* Step 5: Complete */}
          {step === "complete" && importResult && (
            <div className="space-y-4 py-8 text-center">
              <CheckCircle2 className="h-16 w-16 mx-auto text-green-500" />
              <h3 className="text-lg font-medium">Import Complete!</h3>
              <div className="flex items-center justify-center gap-8">
                <div>
                  <div className="text-3xl font-bold text-green-600">{importResult.success}</div>
                  <p className="text-sm text-muted-foreground">Imported</p>
                </div>
                {importResult.failed > 0 && (
                  <div>
                    <div className="text-3xl font-bold text-red-600">{importResult.failed}</div>
                    <p className="text-sm text-muted-foreground">Failed</p>
                  </div>
                )}
              </div>
              <Button onClick={() => handleOpenChange(false)}>Done</Button>
            </div>
          )}

          {/* Upgrade Required */}
          {step === "upgrade" && upgradeInfo && (
            <div className="space-y-4 py-8 text-center">
              <AlertTriangle className="h-16 w-16 mx-auto text-yellow-500" />
              <h3 className="text-lg font-medium">Upgrade Required</h3>
              <p className="text-muted-foreground">
                Your {upgradeInfo.plan} plan allows {upgradeInfo.limit} prospects.
                <br />
                You currently have {upgradeInfo.current} prospects.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Button variant="outline" onClick={() => handleOpenChange(false)}>
                  Cancel
                </Button>
                <Button onClick={() => router.push("/settings/billing")}>Upgrade Now</Button>
              </div>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
