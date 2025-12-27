"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mail, Trash2, AlertCircle, CheckCircle2, Clock } from "lucide-react"

interface Account {
  id: string
  name: string
  email: string
  provider: string
  status: "active" | "error" | "warming"
}

interface Props {
  account: Account
  onDelete: (id: string) => void
}

export function EmailAccountCard({ account, onDelete }: Props) {
  const getStatusConfig = () => {
    switch (account.status) {
      case "active":
        return {
          icon: <CheckCircle2 className="h-4 w-4" />,
          label: "Active",
          variant: "default" as const,
          className: "bg-success/10 text-success border-success/20",
        }
      case "warming":
        return {
          icon: <Clock className="h-4 w-4" />,
          label: "Warming",
          variant: "secondary" as const,
          className: "bg-warning/10 text-warning-foreground border-warning/20",
        }
      case "error":
        return {
          icon: <AlertCircle className="h-4 w-4" />,
          label: "Error",
          variant: "destructive" as const,
          className: "bg-destructive/10 text-destructive border-destructive/20",
        }
    }
  }

  const statusConfig = getStatusConfig()

  return (
    <Card className="p-5 bg-white hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
            <Mail className="h-5 w-5 text-foreground" />
          </div>
          <div className="flex-1 min-w-0 space-y-2">
            <div>
              <h4 className="font-semibold text-foreground truncate">{account.name}</h4>
              <p className="text-sm text-muted-foreground truncate">{account.email}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="capitalize">
                {account.provider}
              </Badge>
              <Badge className={statusConfig.className}>
                {statusConfig.icon}
                <span className="ml-1.5">{statusConfig.label}</span>
              </Badge>
            </div>
          </div>
        </div>
        <Button
          onClick={() => onDelete(account.id)}
          variant="ghost"
          size="icon"
          className="shrink-0 text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  )
}
