import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url")
  const filename = req.nextUrl.searchParams.get("filename") || "download"

  if (!url) {
    return new NextResponse("Missing file URL", { status: 400 })
  }

  const res = await fetch(url)

  if (!res.ok) {
    return new NextResponse("Failed to fetch file", { status: 500 })
  }

  const blob = await res.blob()
  const buffer = Buffer.from(await blob.arrayBuffer())

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": res.headers.get("content-type") || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  })
}
