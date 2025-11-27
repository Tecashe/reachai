"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { recheckDomainHealth } from "@/lib/actions/deliverability"
import { useToast } from "@/hooks/use-toast"

interface RecheckButtonProps {
  domainId: string
}

export function RecheckButton({ domainId }: RecheckButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleRecheck = async () => {
    setIsLoading(true)
    try {
      const result = await recheckDomainHealth(domainId)

      if (result.success) {
        toast({
          title: "Health check complete",
          description: result.health?.blacklisted
            ? `Domain is blacklisted on ${result.health.blacklists?.length || 0} list(s)`
            : `Health score: ${result.health?.score || 0}/100`,
        })
      } else {
        toast({
          title: "Check failed",
          description: result.error || "Failed to recheck domain health",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to recheck domain health",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleRecheck} disabled={isLoading}>
      <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
      {isLoading ? "Checking..." : "Re-check"}
    </Button>
  )
}
