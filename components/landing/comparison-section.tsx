"use client"

import { Check, X } from "lucide-react"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"

const comparisonData = [
  { feature: "AI Research", reachAI: true, generic: false, manual: false },
  { feature: "Personalization at Scale", reachAI: true, generic: false, manual: true },
  { feature: "Automated Follow-ups", reachAI: true, generic: false, manual: false },
  { feature: "Quality Scoring", reachAI: true, generic: false, manual: false },
  { feature: "Competitor Intelligence", reachAI: true, generic: false, manual: false },
  { feature: "Smart Send Times", reachAI: true, generic: false, manual: false },
  { feature: "Advanced Analytics", reachAI: true, generic: true, manual: false },
  { feature: "Team Collaboration", reachAI: true, generic: true, manual: false },
]

export function ComparisonSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-5xl mb-4">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">ReachAI?</span>
          </h2>
          <p className="text-lg text-muted-foreground text-balance">
            See how ReachAI compares to traditional cold email methods.
          </p>
        </motion.div>

        <div className="overflow-x-auto">
          <div className="min-w-full">
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-1" />
              {["ReachAI", "Generic Tools", "Manual Outreach"].map((tool, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className={`text-center font-semibold ${idx === 0 ? "text-primary" : "text-muted-foreground"}`}
                >
                  {tool}
                </motion.div>
              ))}
            </div>

            {comparisonData.map((row, rowIdx) => (
              <motion.div
                key={rowIdx}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ duration: 0.5, delay: rowIdx * 0.05 }}
                className="grid grid-cols-4 gap-4 py-4 border-b border-border/40 items-center"
              >
                <div className="font-medium text-sm">{row.feature}</div>
                <div className="flex justify-center">
                  {row.reachAI ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <X className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex justify-center">
                  {row.generic ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <X className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex justify-center">
                  {row.manual ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <X className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
