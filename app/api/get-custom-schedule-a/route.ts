import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing invite ID",
          message: "Invite ID is required",
        },
        { status: 400 },
      )
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from("partner_applications")
      .select("custom_schedule_a, custom_message, custom_code_of_conduct, custom_terms, agent")
      .eq("id", id)
      .single()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json(
        {
          success: false,
          error: "Database error",
          message: error.message || "Failed to fetch data",
        },
        { status: 500 },
      )
    }

    // Parse JSON if it's a string (handles double-encoded JSON)
    let scheduleA = data?.custom_schedule_a
    let message = data?.custom_message
    let codeOfConduct = data?.custom_code_of_conduct
    let terms = data?.custom_terms

    // Handle double-encoded JSON for custom_schedule_a
    if (scheduleA && typeof scheduleA === "string") {
      try {
        scheduleA = JSON.parse(scheduleA)
        // Check if it's still a string (double-encoded)
        if (typeof scheduleA === "string") {
          scheduleA = JSON.parse(scheduleA)
        }
      } catch (e) {
        console.error("Error parsing custom_schedule_a:", e)
        scheduleA = null
      }
    }

    // Handle double-encoded JSON for custom_message
    if (message && typeof message === "string") {
      try {
        message = JSON.parse(message)
        // Check if it's still a string (double-encoded)
        if (typeof message === "string") {
          message = JSON.parse(message)
        }
      } catch (e) {
        console.error("Error parsing custom_message:", e)
        message = null
      }
    }

    if (codeOfConduct && typeof codeOfConduct === "string") {
      try {
        codeOfConduct = JSON.parse(codeOfConduct)
        // Check if it's still a string (double-encoded)
        if (typeof codeOfConduct === "string") {
          codeOfConduct = JSON.parse(codeOfConduct)
        }
      } catch (e) {
        console.error("Error parsing custom_code_of_conduct:", e)
        codeOfConduct = null
      }
    }

    // Handle double-encoded JSON for custom_terms
    if (terms && typeof terms === "string") {
      try {
        terms = JSON.parse(terms)
        if (typeof terms === "string") {
          terms = JSON.parse(terms)
        }
      } catch (e) {
        console.error("Error parsing custom_terms:", e)
        terms = null
      }
    }

    return NextResponse.json({
      success: true,
      custom_schedule_a: scheduleA,
      custom_message: message,
      custom_code_of_conduct: codeOfConduct,
      custom_terms: terms,
      agent: data?.agent,
    })
  } catch (error) {
    console.error("Error in get-custom-schedule-a endpoint:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    )
  }
}
