import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { auth } from "@clerk/nextjs/server"

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { applicationId, scheduleAData, effectiveDate, notes, createdBy } = body

    if (!applicationId || !scheduleAData || !createdBy) {
      return NextResponse.json(
        { error: "Missing required fields: applicationId, scheduleAData, createdBy" },
        { status: 400 },
      )
    }

    const supabase = createClient()

    // Deactivate all previous versions for this application
    await supabase.from("agent_schedule_a_versions").update({ is_active: false }).eq("application_id", applicationId)

    // Insert new version
    const { data: versionData, error: versionError } = await supabase
      .from("agent_schedule_a_versions")
      .insert({
        application_id: applicationId,
        schedule_a_data: scheduleAData,
        effective_date: effectiveDate || new Date().toISOString().split("T")[0],
        created_by: createdBy,
        notes: notes || null,
        is_active: true,
      })
      .select()
      .single()

    if (versionError) {
      console.error("Error creating version:", versionError)
      return NextResponse.json({ error: "Failed to create version history" }, { status: 500 })
    }

    // Update the partner_applications table with the new custom_schedule_a
    const { error: updateError } = await supabase
      .from("partner_applications")
      .update({ custom_schedule_a: scheduleAData })
      .eq("id", applicationId)

    if (updateError) {
      console.error("Error updating application:", updateError)
      return NextResponse.json({ error: "Failed to update application" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      version: versionData,
      message: "Schedule A updated successfully",
    })
  } catch (error) {
    console.error("Error in update-agent-schedule-a:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
