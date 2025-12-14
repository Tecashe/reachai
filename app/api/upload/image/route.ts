import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { auth } from "@clerk/nextjs/server"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 })
    }

    // Most images will be under 100KB after compression, but allow buffer for edge cases
    if (file.size > 500 * 1024) {
      return NextResponse.json(
        { error: "Compressed image still exceeds 500KB. Please use a smaller image." },
        { status: 400 },
      )
    }

    // Upload to Vercel Blob
    const blob = await put(file.name, file, {
      access: "public",
      addRandomSuffix: true,
    })

    return NextResponse.json({
      url: blob.url,
      filename: file.name,
      size: file.size,
      uploadedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Image upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
