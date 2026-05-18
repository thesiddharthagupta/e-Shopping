import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

// The storefront public/uploads directory (relative to monorepo root)
const UPLOAD_DIR = path.join(process.cwd(), "..", "storefront", "public", "uploads")

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]
const MAX_SIZE_MB = 5

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll("files") as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ success: false, error: "No files received." }, { status: 400 })
    }

    // Ensure upload directory exists
    await mkdir(UPLOAD_DIR, { recursive: true })

    const uploadedPaths: string[] = []

    for (const file of files) {
      // Validate type
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { success: false, error: `Invalid file type: ${file.type}. Accepted: JPG, PNG, WebP, GIF.` },
          { status: 400 }
        )
      }

      // Validate size
      const sizeInMB = file.size / (1024 * 1024)
      if (sizeInMB > MAX_SIZE_MB) {
        return NextResponse.json(
          { success: false, error: `File too large: ${sizeInMB.toFixed(1)}MB. Max size is ${MAX_SIZE_MB}MB.` },
          { status: 400 }
        )
      }

      // Generate unique filename: timestamp + random + original extension
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg"
      const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
      const filePath = path.join(UPLOAD_DIR, uniqueName)

      // Write to disk
      const buffer = Buffer.from(await file.arrayBuffer())
      await writeFile(filePath, buffer)

      // Return the public URL path (served by storefront)
      uploadedPaths.push(`/uploads/${uniqueName}`)
    }

    return NextResponse.json({ success: true, paths: uploadedPaths })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ success: false, error: "Server error during upload." }, { status: 500 })
  }
}
