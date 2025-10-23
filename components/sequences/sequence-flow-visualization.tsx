"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Mail, CheckCircle2, XCircle, Eye, Edit, Trash2 } from "lucide-react"
import { useState } from "react"

interface Sequence {
  id: string
  stepNumber: number
  delayDays: number
  sendOnlyIfNotReplied: boolean
  sendOnlyIfNotOpened: boolean
  template: {
    id: string
    name: string
    subject: string
    body: string
  }
}

interface SequenceFlowVisualizationProps {
  sequences: Sequence[]
  campaignName: string
}

export function SequenceFlowVisualization({ sequences, campaignName }: SequenceFlowVisualizationProps) {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null)

  if (sequences.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Mail className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-xl font-semibold mb-2">No sequences yet</h3>
        <p className="text-muted-foreground mb-6">Create your first email sequence to get started</p>
        <Button>Add First Step</Button>
      </Card>
    )
  }

  return (
    <div className="relative py-8">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-lg -z-10" />

      <div className="space-y-8">
        {sequences.map((sequence, index) => {
          const isEven = index % 2 === 0
          const isLast = index === sequences.length - 1

          return (
            <motion.div
              key={sequence.id}
              initial={{ opacity: 0, x: isEven ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              {/* Step Container with Zigzag Layout */}
              <div className={`flex items-center gap-8 ${isEven ? "flex-row" : "flex-row-reverse"} max-w-6xl mx-auto`}>
                {/* Step Number Badge */}
                <motion.div
                  className="flex-shrink-0"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  onHoverStart={() => setHoveredStep(sequence.stepNumber)}
                  onHoverEnd={() => setHoveredStep(null)}
                >
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
                      <span className="text-2xl font-bold text-primary-foreground">{sequence.stepNumber}</span>
                    </div>
                    {hoveredStep === sequence.stepNumber && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -inset-2 rounded-full bg-primary/20 -z-10"
                      />
                    )}
                  </div>
                </motion.div>

                {/* Email Card */}
                <motion.div
                  className="flex-1"
                  whileHover={{ scale: 1.02, y: -4 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="overflow-hidden border-2 hover:border-primary/50 transition-colors shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 pb-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <Mail className="h-5 w-5 text-primary" />
                            <CardTitle className="text-xl">{sequence.template.name}</CardTitle>
                          </div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Subject: <span className="text-foreground">{sequence.template.subject}</span>
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-4">
                      {/* Email Preview */}
                      <div className="bg-muted/50 rounded-lg p-4 max-h-32 overflow-hidden relative">
                        <p className="text-sm text-muted-foreground line-clamp-4">{sequence.template.body}</p>
                        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-muted/50 to-transparent" />
                      </div>

                      {/* Conditions */}
                      <div className="flex flex-wrap gap-2">
                        {sequence.sendOnlyIfNotReplied && (
                          <Badge variant="secondary" className="gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Only if no reply
                          </Badge>
                        )}
                        {sequence.sendOnlyIfNotOpened && (
                          <Badge variant="secondary" className="gap-1">
                            <XCircle className="h-3 w-3" />
                            Only if not opened
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Animated Arrow Connector */}
              {!isLast && (
                <div className="relative h-24 flex items-center justify-center">
                  <motion.div
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
                    className="absolute"
                  >
                    <svg
                      width="120"
                      height="96"
                      viewBox="0 0 120 96"
                      fill="none"
                      className={`${isEven ? "" : "scale-x-[-1]"}`}
                    >
                      <motion.path
                        d="M 60 0 Q 80 48, 60 96"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeDasharray="8 4"
                        className="text-primary/40"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                      />
                      <motion.path
                        d="M 60 96 L 54 86 M 60 96 L 66 86"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        className="text-primary/60"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 + 0.8 }}
                      />
                    </svg>
                  </motion.div>

                  {/* Delay Badge */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.5 }}
                    className="relative z-10"
                  >
                    <Badge
                      variant="outline"
                      className="bg-background border-2 border-primary/30 px-4 py-2 text-sm font-semibold shadow-md"
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Wait {sequence.delayDays} {sequence.delayDays === 1 ? "day" : "days"}
                    </Badge>
                  </motion.div>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Completion Badge */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: sequences.length * 0.1 + 0.5 }}
        className="flex justify-center mt-8"
      >
        <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-500/30 rounded-full px-6 py-3 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
          <span className="font-semibold text-green-700 dark:text-green-300">Sequence Complete</span>
        </div>
      </motion.div>
    </div>
  )
}
