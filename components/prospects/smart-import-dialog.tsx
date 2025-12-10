// "use client"

// import type React from "react"

// import { useState, useCallback } from "react"
// import { useRouter } from "next/navigation"
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Badge } from "@/components/ui/badge"
// import { Card, CardContent } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Switch } from "@/components/ui/switch"
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// import { Progress } from "@/components/ui/progress"
// import { Separator } from "@/components/ui/separator"
// import {
//   Upload,
//   FileSpreadsheet,
//   ArrowRight,
//   Check,
//   AlertTriangle,
//   Loader2,
//   CheckCircle2,
//   ArrowLeft,
//   Sparkles,
//   AlertCircle,
//   Copy,
// } from "lucide-react"
// import { parseFile, type ParsedFile } from "@/lib/utils/file-parser"
// import {
//   detectFieldMappings,
//   STANDARD_FIELDS,
//   applyFieldMappings,
//   type FieldMapping,
//   type MappingResult,
// } from "@/lib/services/import-field-mapper"
// import { cleanAndValidateData, type CleaningResult, type ValidationIssue } from "@/lib/services/data-cleaner"
// import { toast } from "sonner"

// interface SmartImportDialogProps {
//   trigger?: React.ReactNode
//   folderId?: string
//   folderName?: string
//   onImportComplete?: () => void
// }

// export function SmartImportDialog({ trigger, folderId, folderName, onImportComplete }: SmartImportDialogProps) {
//   const router = useRouter()
//   const [open, setOpen] = useState(false)
//   const [step, setStep] = useState<"upload" | "mapping" | "cleaning" | "importing" | "complete" | "upgrade">("upload")
//   const [file, setFile] = useState<File | null>(null)
//   const [headers, setHeaders] = useState<string[]>([])
//   const [rows, setRows] = useState<string[][]>([])
//   const [parseError, setParseError] = useState<string | null>(null)
//   const [mappingResult, setMappingResult] = useState<MappingResult | null>(null)
//   const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>([])
//   const [cleaningResult, setCleaningResult] = useState<CleaningResult | null>(null)
//   const [cleaningOptions, setCleaningOptions] = useState({
//     removeDuplicates: true,
//     fixEmails: true,
//     fixUrls: true,
//     removeInvalidEmails: true,
//     removeRoleBasedEmails: false,
//     removeDisposableEmails: false,
//   })
//   const [importProgress, setImportProgress] = useState(0)
//   const [importResult, setImportResult] = useState<{ success: number; failed: number; skipped: number } | null>(null)
//   const [existingDuplicates, setExistingDuplicates] = useState<string[]>([])
//   const [upgradeInfo, setUpgradeInfo] = useState<{ current: number; limit: number; plan: string } | null>(null)
//   const [checkingDuplicates, setCheckingDuplicates] = useState(false)

//   const handleTriggerClick = (e: React.MouseEvent) => {
//     e.stopPropagation()
//     e.preventDefault()
//     setOpen(true)
//   }

//   // Reset state when dialog closes
//   const handleOpenChange = (isOpen: boolean) => {
//     setOpen(isOpen)
//     if (!isOpen) {
//       setStep("upload")
//       setFile(null)
//       setHeaders([])
//       setRows([])
//       setParseError(null)
//       setMappingResult(null)
//       setFieldMappings([])
//       setCleaningResult(null)
//       setImportProgress(0)
//       setImportResult(null)
//       setExistingDuplicates([])
//       setUpgradeInfo(null)
//       setCheckingDuplicates(false)
//     }
//   }

//   // Handle file selection and parsing
//   const handleFileSelect = useCallback(async (selectedFile: File) => {
//     setFile(selectedFile)
//     setParseError(null)

//     try {
//       const parsed: ParsedFile = await parseFile(selectedFile)
//       const parsedHeaders = parsed.headers
//       const parsedRows = parsed.rows

//       if (parsedHeaders.length === 0) {
//         throw new Error("No headers found in file")
//       }

//       if (parsedRows.length === 0) {
//         throw new Error("No data rows found in file")
//       }

//       setHeaders(parsedHeaders)
//       setRows(parsedRows)

//       const result = detectFieldMappings(parsedHeaders)
//       setMappingResult(result)
//       setFieldMappings(result.mappings)

//       setStep("mapping")
//     } catch (err) {
//       setParseError(err instanceof Error ? err.message : "Failed to parse file")
//     }
//   }, [])

//   // Handle drag and drop
//   const handleDrop = useCallback(
//     (e: React.DragEvent) => {
//       e.preventDefault()
//       const droppedFile = e.dataTransfer.files[0]
//       if (droppedFile) {
//         handleFileSelect(droppedFile)
//       }
//     },
//     [handleFileSelect],
//   )

//   // Update a specific field mapping
//   const updateMapping = (sourceField: string, targetField: string) => {
//     setFieldMappings((prev) => {
//       // Remove any existing mapping for this source field
//       const filtered = prev.filter((m) => m.sourceField !== sourceField)

//       if (targetField === "skip") {
//         return filtered
//       }

//       // Add new mapping
//       return [
//         ...filtered,
//         {
//           sourceField,
//           targetField,
//           confidence: 1.0,
//           isCustomField: targetField.startsWith("custom_"),
//         },
//       ]
//     })
//   }

//   // Proceed to cleaning step
//   const proceedToCleaning = async () => {
//     // Apply mappings to transform data
//     const transformedRecords = applyFieldMappings(headers, rows, fieldMappings)

//     console.log("[v0] Transformed records count:", transformedRecords.length)
//     console.log("[v0] Sample transformed record:", transformedRecords[0])

//     // Clean and validate the data
//     const result = cleanAndValidateData(transformedRecords, cleaningOptions)
//     setCleaningResult(result)

//     console.log(
//       "[v0] Cleaning result - valid:",
//       result.validRecords.length,
//       "duplicates in file:",
//       result.duplicates.length,
//     )

//     setCheckingDuplicates(true)
//     try {
//       // Get all emails from transformed records (before filtering)
//       const allEmails = transformedRecords
//         .map((r) => r.email)
//         .filter((e): e is string => typeof e === "string" && e.trim().length > 0)

//       console.log("[v0] Emails to check for duplicates:", allEmails.length)
//       console.log("[v0] Sample emails:", allEmails.slice(0, 5))

//       if (allEmails.length === 0) {
//         console.log("[v0] No emails found in transformed records - check field mapping!")
//         toast.error("No emails found! Make sure you have mapped the email column correctly.")
//         setExistingDuplicates([])
//         setCheckingDuplicates(false)
//         setStep("cleaning")
//         return
//       }

//       const response = await fetch("/api/prospects/check-duplicates", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ emails: allEmails }),
//       })

//       console.log("[v0] Check duplicates response status:", response.status)

//       if (response.ok) {
//         const data = await response.json()
//         console.log("[v0] Duplicates API response:", data)

//         const duplicates = data.duplicates || []
//         setExistingDuplicates(duplicates)

//         if (duplicates.length > 0) {
//           toast.warning(`Found ${duplicates.length} prospects that already exist in your database!`)
//         } else {
//           console.log("[v0] No existing duplicates found")
//         }
//       } else {
//         const errorText = await response.text()
//         console.error("[v0] Failed to check duplicates:", response.status, errorText)
//         toast.error("Failed to check for existing duplicates")
//       }
//     } catch (err) {
//       console.error("[v0] Failed to check duplicates:", err)
//       toast.error("Failed to check for existing duplicates")
//     } finally {
//       setCheckingDuplicates(false)
//     }

//     setStep("cleaning")
//   }

//   // Re-run cleaning with updated options
//   const rerunCleaning = () => {
//     const transformedRecords = applyFieldMappings(headers, rows, fieldMappings)
//     const result = cleanAndValidateData(transformedRecords, cleaningOptions)
//     setCleaningResult(result)
//   }

//   // Perform the import
//   const performImport = async () => {
//     if (!cleaningResult) return

//     setStep("importing")
//     setImportProgress(0)

//     try {
//       // Filter out existing duplicates
//       let recordsToImport = cleaningResult.validRecords
//       if (existingDuplicates.length > 0) {
//         const existingSet = new Set(existingDuplicates.map((e) => e.toLowerCase()))
//         recordsToImport = recordsToImport.filter((r) => !existingSet.has(r.email?.toLowerCase()))
//         console.log("[v0] After removing existing duplicates:", recordsToImport.length, "records")
//       }

//       if (recordsToImport.length === 0) {
//         toast.error("No new prospects to import - all records already exist in database")
//         setStep("cleaning")
//         return
//       }

//       setImportProgress(30)

//       // Send to API
//       const response = await fetch("/api/prospects/import", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           prospects: recordsToImport,
//           folderId,
//           skipExistingDuplicates: true,
//         }),
//       })

//       const data = await response.json()

//       if (response.status === 402) {
//         setUpgradeInfo({
//           current: data.currentCount ?? 0,
//           limit: data.limit ?? 50,
//           plan: data.plan ?? "FREE",
//         })
//         setStep("upgrade")
//         return
//       }

//       if (!response.ok) {
//         throw new Error(data.error || "Import failed")
//       }

//       setImportProgress(100)
//       setImportResult({
//         success: data.imported || 0,
//         failed: data.failed || 0,
//         skipped: data.skipped || 0,
//       })
//       setStep("complete")

//       // Notify parent to refresh
//       onImportComplete?.()
//     } catch (err) {
//       console.error("[v0] Import failed:", err)
//       toast.error(err instanceof Error ? err.message : "Import failed")
//       setStep("cleaning")
//     }
//   }

//   // Get the current mapping for a header
//   const getMappingForHeader = (header: string): string => {
//     const mapping = fieldMappings.find((m) => m.sourceField === header)
//     return mapping?.targetField || "skip"
//   }

//   // Get sample values for a header
//   const getSampleValues = (header: string): string[] => {
//     const headerIndex = headers.indexOf(header)
//     if (headerIndex === -1) return []
//     return rows
//       .slice(0, 3)
//       .map((row) => row[headerIndex] || "")
//       .filter(Boolean)
//   }

//   // Collect all issues from invalidRecords
//   const getAllIssues = (): ValidationIssue[] => {
//     if (!cleaningResult) return []
//     return cleaningResult.invalidRecords.flatMap((r) => r.issues)
//   }

//   const renderTrigger = () => {
//     if (trigger) {
//       // Clone the trigger element and add our click handler
//       return (
//         <div
//           onClick={(e) => {
//             e.stopPropagation()
//             e.preventDefault()
//             setOpen(true)
//           }}
//           onMouseDown={(e) => e.stopPropagation()}
//           onPointerDown={(e) => e.stopPropagation()}
//           className="cursor-pointer inline-block"
//         >
//           {trigger}
//         </div>
//       )
//     }
//     return (
//       <Button variant="outline" size="sm" onClick={handleTriggerClick}>
//         <Upload className="mr-2 h-4 w-4" />
//         Import
//       </Button>
//     )
//   }

//   return (
//     <>
//       {renderTrigger()}
//       <Dialog open={open} onOpenChange={handleOpenChange}>
//         <DialogContent className="!max-w-7xl w-[98vw] max-h-[90vh] flex flex-col overflow-hidden">
//           <DialogHeader className="flex-shrink-0">
//             <DialogTitle className="flex items-center gap-2">
//               <FileSpreadsheet className="h-5 w-5" />
//               Smart Import {folderName && `to "${folderName}"`}
//             </DialogTitle>
//           </DialogHeader>

//           {/* Step indicator */}
//           <div className="flex items-center gap-2 py-2 flex-shrink-0">
//             {["upload", "mapping", "cleaning", "importing", "complete"].map((s, i) => (
//               <div key={s} className="flex items-center">
//                 <div
//                   className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
//                     step === s
//                       ? "bg-primary text-primary-foreground"
//                       : ["upload", "mapping", "cleaning", "importing", "complete"].indexOf(step) > i
//                         ? "bg-primary/20 text-primary"
//                         : "bg-muted text-muted-foreground"
//                   }`}
//                 >
//                   {["upload", "mapping", "cleaning", "importing", "complete"].indexOf(step) > i ? (
//                     <Check className="h-4 w-4" />
//                   ) : (
//                     i + 1
//                   )}
//                 </div>
//                 {i < 4 && <div className="w-8 md:w-16 h-0.5 bg-muted mx-1" />}
//               </div>
//             ))}
//           </div>

//           <div className="flex-1 overflow-y-auto min-h-0">
//             {/* Step 1: Upload */}
//             {step === "upload" && (
//               <div className="space-y-4 py-4">
//                 <div
//                   className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
//                   onDrop={handleDrop}
//                   onDragOver={(e) => e.preventDefault()}
//                   onClick={() => document.getElementById("file-input")?.click()}
//                 >
//                   <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
//                   <p className="text-lg font-medium">Drop your file here or click to browse</p>
//                   <p className="text-sm text-muted-foreground mt-1">Supports CSV and TXT files</p>
//                   <Input
//                     id="file-input"
//                     type="file"
//                     accept=".csv,.txt"
//                     className="hidden"
//                     onChange={(e) => {
//                       const f = e.target.files?.[0]
//                       if (f) handleFileSelect(f)
//                     }}
//                   />
//                 </div>

//                 {parseError && (
//                   <Alert variant="destructive">
//                     <AlertCircle className="h-4 w-4" />
//                     <AlertTitle>Parse Error</AlertTitle>
//                     <AlertDescription>{parseError}</AlertDescription>
//                   </Alert>
//                 )}

//                 <div className="bg-muted/50 rounded-lg p-4">
//                   <h4 className="font-medium mb-2 flex items-center gap-2">
//                     <Sparkles className="h-4 w-4" />
//                     Smart Field Detection
//                   </h4>
//                   <p className="text-sm text-muted-foreground">
//                     Our AI will automatically detect and map your columns. You can import any CSV structure - we will
//                     match common fields like email, name, company, and store any custom fields for personalization.
//                   </p>
//                 </div>
//               </div>
//             )}

//             {/* Step 2: Field Mapping */}
//             {step === "mapping" && mappingResult && (
//               <div className="space-y-4 py-4">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <h3 className="font-medium">Map Your Fields</h3>
//                     <p className="text-sm text-muted-foreground">
//                       We detected {headers.length} columns and {rows.length} rows. Review and adjust the mappings below.
//                     </p>
//                   </div>
//                   <Badge variant={mappingResult.confidence > 0.7 ? "default" : "secondary"}>
//                     {Math.round(mappingResult.confidence * 100)}% confidence
//                   </Badge>
//                 </div>

//                 <div className="border rounded-lg overflow-hidden">
//                   <table className="w-full">
//                     <thead className="bg-muted/50">
//                       <tr>
//                         <th className="text-left p-3 font-medium w-1/4">Your Column</th>
//                         <th className="text-left p-3 font-medium w-1/4">Sample Data</th>
//                         <th className="text-left p-3 font-medium w-1/4">Map To</th>
//                         <th className="text-left p-3 font-medium w-1/4">Status</th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y">
//                       {headers.map((header) => {
//                         const currentMapping = getMappingForHeader(header)
//                         const samples = getSampleValues(header)
//                         const isEmailField = currentMapping === "email"

//                         return (
//                           <tr key={header} className={isEmailField ? "bg-green-50 dark:bg-green-950/20" : ""}>
//                             <td className="p-3">
//                               <code className="text-sm bg-muted px-2 py-1 rounded break-all">{header}</code>
//                             </td>
//                             <td className="p-3">
//                               <div className="text-sm text-muted-foreground truncate max-w-[200px]">
//                                 {samples.join(", ") || "-"}
//                               </div>
//                             </td>
//                             <td className="p-3">
//                               <Select value={currentMapping} onValueChange={(v) => updateMapping(header, v)}>
//                                 <SelectTrigger className="w-full">
//                                   <SelectValue />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                   <SelectItem value="skip">-- Skip --</SelectItem>
//                                   <Separator className="my-1" />
//                                   {STANDARD_FIELDS.map((field) => (
//                                     <SelectItem key={field.key} value={field.key}>
//                                       {field.label}
//                                     </SelectItem>
//                                   ))}
//                                   <Separator className="my-1" />
//                                   <SelectItem value={`custom_${header}`}>Custom: {header}</SelectItem>
//                                 </SelectContent>
//                               </Select>
//                             </td>
//                             <td className="p-3">
//                               {currentMapping === "skip" ? (
//                                 <Badge variant="secondary">Skipped</Badge>
//                               ) : currentMapping.startsWith("custom_") ? (
//                                 <Badge variant="outline">Custom</Badge>
//                               ) : (
//                                 <Badge variant="default">
//                                   <Check className="h-3 w-3 mr-1" />
//                                   Mapped
//                                 </Badge>
//                               )}
//                             </td>
//                           </tr>
//                         )
//                       })}
//                     </tbody>
//                   </table>
//                 </div>

//                 {/* Warning if no email field mapped */}
//                 {!fieldMappings.some((m) => m.targetField === "email") && (
//                   <Alert variant="destructive">
//                     <AlertTriangle className="h-4 w-4" />
//                     <AlertTitle>Email Required</AlertTitle>
//                     <AlertDescription>
//                       You must map at least one column to the Email field to import prospects.
//                     </AlertDescription>
//                   </Alert>
//                 )}

//                 <div className="flex justify-between pt-4">
//                   <Button variant="outline" onClick={() => setStep("upload")}>
//                     <ArrowLeft className="mr-2 h-4 w-4" />
//                     Back
//                   </Button>
//                   <Button onClick={proceedToCleaning} disabled={!fieldMappings.some((m) => m.targetField === "email")}>
//                     Continue to Cleaning
//                     <ArrowRight className="ml-2 h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>
//             )}

//             {/* Step 3: Data Cleaning */}
//             {step === "cleaning" && cleaningResult && (
//               <div className="space-y-4 py-4">
//                 {checkingDuplicates && (
//                   <Alert>
//                     <Loader2 className="h-4 w-4 animate-spin" />
//                     <AlertTitle>Checking for existing duplicates...</AlertTitle>
//                     <AlertDescription>
//                       We are checking if any of these emails already exist in your database.
//                     </AlertDescription>
//                   </Alert>
//                 )}

//                 {existingDuplicates.length > 0 && (
//                   <Alert variant="destructive">
//                     <AlertTriangle className="h-4 w-4" />
//                     <AlertTitle>Found {existingDuplicates.length} Existing Duplicates!</AlertTitle>
//                     <AlertDescription>
//                       These emails already exist in your database and will be skipped during import.
//                     </AlertDescription>
//                   </Alert>
//                 )}

//                 <Tabs defaultValue="summary">
//                   <TabsList className="grid w-full grid-cols-4">
//                     <TabsTrigger value="summary">Summary</TabsTrigger>
//                     <TabsTrigger value="existing">Existing ({existingDuplicates.length})</TabsTrigger>
//                     <TabsTrigger value="issues">Issues ({getAllIssues().length})</TabsTrigger>
//                     <TabsTrigger value="options">Options</TabsTrigger>
//                   </TabsList>

//                   <TabsContent value="summary" className="space-y-4 mt-4">
//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                       <Card>
//                         <CardContent className="p-4 text-center">
//                           <div className="text-3xl font-bold text-primary">{cleaningResult.summary.total}</div>
//                           <div className="text-sm text-muted-foreground">Total Records</div>
//                         </CardContent>
//                       </Card>
//                       <Card>
//                         <CardContent className="p-4 text-center">
//                           <div className="text-3xl font-bold text-green-600">{cleaningResult.summary.valid}</div>
//                           <div className="text-sm text-muted-foreground">Valid</div>
//                         </CardContent>
//                       </Card>
//                       <Card>
//                         <CardContent className="p-4 text-center">
//                           <div className="text-3xl font-bold text-red-600">{existingDuplicates.length}</div>
//                           <div className="text-sm text-muted-foreground">Already Exist</div>
//                         </CardContent>
//                       </Card>
//                       <Card>
//                         <CardContent className="p-4 text-center">
//                           <div className="text-3xl font-bold text-blue-600">
//                             {Math.max(0, cleaningResult.summary.valid - existingDuplicates.length)}
//                           </div>
//                           <div className="text-sm text-muted-foreground">Will Import</div>
//                         </CardContent>
//                       </Card>
//                     </div>

//                     {cleaningResult.summary.emailsFixed > 0 && (
//                       <Alert>
//                         <CheckCircle2 className="h-4 w-4 text-green-600" />
//                         <AlertTitle>Auto-Fixed {cleaningResult.summary.emailsFixed} Emails</AlertTitle>
//                         <AlertDescription>We fixed common typos like gmial.com → gmail.com</AlertDescription>
//                       </Alert>
//                     )}

//                     {cleaningResult.duplicates.length > 0 && (
//                       <Alert variant="destructive">
//                         <Copy className="h-4 w-4" />
//                         <AlertTitle>{cleaningResult.duplicates.length} Duplicates in File</AlertTitle>
//                         <AlertDescription>
//                           Found {cleaningResult.duplicates.length} duplicate emails within your file.
//                           {cleaningOptions.removeDuplicates
//                             ? " Duplicates will be removed."
//                             : " Enable 'Remove duplicates' to filter them."}
//                         </AlertDescription>
//                       </Alert>
//                     )}
//                   </TabsContent>

//                   <TabsContent value="existing" className="mt-4">
//                     {existingDuplicates.length === 0 ? (
//                       <div className="text-center py-8 text-muted-foreground">
//                         <CheckCircle2 className="h-12 w-12 mx-auto mb-2 text-green-500" />
//                         <p>No existing duplicates found! All prospects are new.</p>
//                       </div>
//                     ) : (
//                       <div className="space-y-2">
//                         <p className="text-sm text-muted-foreground mb-4">
//                           These {existingDuplicates.length} emails already exist in your database and will be skipped:
//                         </p>
//                         <div className="max-h-[300px] overflow-y-auto border rounded-lg">
//                           <table className="w-full">
//                             <thead className="bg-muted/50 sticky top-0">
//                               <tr>
//                                 <th className="text-left p-2 font-medium">#</th>
//                                 <th className="text-left p-2 font-medium">Email</th>
//                               </tr>
//                             </thead>
//                             <tbody className="divide-y">
//                               {existingDuplicates.map((email, idx) => (
//                                 <tr key={idx} className="bg-red-50 dark:bg-red-950/20">
//                                   <td className="p-2 text-sm">{idx + 1}</td>
//                                   <td className="p-2 text-sm">{email}</td>
//                                 </tr>
//                               ))}
//                             </tbody>
//                           </table>
//                         </div>
//                       </div>
//                     )}
//                   </TabsContent>

//                   <TabsContent value="issues" className="mt-4">
//                     {getAllIssues().length === 0 ? (
//                       <div className="text-center py-8 text-muted-foreground">
//                         <CheckCircle2 className="h-12 w-12 mx-auto mb-2 text-green-500" />
//                         <p>No issues found! Your data looks clean.</p>
//                       </div>
//                     ) : (
//                       <div className="max-h-[300px] overflow-y-auto border rounded-lg">
//                         <table className="w-full">
//                           <thead className="bg-muted/50 sticky top-0">
//                             <tr>
//                               <th className="text-left p-2 font-medium">Row</th>
//                               <th className="text-left p-2 font-medium">Field</th>
//                               <th className="text-left p-2 font-medium">Issue</th>
//                               <th className="text-left p-2 font-medium">Value</th>
//                             </tr>
//                           </thead>
//                           <tbody className="divide-y">
//                             {getAllIssues().map((issue: ValidationIssue, idx: number) => (
//                               <tr key={idx}>
//                                 <td className="p-2 text-sm">{issue.row}</td>
//                                 <td className="p-2 text-sm">{issue.field}</td>
//                                 <td className="p-2">
//                                   <Badge variant={issue.severity === "error" ? "destructive" : "secondary"}>
//                                     {issue.issue.replace(/_/g, " ")}
//                                   </Badge>
//                                 </td>
//                                 <td className="p-2 text-sm truncate max-w-[200px]">{issue.value}</td>
//                               </tr>
//                             ))}
//                           </tbody>
//                         </table>
//                       </div>
//                     )}
//                   </TabsContent>

//                   <TabsContent value="options" className="space-y-4 mt-4">
//                     <div className="space-y-4">
//                       {[
//                         {
//                           key: "removeDuplicates",
//                           label: "Remove duplicate emails",
//                           desc: "Keep only the first occurrence",
//                         },
//                         { key: "fixEmails", label: "Auto-fix email typos", desc: "Fix common typos like gmial.com" },
//                         { key: "fixUrls", label: "Auto-fix URLs", desc: "Add https:// and fix LinkedIn URLs" },
//                         {
//                           key: "removeInvalidEmails",
//                           label: "Remove invalid emails",
//                           desc: "Skip records with invalid email format",
//                         },
//                         {
//                           key: "removeRoleBasedEmails",
//                           label: "Remove role-based emails",
//                           desc: "Skip info@, support@, etc.",
//                         },
//                         {
//                           key: "removeDisposableEmails",
//                           label: "Remove disposable emails",
//                           desc: "Skip mailinator, tempmail, etc.",
//                         },
//                       ].map((option) => (
//                         <div key={option.key} className="flex items-center justify-between">
//                           <div>
//                             <Label htmlFor={option.key}>{option.label}</Label>
//                             <p className="text-sm text-muted-foreground">{option.desc}</p>
//                           </div>
//                           <Switch
//                             id={option.key}
//                             checked={cleaningOptions[option.key as keyof typeof cleaningOptions]}
//                             onCheckedChange={(checked) => {
//                               setCleaningOptions((prev) => ({ ...prev, [option.key]: checked }))
//                             }}
//                           />
//                         </div>
//                       ))}
//                     </div>
//                     <Button variant="outline" onClick={rerunCleaning} className="w-full bg-transparent">
//                       <Sparkles className="mr-2 h-4 w-4" />
//                       Re-run Cleaning with New Options
//                     </Button>
//                   </TabsContent>
//                 </Tabs>

//                 <div className="flex justify-between pt-4">
//                   <Button variant="outline" onClick={() => setStep("mapping")}>
//                     <ArrowLeft className="mr-2 h-4 w-4" />
//                     Back to Mapping
//                   </Button>
//                   <Button
//                     onClick={performImport}
//                     disabled={cleaningResult.summary.valid - existingDuplicates.length <= 0}
//                   >
//                     Import {Math.max(0, cleaningResult.summary.valid - existingDuplicates.length)} Prospects
//                     <ArrowRight className="ml-2 h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>
//             )}

//             {/* Step 4: Importing */}
//             {step === "importing" && (
//               <div className="py-12 text-center space-y-6">
//                 <Loader2 className="h-16 w-16 animate-spin mx-auto text-primary" />
//                 <div>
//                   <h3 className="text-xl font-medium">Importing Prospects...</h3>
//                   <p className="text-muted-foreground mt-1">This may take a moment</p>
//                 </div>
//                 <Progress value={importProgress} className="max-w-md mx-auto" />
//               </div>
//             )}

//             {/* Step 5: Complete */}
//             {step === "complete" && importResult && (
//               <div className="py-12 text-center space-y-6">
//                 <CheckCircle2 className="h-16 w-16 mx-auto text-green-500" />
//                 <div>
//                   <h3 className="text-xl font-medium">Import Complete!</h3>
//                   <p className="text-muted-foreground mt-1">Your prospects have been imported successfully</p>
//                 </div>

//                 <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
//                   <Card>
//                     <CardContent className="p-4 text-center">
//                       <div className="text-2xl font-bold text-green-600">{importResult.success}</div>
//                       <div className="text-sm text-muted-foreground">Imported</div>
//                     </CardContent>
//                   </Card>
//                   <Card>
//                     <CardContent className="p-4 text-center">
//                       <div className="text-2xl font-bold text-yellow-600">{importResult.skipped}</div>
//                       <div className="text-sm text-muted-foreground">Skipped</div>
//                     </CardContent>
//                   </Card>
//                   <Card>
//                     <CardContent className="p-4 text-center">
//                       <div className="text-2xl font-bold text-red-600">{importResult.failed}</div>
//                       <div className="text-sm text-muted-foreground">Failed</div>
//                     </CardContent>
//                   </Card>
//                 </div>

//                 <Button onClick={() => handleOpenChange(false)}>
//                   <Check className="mr-2 h-4 w-4" />
//                   Done
//                 </Button>
//               </div>
//             )}

//             {/* Upgrade Required Step */}
//             {step === "upgrade" && upgradeInfo && (
//               <div className="py-12 text-center space-y-6">
//                 <AlertTriangle className="h-16 w-16 mx-auto text-yellow-500" />
//                 <div>
//                   <h3 className="text-xl font-medium">Upgrade Required</h3>
//                   <p className="text-muted-foreground mt-1">
//                     Your {upgradeInfo.plan} plan allows up to {upgradeInfo.limit} prospects.
//                   </p>
//                   <p className="text-muted-foreground">You currently have {upgradeInfo.current} prospects.</p>
//                 </div>

//                 <div className="flex gap-4 justify-center">
//                   <Button variant="outline" onClick={() => setStep("cleaning")}>
//                     <ArrowLeft className="mr-2 h-4 w-4" />
//                     Go Back
//                   </Button>
//                   <Button onClick={() => window.open("/settings/billing", "_blank")}>
//                     Upgrade Plan
//                     <ArrowRight className="ml-2 h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </DialogContent>
//       </Dialog>
//     </>
//   )
// }
"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Upload,
  FileSpreadsheet,
  ArrowRight,
  Check,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  AlertCircle,
  XCircle,
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
import { WaveLoader } from "../loader/wave-loader"

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
  const [importResult, setImportResult] = useState<{ success: number; failed: number; skipped: number } | null>(null)
  const [existingDuplicates, setExistingDuplicates] = useState<string[]>([])
  const [upgradeInfo, setUpgradeInfo] = useState<{ current: number; limit: number; plan: string } | null>(null)
  const [checkingDuplicates, setCheckingDuplicates] = useState(false)

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
      setCheckingDuplicates(false)
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
      const filtered = prev.filter((m) => m.sourceField !== sourceField)

      if (targetField === "skip") {
        return filtered
      }

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
    const transformedRecords = applyFieldMappings(headers, rows, fieldMappings)

    console.log("[v0] Transformed records count:", transformedRecords.length)
    console.log("[v0] Sample transformed record:", transformedRecords[0])

    const result = cleanAndValidateData(transformedRecords, cleaningOptions)
    setCleaningResult(result)

    console.log(
      "[v0] Cleaning result - valid:",
      result.validRecords.length,
      "duplicates in file:",
      result.duplicates.length,
    )

    setCheckingDuplicates(true)
    try {
      const allEmails = transformedRecords
        .map((r) => r.email)
        .filter((e): e is string => typeof e === "string" && e.trim().length > 0)

      console.log("[v0] Emails to check for duplicates:", allEmails.length)
      console.log("[v0] Sample emails:", allEmails.slice(0, 5))

      if (allEmails.length === 0) {
        console.log("[v0] No emails found in transformed records - check field mapping!")
        toast.error("No emails found! Make sure you have mapped the email column correctly.")
        setExistingDuplicates([])
        setCheckingDuplicates(false)
        setStep("cleaning")
        return
      }

      const response = await fetch("/api/prospects/check-duplicates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emails: allEmails }),
      })

      console.log("[v0] Check duplicates response status:", response.status)

      if (response.ok) {
        const data = await response.json()
        console.log("[v0] Duplicates API response:", data)

        const duplicates = data.duplicates || []
        setExistingDuplicates(duplicates)

        if (duplicates.length > 0) {
          toast.warning(`Found ${duplicates.length} prospects that already exist in your database!`)
        }
      } else {
        const errorText = await response.text()
        console.error("[v0] Failed to check duplicates:", response.status, errorText)
        toast.error("Failed to check for existing duplicates")
      }
    } catch (err) {
      console.error("[v0] Failed to check duplicates:", err)
      toast.error("Failed to check for existing duplicates")
    } finally {
      setCheckingDuplicates(false)
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
      let recordsToImport = cleaningResult.validRecords

      if (existingDuplicates.length > 0) {
        const existingSet = new Set(existingDuplicates.map((e) => e.toLowerCase()))
        const beforeCount = recordsToImport.length
        recordsToImport = recordsToImport.filter((r) => !existingSet.has(r.email?.toLowerCase()))
        console.log("[v0] Filtered out", beforeCount - recordsToImport.length, "existing duplicates")
        console.log("[v0] Records to import after filtering:", recordsToImport.length)
      }

      if (recordsToImport.length === 0) {
        toast.error("No new prospects to import - all records already exist in database")
        setStep("cleaning")
        return
      }

      setImportProgress(30)

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
        setUpgradeInfo({
          current: data.currentCount ?? 0,
          limit: data.limit ?? 50,
          plan: data.plan ?? "FREE",
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
        skipped: data.skipped || 0,
      })
      setStep("complete")

      onImportComplete?.()
    } catch (err) {
      console.error("[v0] Import failed:", err)
      toast.error(err instanceof Error ? err.message : "Import failed")
      setStep("cleaning")
    }
  }

  const getMappingForHeader = (header: string): string => {
    const mapping = fieldMappings.find((m) => m.sourceField === header)
    return mapping?.targetField || "skip"
  }

  const getSampleValues = (header: string): string[] => {
    const headerIndex = headers.indexOf(header)
    if (headerIndex === -1) return []
    return rows
      .slice(0, 3)
      .map((row) => row[headerIndex] || "")
      .filter(Boolean)
  }

  const getAllIssues = (): ValidationIssue[] => {
    if (!cleaningResult) return []
    return cleaningResult.invalidRecords.flatMap((r) => r.issues)
  }

  return (
    <>
      {trigger ? (
        <div
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
            setOpen(true)
          }}
          onMouseDown={(e) => {
            e.stopPropagation()
            e.preventDefault()
          }}
          onPointerDown={(e) => {
            e.stopPropagation()
            e.preventDefault()
          }}
          style={{ display: "inline-block" }}
        >
          {trigger}
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
            setOpen(true)
          }}
        >
          <Upload className="mr-2 h-4 w-4" />
          Import
        </Button>
      )}

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          className="flex flex-col overflow-hidden"
          style={{
            maxWidth: "1400px",
            width: "95vw",
            maxHeight: "90vh",
          }}
        >
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5" />
              Smart Import {folderName && `to "${folderName}"`}
            </DialogTitle>
          </DialogHeader>

          {/* Step indicator */}
          <div className="flex items-center gap-2 py-2 flex-shrink-0">
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

          <div className="flex-1 overflow-y-auto min-h-0 pr-2">
            {/* Step 1: Upload */}
            {step === "upload" && (
              <div className="space-y-6 py-4">
                <div
                  className="border-2 border-dashed rounded-lg p-12 text-center cursor-pointer hover:border-primary/50 transition-colors"
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => document.getElementById("file-upload")?.click()}
                >
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium mb-2">Drop your file here or click to browse</p>
                  <p className="text-sm text-muted-foreground">Supports CSV, TXT files</p>
                  <input
                    id="file-upload"
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
                    <AlertTitle>Error parsing file</AlertTitle>
                    <AlertDescription>{parseError}</AlertDescription>
                  </Alert>
                )}

                <div className="text-sm text-muted-foreground">
                  <p className="font-medium mb-2">Tips:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>First row should contain column headers</li>
                    <li>We will auto-detect your columns and suggest mappings</li>
                    <li>Any unmapped columns can be kept as custom fields</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Step 2: Field Mapping */}
            {step === "mapping" && (
              <div className="space-y-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Map Your Columns</h3>
                    <p className="text-sm text-muted-foreground">
                      {file?.name} - {rows.length} rows detected
                    </p>
                  </div>
                  {mappingResult && (
                    <Badge variant={mappingResult.confidence > 0.7 ? "default" : "secondary"}>
                      {Math.round(mappingResult.confidence * 100)}% auto-mapped
                    </Badge>
                  )}
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-3 font-medium">Your Column</th>
                        <th className="text-left p-3 font-medium">Sample Values</th>
                        <th className="text-left p-3 font-medium">Map To</th>
                      </tr>
                    </thead>
                    <tbody>
                      {headers.map((header) => (
                        <tr key={header} className="border-t">
                          <td className="p-3">
                            <div className="font-medium">{header}</div>
                          </td>
                          <td className="p-3">
                            <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                              {getSampleValues(header).join(", ") || "No data"}
                            </div>
                          </td>
                          <td className="p-3">
                            <Select value={getMappingForHeader(header)} onValueChange={(v) => updateMapping(header, v)}>
                              <SelectTrigger className="w-[200px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="skip">
                                  <span className="text-muted-foreground">Skip this column</span>
                                </SelectItem>
                                <Separator className="my-1" />
                                {STANDARD_FIELDS.map((field) => (
                                  <SelectItem key={field.key} value={field.key}>
                                    {field.label}
                                    {field.required && <span className="text-destructive ml-1">*</span>}
                                  </SelectItem>
                                ))}
                                <Separator className="my-1" />
                                <SelectItem value={`custom_${header}`}>
                                  <span className="flex items-center gap-1">
                                    <Sparkles className="h-3 w-3" />
                                    Keep as custom field
                                  </span>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {!fieldMappings.some((m) => m.targetField === "email") && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Email required</AlertTitle>
                    <AlertDescription>You must map at least one column to Email</AlertDescription>
                  </Alert>
                )}

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setStep("upload")}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button onClick={proceedToCleaning} disabled={!fieldMappings.some((m) => m.targetField === "email")}>
                    Continue to Review
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Cleaning & Review */}
            {step === "cleaning" && cleaningResult && (
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl font-bold text-green-600">{cleaningResult.validRecords.length}</div>
                      <div className="text-sm text-muted-foreground">Ready to Import</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl font-bold text-yellow-600">{cleaningResult.duplicates.length}</div>
                      <div className="text-sm text-muted-foreground">Duplicates (in file)</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl font-bold text-red-600">{existingDuplicates.length}</div>
                      <div className="text-sm text-muted-foreground">Already in Database</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl font-bold text-orange-600">{cleaningResult.invalidRecords.length}</div>
                      <div className="text-sm text-muted-foreground">Invalid Records</div>
                    </CardContent>
                  </Card>
                </div>

                {checkingDuplicates && (
                  <Alert>
                    <WaveLoader size="sm" bars={8} gap="tight" />
                    <AlertTitle>Checking for existing duplicates...</AlertTitle>
                  </Alert>
                )}

                {existingDuplicates.length > 0 && (
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertTitle>Duplicates Found in Database!</AlertTitle>
                    <AlertDescription>
                      {existingDuplicates.length} email(s) already exist in your database and will be skipped during
                      import.
                    </AlertDescription>
                  </Alert>
                )}

                <Tabs defaultValue="summary">
                  <TabsList>
                    <TabsTrigger value="summary">Summary</TabsTrigger>
                    <TabsTrigger value="issues">Issues ({getAllIssues().length})</TabsTrigger>
                    <TabsTrigger value="existing">Existing ({existingDuplicates.length})</TabsTrigger>
                    <TabsTrigger value="options">Options</TabsTrigger>
                  </TabsList>

                  <TabsContent value="summary" className="space-y-4">
                    <div className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between">
                        <span>Total rows in file</span>
                        <span className="font-medium">{rows.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Valid records</span>
                        <span className="font-medium text-green-600">{cleaningResult.validRecords.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Duplicates in file (removed)</span>
                        <span className="font-medium text-yellow-600">{cleaningResult.duplicates.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Already in database (will skip)</span>
                        <span className="font-medium text-red-600">{existingDuplicates.length}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-medium">
                        <span>Will be imported</span>
                        <span className="text-primary">
                          {Math.max(0, cleaningResult.validRecords.length - existingDuplicates.length)}
                        </span>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="issues" className="space-y-4">
                    {getAllIssues().length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <CheckCircle2 className="h-12 w-12 mx-auto mb-2 text-green-500" />
                        <p>No issues found!</p>
                      </div>
                    ) : (
                      <div className="border rounded-lg overflow-hidden max-h-[300px] overflow-y-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-muted/50 sticky top-0">
                            <tr>
                              <th className="text-left p-2">Row</th>
                              <th className="text-left p-2">Field</th>
                              <th className="text-left p-2">Issue</th>
                            </tr>
                          </thead>
                          <tbody>
                            {getAllIssues()
                              .slice(0, 50)
                              .map((issue: ValidationIssue, idx: number) => (
                                <tr key={idx} className="border-t">
                                  <td className="p-2">{issue.row || "-"}</td>
                                  <td className="p-2">{issue.field}</td>
                                  <td className="p-2 text-red-600">{issue.value}</td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="existing" className="space-y-4">
                    {existingDuplicates.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <CheckCircle2 className="h-12 w-12 mx-auto mb-2 text-green-500" />
                        <p>No existing duplicates found!</p>
                      </div>
                    ) : (
                      <div className="border rounded-lg overflow-hidden max-h-[300px] overflow-y-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-muted/50 sticky top-0">
                            <tr>
                              <th className="text-left p-2">#</th>
                              <th className="text-left p-2">Email (already in database)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {existingDuplicates.map((email, idx) => (
                              <tr key={idx} className="border-t">
                                <td className="p-2">{idx + 1}</td>
                                <td className="p-2 font-mono text-sm">{email}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="options" className="space-y-4">
                    <div className="space-y-4">
                      {Object.entries({
                        removeDuplicates: "Remove duplicate emails (within file)",
                        fixEmails: "Auto-fix common email typos",
                        removeInvalidEmails: "Remove invalid emails",
                        removeRoleBasedEmails: "Remove role-based emails (info@, support@)",
                        removeDisposableEmails: "Remove disposable emails",
                      }).map(([key, label]) => (
                        <div key={key} className="flex items-center justify-between">
                          <Label htmlFor={key}>{label}</Label>
                          <Switch
                            id={key}
                            checked={cleaningOptions[key as keyof typeof cleaningOptions]}
                            onCheckedChange={(checked) => {
                              setCleaningOptions((prev) => ({ ...prev, [key]: checked }))
                              setTimeout(rerunCleaning, 0)
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setStep("mapping")}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    onClick={performImport}
                    disabled={cleaningResult.validRecords.length === 0 || checkingDuplicates}
                  >
                    {checkingDuplicates ? (
                      <>
                        <WaveLoader size="sm" bars={8} gap="tight" />
                        Checking...
                      </>
                    ) : (
                      <>
                        Import {Math.max(0, cleaningResult.validRecords.length - existingDuplicates.length)} Prospects
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Importing */}
            {step === "importing" && (
              <div className="space-y-6 py-12 text-center">
                <WaveLoader size="sm" bars={8} gap="tight" />
                <div>
                  <h3 className="font-medium text-lg">Importing prospects...</h3>
                  <p className="text-sm text-muted-foreground">This may take a moment</p>
                </div>
                <Progress value={importProgress} className="max-w-md mx-auto" />
              </div>
            )}

            {/* Step 5: Complete */}
            {step === "complete" && importResult && (
              <div className="space-y-6 py-12 text-center">
                <CheckCircle2 className="h-16 w-16 mx-auto text-green-500" />
                <div>
                  <h3 className="font-medium text-lg">Import Complete!</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Successfully imported {importResult.success} prospects
                    {importResult.skipped > 0 && `, ${importResult.skipped} skipped`}
                    {importResult.failed > 0 && `, ${importResult.failed} failed`}
                  </p>
                </div>
                <Button onClick={() => handleOpenChange(false)}>Done</Button>
              </div>
            )}

            {/* Upgrade Required */}
            {step === "upgrade" && upgradeInfo && (
              <div className="space-y-6 py-12 text-center">
                <AlertTriangle className="h-16 w-16 mx-auto text-yellow-500" />
                <div>
                  <h3 className="font-medium text-lg">Upgrade Required</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Your {upgradeInfo.plan} plan allows {upgradeInfo.limit} prospects.
                    <br />
                    You currently have {upgradeInfo.current} prospects.
                  </p>
                </div>
                <div className="flex gap-4 justify-center">
                  <Button variant="outline" onClick={() => setStep("cleaning")}>
                    Go Back
                  </Button>
                  <Button onClick={() => router.push("/settings/billing")}>Upgrade Plan</Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
