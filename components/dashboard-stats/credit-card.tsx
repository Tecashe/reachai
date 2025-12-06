"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditCardIcon, ArrowRight } from "lucide-react"
import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import { motion } from "framer-motion"

interface CreditCardProps {
  title: string
  value: number
  icon: LucideIcon
  href: string
  description: string
}

export function CreditCard({ title, value, icon: Icon, href, description }: CreditCardProps) {
  const isLow = value < 100

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
    >
      <Card className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-xl shadow-lg shadow-foreground/[0.03] hover:shadow-xl transition-all duration-300">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 1px)`,
              backgroundSize: "24px 24px",
            }}
          />
        </div>

        <CardContent className="flex items-center justify-between p-6 relative">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="p-3.5 rounded-2xl bg-foreground/5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] group-hover:bg-foreground/10 transition-all duration-300">
                <Icon className="h-5 w-5 text-foreground/70" />
              </div>
              {isLow && <div className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full animate-pulse" />}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{title}</p>
              <p className="text-2xl font-bold text-foreground tracking-tight">{value.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground/70 mt-0.5">{description}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            asChild
            className="relative overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 bg-transparent border-foreground/10 hover:border-foreground/20 group/btn"
          >
            <Link href={href}>
              <CreditCardIcon className="h-4 w-4 mr-2 text-foreground/60" />
              <span>Buy More</span>
              <ArrowRight className="h-3 w-3 ml-1 opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all duration-300" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}
