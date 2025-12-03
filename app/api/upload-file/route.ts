import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

/**
 * Upload a file to the "partner-uploads" Supabase bucket.
 * Cleans filenames, enforces 10MB limit, and returns a public URL.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { fileContent, filename, contentType, email } = body as {
      fileContent: string
      filename: string
      contentType: string
      email?: string
    }

    if (!fileContent || !filename || !contentType) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Convert base64 → buffer
    const base64Data = fileContent.includes(",") ? fileContent.split(",")[1] : fileContent
    const fileBuffer = Buffer.from(base64Data, "base64")

    // Enforce 10MB size limit
    const MAX_SIZE = 10 * 1024 * 1024
    if (fileBuffer.length > MAX_SIZE) {
      return NextResponse.json({ success: false, error: "File size exceeds 10MB limit" }, { status: 400 })
    }

    const supabase = await createClient()

    // 🔒 Sanitize and normalize filename
    const emailSafe = (email ?? "unknown").replace(/[^a-zA-Z0-9_-]/g, "_")
    const cleanName = filename
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_.-]/g, "") // keep only safe chars
      .replace(/_+/g, "_") // collapse duplicate underscores

    const timestamp = Date.now()
    const objectKey = `${emailSafe}/${timestamp}_${cleanName}`

    // Upload to Supabase
    const { error: uploadError } = await supabase.storage.from("partner-uploads").upload(objectKey, fileBuffer, {
      contentType,
      upsert: false,
    })

    if (uploadError) {
      console.error("Supabase upload error:", uploadError)
      return NextResponse.json({ success: false, error: uploadError.message }, { status: 500 })
    }

    // Get public URL
    const { data } = supabase.storage.from("partner-uploads").getPublicUrl(objectKey)

    return NextResponse.json({
      success: true,
      url: data.publicUrl,
      filename: objectKey,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Upload failed",
      },
      { status: 500 },
    )
  }
}
