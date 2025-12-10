import { Suspense } from "react"
import { SequencesPageContent } from "@/components/sequences/sequences-page-content"
import { SequencesPageSkeleton } from "@/components/sequences/sequences-page-skeleton"
import { getSequences, getAllTags } from "@/lib/actions/sequence-actions"
import { getCurrentUser } from "@/lib/auth"

export const metadata = {
  title: "Sequences | Cold Email SaaS",
  description: "Create and manage your email sequences",
}

async function SequencesDataLoader() {
  const user = await getCurrentUser()
  const userId = user.id

  const [sequences, allTags] = await Promise.all([getSequences(userId), getAllTags(userId)])

  return <SequencesPageContent initialSequences={sequences} allTags={allTags} userId={userId} />
}
//hjbd
export default function SequencesPage() {
  return (
    <Suspense fallback={<SequencesPageSkeleton />}>
      <SequencesDataLoader />
    </Suspense>
  )
}
