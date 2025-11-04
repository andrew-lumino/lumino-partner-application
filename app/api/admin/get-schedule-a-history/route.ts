import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { auth } from "@clerk/nextjs/server"

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const applicationId = searchParams.get("applicationId")

    if (!applicationId) {
      return NextResponse.json({ error: "Missing applicationId parameter" }, { status: 400 })
    }

    const supabase = createClient()

    // Fetch all versions for this application, ordered by effective date (newest first)
    const { data, error } = await supabase
      .from("agent_schedule_a_versions")
      .select("*")
      .eq("application_id", applicationId)
      .order("effective_date", { ascending: false })

    if (error) {
      console.error("Error fetching schedule history:", error)
      return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 })
    }

    return NextResponse.json({ versions: data || [] })
  } catch (error) {
    console.error("Error in get-schedule-a-history:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
