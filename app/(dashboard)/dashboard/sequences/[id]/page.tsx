
import { Suspense } from "react"
import { notFound } from "next/navigation"
import { SequenceBuilderContent } from "@/components/sequences/builder/sequence-builder-content"
import { SequenceBuilderSkeleton } from "@/components/sequences/builder/sequence-builder-skeleton"
import { getSequenceById } from "@/lib/actions/sequence-actions"
import { getAvailableResearchVariables } from "@/lib/actions/campaign-sequence-actions"
import { getCurrentUser } from "@/lib/auth"

export const metadata = {
  title: "Sequence Builder | Cold Email SaaS",
  description: "Build and edit your email sequence",
}

interface SequenceBuilderPageProps {
  params: Promise<{ id: string }>
}

async function SequenceBuilderLoader({ sequenceId }: { sequenceId: string }) {
  console.log("[v0] SequenceBuilderLoader - Loading sequence:", sequenceId)

  const user = await getCurrentUser()
  console.log("[v0] SequenceBuilderLoader - User:", user?.id)

  if (!user) {
    console.log("[v0] SequenceBuilderLoader - No user found, calling notFound()")
    notFound()
  }

  const userId = user.id

  // Fetch sequence and research data in parallel
  const [sequence, researchInfo] = await Promise.all([
    getSequenceById(sequenceId, userId),
    getAvailableResearchVariables(userId, sequenceId),
  ])

  console.log("[v0] SequenceBuilderLoader - Sequence found:", sequence?.id, sequence?.name)
  console.log("[v0] SequenceBuilderLoader - Research data available:", researchInfo.hasResearchData)

  if (!sequence) {
    console.log("[v0] SequenceBuilderLoader - Sequence not found for id:", sequenceId, "userId:", userId)
    notFound()
  }

  return (
    <SequenceBuilderContent
      initialSequence={sequence}
      userId={userId}
      campaignResearchInfo={researchInfo}
    />
  )
}

export default async function SequenceBuilderPage({ params }: SequenceBuilderPageProps) {
  const { id } = await params
  console.log("[v0] SequenceBuilderPage - Rendering for id:", id)

  // Handle new sequence creation
  if (id === "new") {
    const user = await getCurrentUser()
    console.log("[v0] SequenceBuilderPage - New sequence, user:", user?.id)

    if (!user) {
      notFound()
    }

    return (
      <Suspense fallback={<SequenceBuilderSkeleton />}>
        <SequenceBuilderContent isNew userId={user.id} />
      </Suspense>
    )
  }

  return (
    <Suspense fallback={<SequenceBuilderSkeleton />}>
      <SequenceBuilderLoader sequenceId={id} />
    </Suspense>
  )
}
