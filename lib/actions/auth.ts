// "use server"

// import { clerkClient } from "@clerk/nextjs/server"
// import { db } from "@/lib/db"

// export async function syncUserToDatabase(userId: string) {
//   try {
//     const client = await clerkClient()
//     const clerkUser = await client.users.getUser(userId)

//     // Check if user exists in database
//     const existingUser = await db.user.findUnique({
//       where: { clerkId: userId },
//     })

//     if (!existingUser) {
//       // Create new user in database
//       await db.user.create({
//         data: {
//           clerkId: userId,
//           email: clerkUser.emailAddresses[0]?.emailAddress || "",
//           name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || "User",
//           subscriptionTier: "FREE",
//           subscriptionStatus: "ACTIVE",
//           emailCredits: 100, // Free tier credits
//           researchCredits: 50,
//         },
//       })
//     }

//     return { success: true }
//   } catch (error) {
//     console.error("Error syncing user to database:", error)
//     return { success: false, error: "Failed to sync user" }
//   }
// }

// export async function getCurrentUser(userId: string) {
//   try {
//     const user = await db.user.findUnique({
//       where: { clerkId: userId },
//       include: {
//         subscription: true,
//       },
//     })

//     return user
//   } catch (error) {
//     console.error("Error getting current user:", error)
//     return null
//   }
// }

"use server"

import { clerkClient } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

export async function syncUserToDatabase(userId: string) {
  try {
    // Check if user exists in database first
    const existingUser = await db.user.findUnique({
      where: { clerkId: userId },
    })

    if (existingUser) {
      return { success: true, user: existingUser }
    }

    // User doesn't exist, create them
    const client = await clerkClient()
    const clerkUser = await client.users.getUser(userId)

    const newUser = await db.user.create({
      data: {
        clerkId: userId,
        email: clerkUser.emailAddresses[0]?.emailAddress || "",
        name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || "User",
        subscriptionTier: "FREE",
        subscriptionStatus: "ACTIVE",
        emailCredits: 100,
        researchCredits: 50,
      },
    })

    return { success: true, user: newUser }
  } catch (error) {
    console.error("[v0] Error syncing user to database:", error)
    return { success: false, error: "Failed to sync user" }
  }
}

export async function getCurrentUser(userId: string) {
  try {
    const user = await db.user.findUnique({
      where: { clerkId: userId },
      include: {
        subscription: true,
      },
    })

    return user
  } catch (error) {
    console.error("[v0] Error getting current user:", error)
    return null
  }
}