
// "use client"

// import * as React from "react"
// import {
//   TestTube,
//   Plus,
//   Trash2,
//   Trophy,
//   Sparkles,
//   Copy,
//   ChevronDown,
//   ArrowUpRight,
//   Loader2,
//   Check,
//   Settings,
// } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Badge } from "@/components/ui/badge"
// import { Slider } from "@/components/ui/slider"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Progress } from "@/components/ui/progress"
// import { Card, CardContent, CardHeader } from "@/components/ui/card"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog"
// import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
// import { TooltipProvider } from "@/components/ui/tooltip"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// import { cn } from "@/lib/utils"
// import { useToast } from "@/hooks/use-toast"
// import type { SequenceStep, SequenceStepVariant, ABTestMetric } from "@/lib/types/sequence"
// import {
//   createVariant,
//   updateVariant,
//   deleteVariant,
//   selectVariantAsWinner,
//   redistributeVariantWeights,
// } from "@/lib/actions/sequence-actions"
// import { WaveLoader } from "@/components/loader/wave-loader"

// interface ABTestPanelProps {
//   step: SequenceStep
//   sequenceId: string
//   userId: string
//   onUpdate: (updates: Partial<SequenceStep>) => void
//   onVariantsChange: (variants: SequenceStepVariant[]) => void
// }

// const METRIC_OPTIONS: { value: ABTestMetric; label: string; description: string }[] = [
//   { value: "OPEN_RATE", label: "Open Rate", description: "Track which variant gets more opens" },
//   { value: "CLICK_RATE", label: "Click Rate", description: "Track which variant gets more clicks" },
//   { value: "REPLY_RATE", label: "Reply Rate", description: "Track which variant gets more replies" },
//   { value: "POSITIVE_REPLY_RATE", label: "Positive Reply Rate", description: "Track positive sentiment replies" },
// ]

// const VARIANT_LETTERS = ["A", "B", "C", "D", "E"]

// export function ABTestPanel({ step, sequenceId, userId, onUpdate, onVariantsChange }: ABTestPanelProps) {
//   const { toast } = useToast()
//   const [isLoading, setIsLoading] = React.useState(false)
//   const [loadingAction, setLoadingAction] = React.useState<string | null>(null)
//   const [isAddingVariant, setIsAddingVariant] = React.useState(false)
//   const [newVariant, setNewVariant] = React.useState<Partial<SequenceStepVariant>>({
//     subject: step.subject || "",
//     body: step.body || "",
//     weight: 50,
//   })
//   const [selectedMetric, setSelectedMetric] = React.useState<ABTestMetric>("REPLY_RATE")
//   const [editingVariant, setEditingVariant] = React.useState<string | null>(null)
//   const [editedContent, setEditedContent] = React.useState<{ subject: string; body: string }>({
//     subject: "",
//     body: "",
//   })
//   const [isSettingsOpen, setIsSettingsOpen] = React.useState(true)

//   const variants = step.variants || []
//   const hasVariants = variants.length > 0

//   const handleAddVariant = async () => {
//     if (sequenceId === "new") {
//       toast({
//         title: "Save first",
//         description: "Please save the sequence before adding A/B test variants.",
//         variant: "destructive",
//       })
//       return
//     }

//     setIsLoading(true)
//     try {
//       const nextLetter = VARIANT_LETTERS[variants.length + 1] || `V${variants.length + 2}`

//       if (variants.length === 0) {
//         const variantA = await createVariant(step.id, sequenceId, userId, {
//           variantName: "A",
//           subject: step.subject || "",
//           body: step.body || "",
//           weight: 50,
//         })

//         const variantB = await createVariant(step.id, sequenceId, userId, {
//           variantName: "B",
//           subject: newVariant.subject || step.subject || "",
//           body: newVariant.body || step.body || "",
//           weight: 50,
//         })

//         onVariantsChange([variantA, variantB])
//       } else {
//         const newWeight = Math.floor(100 / (variants.length + 1))
//         const createdVariant = await createVariant(step.id, sequenceId, userId, {
//           variantName: nextLetter,
//           subject: newVariant.subject || "",
//           body: newVariant.body || "",
//           weight: newWeight,
//         })

//         const updatedWeights = variants.map((v) => ({
//           variantId: v.id,
//           weight: newWeight,
//         }))
//         await redistributeVariantWeights(step.id, sequenceId, userId, updatedWeights)

//         const updatedVariants = variants.map((v) => ({ ...v, weight: newWeight }))
//         onVariantsChange([...updatedVariants, createdVariant])
//       }

//       toast({ title: "Variant added", description: "A/B test variant has been created." })
//       setIsAddingVariant(false)
//       setNewVariant({ subject: "", body: "", weight: 50 })
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to add variant. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleRemoveVariant = async (variantId: string) => {
//     setLoadingAction(variantId)
//     try {
//       await deleteVariant(variantId, sequenceId, userId)

//       const remaining = variants.filter((v) => v.id !== variantId)

//       if (remaining.length > 0) {
//         const newWeight = Math.floor(100 / remaining.length)
//         const updatedWeights = remaining.map((v) => ({
//           variantId: v.id,
//           weight: newWeight,
//         }))
//         await redistributeVariantWeights(step.id, sequenceId, userId, updatedWeights)
//         onVariantsChange(remaining.map((v) => ({ ...v, weight: newWeight })))
//       } else {
//         onVariantsChange([])
//       }

//       toast({ title: "Variant deleted" })
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to delete variant.",
//         variant: "destructive",
//       })
//     } finally {
//       setLoadingAction(null)
//     }
//   }

//   const handleWeightChange = async (variantId: string, newWeight: number) => {
//     const updatedVariants = variants.map((v) => (v.id === variantId ? { ...v, weight: newWeight } : v))
//     onVariantsChange(updatedVariants)

//     try {
//       await updateVariant(variantId, sequenceId, userId, { weight: newWeight })
//     } catch (error) {
//       onVariantsChange(variants)
//       toast({
//         title: "Error",
//         description: "Failed to update weight.",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleSaveVariantContent = async (variantId: string) => {
//     setLoadingAction(variantId)
//     try {
//       await updateVariant(variantId, sequenceId, userId, {
//         subject: editedContent.subject,
//         body: editedContent.body,
//       })

//       onVariantsChange(
//         variants.map((v) =>
//           v.id === variantId ? { ...v, subject: editedContent.subject, body: editedContent.body } : v,
//         ),
//       )

//       setEditingVariant(null)
//       toast({ title: "Variant updated" })
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to update variant.",
//         variant: "destructive",
//       })
//     } finally {
//       setLoadingAction(null)
//     }
//   }

//   const handleSelectWinner = async (variantId: string) => {
//     setLoadingAction(variantId)
//     try {
//       await selectVariantAsWinner(variantId, step.id, sequenceId, userId)

//       const winnerVariant = variants.find((v) => v.id === variantId)
//       if (winnerVariant) {
//         onUpdate({
//           subject: winnerVariant.subject || undefined,
//           body: winnerVariant.body || undefined,
//         })
//         onVariantsChange(
//           variants.map((v) => ({
//             ...v,
//             isWinner: v.id === variantId,
//             winnerSelectedAt: v.id === variantId ? new Date() : null,
//           })),
//         )
//       }

//       toast({
//         title: "Winner selected!",
//         description: "The winning variant content has been applied to the main step.",
//       })
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to select winner.",
//         variant: "destructive",
//       })
//     } finally {
//       setLoadingAction(null)
//     }
//   }

//   const handleDuplicateAsVariant = async () => {
//     if (sequenceId === "new") {
//       toast({
//         title: "Save first",
//         description: "Please save the sequence before adding variants.",
//         variant: "destructive",
//       })
//       return
//     }

//     setIsLoading(true)
//     try {
//       const nextLetter = VARIANT_LETTERS[variants.length + 1] || `V${variants.length + 2}`

//       if (variants.length === 0) {
//         const variantA = await createVariant(step.id, sequenceId, userId, {
//           variantName: "A",
//           subject: step.subject || "",
//           body: step.body || "",
//           weight: 50,
//         })

//         const variantB = await createVariant(step.id, sequenceId, userId, {
//           variantName: "B",
//           subject: step.subject || "",
//           body: step.body || "",
//           weight: 50,
//         })

//         onVariantsChange([variantA, variantB])
//       } else {
//         const newWeight = Math.floor(100 / (variants.length + 1))
//         const createdVariant = await createVariant(step.id, sequenceId, userId, {
//           variantName: nextLetter,
//           subject: step.subject || "",
//           body: step.body || "",
//           weight: newWeight,
//         })

//         const updatedWeights = variants.map((v) => ({
//           variantId: v.id,
//           weight: newWeight,
//         }))
//         await redistributeVariantWeights(step.id, sequenceId, userId, updatedWeights)

//         const updatedVariants = variants.map((v) => ({ ...v, weight: newWeight }))
//         onVariantsChange([...updatedVariants, createdVariant])
//       }

//       toast({ title: "Variant created from current content" })
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to duplicate as variant.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const startEditing = (variant: SequenceStepVariant) => {
//     setEditingVariant(variant.id)
//     setEditedContent({
//       subject: variant.subject || "",
//       body: variant.body || "",
//     })
//   }

//   const getVariantPerformance = (variant: SequenceStepVariant) => {
//     const total = variant.sent || 0
//     if (total === 0) return { openRate: 0, clickRate: 0, replyRate: 0, confidence: 0 }

//     return {
//       openRate: (variant.opened / total) * 100,
//       clickRate: (variant.clicked / total) * 100,
//       replyRate: (variant.replied / total) * 100,
//       confidence: Math.min(100, (total / 100) * 100),
//     }
//   }

//   const getBestVariant = () => {
//     if (variants.length === 0) return null

//     return variants.reduce((best, current) => {
//       const bestPerf = getVariantPerformance(best)
//       const currentPerf = getVariantPerformance(current)

//       const metricMap: Record<ABTestMetric, keyof typeof bestPerf> = {
//         OPEN_RATE: "openRate",
//         CLICK_RATE: "clickRate",
//         REPLY_RATE: "replyRate",
//         POSITIVE_REPLY_RATE: "replyRate",
//       }

//       const metric = metricMap[selectedMetric]
//       return currentPerf[metric] > bestPerf[metric] ? current : best
//     })
//   }

//   const bestVariant = getBestVariant()

//   return (
//     <TooltipProvider>
//       <div className="flex flex-col h-full">
//         {/* Header - Fixed */}
//         <div className="flex items-center justify-between p-4 border-b">
//           <div className="flex items-center gap-2">
//             <TestTube className="h-5 w-5 text-primary" />
//             <h3 className="text-sm font-semibold">A/B Testing</h3>
//           </div>
//           {hasVariants && (
//             <Badge variant="outline" className="text-xs">
//               {variants.length} variants
//             </Badge>
//           )}
//         </div>

//         {/* Test Settings - Collapsible but always visible when variants exist */}
//         {hasVariants && (
//           <Collapsible open={isSettingsOpen} onOpenChange={setIsSettingsOpen} className="border-b">
//             <CollapsibleTrigger asChild>
//               <Button variant="ghost" className="w-full justify-between h-auto py-3 px-4 rounded-none">
//                 <div className="flex items-center gap-2">
//                   <Settings className="h-4 w-4 text-muted-foreground" />
//                   <span className="text-sm font-medium">Test Settings</span>
//                 </div>
//                 <ChevronDown
//                   className={cn("h-4 w-4 text-muted-foreground transition-transform", isSettingsOpen && "rotate-180")}
//                 />
//               </Button>
//             </CollapsibleTrigger>
//             <CollapsibleContent>
//               <div className="px-4 pb-4 space-y-3">
//                 <div>
//                   <Label className="text-xs text-muted-foreground">Winner selection metric</Label>
//                   <Select value={selectedMetric} onValueChange={(v) => setSelectedMetric(v as ABTestMetric)}>
//                     <SelectTrigger className="mt-1.5">
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {METRIC_OPTIONS.map((option) => (
//                         <SelectItem key={option.value} value={option.value}>
//                           <div>
//                             <p className="font-medium">{option.label}</p>
//                             <p className="text-xs text-muted-foreground">{option.description}</p>
//                           </div>
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
//             </CollapsibleContent>
//           </Collapsible>
//         )}

//         {/* Scrollable Content Area */}
//         <ScrollArea className="flex-1">
//           <div className="p-4 space-y-4">
//             {/* No variants state */}
//             {!hasVariants && (
//               <div className="rounded-lg border border-dashed border-border p-6 text-center">
//                 <TestTube className="mx-auto h-10 w-10 text-muted-foreground" />
//                 <h4 className="mt-3 text-sm font-medium">No A/B test variants</h4>
//                 <p className="mt-1 text-xs text-muted-foreground">
//                   Create variants to test different subject lines and email content
//                 </p>
//                 <div className="mt-4 flex items-center justify-center gap-2">
//                   <Button size="sm" onClick={handleDuplicateAsVariant} disabled={isLoading} className="shadow-sm">
//                     {isLoading ? <WaveLoader size="sm" bars={8} gap="tight" /> : <Copy className="mr-2 h-4 w-4" />}
//                     Create A/B Test
//                   </Button>
//                 </div>
//               </div>
//             )}

//             {/* Variants list */}
//             {hasVariants && (
//               <div className="space-y-4">
//                 {variants.map((variant, index) => {
//                   const perf = getVariantPerformance(variant)
//                   const isBest = bestVariant?.id === variant.id && variant.sent > 0
//                   const isEditing = editingVariant === variant.id

//                   return (
//                     <Card
//                       key={variant.id}
//                       className={cn(
//                         "relative transition-all",
//                         variant.isWinner && "ring-2 ring-green-500",
//                         isBest && !variant.isWinner && "ring-1 ring-primary",
//                       )}
//                     >
//                       <CardHeader className="pb-2">
//                         <div className="flex items-center justify-between">
//                           <div className="flex items-center gap-2">
//                             <div
//                               className={cn(
//                                 "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold",
//                                 index === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
//                               )}
//                             >
//                               {variant.variantName}
//                             </div>
//                             <span className="text-sm font-medium">Variant {variant.variantName}</span>
//                             {variant.isWinner && (
//                               <Badge className="gap-1 bg-green-500 text-white">
//                                 <Trophy className="h-3 w-3" />
//                                 Winner
//                               </Badge>
//                             )}
//                             {isBest && !variant.isWinner && (
//                               <Badge variant="outline" className="gap-1 text-primary">
//                                 <ArrowUpRight className="h-3 w-3" />
//                                 Leading
//                               </Badge>
//                             )}
//                           </div>
//                           <DropdownMenu>
//                             <DropdownMenuTrigger asChild>
//                               <Button variant="ghost" size="icon" className="h-8 w-8">
//                                 <ChevronDown className="h-4 w-4" />
//                               </Button>
//                             </DropdownMenuTrigger>
//                             <DropdownMenuContent align="end">
//                               <DropdownMenuItem onClick={() => startEditing(variant)}>Edit content</DropdownMenuItem>
//                               <DropdownMenuItem onClick={() => handleSelectWinner(variant.id)}>
//                                 <Trophy className="mr-2 h-4 w-4" />
//                                 Select as winner
//                               </DropdownMenuItem>
//                               {variants.length > 1 && (
//                                 <DropdownMenuItem
//                                   className="text-destructive"
//                                   onClick={() => handleRemoveVariant(variant.id)}
//                                 >
//                                   <Trash2 className="mr-2 h-4 w-4" />
//                                   Delete variant
//                                 </DropdownMenuItem>
//                               )}
//                             </DropdownMenuContent>
//                           </DropdownMenu>
//                         </div>
//                       </CardHeader>
//                       <CardContent className="space-y-4">
//                         {isEditing ? (
//                           <div className="space-y-3">
//                             <div>
//                               <Label className="text-xs">Subject</Label>
//                               <Input
//                                 value={editedContent.subject}
//                                 onChange={(e) => setEditedContent((prev) => ({ ...prev, subject: e.target.value }))}
//                                 className="mt-1"
//                               />
//                             </div>
//                             <div>
//                               <Label className="text-xs">Body</Label>
//                               <Textarea
//                                 value={editedContent.body}
//                                 onChange={(e) => setEditedContent((prev) => ({ ...prev, body: e.target.value }))}
//                                 className="mt-1 min-h-[100px]"
//                               />
//                             </div>
//                             <div className="flex justify-end gap-2">
//                               <Button
//                                 variant="outline"
//                                 size="sm"
//                                 onClick={() => setEditingVariant(null)}
//                                 className="shadow-sm"
//                               >
//                                 Cancel
//                               </Button>
//                               <Button
//                                 size="sm"
//                                 onClick={() => handleSaveVariantContent(variant.id)}
//                                 disabled={loadingAction === variant.id}
//                                 className="shadow-sm"
//                               >
//                                 {loadingAction === variant.id ? (
//                                  <WaveLoader size="sm" bars={8} gap="tight" />
//                                 ) : (
//                                   <Check className="mr-2 h-4 w-4" />
//                                 )}
//                                 Save
//                               </Button>
//                             </div>
//                           </div>
//                         ) : (
//                           <>
//                             <div className="space-y-2">
//                               <div>
//                                 <p className="text-xs text-muted-foreground">Subject</p>
//                                 <p className="text-sm font-medium line-clamp-1">{variant.subject || "(No subject)"}</p>
//                               </div>
//                               <div>
//                                 <p className="text-xs text-muted-foreground">Preview</p>
//                                 <p className="text-xs text-muted-foreground line-clamp-2">
//                                   {variant.body || "(No content)"}
//                                 </p>
//                               </div>
//                             </div>

//                             <div className="space-y-2">
//                               <div className="flex items-center justify-between text-xs">
//                                 <span>Traffic allocation</span>
//                                 <span className="font-medium">{variant.weight}%</span>
//                               </div>
//                               <Slider
//                                 value={[variant.weight]}
//                                 onValueChange={([value]) => handleWeightChange(variant.id, value)}
//                                 max={100}
//                                 min={0}
//                                 step={5}
//                               />
//                             </div>

//                             {variant.sent > 0 && (
//                               <div className="grid grid-cols-3 gap-3 pt-2 border-t">
//                                 <div className="text-center">
//                                   <p className="text-lg font-bold text-foreground">{perf.openRate.toFixed(1)}%</p>
//                                   <p className="text-[10px] text-muted-foreground">Open Rate</p>
//                                 </div>
//                                 <div className="text-center">
//                                   <p className="text-lg font-bold text-foreground">{perf.clickRate.toFixed(1)}%</p>
//                                   <p className="text-[10px] text-muted-foreground">Click Rate</p>
//                                 </div>
//                                 <div className="text-center">
//                                   <p className="text-lg font-bold text-foreground">{perf.replyRate.toFixed(1)}%</p>
//                                   <p className="text-[10px] text-muted-foreground">Reply Rate</p>
//                                 </div>
//                               </div>
//                             )}

//                             {variant.sent === 0 && (
//                               <div className="rounded-md bg-muted/50 p-2 text-center">
//                                 <p className="text-xs text-muted-foreground">
//                                   No sends yet. Stats will appear once emails are sent.
//                                 </p>
//                               </div>
//                             )}

//                             {variant.sent > 0 && (
//                               <div className="space-y-1">
//                                 <div className="flex items-center justify-between text-xs">
//                                   <span className="text-muted-foreground">Statistical confidence</span>
//                                   <span className="font-medium">{perf.confidence.toFixed(0)}%</span>
//                                 </div>
//                                 <Progress value={perf.confidence} className="h-1.5" />
//                               </div>
//                             )}
//                           </>
//                         )}
//                       </CardContent>
//                     </Card>
//                   )
//                 })}

//                 {variants.length < 5 && (
//                   <Button
//                     variant="outline"
//                     className="w-full border-dashed bg-transparent shadow-sm"
//                     onClick={() => setIsAddingVariant(true)}
//                     disabled={isLoading}
//                   >
//                     <Plus className="mr-2 h-4 w-4" />
//                     Add Variant {VARIANT_LETTERS[variants.length] || `V${variants.length + 1}`}
//                   </Button>
//                 )}
//               </div>
//             )}
//           </div>
//         </ScrollArea>

//         {/* Add variant dialog */}
//         <Dialog open={isAddingVariant} onOpenChange={setIsAddingVariant}>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>Add New Variant</DialogTitle>
//               <DialogDescription>Create a new email variant to test against existing ones.</DialogDescription>
//             </DialogHeader>
//             <div className="space-y-4 py-4">
//               <div className="space-y-2">
//                 <Label>Subject Line</Label>
//                 <Input
//                   value={newVariant.subject || ""}
//                   onChange={(e) => setNewVariant((prev) => ({ ...prev, subject: e.target.value }))}
//                   placeholder="Enter subject line..."
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label>Email Body</Label>
//                 <Textarea
//                   value={newVariant.body || ""}
//                   onChange={(e) => setNewVariant((prev) => ({ ...prev, body: e.target.value }))}
//                   placeholder="Enter email body..."
//                   className="min-h-[150px]"
//                 />
//               </div>
//               <div className="flex items-center gap-2 rounded-md bg-muted p-3">
//                 <Sparkles className="h-4 w-4 text-primary" />
//                 <p className="text-xs text-muted-foreground">
//                   Tip: Try testing different subject lines, opening hooks, or calls to action
//                 </p>
//               </div>
//             </div>
//             <DialogFooter>
//               <Button variant="outline" onClick={() => setIsAddingVariant(false)} className="shadow-sm">
//                 Cancel
//               </Button>
//               <Button onClick={handleAddVariant} disabled={isLoading} className="shadow-sm">
//                 {isLoading ? <WaveLoader size="sm" bars={8} gap="tight" /> : <Plus className="mr-2 h-4 w-4" />}
//                 Add Variant
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       </div>
//     </TooltipProvider>
//   )
// }
"use client"

import * as React from "react"
import {
  TestTube,
  Plus,
  Trash2,
  Trophy,
  Copy,
  ChevronDown,
  ArrowUpRight,
  Settings,
  Zap,
  TrendingUp,
  Check,
  Sparkles,
  Percent,
  MousePointer,
  Mail,
  Reply,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { TooltipProvider } from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import type { SequenceStep, SequenceStepVariant, ABTestMetric } from "@/lib/types/sequence"
import { WaveLoader } from "@/components/loader/wave-loader"

interface ABTestPanelProps {
  step: SequenceStep
  sequenceId: string
  userId: string
  onUpdate: (updates: Partial<SequenceStep>) => void
  onVariantsChange: (variants: SequenceStepVariant[]) => void
}

const METRIC_OPTIONS: { value: ABTestMetric; label: string; description: string; icon: React.ElementType }[] = [
  { value: "OPEN_RATE", label: "Open Rate", description: "Which variant gets more opens", icon: Mail },
  { value: "CLICK_RATE", label: "Click Rate", description: "Which variant gets more clicks", icon: MousePointer },
  { value: "REPLY_RATE", label: "Reply Rate", description: "Which variant gets more replies", icon: Reply },
  {
    value: "POSITIVE_REPLY_RATE",
    label: "Positive Reply",
    description: "Positive sentiment replies",
    icon: TrendingUp,
  },
]

const VARIANT_COLORS = [
  { bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-600", fill: "bg-blue-500" },
  { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-600", fill: "bg-emerald-500" },
  { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-600", fill: "bg-amber-500" },
  { bg: "bg-purple-500/10", border: "border-purple-500/30", text: "text-purple-600", fill: "bg-purple-500" },
  { bg: "bg-rose-500/10", border: "border-rose-500/30", text: "text-rose-600", fill: "bg-rose-500" },
]

const VARIANT_LETTERS = ["A", "B", "C", "D", "E"]

export function ABTestPanel({ step, sequenceId, userId, onUpdate, onVariantsChange }: ABTestPanelProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = React.useState(false)
  const [selectedMetric, setSelectedMetric] = React.useState<ABTestMetric>("REPLY_RATE")
  const [editingVariant, setEditingVariant] = React.useState<string | null>(null)
  const [editedContent, setEditedContent] = React.useState<{ subject: string; body: string }>({
    subject: "",
    body: "",
  })
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false)
  const [autoSelectWinner, setAutoSelectWinner] = React.useState(true)
  const [minSampleSize, setMinSampleSize] = React.useState(100)

  const variants = step.variants || []
  const hasVariants = variants.length > 0
  const totalSent = variants.reduce((acc, v) => acc + (v.sent || 0), 0)

  const handleAddVariant = () => {
    const nextLetter = VARIANT_LETTERS[variants.length] || `V${variants.length + 1}`

    if (variants.length === 0) {
      const variantA: SequenceStepVariant = {
        id: `temp_a_${Date.now()}`,
        stepId: step.id,
        variantName: "A",
        subject: step.subject || "",
        body: step.body || "",
        weight: 50,
        sent: 0,
        opened: 0,
        clicked: 0,
        replied: 0,
        isWinner: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const variantB: SequenceStepVariant = {
        id: `temp_b_${Date.now()}`,
        stepId: step.id,
        variantName: "B",
        subject: step.subject || "",
        body: step.body || "",
        weight: 50,
        sent: 0,
        opened: 0,
        clicked: 0,
        replied: 0,
        isWinner: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      onVariantsChange([variantA, variantB])
    } else {
      const newWeight = Math.floor(100 / (variants.length + 1))
      const updatedVariants = variants.map((v) => ({ ...v, weight: newWeight }))

      const newVariant: SequenceStepVariant = {
        id: `temp_${Date.now()}`,
        stepId: step.id,
        variantName: nextLetter,
        subject: step.subject || "",
        body: step.body || "",
        weight: newWeight,
        sent: 0,
        opened: 0,
        clicked: 0,
        replied: 0,
        isWinner: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      onVariantsChange([...updatedVariants, newVariant])
    }

    toast({ title: "Variant added" })
  }

  const handleRemoveVariant = (variantId: string) => {
    const remaining = variants.filter((v) => v.id !== variantId)

    if (remaining.length > 0) {
      const newWeight = Math.floor(100 / remaining.length)
      onVariantsChange(remaining.map((v) => ({ ...v, weight: newWeight })))
    } else {
      onVariantsChange([])
    }

    toast({ title: "Variant deleted" })
  }

  const handleWeightChange = (variantId: string, newWeight: number) => {
    const updatedVariants = variants.map((v) => (v.id === variantId ? { ...v, weight: newWeight } : v))
    onVariantsChange(updatedVariants)
  }

  const handleDistributeEvenly = () => {
    const evenWeight = Math.floor(100 / variants.length)
    const remainder = 100 - evenWeight * variants.length
    onVariantsChange(variants.map((v, i) => ({ ...v, weight: evenWeight + (i === 0 ? remainder : 0) })))
  }

  const handleSaveVariantContent = (variantId: string) => {
    onVariantsChange(
      variants.map((v) =>
        v.id === variantId ? { ...v, subject: editedContent.subject, body: editedContent.body } : v,
      ),
    )
    setEditingVariant(null)
    toast({ title: "Variant updated" })
  }

  const handleSelectWinner = (variantId: string) => {
    const winnerVariant = variants.find((v) => v.id === variantId)
    if (winnerVariant) {
      onUpdate({
        subject: winnerVariant.subject || undefined,
        body: winnerVariant.body || undefined,
      })
      onVariantsChange(
        variants.map((v) => ({
          ...v,
          isWinner: v.id === variantId,
          winnerSelectedAt: v.id === variantId ? new Date() : null,
        })),
      )
    }

    toast({
      title: "Winner selected!",
      description: "The winning variant content has been applied.",
    })
  }

  const startEditing = (variant: SequenceStepVariant) => {
    setEditingVariant(variant.id)
    setEditedContent({
      subject: variant.subject || "",
      body: variant.body || "",
    })
  }

  const getVariantPerformance = (variant: SequenceStepVariant) => {
    const total = variant.sent || 0
    if (total === 0) return { openRate: 0, clickRate: 0, replyRate: 0, confidence: 0 }

    return {
      openRate: (variant.opened / total) * 100,
      clickRate: (variant.clicked / total) * 100,
      replyRate: (variant.replied / total) * 100,
      confidence: Math.min(100, (total / minSampleSize) * 100),
    }
  }

  const getBestVariant = () => {
    if (variants.length === 0) return null

    return variants.reduce((best, current) => {
      const bestPerf = getVariantPerformance(best)
      const currentPerf = getVariantPerformance(current)

      const metricMap: Record<ABTestMetric, keyof typeof bestPerf> = {
        OPEN_RATE: "openRate",
        CLICK_RATE: "clickRate",
        REPLY_RATE: "replyRate",
        POSITIVE_REPLY_RATE: "replyRate",
      }

      const metric = metricMap[selectedMetric]
      return currentPerf[metric] > bestPerf[metric] ? current : best
    })
  }

  const bestVariant = getBestVariant()
  const selectedMetricConfig = METRIC_OPTIONS.find((m) => m.value === selectedMetric)

  return (
    <TooltipProvider>
      <div className="flex flex-col h-full">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5" />
          <div className="relative flex items-center justify-between p-4 sm:p-5 border-b">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
                <TestTube className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-base font-semibold">A/B Testing</h3>
                <p className="text-xs text-muted-foreground">
                  {hasVariants ? `${variants.length} variants • ${totalSent} sent` : "Test different approaches"}
                </p>
              </div>
            </div>
            {hasVariants && (
              <Badge variant="secondary" className="hidden sm:flex gap-1.5 font-medium">
                <Sparkles className="h-3 w-3" />
                {variants.length} variants
              </Badge>
            )}
          </div>
        </div>

        {hasVariants && (
          <Collapsible open={isSettingsOpen} onOpenChange={setIsSettingsOpen} className="border-b">
            <CollapsibleTrigger asChild>
              <button className="w-full flex items-center justify-between px-4 sm:px-5 py-3 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2.5">
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Test Configuration</span>
                </div>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-muted-foreground transition-transform duration-200",
                    isSettingsOpen && "rotate-180",
                  )}
                />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="px-4 sm:px-5 pb-5 space-y-5">
                {/* Winner metric selection */}
                <div className="space-y-2.5">
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Success Metric
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {METRIC_OPTIONS.map((option) => {
                      const Icon = option.icon
                      const isSelected = selectedMetric === option.value
                      return (
                        <button
                          key={option.value}
                          onClick={() => setSelectedMetric(option.value)}
                          className={cn(
                            "flex items-center gap-2.5 p-3 rounded-lg border-2 transition-all text-left",
                            isSelected
                              ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                              : "border-border hover:border-primary/30 hover:bg-muted/50",
                          )}
                        >
                          <Icon
                            className={cn("h-4 w-4 shrink-0", isSelected ? "text-primary" : "text-muted-foreground")}
                          />
                          <div className="min-w-0">
                            <p className={cn("text-sm font-medium truncate", isSelected && "text-primary")}>
                              {option.label}
                            </p>
                            <p className="text-[10px] text-muted-foreground truncate hidden sm:block">
                              {option.description}
                            </p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Auto-select winner toggle */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
                  <div className="flex items-center gap-2.5">
                    <Zap className="h-4 w-4 text-amber-500" />
                    <div>
                      <p className="text-sm font-medium">Auto-select winner</p>
                      <p className="text-xs text-muted-foreground">Automatically pick the best variant</p>
                    </div>
                  </div>
                  <Switch checked={autoSelectWinner} onCheckedChange={setAutoSelectWinner} />
                </div>

                {/* Min sample size */}
                {autoSelectWinner && (
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Min Sample Size
                      </Label>
                      <span className="text-sm font-semibold tabular-nums">{minSampleSize}</span>
                    </div>
                    <Slider
                      value={[minSampleSize]}
                      onValueChange={([v]) => setMinSampleSize(v)}
                      min={50}
                      max={500}
                      step={50}
                      className="py-2"
                    />
                    <p className="text-xs text-muted-foreground">
                      Winner will be selected after {minSampleSize} emails are sent
                    </p>
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Content */}
        <ScrollArea className="flex-1">
          <div className="p-4 sm:p-5 space-y-4">
            {!hasVariants && (
              <div className="rounded-2xl border-2 border-dashed border-primary/20 bg-gradient-to-b from-primary/5 to-transparent p-6 sm:p-8 text-center">
                <div className="mx-auto h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center ring-1 ring-primary/20 mb-4">
                  <TestTube className="h-7 w-7 text-primary" />
                </div>
                <h4 className="text-lg font-semibold mb-2">Start A/B Testing</h4>
                <p className="text-sm text-muted-foreground mb-6 max-w-xs mx-auto">
                  Test different subject lines and email content to discover what resonates best with your audience.
                </p>
                <Button onClick={handleAddVariant} disabled={isLoading} className="gap-2 shadow-lg shadow-primary/20">
                  {isLoading ? <WaveLoader size="sm" bars={8} gap="tight" /> : <Plus className="h-4 w-4" />}
                  Create A/B Test
                </Button>
              </div>
            )}

            {hasVariants && (
              <div className="rounded-xl border bg-card p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Percent className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Traffic Distribution</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleDistributeEvenly} className="h-7 text-xs">
                    Distribute evenly
                  </Button>
                </div>
                <div className="flex h-3 rounded-full overflow-hidden bg-muted">
                  {variants.map((variant, i) => (
                    <div
                      key={variant.id}
                      className={cn("h-full transition-all", VARIANT_COLORS[i]?.fill || "bg-gray-500")}
                      style={{ width: `${variant.weight}%` }}
                    />
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {variants.map((variant, i) => (
                    <div key={variant.id} className="flex items-center gap-1.5 text-xs">
                      <div className={cn("h-2 w-2 rounded-full", VARIANT_COLORS[i]?.fill || "bg-gray-500")} />
                      <span className="font-medium">{variant.variantName}</span>
                      <span className="text-muted-foreground">{variant.weight}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {hasVariants && (
              <div className="space-y-3">
                {variants.map((variant, index) => {
                  const perf = getVariantPerformance(variant)
                  const isBest = bestVariant?.id === variant.id && variant.sent > 0
                  const isEditing = editingVariant === variant.id
                  const colors = VARIANT_COLORS[index] || VARIANT_COLORS[0]

                  return (
                    <Card
                      key={variant.id}
                      className={cn(
                        "relative overflow-hidden transition-all duration-200",
                        variant.isWinner && "ring-2 ring-emerald-500 shadow-lg shadow-emerald-500/10",
                        isBest && !variant.isWinner && "ring-1 ring-primary shadow-md",
                      )}
                    >
                      {/* Status badges */}
                      <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
                        {variant.isWinner && (
                          <Badge className="gap-1 bg-emerald-500 text-white border-0 shadow-sm">
                            <Trophy className="h-3 w-3" />
                            Winner
                          </Badge>
                        )}
                        {isBest && !variant.isWinner && (
                          <Badge variant="outline" className="gap-1 text-primary border-primary/30 bg-primary/5">
                            <ArrowUpRight className="h-3 w-3" />
                            Leading
                          </Badge>
                        )}
                      </div>

                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "flex h-10 w-10 items-center justify-center rounded-xl font-bold text-lg",
                              colors.bg,
                              colors.text,
                              "ring-1",
                              colors.border,
                            )}
                          >
                            {variant.variantName}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold">Variant {variant.variantName}</p>
                            <p className="text-xs text-muted-foreground truncate">
                              {variant.sent > 0 ? `${variant.sent} sent` : "Not sent yet"}
                            </p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                                <ChevronDown className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem onClick={() => startEditing(variant)}>
                                <Copy className="mr-2 h-4 w-4" />
                                Edit content
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleSelectWinner(variant.id)}>
                                <Trophy className="mr-2 h-4 w-4" />
                                Select as winner
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {variants.length > 1 && (
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => handleRemoveVariant(variant.id)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete variant
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {isEditing ? (
                          <div className="space-y-3">
                            <div>
                              <Label className="text-xs font-medium text-muted-foreground">Subject Line</Label>
                              <Input
                                value={editedContent.subject}
                                onChange={(e) => setEditedContent((prev) => ({ ...prev, subject: e.target.value }))}
                                className="mt-1.5"
                                placeholder="Enter subject line..."
                              />
                            </div>
                            <div>
                              <Label className="text-xs font-medium text-muted-foreground">Email Body</Label>
                              <Textarea
                                value={editedContent.body}
                                onChange={(e) => setEditedContent((prev) => ({ ...prev, body: e.target.value }))}
                                className="mt-1.5 min-h-[120px] resize-none"
                                placeholder="Enter email body..."
                              />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                              <Button variant="outline" size="sm" onClick={() => setEditingVariant(null)}>
                                Cancel
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleSaveVariantContent(variant.id)}
                                className="gap-1.5"
                              >
                                <Check className="h-3.5 w-3.5" />
                                Save
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            {/* Subject preview */}
                            <div className="p-3 rounded-lg bg-muted/50 border">
                              <p className="text-xs text-muted-foreground mb-1">Subject</p>
                              <p className="text-sm font-medium line-clamp-1">
                                {variant.subject || <span className="text-muted-foreground italic">No subject</span>}
                              </p>
                            </div>

                            {/* Weight slider */}
                            <div className="space-y-2">
                              <div className="flex justify-between text-xs">
                                <span className="text-muted-foreground font-medium">Traffic allocation</span>
                                <span className="font-bold tabular-nums">{variant.weight}%</span>
                              </div>
                              <Slider
                                value={[variant.weight]}
                                onValueChange={([v]) => handleWeightChange(variant.id, v)}
                                max={100}
                                min={0}
                                step={5}
                                className="py-1"
                              />
                            </div>

                            {/* Performance stats */}
                            {variant.sent > 0 && (
                              <div className="space-y-3 pt-2 border-t">
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                  <span>Statistical confidence</span>
                                  <span className="font-medium tabular-nums">{perf.confidence.toFixed(0)}%</span>
                                </div>
                                <Progress value={perf.confidence} className="h-1.5" />

                                <div className="grid grid-cols-3 gap-2">
                                  {[
                                    { label: "Open", value: perf.openRate, icon: Mail },
                                    { label: "Click", value: perf.clickRate, icon: MousePointer },
                                    { label: "Reply", value: perf.replyRate, icon: Reply },
                                  ].map((stat) => (
                                    <div
                                      key={stat.label}
                                      className="flex flex-col items-center p-2.5 rounded-lg bg-muted/50"
                                    >
                                      <stat.icon className="h-3.5 w-3.5 text-muted-foreground mb-1" />
                                      <p className="text-lg font-bold tabular-nums">{stat.value.toFixed(1)}%</p>
                                      <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}

                {/* Add variant button */}
                {variants.length < 5 && (
                  <Button
                    variant="outline"
                    className="w-full h-14 border-2 border-dashed hover:border-primary hover:bg-primary/5 transition-all bg-transparent"
                    onClick={handleAddVariant}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Variant {VARIANT_LETTERS[variants.length]}
                  </Button>
                )}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </TooltipProvider>
  )
}
