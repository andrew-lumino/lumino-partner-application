import { NextResponse } from "next/server"
import { Resend } from "resend"
import { auth } from "@clerk/nextjs/server"

const resend = new Resend(process.env.RESEND_API_KEY)

// Security: Validate email format
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 254
}

// Security: Sanitize string inputs
const sanitizeString = (input: any): string => {
  if (typeof input !== "string") return ""
  return input.trim().substring(0, 200)
}

export async function POST(req: Request) {
  try {
    // Security: Verify authentication
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized", message: "Authentication required" },
        { status: 401 },
      )
    }

    const body = await req.json()
    const { email, inviteId, agent } = body

    // Security: Validate required fields
    if (!email || !inviteId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields", message: "Email and inviteId are required" },
        { status: 400 },
      )
    }

    // Security: Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email", message: "Please provide a valid email address" },
        { status: 400 },
      )
    }

    // Security: Validate inviteId format (UUID)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(inviteId)) {
      return NextResponse.json(
        { success: false, error: "Invalid invite ID", message: "Invite ID format is invalid" },
        { status: 400 },
      )
    }

    // Security: Sanitize inputs
    const sanitizedEmail = sanitizeString(email)
    const sanitizedAgent = agent ? sanitizeString(agent) : null

    // Use the production base URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://partner.golumino.com"
    const inviteLink = `${baseUrl}?id=${inviteId}`

    // Send the email
    const { data, error } = await resend.emails.send({
      from: "Lumino Partner Portal <no-reply@golumino.com>",
      to: [sanitizedEmail],
      subject: "You're Invited to Join the Lumino Partner Program",
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1a1a1a; font-size: 28px;">LUMINO</h1>
            <p style="color: #666; font-size: 14px;">Payments with Purpose</p>
          </div>
          
          <h2 style="color: #1a1a1a;">You're Invited to Join Our Partner Program!</h2>
          
          <p>Hello,</p>
          
          <p>You've been personally invited${sanitizedAgent ? ` by <strong>${sanitizedAgent}</strong>` : ""} to join the Lumino Partner Program. We're excited to potentially welcome you to our growing network of partners who are transforming the payments industry.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${inviteLink}" style="background-color: #007bff; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              Complete Your Application
            </a>
          </div>
          
          <p>This personalized link will connect your application directly with our team, ensuring you receive dedicated support throughout the process.</p>
          
          <p><strong>What makes Lumino different:</strong></p>
          <ul>
            <li>Residual revenue sharing</li>
            <li>Next-generation dual-pricing gateway</li>
            <li>Built-in rewards engine for customer loyalty</li>
            <li>Transparent, partner-first economics</li>
            <li>AI-driven automation and streamlined operations</li>
          </ul>
          
          <p>If you have any questions, feel free to reach out to our <a href="mailto:support@golumino.com">partner team</a>.</p>
          
          <p>We look forward to partnering with you!</p>
          
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 12px;">
            <p>Lumino Technologies<br>
            4201 Main St Suite 201, Houston, TX 77002<br>
            1-866-488-4168 | www.golumino.com</p>
          </div>
        </div>
      `,
    })

    if (error) {
      console.error("Resend error:", error)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to send email",
          message: error.message || "Unknown error from email service",
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Invite sent successfully!",
      data,
    })
  } catch (error) {
    console.error("Error in send-invite endpoint:", error)
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
