"use client"

import { Card } from "@/components/ui/card"
import { Mail, ArrowRight } from "lucide-react"

interface Props {
  title: string
  description: string
  icon: "gmail" | "outlook" | "smtp"
  onClick: () => void
}

export function ConnectionMethodCard({ title, description, icon, onClick }: Props) {
  const getIcon = () => {
    // Using Mail icon for all, you can add custom icons later
    return <Mail className="h-6 w-6 text-foreground" />
  }

  return (
    <Card
      onClick={onClick}
      className="p-6 bg-white cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 group"
    >
      <div className="space-y-4">
        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">{getIcon()}</div>
        <div className="space-y-2">
          <h4 className="font-semibold text-foreground text-lg">{title}</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-foreground group-hover:gap-3 transition-all">
          <span>Get started</span>
          <ArrowRight className="h-4 w-4" />
        </div>
      </div>
    </Card>
  )
}
