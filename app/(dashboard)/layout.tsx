// import type React from "react"
// import { auth } from "@clerk/nextjs/server"
// import { redirect } from "next/navigation"
// import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
// import { DashboardHeader } from "@/components/dashboard/dashboard-header"
// import { syncUserToDatabase } from "@/lib/actions/auth"

// export default async function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   const { userId } = await auth()

//   if (!userId) {
//     redirect("/sign-in")
//   }

//   try {
//     await syncUserToDatabase(userId)
//   } catch (error) {
//     console.error("[v0] Failed to sync user to database:", error)
//     // Continue loading the dashboard even if sync fails
//   }

//   return (
//     <div className="flex min-h-screen">
//       <DashboardSidebar />
//       <div className="flex-1 flex flex-col">
//         <DashboardHeader />
//         <main className="flex-1 p-6 md:p-8 bg-muted/30">{children}</main>
//       </div>
//     </div>
//   )
// }

// import type React from "react"
// import { auth } from "@clerk/nextjs/server"
// import { redirect } from "next/navigation"
// import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
// import { DashboardHeader } from "@/components/dashboard/dashboard-header"
// import { syncUserToDatabase } from "@/lib/actions/auth"
// import { OnboardingTour } from "@/components/onboarding/onboarding-tour"

// export default async function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   const { userId } = await auth()

//   if (!userId) {
//     redirect("/sign-in")
//   }

//   try {
//     await syncUserToDatabase(userId)
//   } catch (error) {
//     console.error("[v0] Failed to sync user to database:", error)
//   }

//   return (
//     <div className="flex min-h-screen">
//       <DashboardSidebar />
//       <div className="flex-1 flex flex-col">
//         <DashboardHeader />
//         <main className="flex-1 p-6 md:p-8 bg-muted/30">{children}</main>
//       </div>
//       <OnboardingTour />
//     </div>
//   )
// }

// import type React from "react"
// import { auth } from "@clerk/nextjs/server"
// import { redirect } from "next/navigation"
// import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
// import { DashboardHeader } from "@/components/dashboard/dashboard-header"
// import { syncUserToDatabase } from "@/lib/actions/auth"
// import { OnboardingTour } from "@/components/onboarding/onboarding-tour"

// export default async function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   const { userId } = await auth()

//   if (!userId) {
//     redirect("/sign-in")
//   }

//   try {
//     await syncUserToDatabase(userId)
//   } catch (error) {
//     console.error("[v0] Failed to sync user to database:", error)
//   }

//   return (
//     <div className="flex min-h-screen">
//       <DashboardSidebar />
//       <div className="flex-1 flex flex-col w-full min-w-0">
//         <DashboardHeader />
//         <main className="flex-1 p-4 md:p-6 lg:p-8 bg-muted/30 overflow-x-hidden">{children}</main>
//       </div>
//       <OnboardingTour />
//     </div>
//   )
// }



// import type React from "react"
// import { auth } from "@clerk/nextjs/server"
// import { redirect } from "next/navigation"
// import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
// import { DashboardHeader } from "@/components/dashboard/dashboard-header"
// import { syncUserToDatabase } from "@/lib/actions/auth"
// import { OnboardingTour } from "@/components/onboarding/onboarding-tour"

// export default async function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   const { userId } = await auth()

//   if (!userId) {
//     redirect("/sign-in")
//   }

//   try {
//     await syncUserToDatabase(userId)
//   } catch (error) {
//     console.error("[v0] Failed to sync user to database:", error)
//   }

//   return (
//     <div className="flex min-h-screen bg-background">
//       <DashboardSidebar />
//       <div className="flex-1 flex flex-col w-full min-w-0">
//         <DashboardHeader />
//         <main className="flex-1 p-4 md:p-6 lg:p-8 bg-gradient-to-br from-muted/30 via-background to-muted/20 overflow-x-hidden">
//           <div className="max-w-[1600px] mx-auto w-full">{children}</div>
//         </main>
//       </div>
//       <OnboardingTour />
//     </div>
//   )
// }


// import type React from "react"
// import { auth } from "@clerk/nextjs/server"
// import { redirect } from "next/navigation"
// import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
// import { DashboardHeader } from "@/components/dashboard/dashboard-header"
// import { syncUserToDatabase } from "@/lib/actions/auth"
// import { OnboardingTour } from "@/components/onboarding/onboarding-tour"

// export default async function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   const { userId } = await auth()

//   if (!userId) {
//     redirect("/sign-in")
//   }

//   try {
//     await syncUserToDatabase(userId)
//   } catch (error) {
//     console.error("[v0] Failed to sync user to database:", error)
//   }

//   return (
//     <div className="flex h-screen overflow-hidden bg-background">
//       <DashboardSidebar />
//       <div className="flex-1 flex flex-col w-full min-w-0 overflow-hidden">
//         <DashboardHeader />
//         <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-gradient-to-br from-muted/30 via-background to-muted/20">
//           <div className="max-w-[1600px] mx-auto w-full">{children}</div>
//         </main>
//       </div>
//       <OnboardingTour />
//     </div>
//   )
// }

// import type React from "react"
// import { auth } from "@clerk/nextjs/server"
// import { redirect } from "next/navigation"
// import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
// import { DashboardHeader } from "@/components/dashboard/dashboard-header"
// import { syncUserToDatabase } from "@/lib/actions/auth"
// import { OnboardingTour } from "@/components/onboarding/onboarding-tour"

// export default async function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   const { userId } = await auth()

//   if (!userId) {
//     redirect("/sign-in")
//   }

//   try {
//     await syncUserToDatabase(userId)
//   } catch (error) {
//     console.error("[v0] Failed to sync user to database:", error)
//   }

//   return (
//     <div className="flex h-screen overflow-hidden bg-background">
//       <DashboardSidebar />
//       <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
//         <DashboardHeader />
//         <main className="flex-1 overflow-y-auto scrollbar-thin p-4 md:p-6 lg:p-8 bg-gradient-to-br from-muted/30 via-background to-muted/20">
//           <div className="max-w-[1600px] mx-auto w-full">{children}</div>
//         </main>
//       </div>
//       <OnboardingTour />
//     </div>
//   )
// }


// import type React from "react"
// import { auth } from "@clerk/nextjs/server"
// import { redirect } from "next/navigation"
// import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
// import { DashboardHeader } from "@/components/dashboard/dashboard-header"
// import { syncUserToDatabase } from "@/lib/actions/auth"
// import { OnboardingTour } from "@/components/onboarding/onboarding-tour"
// import { db } from "@/lib/db"

// export default async function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   const { userId } = await auth()

//   if (!userId) {
//     redirect("/sign-in")
//   }

//   try {
//     await syncUserToDatabase(userId)
//   } catch (error) {
//     console.error("[v0] Failed to sync user to database:", error)
//   }

//   // Check if user has completed onboarding questionnaire
//   try {
//     const user = await db.user.findUnique({
//       where: { clerkId: userId },
//       select: { onboardingCompletedQuestionnaire: true },
//     })

//     if (user && !user.onboardingCompletedQuestionnaire) {
//       redirect("/onboarding")
//     }
//   } catch (error) {
//     console.error("[v0] Failed to check onboarding status:", error)
//   }

//   return (
//     <div className="flex h-screen overflow-hidden bg-background">
//       <DashboardSidebar />
//       <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
//         <DashboardHeader />
//         <main className="flex-1 overflow-y-auto scrollbar-thin p-4 md:p-6 lg:p-8 bg-gradient-to-br from-muted/30 via-background to-muted/20">
//           <div className="max-w-[1600px] mx-auto w-full">{children}</div>
//         </main>
//       </div>
//       <OnboardingTour />
//     </div>
//   )
// }

// app/(dashboard)/layout.tsx

import type React from "react"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { syncUserToDatabase } from "@/lib/actions/auth"
import { OnboardingTour } from "@/components/onboarding/onboarding-tour"
import { db } from "@/lib/db"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  try {
    await syncUserToDatabase(userId)
  } catch (error) {
    console.error("[v0] Failed to sync user to database:", error)
  }

  // Check if user has completed onboarding questionnaire
  // JUST REMOVED try-catch - let redirect throw naturally
  const user = await db.user.findUnique({
    where: { clerkId: userId },
    select: { onboardingCompletedQuestionnaire: true },
  })

  if (user && !user.onboardingCompletedQuestionnaire) {
    redirect("/onboarding")
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto scrollbar-thin p-4 md:p-6 lg:p-8 bg-gradient-to-br from-muted/30 via-background to-muted/20">
          <div className="max-w-[1600px] mx-auto w-full">{children}</div>
        </main>
      </div>
      <OnboardingTour />
    </div>
  )
}