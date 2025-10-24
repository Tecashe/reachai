import { Suspense } from "react"
import { InvitationAcceptance } from "@/components/team/invitation-acceptance"

export default function InvitePage({ params }: { params: { token: string } }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <InvitationAcceptance token={params.token} />
      </Suspense>
    </div>
  )
}
