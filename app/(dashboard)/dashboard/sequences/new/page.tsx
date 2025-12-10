import { redirect } from "next/navigation"
import { getCurrentUserFromDb } from "@/lib/auth"
import { SequenceBuilderContent } from "@/components/sequences/builder/sequence-builder-content"

export default async function NewSequencePage() {
  const user = await getCurrentUserFromDb()

  if (!user) {
    redirect("/sign-in")
  }

  return <SequenceBuilderContent isNew userId={user.id} />
}
