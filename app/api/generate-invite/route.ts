import { auth } from "@clerk/nextjs/server"
import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  try {
    console.log("=== Generate Invite API Called ===")

    const { userId } = await auth()
    console.log("User ID from Clerk:", userId)

    if (!userId) {
      console.log("No userId found - returning 401")
      return NextResponse.json(
        { success: false, error: "Unauthorized", message: "Authentication required" },
        { status: 401 },
      )
    }

    const body = await req.json()
    console.log("Request body:", body)

    const { agentName, agentEmail, customScheduleA, customMessage, custom_code_of_conduct } = body

    const finalAgentName = agentName?.trim() || "Unknown Agent"
    const finalAgentEmail = agentEmail?.trim() || "no-email@example.com"

    const supabase = createClient()
    console.log("Supabase client created")

    const { data, error } = await supabase
      .from("partner_invites")
      .insert({
        agent_name: finalAgentName,
        agent_email: finalAgentEmail,
        custom_schedule_a: customScheduleA || null,
        custom_message: customMessage || null,
        custom_code_of_conduct: custom_code_of_conduct || null,
        created_by: userId,
      })
      .select()
      .single()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ success: false, error: "Database error", message: error.message }, { status: 500 })
    }

    console.log("Invite created successfully:", data)

    return NextResponse.json({
      success: true,
      inviteId: data.id,
      message: "Invite created successfully",
    })
  } catch (error) {
    console.error("Unexpected error in generate-invite:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
