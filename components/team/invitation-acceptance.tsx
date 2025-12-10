"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, Loader2, Users } from "lucide-react"
import { acceptInvitation, declineInvitation } from "@/lib/actions/team"
import { useAuth } from "@clerk/nextjs"
import { WaveLoader } from "../loader/wave-loader"

interface InvitationAcceptanceProps {
  token: string
}

export function InvitationAcceptance({ token }: InvitationAcceptanceProps) {
  const router = useRouter()
  const { isSignedIn } = useAuth()
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "accepting" | "declining" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const [workspaceInfo, setWorkspaceInfo] = useState<{ workspaceName: string; role: string } | null>(null)

  const handleAccept = async () => {
    if (!isSignedIn) {
      // Redirect to sign in with return URL
      router.push(`/sign-in?redirect_url=/invite/${token}`)
      return
    }

    setLoading(true)
    setStatus("accepting")

    const result = await acceptInvitation(token)

    if (result.success) {
      setStatus("success")
      setMessage("Invitation accepted successfully!")
      setWorkspaceInfo({
        workspaceName: "the workspace",
        role:"MEMBER",
      })

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } else {
      setStatus("error")
      setMessage(result.error || "Failed to accept invitation")
    }

    setLoading(false)
  }

  const handleDecline = async () => {
    setLoading(true)
    setStatus("declining")

    const result = await declineInvitation(token)

    if (result.success) {
      setMessage("Invitation declined")
      setTimeout(() => {
        router.push("/")
      }, 2000)
    } else {
      setStatus("error")
      setMessage(result.error || "Failed to decline invitation")
    }

    setLoading(false)
  }

  if (status === "success") {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
            <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl">Welcome to {workspaceInfo?.workspaceName}!</CardTitle>
          <CardDescription>You've successfully joined as a {workspaceInfo?.role}</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground mb-4">Redirecting you to the dashboard...</p>
          {/* <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" /> */}
          <WaveLoader size="sm" bars={8} gap="tight" />
        </CardContent>
      </Card>
    )
  }

  if (status === "error") {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
            <XCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-2xl">Invitation Error</CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button onClick={() => router.push("/")} variant="outline">
            Go to Homepage
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Users className="h-10 w-10 text-primary" />
        </div>
        <CardTitle className="text-2xl">Team Invitation</CardTitle>
        <CardDescription>You've been invited to join a mailfra workspace</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isSignedIn && (
          <div className="rounded-lg bg-muted p-4 text-sm">
            <p className="font-medium mb-2">Sign in required</p>
            <p className="text-muted-foreground">You need to sign in or create an account to accept this invitation.</p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Button onClick={handleAccept} disabled={loading} size="lg" className="w-full">
            {loading && status === "accepting" ? (
              <>
                <WaveLoader size="sm" bars={8} gap="tight" />
                Accepting...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                {isSignedIn ? "Accept Invitation" : "Sign In & Accept"}
              </>
            )}
          </Button>

          <Button
            onClick={handleDecline}
            disabled={loading}
            variant="outline"
            size="lg"
            className="w-full bg-transparent"
          >
            {loading && status === "declining" ? (
              <>
                <WaveLoader size="sm" bars={8} gap="tight" />
                Declining...
              </>
            ) : (
              <>
                <XCircle className="mr-2 h-4 w-4" />
                Decline Invitation
              </>
            )}
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          By accepting, you agree to mailfra's Terms of Service and Privacy Policy
        </p>
      </CardContent>
    </Card>
  )
}
