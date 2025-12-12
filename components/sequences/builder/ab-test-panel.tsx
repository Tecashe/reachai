// "use client"

// import * as React from "react"
// import { TestTube, Plus, Trash2, Trophy, Sparkles, Copy, ChevronDown, ArrowUpRight, Loader2, Check } from "lucide-react"
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

//       // If no variants exist, create variant A from current step content first
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
//         // Create new variant
//         const newWeight = Math.floor(100 / (variants.length + 1))
//         const createdVariant = await createVariant(step.id, sequenceId, userId, {
//           variantName: nextLetter,
//           subject: newVariant.subject || "",
//           body: newVariant.body || "",
//           weight: newWeight,
//         })

//         // Redistribute weights for existing variants
//         const updatedWeights = variants.map((v) => ({
//           variantId: v.id,
//           weight: newWeight,
//         }))
//         await redistributeVariantWeights(step.id, sequenceId, userId, updatedWeights)

//         // Update local stat
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

//       // Redistribute weights
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
//     // Optimistic update
//     const updatedVariants = variants.map((v) => (v.id === variantId ? { ...v, weight: newWeight } : v))
//     onVariantsChange(updatedVariants)

//     // Debounced save
//     try {
//       await updateVariant(variantId, sequenceId, userId, { weight: newWeight })
//     } catch (error) {
//       // Revert on error
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

//       // Update local state
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

//   // Duplicate current step content as a new variant
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
//         // Create both A and B variants
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

//   // Calculate performance metrics
//   const getVariantPerformance = (variant: SequenceStepVariant) => {
//     const total = variant.sent || 0
//     if (total === 0) return { openRate: 0, clickRate: 0, replyRate: 0, confidence: 0 }

//     return {
//       openRate: (variant.opened / total) * 100,
//       clickRate: (variant.clicked / total) * 100,
//       replyRate: (variant.replied / total) * 100,
//       confidence: Math.min(100, (total / 100) * 100), // Simple confidence based on sample size
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
//       <div className="space-y-6 p-4">
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <TestTube className="h-5 w-5 text-primary" />
//             <h3 className="text-sm font-semibold">A/B Testing</h3>
//           </div>
//           {hasVariants && (
//             <Badge variant="outline" className="text-xs">
//               {variants.length + 1} variants
//             </Badge>
//           )}
//         </div>

//         {/* No variants state */}
//         {!hasVariants && (
//           <div className="rounded-lg border border-dashed border-border p-6 text-center">
//             <TestTube className="mx-auto h-10 w-10 text-muted-foreground" />
//             <h4 className="mt-3 text-sm font-medium">No A/B test variants</h4>
//             <p className="mt-1 text-xs text-muted-foreground">
//               Create variants to test different subject lines and email content
//             </p>
//             <div className="mt-4 flex items-center justify-center gap-2">
//               <Button size="sm" onClick={handleDuplicateAsVariant} disabled={isLoading}>
//                 {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Copy className="mr-2 h-4 w-4" />}
//                 Create A/B Test
//               </Button>
//             </div>
//           </div>
//         )}

//         {/* Variants list */}
//         {hasVariants && (
//           <ScrollArea className="max-h-[500px]">
//             <div className="space-y-4">
//               {/* Original (shown as Variant A) */}
//               {variants.map((variant, index) => {
//                 const perf = getVariantPerformance(variant)
//                 const isBest = bestVariant?.id === variant.id && variant.sent > 0
//                 const isEditing = editingVariant === variant.id

//                 return (
//                   <Card
//                     key={variant.id}
//                     className={cn(
//                       "relative transition-all",
//                       variant.isWinner && "ring-2 ring-green-500",
//                       isBest && !variant.isWinner && "ring-1 ring-primary",
//                     )}
//                   >
//                     <CardHeader className="pb-2">
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-2">
//                           <div
//                             className={cn(
//                               "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold",
//                               index === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
//                             )}
//                           >
//                             {variant.variantName}
//                           </div>
//                           <span className="text-sm font-medium">Variant {variant.variantName}</span>
//                           {variant.isWinner && (
//                             <Badge className="gap-1 bg-green-500 text-white">
//                               <Trophy className="h-3 w-3" />
//                               Winner
//                             </Badge>
//                           )}
//                           {isBest && !variant.isWinner && (
//                             <Badge variant="outline" className="gap-1 text-primary">
//                               <ArrowUpRight className="h-3 w-3" />
//                               Leading
//                             </Badge>
//                           )}
//                         </div>
//                         <DropdownMenu>
//                           <DropdownMenuTrigger asChild>
//                             <Button variant="ghost" size="icon" className="h-8 w-8">
//                               <ChevronDown className="h-4 w-4" />
//                             </Button>
//                           </DropdownMenuTrigger>
//                           <DropdownMenuContent align="end">
//                             <DropdownMenuItem onClick={() => startEditing(variant)}>Edit content</DropdownMenuItem>
//                             <DropdownMenuItem onClick={() => handleSelectWinner(variant.id)}>
//                               <Trophy className="mr-2 h-4 w-4" />
//                               Select as winner
//                             </DropdownMenuItem>
//                             {variants.length > 1 && (
//                               <DropdownMenuItem
//                                 className="text-destructive"
//                                 onClick={() => handleRemoveVariant(variant.id)}
//                               >
//                                 <Trash2 className="mr-2 h-4 w-4" />
//                                 Delete variant
//                               </DropdownMenuItem>
//                             )}
//                           </DropdownMenuContent>
//                         </DropdownMenu>
//                       </div>
//                     </CardHeader>
//                     <CardContent className="space-y-4">
//                       {isEditing ? (
//                         <div className="space-y-3">
//                           <div>
//                             <Label className="text-xs">Subject</Label>
//                             <Input
//                               value={editedContent.subject}
//                               onChange={(e) => setEditedContent((prev) => ({ ...prev, subject: e.target.value }))}
//                               className="mt-1"
//                             />
//                           </div>
//                           <div>
//                             <Label className="text-xs">Body</Label>
//                             <Textarea
//                               value={editedContent.body}
//                               onChange={(e) => setEditedContent((prev) => ({ ...prev, body: e.target.value }))}
//                               className="mt-1 min-h-[100px]"
//                             />
//                           </div>
//                           <div className="flex justify-end gap-2">
//                             <Button variant="outline" size="sm" onClick={() => setEditingVariant(null)}>
//                               Cancel
//                             </Button>
//                             <Button
//                               size="sm"
//                               onClick={() => handleSaveVariantContent(variant.id)}
//                               disabled={loadingAction === variant.id}
//                             >
//                               {loadingAction === variant.id ? (
//                                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                               ) : (
//                                 <Check className="mr-2 h-4 w-4" />
//                               )}
//                               Save
//                             </Button>
//                           </div>
//                         </div>
//                       ) : (
//                         <>
//                           {/* Content preview */}
//                           <div className="space-y-2">
//                             <div>
//                               <p className="text-xs text-muted-foreground">Subject</p>
//                               <p className="text-sm font-medium line-clamp-1">{variant.subject || "(No subject)"}</p>
//                             </div>
//                             <div>
//                               <p className="text-xs text-muted-foreground">Preview</p>
//                               <p className="text-xs text-muted-foreground line-clamp-2">
//                                 {variant.body || "(No content)"}
//                               </p>
//                             </div>
//                           </div>

//                           {/* Traffic allocation */}
//                           <div className="space-y-2">
//                             <div className="flex items-center justify-between text-xs">
//                               <span>Traffic allocation</span>
//                               <span className="font-medium">{variant.weight}%</span>
//                             </div>
//                             <Slider
//                               value={[variant.weight]}
//                               onValueChange={([value]) => handleWeightChange(variant.id, value)}
//                               max={100}
//                               min={0}
//                               step={5}
//                             />
//                           </div>

//                           {/* Performance metrics */}
//                           {variant.sent > 0 && (
//                             <div className="grid grid-cols-3 gap-3 pt-2 border-t">
//                               <div className="text-center">
//                                 <p className="text-lg font-bold text-foreground">{perf.openRate.toFixed(1)}%</p>
//                                 <p className="text-[10px] text-muted-foreground">Open Rate</p>
//                               </div>
//                               <div className="text-center">
//                                 <p className="text-lg font-bold text-foreground">{perf.clickRate.toFixed(1)}%</p>
//                                 <p className="text-[10px] text-muted-foreground">Click Rate</p>
//                               </div>
//                               <div className="text-center">
//                                 <p className="text-lg font-bold text-foreground">{perf.replyRate.toFixed(1)}%</p>
//                                 <p className="text-[10px] text-muted-foreground">Reply Rate</p>
//                               </div>
//                             </div>
//                           )}

//                           {variant.sent === 0 && (
//                             <div className="rounded-md bg-muted/50 p-2 text-center">
//                               <p className="text-xs text-muted-foreground">
//                                 No sends yet. Stats will appear once emails are sent.
//                               </p>
//                             </div>
//                           )}

//                           {/* Confidence indicator */}
//                           {variant.sent > 0 && (
//                             <div className="space-y-1">
//                               <div className="flex items-center justify-between text-xs">
//                                 <span className="text-muted-foreground">Statistical confidence</span>
//                                 <span className="font-medium">{perf.confidence.toFixed(0)}%</span>
//                               </div>
//                               <Progress value={perf.confidence} className="h-1.5" />
//                             </div>
//                           )}
//                         </>
//                       )}
//                     </CardContent>
//                   </Card>
//                 )
//               })}

//               {/* Add variant button */}
//               {variants.length < 5 && (
//                 <Button
//                   variant="outline"
//                   className="w-full border-dashed bg-transparent"
//                   onClick={() => setIsAddingVariant(true)}
//                   disabled={isLoading}
//                 >
//                   <Plus className="mr-2 h-4 w-4" />
//                   Add Variant {VARIANT_LETTERS[variants.length] || `V${variants.length + 1}`}
//                 </Button>
//               )}
//             </div>
//           </ScrollArea>
//         )}

//         {/* Test settings */}
//         {hasVariants && (
//           <div className="space-y-4 border-t pt-4">
//             <h4 className="text-sm font-medium">Test Settings</h4>
//             <div className="space-y-3">
//               <div>
//                 <Label className="text-xs">Winner selection metric</Label>
//                 <Select value={selectedMetric} onValueChange={(v) => setSelectedMetric(v as ABTestMetric)}>
//                   <SelectTrigger className="mt-1">
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {METRIC_OPTIONS.map((option) => (
//                       <SelectItem key={option.value} value={option.value}>
//                         <div>
//                           <p>{option.label}</p>
//                           <p className="text-xs text-muted-foreground">{option.description}</p>
//                         </div>
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
//           </div>
//         )}

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
//               <Button variant="outline" onClick={() => setIsAddingVariant(false)}>
//                 Cancel
//               </Button>
//               <Button onClick={handleAddVariant} disabled={isLoading}>
//                 {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
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
  Sparkles,
  Copy,
  ChevronDown,
  ArrowUpRight,
  Loader2,
  Check,
  Settings,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { TooltipProvider } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import type { SequenceStep, SequenceStepVariant, ABTestMetric } from "@/lib/types/sequence"
import {
  createVariant,
  updateVariant,
  deleteVariant,
  selectVariantAsWinner,
  redistributeVariantWeights,
} from "@/lib/actions/sequence-actions"

interface ABTestPanelProps {
  step: SequenceStep
  sequenceId: string
  userId: string
  onUpdate: (updates: Partial<SequenceStep>) => void
  onVariantsChange: (variants: SequenceStepVariant[]) => void
}

const METRIC_OPTIONS: { value: ABTestMetric; label: string; description: string }[] = [
  { value: "OPEN_RATE", label: "Open Rate", description: "Track which variant gets more opens" },
  { value: "CLICK_RATE", label: "Click Rate", description: "Track which variant gets more clicks" },
  { value: "REPLY_RATE", label: "Reply Rate", description: "Track which variant gets more replies" },
  { value: "POSITIVE_REPLY_RATE", label: "Positive Reply Rate", description: "Track positive sentiment replies" },
]

const VARIANT_LETTERS = ["A", "B", "C", "D", "E"]

export function ABTestPanel({ step, sequenceId, userId, onUpdate, onVariantsChange }: ABTestPanelProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = React.useState(false)
  const [loadingAction, setLoadingAction] = React.useState<string | null>(null)
  const [isAddingVariant, setIsAddingVariant] = React.useState(false)
  const [newVariant, setNewVariant] = React.useState<Partial<SequenceStepVariant>>({
    subject: step.subject || "",
    body: step.body || "",
    weight: 50,
  })
  const [selectedMetric, setSelectedMetric] = React.useState<ABTestMetric>("REPLY_RATE")
  const [editingVariant, setEditingVariant] = React.useState<string | null>(null)
  const [editedContent, setEditedContent] = React.useState<{ subject: string; body: string }>({
    subject: "",
    body: "",
  })
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(true)

  const variants = step.variants || []
  const hasVariants = variants.length > 0

  const handleAddVariant = async () => {
    if (sequenceId === "new") {
      toast({
        title: "Save first",
        description: "Please save the sequence before adding A/B test variants.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const nextLetter = VARIANT_LETTERS[variants.length + 1] || `V${variants.length + 2}`

      if (variants.length === 0) {
        const variantA = await createVariant(step.id, sequenceId, userId, {
          variantName: "A",
          subject: step.subject || "",
          body: step.body || "",
          weight: 50,
        })

        const variantB = await createVariant(step.id, sequenceId, userId, {
          variantName: "B",
          subject: newVariant.subject || step.subject || "",
          body: newVariant.body || step.body || "",
          weight: 50,
        })

        onVariantsChange([variantA, variantB])
      } else {
        const newWeight = Math.floor(100 / (variants.length + 1))
        const createdVariant = await createVariant(step.id, sequenceId, userId, {
          variantName: nextLetter,
          subject: newVariant.subject || "",
          body: newVariant.body || "",
          weight: newWeight,
        })

        const updatedWeights = variants.map((v) => ({
          variantId: v.id,
          weight: newWeight,
        }))
        await redistributeVariantWeights(step.id, sequenceId, userId, updatedWeights)

        const updatedVariants = variants.map((v) => ({ ...v, weight: newWeight }))
        onVariantsChange([...updatedVariants, createdVariant])
      }

      toast({ title: "Variant added", description: "A/B test variant has been created." })
      setIsAddingVariant(false)
      setNewVariant({ subject: "", body: "", weight: 50 })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add variant. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveVariant = async (variantId: string) => {
    setLoadingAction(variantId)
    try {
      await deleteVariant(variantId, sequenceId, userId)

      const remaining = variants.filter((v) => v.id !== variantId)

      if (remaining.length > 0) {
        const newWeight = Math.floor(100 / remaining.length)
        const updatedWeights = remaining.map((v) => ({
          variantId: v.id,
          weight: newWeight,
        }))
        await redistributeVariantWeights(step.id, sequenceId, userId, updatedWeights)
        onVariantsChange(remaining.map((v) => ({ ...v, weight: newWeight })))
      } else {
        onVariantsChange([])
      }

      toast({ title: "Variant deleted" })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete variant.",
        variant: "destructive",
      })
    } finally {
      setLoadingAction(null)
    }
  }

  const handleWeightChange = async (variantId: string, newWeight: number) => {
    const updatedVariants = variants.map((v) => (v.id === variantId ? { ...v, weight: newWeight } : v))
    onVariantsChange(updatedVariants)

    try {
      await updateVariant(variantId, sequenceId, userId, { weight: newWeight })
    } catch (error) {
      onVariantsChange(variants)
      toast({
        title: "Error",
        description: "Failed to update weight.",
        variant: "destructive",
      })
    }
  }

  const handleSaveVariantContent = async (variantId: string) => {
    setLoadingAction(variantId)
    try {
      await updateVariant(variantId, sequenceId, userId, {
        subject: editedContent.subject,
        body: editedContent.body,
      })

      onVariantsChange(
        variants.map((v) =>
          v.id === variantId ? { ...v, subject: editedContent.subject, body: editedContent.body } : v,
        ),
      )

      setEditingVariant(null)
      toast({ title: "Variant updated" })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update variant.",
        variant: "destructive",
      })
    } finally {
      setLoadingAction(null)
    }
  }

  const handleSelectWinner = async (variantId: string) => {
    setLoadingAction(variantId)
    try {
      await selectVariantAsWinner(variantId, step.id, sequenceId, userId)

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
        description: "The winning variant content has been applied to the main step.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to select winner.",
        variant: "destructive",
      })
    } finally {
      setLoadingAction(null)
    }
  }

  const handleDuplicateAsVariant = async () => {
    if (sequenceId === "new") {
      toast({
        title: "Save first",
        description: "Please save the sequence before adding variants.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const nextLetter = VARIANT_LETTERS[variants.length + 1] || `V${variants.length + 2}`

      if (variants.length === 0) {
        const variantA = await createVariant(step.id, sequenceId, userId, {
          variantName: "A",
          subject: step.subject || "",
          body: step.body || "",
          weight: 50,
        })

        const variantB = await createVariant(step.id, sequenceId, userId, {
          variantName: "B",
          subject: step.subject || "",
          body: step.body || "",
          weight: 50,
        })

        onVariantsChange([variantA, variantB])
      } else {
        const newWeight = Math.floor(100 / (variants.length + 1))
        const createdVariant = await createVariant(step.id, sequenceId, userId, {
          variantName: nextLetter,
          subject: step.subject || "",
          body: step.body || "",
          weight: newWeight,
        })

        const updatedWeights = variants.map((v) => ({
          variantId: v.id,
          weight: newWeight,
        }))
        await redistributeVariantWeights(step.id, sequenceId, userId, updatedWeights)

        const updatedVariants = variants.map((v) => ({ ...v, weight: newWeight }))
        onVariantsChange([...updatedVariants, createdVariant])
      }

      toast({ title: "Variant created from current content" })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to duplicate as variant.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
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
      confidence: Math.min(100, (total / 100) * 100),
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

  return (
    <TooltipProvider>
      <div className="flex flex-col h-full">
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <TestTube className="h-5 w-5 text-primary" />
            <h3 className="text-sm font-semibold">A/B Testing</h3>
          </div>
          {hasVariants && (
            <Badge variant="outline" className="text-xs">
              {variants.length} variants
            </Badge>
          )}
        </div>

        {/* Test Settings - Collapsible but always visible when variants exist */}
        {hasVariants && (
          <Collapsible open={isSettingsOpen} onOpenChange={setIsSettingsOpen} className="border-b">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between h-auto py-3 px-4 rounded-none">
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Test Settings</span>
                </div>
                <ChevronDown
                  className={cn("h-4 w-4 text-muted-foreground transition-transform", isSettingsOpen && "rotate-180")}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="px-4 pb-4 space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Winner selection metric</Label>
                  <Select value={selectedMetric} onValueChange={(v) => setSelectedMetric(v as ABTestMetric)}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {METRIC_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div>
                            <p className="font-medium">{option.label}</p>
                            <p className="text-xs text-muted-foreground">{option.description}</p>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Scrollable Content Area */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {/* No variants state */}
            {!hasVariants && (
              <div className="rounded-lg border border-dashed border-border p-6 text-center">
                <TestTube className="mx-auto h-10 w-10 text-muted-foreground" />
                <h4 className="mt-3 text-sm font-medium">No A/B test variants</h4>
                <p className="mt-1 text-xs text-muted-foreground">
                  Create variants to test different subject lines and email content
                </p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <Button size="sm" onClick={handleDuplicateAsVariant} disabled={isLoading} className="shadow-sm">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Copy className="mr-2 h-4 w-4" />}
                    Create A/B Test
                  </Button>
                </div>
              </div>
            )}

            {/* Variants list */}
            {hasVariants && (
              <div className="space-y-4">
                {variants.map((variant, index) => {
                  const perf = getVariantPerformance(variant)
                  const isBest = bestVariant?.id === variant.id && variant.sent > 0
                  const isEditing = editingVariant === variant.id

                  return (
                    <Card
                      key={variant.id}
                      className={cn(
                        "relative transition-all",
                        variant.isWinner && "ring-2 ring-green-500",
                        isBest && !variant.isWinner && "ring-1 ring-primary",
                      )}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className={cn(
                                "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold",
                                index === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                              )}
                            >
                              {variant.variantName}
                            </div>
                            <span className="text-sm font-medium">Variant {variant.variantName}</span>
                            {variant.isWinner && (
                              <Badge className="gap-1 bg-green-500 text-white">
                                <Trophy className="h-3 w-3" />
                                Winner
                              </Badge>
                            )}
                            {isBest && !variant.isWinner && (
                              <Badge variant="outline" className="gap-1 text-primary">
                                <ArrowUpRight className="h-3 w-3" />
                                Leading
                              </Badge>
                            )}
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <ChevronDown className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => startEditing(variant)}>Edit content</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleSelectWinner(variant.id)}>
                                <Trophy className="mr-2 h-4 w-4" />
                                Select as winner
                              </DropdownMenuItem>
                              {variants.length > 1 && (
                                <DropdownMenuItem
                                  className="text-destructive"
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
                              <Label className="text-xs">Subject</Label>
                              <Input
                                value={editedContent.subject}
                                onChange={(e) => setEditedContent((prev) => ({ ...prev, subject: e.target.value }))}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Body</Label>
                              <Textarea
                                value={editedContent.body}
                                onChange={(e) => setEditedContent((prev) => ({ ...prev, body: e.target.value }))}
                                className="mt-1 min-h-[100px]"
                              />
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingVariant(null)}
                                className="shadow-sm"
                              >
                                Cancel
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleSaveVariantContent(variant.id)}
                                disabled={loadingAction === variant.id}
                                className="shadow-sm"
                              >
                                {loadingAction === variant.id ? (
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                  <Check className="mr-2 h-4 w-4" />
                                )}
                                Save
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="space-y-2">
                              <div>
                                <p className="text-xs text-muted-foreground">Subject</p>
                                <p className="text-sm font-medium line-clamp-1">{variant.subject || "(No subject)"}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Preview</p>
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                  {variant.body || "(No content)"}
                                </p>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-xs">
                                <span>Traffic allocation</span>
                                <span className="font-medium">{variant.weight}%</span>
                              </div>
                              <Slider
                                value={[variant.weight]}
                                onValueChange={([value]) => handleWeightChange(variant.id, value)}
                                max={100}
                                min={0}
                                step={5}
                              />
                            </div>

                            {variant.sent > 0 && (
                              <div className="grid grid-cols-3 gap-3 pt-2 border-t">
                                <div className="text-center">
                                  <p className="text-lg font-bold text-foreground">{perf.openRate.toFixed(1)}%</p>
                                  <p className="text-[10px] text-muted-foreground">Open Rate</p>
                                </div>
                                <div className="text-center">
                                  <p className="text-lg font-bold text-foreground">{perf.clickRate.toFixed(1)}%</p>
                                  <p className="text-[10px] text-muted-foreground">Click Rate</p>
                                </div>
                                <div className="text-center">
                                  <p className="text-lg font-bold text-foreground">{perf.replyRate.toFixed(1)}%</p>
                                  <p className="text-[10px] text-muted-foreground">Reply Rate</p>
                                </div>
                              </div>
                            )}

                            {variant.sent === 0 && (
                              <div className="rounded-md bg-muted/50 p-2 text-center">
                                <p className="text-xs text-muted-foreground">
                                  No sends yet. Stats will appear once emails are sent.
                                </p>
                              </div>
                            )}

                            {variant.sent > 0 && (
                              <div className="space-y-1">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-muted-foreground">Statistical confidence</span>
                                  <span className="font-medium">{perf.confidence.toFixed(0)}%</span>
                                </div>
                                <Progress value={perf.confidence} className="h-1.5" />
                              </div>
                            )}
                          </>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}

                {variants.length < 5 && (
                  <Button
                    variant="outline"
                    className="w-full border-dashed bg-transparent shadow-sm"
                    onClick={() => setIsAddingVariant(true)}
                    disabled={isLoading}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Variant {VARIANT_LETTERS[variants.length] || `V${variants.length + 1}`}
                  </Button>
                )}
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Add variant dialog */}
        <Dialog open={isAddingVariant} onOpenChange={setIsAddingVariant}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Variant</DialogTitle>
              <DialogDescription>Create a new email variant to test against existing ones.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Subject Line</Label>
                <Input
                  value={newVariant.subject || ""}
                  onChange={(e) => setNewVariant((prev) => ({ ...prev, subject: e.target.value }))}
                  placeholder="Enter subject line..."
                />
              </div>
              <div className="space-y-2">
                <Label>Email Body</Label>
                <Textarea
                  value={newVariant.body || ""}
                  onChange={(e) => setNewVariant((prev) => ({ ...prev, body: e.target.value }))}
                  placeholder="Enter email body..."
                  className="min-h-[150px]"
                />
              </div>
              <div className="flex items-center gap-2 rounded-md bg-muted p-3">
                <Sparkles className="h-4 w-4 text-primary" />
                <p className="text-xs text-muted-foreground">
                  Tip: Try testing different subject lines, opening hooks, or calls to action
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddingVariant(false)} className="shadow-sm">
                Cancel
              </Button>
              <Button onClick={handleAddVariant} disabled={isLoading} className="shadow-sm">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                Add Variant
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  )
}
