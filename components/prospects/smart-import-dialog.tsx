// "use client"

// import type React from "react"
// import { useState, useCallback } from "react"
// import { Button } from "@/components/ui/button"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import {
//   Upload,
//   FileSpreadsheet,
//   CheckCircle2,
//   AlertTriangle,
//   ArrowRight,
//   ArrowLeft,
//   Loader2,
//   Download,
//   Sparkles,
//   AlertCircle,
//   Check,
//   RefreshCw,
// } from "lucide-react"
// import { Progress } from "@/components/ui/progress"
// import { Badge } from "@/components/ui/badge"
// import { Card, CardContent } from "@/components/ui/card"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Switch } from "@/components/ui/switch"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { cn } from "@/lib/utils"
// import { parseFile, validateFile, getSupportedExtensions } from "@/lib/utils/file-parser"
// import {
//   analyzeImportData,
//   applyFieldMappings,
//   STANDARD_FIELDS,
//   type FieldMapping,
//   type MappingResult,
// } from "@/lib/services/import-field-mapper"
// import { cleanAndValidateData, type CleaningResult } from "@/lib/services/data-cleaner"
// import { useRouter } from "next/navigation"

// interface SmartImportDialogProps {
//   folderId?: string | null
//   folderName?: string
//   trigger?: React.ReactNode
//   onImportComplete?: () => void
// }

// type ImportStep = "upload" | "mapping" | "cleaning" | "review" | "importing" | "complete"

// export function SmartImportDialog({ folderId, folderName, trigger, onImportComplete }: SmartImportDialogProps) {
//   const router = useRouter()
//   const [open, setOpen] = useState(false)
//   const [step, setStep] = useState<ImportStep>("upload")
//   const [file, setFile] = useState<File | null>(null)
//   const [isDragging, setIsDragging] = useState(false)

//   // Parsing state
//   const [parsing, setParsing] = useState(false)
//   const [parseError, setParseError] = useState<string | null>(null)
//   const [headers, setHeaders] = useState<string[]>([])
//   const [rows, setRows] = useState<string[][]>([])

//   // Mapping state
//   const [mappingResult, setMappingResult] = useState<MappingResult | null>(null)
//   const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>([])

//   // Cleaning state
//   const [cleaningOptions, setCleaningOptions] = useState({
//     removeDuplicates: true,
//     fixEmails: true,
//     fixUrls: true,
//     removeInvalidEmails: true,
//     removeRoleBasedEmails: false,
//     removeDisposableEmails: false,
//   })
//   const [cleaningResult, setCleaningResult] = useState<CleaningResult | null>(null)
//   const [cleaning, setCleaning] = useState(false)

//   // Import state
//   const [importing, setImporting] = useState(false)
//   const [importProgress, setImportProgress] = useState(0)
//   const [importResult, setImportResult] = useState<{ imported: number; failed: number } | null>(null)

//   const handleFileSelect = useCallback(async (selectedFile: File) => {
//     setParseError(null)

//     const validation = validateFile(selectedFile)
//     if (!validation.valid) {
//       setParseError(validation.error || "Invalid file")
//       return
//     }

//     setFile(selectedFile)
//     setParsing(true)

//     try {
//       const parsed = await parseFile(selectedFile)

//       if (parsed.errors.length > 0) {
//         console.warn("Parse warnings:", parsed.errors)
//       }

//       if (parsed.headers.length === 0 || parsed.rows.length === 0) {
//         setParseError("File appears to be empty or has no data rows")
//         setParsing(false)
//         return
//       }

//       setHeaders(parsed.headers)
//       setRows(parsed.rows)

//       // Analyze and suggest field mappings
//       const analysis = analyzeImportData(parsed.headers, parsed.rows)
//       setMappingResult(analysis)
//       setFieldMappings(analysis.suggestedMappings)

//       setStep("mapping")
//     } catch (error) {
//       setParseError(error instanceof Error ? error.message : "Failed to parse file")
//     } finally {
//       setParsing(false)
//     }
//   }, [])

//   const handleDrop = useCallback(
//     (e: React.DragEvent) => {
//       e.preventDefault()
//       setIsDragging(false)

//       const droppedFile = e.dataTransfer.files[0]
//       if (droppedFile) {
//         handleFileSelect(droppedFile)
//       }
//     },
//     [handleFileSelect],
//   )

//   const handleDragOver = useCallback((e: React.DragEvent) => {
//     e.preventDefault()
//     setIsDragging(true)
//   }, [])

//   const handleDragLeave = useCallback((e: React.DragEvent) => {
//     e.preventDefault()
//     setIsDragging(false)
//   }, [])

//   const handleFileInput = useCallback(
//     (e: React.ChangeEvent<HTMLInputElement>) => {
//       const selectedFile = e.target.files?.[0]
//       if (selectedFile) {
//         handleFileSelect(selectedFile)
//       }
//     },
//     [handleFileSelect],
//   )

//   const updateFieldMapping = useCallback((sourceField: string, targetField: string) => {
//     setFieldMappings((prev) => {
//       // Remove existing mapping for this source
//       const filtered = prev.filter((m) => m.sourceField !== sourceField)

//       if (targetField === "skip" || targetField === "") {
//         return filtered
//       }

//       // Remove any existing mapping to this target (if not custom)
//       const withoutTarget = filtered.filter((m) => m.targetField !== targetField || m.isCustomField)

//       return [
//         ...withoutTarget,
//         {
//           sourceField,
//           targetField,
//           confidence: 1.0,
//           isCustomField: targetField.startsWith("custom_"),
//         },
//       ]
//     })
//   }, [])

//   const handleProceedToCleaning = useCallback(() => {
//     setCleaning(true)

//     // Apply field mappings to get records
//     const records = applyFieldMappings(headers, rows, fieldMappings)

//     // Run cleaning and validation
//     const result = cleanAndValidateData(records, cleaningOptions)
//     setCleaningResult(result)

//     setCleaning(false)
//     setStep("cleaning")
//   }, [headers, rows, fieldMappings, cleaningOptions])

//   const handleRerunCleaning = useCallback(() => {
//     if (!cleaningResult) return

//     setCleaning(true)

//     // Re-apply field mappings to get records
//     const records = applyFieldMappings(headers, rows, fieldMappings)

//     // Run cleaning with updated options
//     const result = cleanAndValidateData(records, cleaningOptions)
//     setCleaningResult(result)

//     setCleaning(false)
//   }, [headers, rows, fieldMappings, cleaningOptions, cleaningResult])

//   const handleStartImport = useCallback(async () => {
//     if (!cleaningResult) return

//     setStep("importing")
//     setImporting(true)
//     setImportProgress(0)

//     try {
//       // Prepare data for import
//       const prospectsToImport = cleaningResult.validRecords.map((record) => ({
//         email: record.email,
//         firstName: record.firstName || "",
//         lastName: record.lastName || "",
//         company: record.company || "",
//         jobTitle: record.jobTitle || "",
//         phone: record.phone || "",
//         linkedinUrl: record.linkedinUrl || "",
//         websiteUrl: record.websiteUrl || "",
//         location: record.location || "",
//         industry: record.industry || "",
//         // Collect custom fields
//         customFields: Object.entries(record)
//           .filter(([key]) => key.startsWith("custom_"))
//           .reduce(
//             (acc, [key, value]) => {
//               acc[key.replace("custom_", "")] = value
//               return acc
//             },
//             {} as Record<string, string>,
//           ),
//       }))

//       setImportProgress(20)

//       // Send to API
//       const response = await fetch("/api/prospects/import", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           prospects: prospectsToImport,
//           folderId: folderId || null,
//         }),
//       })

//       setImportProgress(80)

//       if (!response.ok) {
//         const error = await response.json()
//         throw new Error(error.error || "Import failed")
//       }

//       const result = await response.json()

//       setImportProgress(100)
//       setImportResult({
//         imported: result.imported || 0,
//         failed: result.failed || 0,
//       })
//       setStep("complete")

//       // Notify parent
//       onImportComplete?.()
//       router.refresh()
//     } catch (error) {
//       console.error("Import failed:", error)
//       setParseError(error instanceof Error ? error.message : "Import failed")
//       setStep("review")
//     } finally {
//       setImporting(false)
//     }
//   }, [cleaningResult, folderId, onImportComplete, router])

//   const handleClose = useCallback(() => {
//     setOpen(false)
//     // Reset state after dialog closes
//     setTimeout(() => {
//       setStep("upload")
//       setFile(null)
//       setParseError(null)
//       setHeaders([])
//       setRows([])
//       setMappingResult(null)
//       setFieldMappings([])
//       setCleaningResult(null)
//       setImportProgress(0)
//       setImportResult(null)
//     }, 300)
//   }, [])

//   const handleDownloadSample = useCallback(() => {
//     const sampleCSV = `email,first_name,last_name,company,job_title,phone,linkedin_url,website,location,industry,notes
// john.doe@example.com,John,Doe,Acme Corp,CEO,+1234567890,https://linkedin.com/in/johndoe,https://acmecorp.com,New York,Technology,Met at conference
// jane.smith@techinc.com,Jane,Smith,Tech Inc,CTO,+1987654321,https://linkedin.com/in/janesmith,https://techinc.com,San Francisco,Software,Referred by John
// bob.wilson@startup.io,Bob,Wilson,Startup.io,Founder,,https://linkedin.com/in/bobwilson,https://startup.io,Austin,SaaS,Interested in partnership`

//     const blob = new Blob([sampleCSV], { type: "text/csv" })
//     const url = window.URL.createObjectURL(blob)
//     const link = document.createElement("a")
//     link.href = url
//     link.download = "sample-prospects.csv"
//     document.body.appendChild(link)
//     link.click()
//     document.body.removeChild(link)
//     window.URL.revokeObjectURL(url)
//   }, [])

//   const renderStepIndicator = () => {
//     const steps = [
//       { key: "upload", label: "Upload" },
//       { key: "mapping", label: "Map Fields" },
//       { key: "cleaning", label: "Clean Data" },
//       { key: "importing", label: "Import" },
//     ]

//     const currentIndex = steps.findIndex(
//       (s) =>
//         s.key === step || (step === "review" && s.key === "cleaning") || (step === "complete" && s.key === "importing"),
//     )

//     return (
//       <div className="flex items-center justify-center gap-2 mb-6">
//         {steps.map((s, index) => (
//           <div key={s.key} className="flex items-center">
//             <div
//               className={cn(
//                 "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
//                 index < currentIndex
//                   ? "bg-primary text-primary-foreground"
//                   : index === currentIndex
//                     ? "bg-primary text-primary-foreground"
//                     : "bg-muted text-muted-foreground",
//               )}
//             >
//               {index < currentIndex ? <Check className="h-4 w-4" /> : index + 1}
//             </div>
//             {index < steps.length - 1 && (
//               <div className={cn("w-12 h-0.5 mx-1", index < currentIndex ? "bg-primary" : "bg-muted")} />
//             )}
//           </div>
//         ))}
//       </div>
//     )
//   }

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         {trigger || (
//           <Button variant="outline">
//             <Upload className="h-4 w-4 mr-2" />
//             Import Prospects
//           </Button>
//         )}
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
//         <DialogHeader>
//           <DialogTitle className="flex items-center gap-2">
//             <Sparkles className="h-5 w-5 text-primary" />
//             Smart Import
//             {folderName && (
//               <Badge variant="secondary" className="ml-2">
//                 to {folderName}
//               </Badge>
//             )}
//           </DialogTitle>
//           <DialogDescription>
//             Import prospects from CSV files with intelligent field mapping and data cleaning.
//           </DialogDescription>
//         </DialogHeader>

//         {renderStepIndicator()}

//         <div className="flex-1 overflow-hidden">
//           {/* Step 1: Upload */}
//           {step === "upload" && (
//             <div className="space-y-6">
//               {parseError && (
//                 <Alert variant="destructive">
//                   <AlertCircle className="h-4 w-4" />
//                   <AlertDescription>{parseError}</AlertDescription>
//                 </Alert>
//               )}

//               <div
//                 className={cn(
//                   "border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer",
//                   isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
//                   parsing && "pointer-events-none opacity-50",
//                 )}
//                 onDrop={handleDrop}
//                 onDragOver={handleDragOver}
//                 onDragLeave={handleDragLeave}
//                 onClick={() => document.getElementById("smart-file-upload")?.click()}
//               >
//                 <input
//                   type="file"
//                   accept={getSupportedExtensions().join(",")}
//                   onChange={handleFileInput}
//                   className="hidden"
//                   id="smart-file-upload"
//                   disabled={parsing}
//                 />

//                 {parsing ? (
//                   <div className="space-y-4">
//                     <Loader2 className="h-12 w-12 mx-auto text-primary animate-spin" />
//                     <p className="text-sm text-muted-foreground">Analyzing your file...</p>
//                   </div>
//                 ) : (
//                   <>
//                     <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
//                     <p className="text-sm font-medium mb-1">
//                       {isDragging ? "Drop your file here" : "Click to upload or drag and drop"}
//                     </p>
//                     <p className="text-xs text-muted-foreground">CSV files supported (Max 10MB)</p>
//                   </>
//                 )}
//               </div>

//               <div className="bg-muted/50 rounded-lg p-4 space-y-3">
//                 <div className="flex items-center justify-between">
//                   <p className="text-sm font-medium">Getting Started</p>
//                   <Button variant="ghost" size="sm" onClick={handleDownloadSample}>
//                     <Download className="h-3 w-3 mr-1" />
//                     Sample CSV
//                   </Button>
//                 </div>
//                 <ul className="text-xs text-muted-foreground space-y-1">
//                   <li>Upload any CSV file with prospect data</li>
//                   <li>We will automatically detect and map your columns</li>
//                   <li>Clean and validate data before import</li>
//                   <li>Support for custom fields beyond standard ones</li>
//                 </ul>
//               </div>
//             </div>
//           )}

//           {/* Step 2: Field Mapping */}
//           {step === "mapping" && mappingResult && (
//             <div className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium">Map Your Columns</p>
//                   <p className="text-xs text-muted-foreground">
//                     {rows.length} rows detected - {fieldMappings.filter((m) => !m.isCustomField).length} fields mapped
//                   </p>
//                 </div>
//                 <Badge variant="outline">{file?.name}</Badge>
//               </div>

//               <ScrollArea className="h-[400px] pr-4">
//                 <div className="space-y-3">
//                   {headers.map((header) => {
//                     const currentMapping = fieldMappings.find((m) => m.sourceField === header)
//                     const column = mappingResult.columns.find((c) => c.name === header)

//                     return (
//                       <Card key={header} className="overflow-hidden">
//                         <CardContent className="p-4">
//                           <div className="flex items-start gap-4">
//                             <div className="flex-1 min-w-0">
//                               <div className="flex items-center gap-2 mb-1">
//                                 <p className="font-medium text-sm truncate">{header}</p>
//                                 {currentMapping && currentMapping.confidence >= 0.8 && (
//                                   <Badge variant="secondary" className="text-xs">
//                                     Auto-detected
//                                   </Badge>
//                                 )}
//                               </div>
//                               <div className="flex flex-wrap gap-1">
//                                 {column?.sampleValues.slice(0, 3).map((val, i) => (
//                                   <span
//                                     key={i}
//                                     className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded truncate max-w-[150px]"
//                                   >
//                                     {val || "(empty)"}
//                                   </span>
//                                 ))}
//                               </div>
//                             </div>

//                             <div className="flex items-center gap-2">
//                               <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
//                               <Select
//                                 value={currentMapping?.targetField || "skip"}
//                                 onValueChange={(value) => updateFieldMapping(header, value)}
//                               >
//                                 <SelectTrigger className="w-[180px]">
//                                   <SelectValue placeholder="Map to field..." />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                   <SelectItem value="skip">
//                                     <span className="text-muted-foreground">Skip this column</span>
//                                   </SelectItem>
//                                   {STANDARD_FIELDS.map((field) => (
//                                     <SelectItem key={field.key} value={field.key}>
//                                       {field.label}
//                                       {field.required && <span className="text-destructive ml-1">*</span>}
//                                     </SelectItem>
//                                   ))}
//                                   <SelectItem value={`custom_${header.toLowerCase().replace(/[^a-z0-9]/g, "_")}`}>
//                                     <span className="text-primary">+ Keep as custom field</span>
//                                   </SelectItem>
//                                 </SelectContent>
//                               </Select>
//                             </div>
//                           </div>
//                         </CardContent>
//                       </Card>
//                     )
//                   })}
//                 </div>
//               </ScrollArea>

//               {!fieldMappings.some((m) => m.targetField === "email") && (
//                 <Alert variant="destructive">
//                   <AlertCircle className="h-4 w-4" />
//                   <AlertDescription>Email field is required. Please map one of your columns to Email.</AlertDescription>
//                 </Alert>
//               )}

//               <div className="flex justify-between pt-4 border-t">
//                 <Button variant="outline" onClick={() => setStep("upload")}>
//                   <ArrowLeft className="h-4 w-4 mr-2" />
//                   Back
//                 </Button>
//                 <Button
//                   onClick={handleProceedToCleaning}
//                   disabled={!fieldMappings.some((m) => m.targetField === "email")}
//                 >
//                   Continue to Cleaning
//                   <ArrowRight className="h-4 w-4 ml-2" />
//                 </Button>
//               </div>
//             </div>
//           )}

//           {/* Step 3: Data Cleaning */}
//           {(step === "cleaning" || step === "review") && cleaningResult && (
//             <div className="space-y-4">
//               <Tabs defaultValue="summary" className="w-full">
//                 <TabsList className="grid w-full grid-cols-3">
//                   <TabsTrigger value="summary">Summary</TabsTrigger>
//                   <TabsTrigger value="issues">
//                     Issues
//                     {cleaningResult.invalidRecords.length > 0 && (
//                       <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 justify-center">
//                         {cleaningResult.invalidRecords.length}
//                       </Badge>
//                     )}
//                   </TabsTrigger>
//                   <TabsTrigger value="options">Options</TabsTrigger>
//                 </TabsList>

//                 <TabsContent value="summary" className="space-y-4 mt-4">
//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                     <Card>
//                       <CardContent className="p-4 text-center">
//                         <p className="text-3xl font-bold text-primary">{cleaningResult.summary.total}</p>
//                         <p className="text-xs text-muted-foreground">Total Rows</p>
//                       </CardContent>
//                     </Card>
//                     <Card>
//                       <CardContent className="p-4 text-center">
//                         <p className="text-3xl font-bold text-green-600">{cleaningResult.summary.valid}</p>
//                         <p className="text-xs text-muted-foreground">Ready to Import</p>
//                       </CardContent>
//                     </Card>
//                     <Card>
//                       <CardContent className="p-4 text-center">
//                         <p className="text-3xl font-bold text-yellow-600">{cleaningResult.summary.duplicatesRemoved}</p>
//                         <p className="text-xs text-muted-foreground">Duplicates Removed</p>
//                       </CardContent>
//                     </Card>
//                     <Card>
//                       <CardContent className="p-4 text-center">
//                         <p className="text-3xl font-bold text-blue-600">{cleaningResult.summary.emailsFixed}</p>
//                         <p className="text-xs text-muted-foreground">Emails Fixed</p>
//                       </CardContent>
//                     </Card>
//                   </div>

//                   {cleaningResult.duplicates.length > 0 && (
//                     <Alert>
//                       <AlertTriangle className="h-4 w-4" />
//                       <AlertDescription>
//                         Found {cleaningResult.duplicates.length} duplicate email(s) in your file.
//                         {cleaningOptions.removeDuplicates
//                           ? " Duplicates will be removed."
//                           : " Enable duplicate removal in options."}
//                       </AlertDescription>
//                     </Alert>
//                   )}
//                 </TabsContent>

//                 <TabsContent value="issues" className="mt-4">
//                   <ScrollArea className="h-[300px]">
//                     {cleaningResult.invalidRecords.length === 0 ? (
//                       <div className="text-center py-8">
//                         <CheckCircle2 className="h-12 w-12 mx-auto text-green-600 mb-2" />
//                         <p className="text-sm text-muted-foreground">No issues found!</p>
//                       </div>
//                     ) : (
//                       <div className="space-y-2">
//                         {cleaningResult.invalidRecords.slice(0, 50).map((item, index) => (
//                           <Card
//                             key={index}
//                             className={cn(
//                               "overflow-hidden",
//                               item.issues.some((i) => i.severity === "error") && "border-destructive/50",
//                             )}
//                           >
//                             <CardContent className="p-3">
//                               <div className="flex items-start justify-between gap-2">
//                                 <div className="min-w-0 flex-1">
//                                   <p className="text-sm font-medium truncate">{item.record.email || "(no email)"}</p>
//                                   <div className="flex flex-wrap gap-1 mt-1">
//                                     {item.issues.map((issue, i) => (
//                                       <Badge
//                                         key={i}
//                                         variant={issue.severity === "error" ? "destructive" : "secondary"}
//                                         className="text-xs"
//                                       >
//                                         {issue.issue.replace(/_/g, " ")}
//                                       </Badge>
//                                     ))}
//                                   </div>
//                                 </div>
//                                 <Badge variant="outline" className="flex-shrink-0">
//                                   Row {item.issues[0]?.row}
//                                 </Badge>
//                               </div>
//                             </CardContent>
//                           </Card>
//                         ))}
//                         {cleaningResult.invalidRecords.length > 50 && (
//                           <p className="text-xs text-muted-foreground text-center py-2">
//                             Showing first 50 of {cleaningResult.invalidRecords.length} issues
//                           </p>
//                         )}
//                       </div>
//                     )}
//                   </ScrollArea>
//                 </TabsContent>

//                 <TabsContent value="options" className="space-y-4 mt-4">
//                   <div className="space-y-4">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <Label>Remove Duplicates</Label>
//                         <p className="text-xs text-muted-foreground">Remove rows with duplicate email addresses</p>
//                       </div>
//                       <Switch
//                         checked={cleaningOptions.removeDuplicates}
//                         onCheckedChange={(checked) =>
//                           setCleaningOptions((prev) => ({ ...prev, removeDuplicates: checked }))
//                         }
//                       />
//                     </div>

//                     <div className="flex items-center justify-between">
//                       <div>
//                         <Label>Auto-fix Emails</Label>
//                         <p className="text-xs text-muted-foreground">Fix common typos in email addresses</p>
//                       </div>
//                       <Switch
//                         checked={cleaningOptions.fixEmails}
//                         onCheckedChange={(checked) => setCleaningOptions((prev) => ({ ...prev, fixEmails: checked }))}
//                       />
//                     </div>

//                     <div className="flex items-center justify-between">
//                       <div>
//                         <Label>Auto-fix URLs</Label>
//                         <p className="text-xs text-muted-foreground">Add https:// and fix common URL issues</p>
//                       </div>
//                       <Switch
//                         checked={cleaningOptions.fixUrls}
//                         onCheckedChange={(checked) => setCleaningOptions((prev) => ({ ...prev, fixUrls: checked }))}
//                       />
//                     </div>

//                     <div className="flex items-center justify-between">
//                       <div>
//                         <Label>Remove Invalid Emails</Label>
//                         <p className="text-xs text-muted-foreground">Skip rows with invalid email format</p>
//                       </div>
//                       <Switch
//                         checked={cleaningOptions.removeInvalidEmails}
//                         onCheckedChange={(checked) =>
//                           setCleaningOptions((prev) => ({ ...prev, removeInvalidEmails: checked }))
//                         }
//                       />
//                     </div>

//                     <div className="flex items-center justify-between">
//                       <div>
//                         <Label>Remove Role-based Emails</Label>
//                         <p className="text-xs text-muted-foreground">Skip info@, support@, sales@ etc.</p>
//                       </div>
//                       <Switch
//                         checked={cleaningOptions.removeRoleBasedEmails}
//                         onCheckedChange={(checked) =>
//                           setCleaningOptions((prev) => ({ ...prev, removeRoleBasedEmails: checked }))
//                         }
//                       />
//                     </div>

//                     <div className="flex items-center justify-between">
//                       <div>
//                         <Label>Remove Disposable Emails</Label>
//                         <p className="text-xs text-muted-foreground">Skip temporary/throwaway emails</p>
//                       </div>
//                       <Switch
//                         checked={cleaningOptions.removeDisposableEmails}
//                         onCheckedChange={(checked) =>
//                           setCleaningOptions((prev) => ({ ...prev, removeDisposableEmails: checked }))
//                         }
//                       />
//                     </div>
//                   </div>

//                   <Button
//                     variant="outline"
//                     onClick={handleRerunCleaning}
//                     disabled={cleaning}
//                     className="w-full bg-transparent"
//                   >
//                     <RefreshCw className={cn("h-4 w-4 mr-2", cleaning && "animate-spin")} />
//                     {cleaning ? "Re-analyzing..." : "Re-analyze with New Options"}
//                   </Button>
//                 </TabsContent>
//               </Tabs>

//               <div className="flex justify-between pt-4 border-t">
//                 <Button variant="outline" onClick={() => setStep("mapping")}>
//                   <ArrowLeft className="h-4 w-4 mr-2" />
//                   Back
//                 </Button>
//                 <Button onClick={handleStartImport} disabled={cleaningResult.summary.valid === 0}>
//                   Import {cleaningResult.summary.valid} Prospects
//                   <ArrowRight className="h-4 w-4 ml-2" />
//                 </Button>
//               </div>
//             </div>
//           )}

//           {/* Step 4: Importing */}
//           {step === "importing" && (
//             <div className="py-12 text-center space-y-6">
//               <Loader2 className="h-16 w-16 mx-auto text-primary animate-spin" />
//               <div>
//                 <h3 className="text-lg font-semibold mb-2">Importing Prospects...</h3>
//                 <p className="text-sm text-muted-foreground">Please wait while we import your data</p>
//               </div>
//               <Progress value={importProgress} className="w-full max-w-md mx-auto" />
//             </div>
//           )}

//           {/* Step 5: Complete */}
//           {step === "complete" && importResult && (
//             <div className="py-12 text-center space-y-6">
//               <CheckCircle2 className="h-16 w-16 mx-auto text-green-600" />
//               <div>
//                 <h3 className="text-lg font-semibold mb-2">Import Complete!</h3>
//                 <p className="text-sm text-muted-foreground">
//                   Successfully imported{" "}
//                   <span className="font-semibold text-foreground">{importResult.imported} prospects</span>
//                   {folderName && (
//                     <>
//                       {" "}
//                       to <span className="font-semibold text-foreground">{folderName}</span>
//                     </>
//                   )}
//                 </p>
//                 {importResult.failed > 0 && (
//                   <p className="text-sm text-yellow-600 mt-2">{importResult.failed} prospects failed to import</p>
//                 )}
//               </div>
//               <Button onClick={handleClose} className="w-full max-w-xs">
//                 Done
//               </Button>
//             </div>
//           )}
//         </div>
//       </DialogContent>
//     </Dialog>
//   )
// }

"use client"

import type React from "react"

import { useState, useCallback } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  AlertCircle,
} from "lucide-react"
import { parseFile } from "@/lib/utils/file-parser"
import {
  detectFieldMappings,
  applyFieldMappings,
  type FieldMapping,
  type MappingResult,
  STANDARD_FIELDS,
} from "@/lib/services/import-field-mapper"
import { cleanAndValidateData, type CleaningResult } from "@/lib/services/data-cleaner"
import { useRouter } from "next/navigation"

interface SmartImportDialogProps {
  folderId?: string | null
  folderName?: string
  trigger?: React.ReactNode
  onImportComplete?: () => void
}

type ImportStep = "upload" | "mapping" | "cleaning" | "review" | "importing" | "complete"

export function SmartImportDialog({ folderId, folderName, trigger, onImportComplete }: SmartImportDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<ImportStep>("upload")
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  // Parsing state
  const [parsing, setParsing] = useState(false)
  const [parseError, setParseError] = useState<string | null>(null)
  const [headers, setHeaders] = useState<string[]>([])
  const [rows, setRows] = useState<string[][]>([])

  // Mapping state
  const [mappingResult, setMappingResult] = useState<MappingResult | null>(null)
  const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>([])

  // Cleaning state
  const [cleaningOptions, setCleaningOptions] = useState({
    removeDuplicates: true,
    fixEmails: true,
    fixUrls: true,
    removeInvalidEmails: true,
    removeRoleBasedEmails: false,
    removeDisposableEmails: false,
  })
  const [cleaningResult, setCleaningResult] = useState<CleaningResult | null>(null)
  const [cleaning, setCleaning] = useState(false)

  const [existingDuplicates, setExistingDuplicates] = useState<string[]>([])
  const [checkingExisting, setCheckingExisting] = useState(false)

  // Import state
  const [importing, setImporting] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [importResult, setImportResult] = useState<{
    imported: number
    failed: number
    skippedDuplicates: number
  } | null>(null)

  const handleFileSelect = useCallback(async (selectedFile: File) => {
    setFile(selectedFile)
    setParseError(null)
    setParsing(true)

    try {
      const result = await parseFile(selectedFile)

      if (result.rows.length === 0) {
        throw new Error("No data rows found in file")
      }

      setHeaders(result.headers)
      setRows(result.rows)

      // Auto-detect field mappings
      const mapping = detectFieldMappings(result.headers)
      setMappingResult(mapping)
      setFieldMappings(mapping.mappings)

      setStep("mapping")
    } catch (error) {
      setParseError(error instanceof Error ? error.message : "Failed to parse file")
    } finally {
      setParsing(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile) {
        handleFileSelect(droppedFile)
      }
    },
    [handleFileSelect],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0]
      if (selectedFile) {
        handleFileSelect(selectedFile)
      }
    },
    [handleFileSelect],
  )

  const handleMappingChange = useCallback((sourceField: string, targetField: string) => {
    setFieldMappings((prev) => {
      // Remove any existing mapping for this source field
      const filtered = prev.filter((m) => m.sourceField !== sourceField)

      // If target is "skip", don't add a mapping
      if (targetField === "skip") {
        return filtered
      }

      // Remove any existing mapping to this target (if not custom)
      const withoutTarget = filtered.filter((m) => m.targetField !== targetField || m.isCustomField)

      return [
        ...withoutTarget,
        {
          sourceField,
          targetField,
          confidence: 1.0,
          isCustomField: targetField.startsWith("custom_"),
        },
      ]
    })
  }, [])

  const handleProceedToCleaning = useCallback(async () => {
    setCleaning(true)
    setCheckingExisting(true)

    // Apply field mappings to get records
    const records = applyFieldMappings(headers, rows, fieldMappings)

    // Run cleaning and validation (within-file duplicates)
    const result = cleanAndValidateData(records, cleaningOptions)
    setCleaningResult(result)

    // Check for duplicates against existing prospects in database
    try {
      const emails = result.validRecords.map((r) => r.email).filter(Boolean)
      if (emails.length > 0) {
        const response = await fetch("/api/prospects/check-duplicates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ emails, folderId }),
        })

        if (response.ok) {
          const data = await response.json()
          setExistingDuplicates(data.duplicates || [])
          console.log("[v0] Found existing duplicates:", data.duplicates?.length || 0)
        }
      }
    } catch (error) {
      console.error("[v0] Failed to check existing duplicates:", error)
    }

    setCheckingExisting(false)
    setCleaning(false)
    setStep("cleaning")
  }, [headers, rows, fieldMappings, cleaningOptions, folderId])

  const handleRerunCleaning = useCallback(async () => {
    if (!cleaningResult) return

    setCleaning(true)

    // Re-apply field mappings to get records
    const records = applyFieldMappings(headers, rows, fieldMappings)

    // Run cleaning with updated options
    const result = cleanAndValidateData(records, cleaningOptions)
    setCleaningResult(result)

    setCleaning(false)
  }, [headers, rows, fieldMappings, cleaningOptions, cleaningResult])

  const handleStartImport = useCallback(async () => {
    if (!cleaningResult) return

    setImporting(true)
    setImportProgress(10)
    setStep("importing")

    try {
      // Filter out existing duplicates if option is enabled
      let recordsToImport = cleaningResult.validRecords
      let skippedCount = 0

      if (cleaningOptions.removeDuplicates && existingDuplicates.length > 0) {
        const existingSet = new Set(existingDuplicates.map((e) => e.toLowerCase()))
        recordsToImport = recordsToImport.filter((record) => {
          const isDuplicate = existingSet.has(record.email?.toLowerCase())
          if (isDuplicate) skippedCount++
          return !isDuplicate
        })
        console.log("[v0] Skipping existing duplicates:", skippedCount)
      }

      setImportProgress(30)

      const response = await fetch("/api/prospects/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prospects: recordsToImport,
          folderId: folderId,
        }),
      })

      setImportProgress(80)

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Import failed")
      }

      const result = await response.json()

      setImportProgress(100)
      setImportResult({
        imported: result.imported || 0,
        failed: result.failed || 0,
        skippedDuplicates: skippedCount,
      })
      setStep("complete")

      if (onImportComplete) {
        onImportComplete()
      }

      // Also do a hard router refresh to update server components
      router.refresh()
    } catch (error) {
      console.error("[v0] Import failed:", error)
      setParseError(error instanceof Error ? error.message : "Import failed")
      setStep("review")
    } finally {
      setImporting(false)
    }
  }, [cleaningResult, folderId, onImportComplete, router, cleaningOptions.removeDuplicates, existingDuplicates])

  const handleClose = useCallback(() => {
    setOpen(false)
    // Reset state after dialog closes
    setTimeout(() => {
      setStep("upload")
      setFile(null)
      setParseError(null)
      setHeaders([])
      setRows([])
      setMappingResult(null)
      setFieldMappings([])
      setCleaningResult(null)
      setImportResult(null)
      setImportProgress(0)
      setExistingDuplicates([])
    }, 300)
  }, [])

  const renderUploadStep = () => (
    <div className="space-y-6">
      <div
        className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
          isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {parsing ? (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
              <FileSpreadsheet className="h-8 w-8 text-primary" />
            </div>
            <p className="text-muted-foreground">Parsing file...</p>
          </div>
        ) : (
          <>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium mb-2">Drop your file here</p>
            <p className="text-sm text-muted-foreground mb-4">Supports CSV, TXT files with any column structure</p>
            <Label htmlFor="file-upload" className="cursor-pointer">
              <Input
                id="file-upload"
                type="file"
                accept=".csv,.txt"
                className="hidden"
                onChange={handleFileInputChange}
              />
              <Button variant="outline" asChild>
                <span>Browse Files</span>
              </Button>
            </Label>
          </>
        )}
      </div>

      {parseError && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{parseError}</AlertDescription>
        </Alert>
      )}

      <div className="bg-muted/50 rounded-lg p-4">
        <h4 className="font-medium mb-2 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          Smart Import Features
        </h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>- Auto-detects column mappings from any CSV structure</li>
          <li>- Validates and fixes email addresses</li>
          <li>- Detects duplicates within file AND against existing prospects</li>
          <li>- Keeps custom fields as personalization tokens</li>
        </ul>
      </div>
    </div>
  )

  const renderMappingStep = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">Map Your Columns</h3>
          <p className="text-sm text-muted-foreground">
            We detected {headers.length} columns and {rows.length} rows
          </p>
        </div>
        {mappingResult && (
          <Badge variant={mappingResult.confidence > 0.7 ? "default" : "secondary"}>
            {Math.round(mappingResult.confidence * 100)}% confidence
          </Badge>
        )}
      </div>

      <ScrollArea className="h-[300px] pr-4">
        <div className="space-y-3">
          {headers.map((header) => {
            const mapping = fieldMappings.find((m) => m.sourceField === header)
            const sampleValues = rows
              .slice(0, 3)
              .map((row) => row[headers.indexOf(header)])
              .filter(Boolean)

            return (
              <div key={header} className="flex items-center gap-4 p-3 rounded-lg border bg-card">
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{header}</p>
                  <p className="text-xs text-muted-foreground truncate">e.g., {sampleValues.join(", ") || "empty"}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <Select
                  value={mapping?.targetField || "skip"}
                  onValueChange={(value) => handleMappingChange(header, value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Skip this column" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="skip">Skip this column</SelectItem>
                    {STANDARD_FIELDS.map((field) => (
                      <SelectItem key={field.key} value={field.key}>
                        {field.label}
                      </SelectItem>
                    ))}
                    <SelectItem value={`custom_${header}`}>Keep as Custom Field</SelectItem>
                  </SelectContent>
                </Select>
                {mapping && mapping.confidence >= 0.8 && (
                  <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                )}
              </div>
            )
          })}
        </div>
      </ScrollArea>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep("upload")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button onClick={handleProceedToCleaning} disabled={!fieldMappings.some((m) => m.targetField === "email")}>
          Continue to Clean Data
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  )

  const renderCleaningStep = () => (
    <div className="space-y-6">
      {cleaning || checkingExisting ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <p className="text-muted-foreground">
            {checkingExisting ? "Checking for existing duplicates..." : "Analyzing your data..."}
          </p>
        </div>
      ) : cleaningResult ? (
        <>
          <Tabs defaultValue="summary">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="issues">Issues ({cleaningResult.invalidRecords.length})</TabsTrigger>
              <TabsTrigger value="options">Options</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-3xl font-bold text-green-600">{cleaningResult.summary.valid}</p>
                    <p className="text-xs text-muted-foreground">Valid Records</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-3xl font-bold text-red-600">{cleaningResult.summary.invalid}</p>
                    <p className="text-xs text-muted-foreground">Invalid Records</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-3xl font-bold text-yellow-600">{cleaningResult.summary.duplicatesRemoved}</p>
                    <p className="text-xs text-muted-foreground">File Duplicates</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-3xl font-bold text-blue-600">{cleaningResult.summary.emailsFixed}</p>
                    <p className="text-xs text-muted-foreground">Emails Fixed</p>
                  </CardContent>
                </Card>
              </div>

              {existingDuplicates.length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Found <strong>{existingDuplicates.length}</strong> email(s) that already exist in your database.
                    {cleaningOptions.removeDuplicates
                      ? " These will be skipped during import."
                      : " Enable 'Remove Duplicates' in options to skip them."}
                  </AlertDescription>
                </Alert>
              )}

              {cleaningResult.duplicates.length > 0 && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Found {cleaningResult.duplicates.length} duplicate email(s) within your file.
                    {cleaningOptions.removeDuplicates
                      ? " Duplicates will be removed."
                      : " Enable duplicate removal in options."}
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>

            <TabsContent value="issues" className="mt-4">
              <ScrollArea className="h-[250px]">
                {cleaningResult.invalidRecords.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle2 className="h-12 w-12 mx-auto mb-2 text-green-500" />
                    <p>No issues found!</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {cleaningResult.invalidRecords.slice(0, 50).map((item, idx) => (
                      <div key={idx} className="p-3 rounded-lg border bg-card">
                        <div className="flex items-center gap-2 mb-1">
                          {item.issues[0]?.severity === "error" ? (
                            <AlertCircle className="h-4 w-4 text-red-500" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          )}
                          <span className="font-medium">Row {item.issues[0]?.row}</span>
                          <Badge variant={item.issues[0]?.severity === "error" ? "destructive" : "secondary"}>
                            {item.issues[0]?.issue.replace(/_/g, " ")}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {item.issues[0]?.field}: {item.issues[0]?.value || "(empty)"}
                        </p>
                        {item.issues[0]?.suggestion && (
                          <p className="text-xs text-muted-foreground mt-1">{item.issues[0]?.suggestion}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="options" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Remove Duplicates</Label>
                    <p className="text-xs text-muted-foreground">
                      Skip emails that appear multiple times or already exist
                    </p>
                  </div>
                  <Switch
                    checked={cleaningOptions.removeDuplicates}
                    onCheckedChange={(checked) => {
                      setCleaningOptions((prev) => ({ ...prev, removeDuplicates: checked }))
                    }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-fix Emails</Label>
                    <p className="text-xs text-muted-foreground">Fix common typos like gmial.com to gmail.com</p>
                  </div>
                  <Switch
                    checked={cleaningOptions.fixEmails}
                    onCheckedChange={(checked) => {
                      setCleaningOptions((prev) => ({ ...prev, fixEmails: checked }))
                    }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Filter Role-based Emails</Label>
                    <p className="text-xs text-muted-foreground">Remove emails like info@, support@, sales@</p>
                  </div>
                  <Switch
                    checked={cleaningOptions.removeRoleBasedEmails}
                    onCheckedChange={(checked) => {
                      setCleaningOptions((prev) => ({ ...prev, removeRoleBasedEmails: checked }))
                    }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Filter Disposable Emails</Label>
                    <p className="text-xs text-muted-foreground">Remove temporary email addresses</p>
                  </div>
                  <Switch
                    checked={cleaningOptions.removeDisposableEmails}
                    onCheckedChange={(checked) => {
                      setCleaningOptions((prev) => ({ ...prev, removeDisposableEmails: checked }))
                    }}
                  />
                </div>
              </div>
              <Button variant="outline" onClick={handleRerunCleaning} className="w-full bg-transparent">
                Re-analyze with New Options
              </Button>
            </TabsContent>
          </Tabs>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep("mapping")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button onClick={handleStartImport} disabled={cleaningResult.summary.valid === 0}>
              Import {cleaningResult.summary.valid - (cleaningOptions.removeDuplicates ? existingDuplicates.length : 0)}{" "}
              Prospects
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </>
      ) : null}
    </div>
  )

  const renderImportingStep = () => (
    <div className="space-y-6 py-8">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
          <Upload className="h-10 w-10 text-primary animate-bounce" />
        </div>
        <h3 className="text-lg font-medium mb-2">Importing Prospects</h3>
        <p className="text-sm text-muted-foreground mb-4">
          {folderName ? `Adding to "${folderName}"...` : "Please wait..."}
        </p>
      </div>
      <Progress value={importProgress} className="w-full" />
      <p className="text-center text-sm text-muted-foreground">{importProgress}% complete</p>
    </div>
  )

  const renderCompleteStep = () => (
    <div className="space-y-6 py-8">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center">
          <CheckCircle2 className="h-10 w-10 text-green-500" />
        </div>
        <h3 className="text-lg font-medium mb-2">Import Complete!</h3>
        {importResult && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Successfully imported <strong>{importResult.imported}</strong> prospects
              {folderName && ` to "${folderName}"`}
            </p>
            {importResult.skippedDuplicates > 0 && (
              <p className="text-sm text-yellow-600">
                Skipped {importResult.skippedDuplicates} duplicate(s) that already existed
              </p>
            )}
            {importResult.failed > 0 && (
              <p className="text-sm text-red-600">{importResult.failed} record(s) failed to import</p>
            )}
          </div>
        )}
      </div>
      <Button onClick={handleClose} className="w-full">
        Done
      </Button>
    </div>
  )

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) handleClose()
        else setOpen(true)
      }}
    >
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import Prospects
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Smart Import
            {folderName && (
              <Badge variant="secondary" className="ml-2">
                {folderName}
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            Import prospects from any CSV or text file with intelligent field mapping and data cleaning
          </DialogDescription>
        </DialogHeader>

        {/* Progress indicator */}
        <div className="flex items-center gap-2 py-2">
          {["upload", "mapping", "cleaning", "complete"].map((s, idx) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === s || (step === "importing" && s === "cleaning")
                    ? "bg-primary text-primary-foreground"
                    : ["upload", "mapping", "cleaning"].indexOf(step) > idx || step === "complete"
                      ? "bg-green-500 text-white"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {["upload", "mapping", "cleaning"].indexOf(step) > idx || step === "complete" ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  idx + 1
                )}
              </div>
              {idx < 3 && (
                <div
                  className={`w-12 h-0.5 ${
                    ["upload", "mapping", "cleaning"].indexOf(step) > idx || step === "complete"
                      ? "bg-green-500"
                      : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {step === "upload" && renderUploadStep()}
        {step === "mapping" && renderMappingStep()}
        {(step === "cleaning" || step === "review") && renderCleaningStep()}
        {step === "importing" && renderImportingStep()}
        {step === "complete" && renderCompleteStep()}
      </DialogContent>
    </Dialog>
  )
}
