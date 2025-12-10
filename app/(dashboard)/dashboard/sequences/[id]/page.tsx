// import { Suspense } from "react"
// import { notFound } from "next/navigation"
// import { SequenceBuilderContent } from "@/components/sequences/builder/sequence-builder-content"
// import { SequenceBuilderSkeleton } from "@/components/sequences/builder/sequence-builder-skeleton"
// import { getSequenceById } from "@/lib/actions/sequence-actions"
// import { getCurrentUser } from "@/lib/auth"

// export const metadata = {
//   title: "Sequence Builder | Cold Email SaaS",
//   description: "Build and edit your email sequence",
// }

// interface SequenceBuilderPageProps {
//   params: Promise<{ id: string }>
// }

// async function SequenceBuilderLoader({ sequenceId }: { sequenceId: string }) {
//   const user = await getCurrentUser()
//   const userId = user.id

//   const sequence = await getSequenceById(sequenceId, userId)

//   if (!sequence) {
//     notFound()
//   }

//   return <SequenceBuilderContent initialSequence={sequence} userId={userId} />
// }

// export default async function SequenceBuilderPage({ params }: SequenceBuilderPageProps) {
//   const { id } = await params

//   // Handle new sequence creation
//   if (id === "new") {
//     const user = await getCurrentUser()
//     return (
//       <Suspense fallback={<SequenceBuilderSkeleton />}>
//         <SequenceBuilderContent isNew userId={user.id} />
//       </Suspense>
//     )
//   }

//   return (
//     <Suspense fallback={<SequenceBuilderSkeleton />}>
//       <SequenceBuilderLoader sequenceId={id} />
//     </Suspense>
//   )
// }

import { Suspense } from "react"
import { notFound } from "next/navigation"
import { SequenceBuilderContent } from "@/components/sequences/builder/sequence-builder-content"
import { SequenceBuilderSkeleton } from "@/components/sequences/builder/sequence-builder-skeleton"
import { getSequenceById } from "@/lib/actions/sequence-actions"
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
  const sequence = await getSequenceById(sequenceId, userId)
  console.log("[v0] SequenceBuilderLoader - Sequence found:", sequence?.id, sequence?.name)

  if (!sequence) {
    console.log("[v0] SequenceBuilderLoader - Sequence not found for id:", sequenceId, "userId:", userId)
    notFound()
  }

  return <SequenceBuilderContent initialSequence={sequence} userId={userId} />
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
