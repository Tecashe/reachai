// import { NextRequest, NextResponse } from 'next/server'
// import { auth } from '@clerk/nextjs/server'
// import { db } from '@/lib/db'

// export async function GET(request: NextRequest) {
//   try {
//     const { userId } = await auth()
//     if (!userId) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
//     }

//     // Fetch all connected integrations
//     const integrations = await db.integration.findMany({
//       where: {
//         userId,
//         status: 'active',
//         disconnectedAt: null,
//       },
//     })
//     //
//     // Extract provider names for response
//     const connectedProviders = integrations.map(i => i.provider)

//     return NextResponse.json({
//       success: true,
//       connectedProviders,
//       total: integrations.length,
//     })
//   } catch (error) {
//     console.error('[v0] Error fetching integrations:', error)
//     return NextResponse.json(
//       { error: error instanceof Error ? error.message : 'Unknown error' },
//       { status: 500 },
//     )
//   }
// }
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch all connected integrations
    const integrations = await db.integration.findMany({
      where: {
        userId,
        isActive: true,
      },
    })

    // Extract provider types (field is 'type', not 'provider')
    const connectedProviders = integrations.map(i => i.type)

    return NextResponse.json({
      success: true,
      connectedProviders,
      total: integrations.length,
    })
  } catch (error) {
    console.error('[OAuth] Error fetching integrations:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    )
  }
}