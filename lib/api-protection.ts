// import { auth } from "@clerk/nextjs/server"
// import { NextResponse } from "next/server"
// import { db } from "@/lib/db"

// export async function protectApiRoute() {
//   const { userId } = await auth()

//   if (!userId) {
//     return {
//       error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
//       userId: null,
//       user: null,
//     }
//   }

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//     include: {
//       subscription: true,
//     },
//   })

//   if (!user) {
//     return {
//       error: NextResponse.json({ error: "User not found" }, { status: 404 }),
//       userId,
//       user: null,
//     }
//   }

//   return {
//     error: null,
//     userId,
//     user,
//   }
// }

// export async function checkCredits(
//   user: { emailCredits: number; researchCredits: number },
//   type: "email" | "research",
// ) {
//   if (type === "email" && user.emailCredits <= 0) {
//     return {
//       hasCredits: false,
//       error: NextResponse.json({ error: "Insufficient email credits" }, { status: 403 }),
//     }
//   }

//   if (type === "research" && user.researchCredits <= 0) {
//     return {
//       hasCredits: false,
//       error: NextResponse.json({ error: "Insufficient research credits" }, { status: 403 }),
//     }
//   }

//   return {
//     hasCredits: true,
//     error: null,
//   }
// }


import { auth } from "@clerk/nextjs/server"
import { NextResponse, type NextRequest } from "next/server"
import { db } from "@/lib/db"

export async function protectApiRoute() {
  const { userId } = await auth()

  if (!userId) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      userId: null,
      user: null,
    }
  }

  const user = await db.user.findUnique({
    where: { clerkId: userId },
    include: {
      subscription: true,
    },
  })

  if (!user) {
    return {
      error: NextResponse.json({ error: "User not found" }, { status: 404 }),
      userId,
      user: null,
    }
  }

  return {
    error: null,
    userId,
    user,
  }
}

export async function checkCredits(
  user: { emailCredits: number; researchCredits: number },
  type: "email" | "research",
) {
  if (type === "email" && user.emailCredits <= 0) {
    return {
      hasCredits: false,
      error: NextResponse.json({ error: "Insufficient email credits" }, { status: 403 }),
    }
  }

  if (type === "research" && user.researchCredits <= 0) {
    return {
      hasCredits: false,
      error: NextResponse.json({ error: "Insufficient research credits" }, { status: 403 }),
    }
  }

  return {
    hasCredits: true,
    error: null,
  }
}

export async function withAuth(
  request: NextRequest,
  handler: (userId: string, user: any) => Promise<NextResponse>,
): Promise<NextResponse> {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await db.user.findUnique({
    where: { clerkId: userId },
    include: {
      subscription: true,
    },
  })

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  return handler(userId, user)
}
