"use client"

import { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, CheckCircle2, XCircle } from "lucide-react"
import { WaveLoader } from "../loader/wave-loader"

interface ProgressToastProps {
  title: string
  current: number
  total: number
  status?: "loading" | "success" | "error"
  message?: string
}

export function ProgressToast({ title, current, total, status = "loading", message }: ProgressToastProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    setProgress((current / total) * 100)
  }, [current, total])

  return (
    <Card className="w-full max-w-md">
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          {status === "loading" && <WaveLoader size="sm" bars={8} gap="tight" />}
          {status === "success" && <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />}
          {status === "error" && <XCircle className="h-5 w-5 text-destructive mt-0.5" />}

          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <p className="font-medium">{title}</p>
              <span className="text-sm text-muted-foreground">
                {current}/{total}
              </span>
            </div>

            <Progress value={progress} className="h-2" />

            {message && <p className="text-sm text-muted-foreground">{message}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
