import { NextResponse } from "next/server"
import { Resend } from "resend"
import { createClient } from "@/lib/supabase/server"

const resend = new Resend(process.env.RESEND_API_KEY)

const defaultScheduleA = {
  equipment: {
    category: "Equipment & Software",
    option1: "SkyTab, SumUp, Clover POS",
    option2: "Lumino Terminals, Pax, Dejavoo, Valor, Verifone",
    option3: "Lumino Invoicing, E-Commerce Integrations",
    option4: "Financial Services",
  },
  associationFees: {
    category: "Association Fees (Interchange, dues, assessments from Card Associations)",
    option1: "Pass-through 60%",
    option2: "Pass-through 75%",
    option3: "Pass-through 50%",
    option4: "Pass-through 60%",
  },
  visaMcFee: {
    category: "Visa/MC Transaction Fee",
    option1: "$0.05",
    option2: "$0.03",
    option3: "$0.05",
    option4: "-",
  },
  otherTransactionFee: {
    category: "Other Transaction Fee (AMEX, Discover, EBT, etc.)",
    option1: "$0.05",
    option2: "$0.03",
    option3: "$0.05",
    option4: "-",
  },
  binSponsorship: {
    category: "BIN Sponsorship",
    option1: "5 bps",
    option2: "3 bps",
    option3: "15 bps",
    option4: "-",
  },
  amexOptBlue: {
    category: "AMEX OptBlue / Processor Access",
    option1: "25 bps",
    option2: "25 bps",
    option3: "25 bps",
    option4: "-",
  },
  monthlySupportFee: {
    category: "Monthly Program Support Fee",
    option1: "$4.75",
    option2: "$4.75",
    option3: "$4.75",
    option4: "-",
  },
  monthlyMinimum: {
    category: "Monthly Minimum",
    option1: "$0.00",
    option2: "$0.00",
    option3: "$0.00",
    option4: "-",
  },
  chargebackFee: {
    category: "Chargeback Fee",
    option1: "$15.00",
    option2: "$15.00",
    option3: "$15.00",
    option4: "-",
  },
  retrievalRequest: {
    category: "Retrieval Request",
    option1: "$5.00",
    option2: "$5.00",
    option3: "$5.00",
    option4: "-",
  },
  bonusProgram: {
    category: "Bonus Program Upfront",
    option1: "1x Monthly Residual",
    option2: "1x Monthly Residual",
    option3: "-",
    option4: "-",
  },
  saasFees: {
    category: "SaaS Fees",
    option1: "See RDR/Fraud Schedule",
    option2: "See RDR/Fraud Schedule",
    option3: "See RDR/Fraud Schedule",
    option4: "-",
  },
  equipmentCost: {
    category: "Monthly Equipment Cost",
    option1: "See Equipment Schedule",
    option2: "See Equipment Schedule",
    option3: "See Equipment Schedule",
    option4: "-",
  },
  sbaLoans: {
    category: "SBA Loans (SBA Acquisition Loan Funding)",
    option1: "-",
    option2: "-",
    option3: "-",
    option4: "5% Fee",
  },
  creditCards: {
    category: "0% Interest Credit Cards",
    option1: "-",
    option2: "-",
    option3: "-",
    option4: "5% Fee",
  },
  bridgeLoans: {
    category: "Bank Statement Bridge Loans",
    option1: "-",
    option2: "-",
    option3: "-",
    option4: "3% Fee",
  },
  equipmentFinancing: {
    category: "Equipment Financing",
    option1: "-",
    option2: "-",
    option3: "-",
    option4: "3% Fee",
  },
  creditOptimization: {
    category: "Credit Optimization",
    option1: "-",
    option2: "-",
    option3: "-",
    option4: "25% Fee",
  },
}

function generateHtmlBody(formData: any): string {
  return `
    <div style="font-family: sans-serif; line-height: 1.6; color: #333; padding: 20px;">
      <h1 style="font-size: 24px; color: #1a1a1a; margin-bottom: 10px;">
        Thank you for your application, ${formData.partnerFullName}!
      </h1>
      <p>
        We've successfully received your partner application. Our team will review your submission and get in touch with you shortly.
      </p>
      <p>
        If you have any questions, feel free to reach out to <a href="mailto:support@golumino.com">support@golumino.com</a>.
      </p>
    </div>
  `
}

function camelToSnake(obj: Record<string, any>): Record<string, any> {
  const newObj: Record<string, any> = {}

  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue

    let snakeKey = key.replace(/([A-Z])/g, "_$1").toLowerCase()
    snakeKey = snakeKey
      .replace(/w_9/g, "w9")
      .replace(/t_i_n/g, "tin")
      .replace(/l_l_c/g, "llc")
      .replace(/u_r_l/g, "url")
      .replace(/z_i_p/g, "zip")
      .replace(/e_i_n/g, "ein")
      .replace(/^_/, "")

    newObj[snakeKey] = obj[key]
  }

  return newObj
}

function validateScheduleA(data: any): any {
  if (!data) {
    return defaultScheduleA
  }

  if (typeof data === "string") {
    try {
      data = JSON.parse(data)
    } catch (e) {
      console.error("Failed to parse customScheduleA:", e)
      return defaultScheduleA
    }
  }

  if (typeof data !== "object" || Array.isArray(data)) {
    console.error("customScheduleA is not an object:", typeof data)
    return defaultScheduleA
  }

  const validated = { ...defaultScheduleA }
  for (const key in defaultScheduleA) {
    if (data[key] && typeof data[key] === "object") {
      validated[key] = { ...defaultScheduleA[key], ...data[key] }
    }
  }

  return validated
}

export async function POST(req: Request) {
  try {
    console.log("[v0] API route called - send-email")
    const body = await req.json()
    const { formData, fileUrls, agreementText, inviteId, customScheduleA } = body

    console.log("[v0] Received submission:", {
      formData: formData ? "present" : "missing",
      fileUrls: fileUrls ? "present" : "missing",
      inviteId: inviteId || "NO INVITE ID",
      customScheduleA: customScheduleA ? "present" : "missing",
      partnerEmail: formData?.partnerEmail,
      partnerName: formData?.partnerFullName,
    })

    if (!formData) {
      return NextResponse.json({ success: false, error: "Form data is missing" }, { status: 400 })
    }

    // Validate and normalize Schedule A data
    const validatedScheduleA = validateScheduleA(customScheduleA)
    console.log("Validated Schedule A keys:", Object.keys(validatedScheduleA))

    const supabase = await createClient()

    const snakeFormData = camelToSnake(formData)

    const dbData = {
      ...snakeFormData,
      drivers_license_url: fileUrls?.driversLicenseUrl || null,
      voided_check_url: fileUrls?.voidedCheckUrl || null,
      status: "submitted",
      agreement_text: agreementText || null,
      custom_schedule_a: JSON.stringify(validatedScheduleA),
      created_at: new Date().toISOString(),
    }

    console.log("Prepared DB data keys:", Object.keys(dbData))

    let dbResult
    if (inviteId) {
      console.log("[v0] Attempting to UPDATE existing application with ID:", inviteId)
      const { data: existingRecord, error: checkError } = await supabase
        .from("partner_applications")
        .select("id, status, partner_email")
        .eq("id", inviteId)
        .single()

      if (checkError) {
        console.error("[v0] Record not found for inviteId:", inviteId, checkError)
        console.log("[v0] Will insert new record instead")
        dbResult = await supabase.from("partner_applications").insert(dbData).select()
      } else {
        console.log("[v0] Found existing record:", existingRecord)
        dbResult = await supabase.from("partner_applications").update(dbData).eq("id", inviteId).select()
        console.log("[v0] Update result:", dbResult)
      }
    } else {
      console.log("[v0] No inviteId provided, inserting new application")
      dbResult = await supabase.from("partner_applications").insert(dbData).select()
    }

    if (dbResult.error) {
      console.error("[v0] Supabase DB error:", dbResult.error)
      return NextResponse.json(
        {
          success: false,
          error: `Database error: ${dbResult.error.message}`,
        },
        { status: 500 },
      )
    }

    console.log("[v0] Database operation successful, returned data:", dbResult.data)

    // Notify via Zapier
    try {
      await fetch("https://hooks.zapier.com/hooks/catch/5609223/u2weyus/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          driversLicenseUrl: fileUrls?.driversLicenseUrl,
          voidedCheckUrl: fileUrls?.voidedCheckUrl,
          submittedAt: new Date().toISOString(),
          inviteId,
          scheduleA: validatedScheduleA,
          scheduleAType: customScheduleA ? "custom" : "default",
        }),
      })
      console.log("Zapier notification sent")
    } catch (zapierError) {
      console.error("Zapier webhook failed:", zapierError)
    }

    // Send confirmation email
    try {
      const htmlBody = generateHtmlBody(formData)
      const emailResult = await resend.emails.send({
        from: "Lumino <no-reply@golumino.com>",
        to: ["apps@golumino.com", "zachry@golumino.com", formData.partnerEmail],
        subject: `Lumino Partner Application - ${formData.partnerFullName}`,
        html: htmlBody,
      })
      console.log("Email sent successfully:", emailResult.data?.id)
    } catch (emailError) {
      console.error("Email sending failed:", emailError)
    }

    return NextResponse.json({
      success: true,
      applicationId: dbResult.data?.[0]?.id,
      message: "Application submitted successfully",
    })
  } catch (error) {
    console.error("Error in send-email API:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    )
  }
}
