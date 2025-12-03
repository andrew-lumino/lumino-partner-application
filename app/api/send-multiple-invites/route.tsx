import { NextResponse } from "next/server"
import { Resend } from "resend"
import { createClient } from "@/lib/supabase/server"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const { emails, agent, custom_schedule_a, custom_message, custom_code_of_conduct, custom_terms } = await req.json()
    const supabase = await createClient()

    // Use the correct base URL for the application
    const baseUrl = "https://partner.golumino.com"

    // Create individual invite records for each email
    const invitePromises = emails.map(async (email: string) => {
      // Create invite record
      const { data, error } = await supabase
        .from("partner_applications")
        .insert({
          agent,
          status: "invited",
          partner_email: email,
          custom_schedule_a: custom_schedule_a || null,
          custom_message: custom_message || null,
          custom_code_of_conduct: custom_code_of_conduct || null,
          created_at: new Date().toISOString(),
        })
        .select("id")
        .single()

      if (error) throw error

      const inviteLink = `${baseUrl}?id=${data.id}`

      // Send email
      await resend.emails.send({
        from: "Lumino <no-reply@golumino.com>",
        to: [email],
        subject: "You're Invited to Join the Lumino Partner Program",
        html: `
          <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #1a1a1a; font-size: 28px;">LUMINO</h1>
              <p style="color: #666; font-size: 14px;">Payments with Purpose</p>
            </div>
            
            <h2 style="color: #1a1a1a;">You're Invited to Join Our Partner Program!</h2>
            
            <p>Hello,</p>
            
            <p>You've been personally invited by <strong>${agent}</strong> to join the Lumino Partner Program. We're excited to potentially welcome you to our growing network of partners who are transforming the payments industry.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${inviteLink}" style="background-color: #007bff; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                Complete Your Application
              </a>
            </div>
            
            <p>This personalized link will connect your application directly with ${agent}, ensuring you receive dedicated support throughout the process.</p>
            
            <p><strong>What makes Lumino different:</strong></p>
            <ul>
              <li>Residual revenue sharing</li>
              <li>Next-generation dual-pricing gateway</li>
              <li>Built-in rewards engine for customer loyalty</li>
              <li>Transparent, partner-first economics</li>
              <li>AI-driven automation and streamlined operations</li>
            </ul>
            
            <p>If you have any questions, feel free to reach out or contact our <a href="mailto:support@golumino.com">partner team</a>.</p>
            
            <p>We look forward to partnering with you!</p>
            
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 12px;">
              <p>Lumino Technologies<br>
              4201 Main St Suite 201, Houston, TX 77002<br>
              1-866-488-4168 | www.golumino.com</p>
            </div>
          </div>
        `,
      })

      return data.id
    })

    const results = await Promise.all(invitePromises)

    return NextResponse.json({
      success: true,
      message: `Successfully sent ${emails.length} invites!`,
      inviteIds: results,
    })
  } catch (error) {
    console.error("Error sending multiple invites:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to send invites",
        message: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    )
  }
}
