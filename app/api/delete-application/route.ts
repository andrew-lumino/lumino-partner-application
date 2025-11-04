// /app/api/delete-application/route.ts
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function DELETE(req: Request) {
  const { id } = await req.json()
  const supabase = createClient()

  try {
    // First, get the application data before deleting
    const { data: application, error: fetchError } = await supabase
      .from("partner_applications")
      .select("*")
      .eq("id", id)
      .single()

    if (fetchError) {
      console.error("Failed to fetch application:", fetchError)
      return NextResponse.json({ success: false, error: fetchError.message }, { status: 500 })
    }

    if (!application) {
      return NextResponse.json({ success: false, error: "Application not found" }, { status: 404 })
    }

    // Delete from Supabase first
    const { error: deleteError } = await supabase
      .from("partner_applications")
      .delete()
      .eq("id", id)

    if (deleteError) {
      console.error("Failed to delete from Supabase:", deleteError)
      return NextResponse.json({ success: false, error: deleteError.message }, { status: 500 })
    }

    // Send delete request to the NEW webhook (replace with the actual URL he gives you)
    try {
      await fetch("https://hooks.zapier.com/hooks/catch/5609223/uu7tsjx/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Send the unique identifiers for Zapier to search by
          partnerName: application.partner_full_name,
          partnerEmail: application.partner_email,
          partnerPhone: application.partner_phone,
        }),
      })
      console.log("Zapier delete request sent to new webhook")
    } catch (zapierError) {
      console.error("Zapier notification failed:", zapierError)
      // Don't fail the whole request if Zapier fails - Supabase deletion succeeded
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unexpected error occurred" 
    }, { status: 500 })
  }
}
