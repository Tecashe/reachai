
import { ProspectsPageClient } from "@/components/prospects/prospects-page-client"
import { getFolders, getTrashedCount } from "@/lib/actions/prospect-folders"
import { getUserSubscription } from "@/lib/actions/billing"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"

export default async function ProspectsPage() {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  // Fetch folders and trashed count
  const folders = await getFolders()
  const trashedCount = await getTrashedCount()

  // Fetch user subscription data
  let subscriptionTier = "FREE"
  let researchCredits = 0

  try {
    const user = await db.user.findUnique({
      where: { clerkId: userId },
      select: {
        subscriptionTier: true,
        researchCredits: true,
      },
    })

    if (user) {
      subscriptionTier = user.subscriptionTier
      researchCredits = user.researchCredits || 0
    }
  } catch (error) {
    console.error("Failed to fetch user subscription data:", error)
    // Continue with default values if fetch fails
  }

  return (
    <ProspectsPageClient
      initialFolders={folders}
      initialTrashedCount={trashedCount}
      subscriptionTier={subscriptionTier}
      researchCredits={researchCredits}
    />
  )
}