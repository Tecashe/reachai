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
    return <Mail className="h-5 w-5 text-foreground" />
  }

  return (
    <Card
      onClick={onClick}
      className="p-5 bg-card border-border/50 cursor-pointer transition-all duration-200 hover:border-border hover:shadow-sm hover:-translate-y-0.5 group"
    >
      <div className="space-y-3">
        <div className="w-10 h-10 rounded-md bg-muted/50 flex items-center justify-center">{getIcon()}</div>
        <div className="space-y-1">
          <h4 className="font-semibold text-sm text-foreground">{title}</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-medium text-foreground group-hover:gap-2 transition-all pt-1">
          <span>Get started</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </div>
      </div>
    </Card>
  )
}
