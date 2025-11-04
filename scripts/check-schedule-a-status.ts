import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkScheduleAStatus() {
  console.log("Checking custom_schedule_a data status...\n")

  try {
    const { data: applications, error } = await supabase
      .from("applications")
      .select("id, custom_schedule_a, partner_email")
      .not("custom_schedule_a", "is", null)

    if (error) {
      console.error("Error fetching applications:", error)
      return
    }

    if (!applications || applications.length === 0) {
      console.log("No applications with custom_schedule_a found.")
      return
    }

    console.log(`Found ${applications.length} applications with custom_schedule_a data.\n`)

    const correctFormat: any[] = []
    const needsFix: any[] = []
    const errors: any[] = []

    for (const app of applications) {
      const { id, custom_schedule_a, partner_email } = app

      // Check if it's already a proper object
      if (typeof custom_schedule_a === "object" && custom_schedule_a !== null) {
        correctFormat.push({ id, partner_email, status: "object" })
        continue
      }

      // If it's a string, determine how many times it needs parsing
      if (typeof custom_schedule_a === "string") {
        try {
          let parsed = custom_schedule_a
          let parseCount = 0

          while (typeof parsed === "string" && parseCount < 5) {
            parsed = JSON.parse(parsed)
            parseCount++
          }

          if (typeof parsed === "object" && parsed !== null) {
            needsFix.push({
              id,
              partner_email,
              status: `needs ${parseCount} parse(s)`,
              preview: custom_schedule_a.substring(0, 100) + "...",
            })
          } else {
            errors.push({ id, partner_email, status: "unparseable" })
          }
        } catch (parseError) {
          errors.push({ id, partner_email, status: "parse error" })
        }
      }
    }

    // Display results
    console.log("=".repeat(70))
    console.log("CORRECT FORMAT (Already Objects):")
    console.log("=".repeat(70))
    if (correctFormat.length === 0) {
      console.log("None")
    } else {
      correctFormat.forEach((app) => {
        console.log(`ID: ${app.id} | Email: ${app.partner_email}`)
      })
    }

    console.log("\n" + "=".repeat(70))
    console.log("NEEDS FIXING (Escaped Strings):")
    console.log("=".repeat(70))
    if (needsFix.length === 0) {
      console.log("None")
    } else {
      needsFix.forEach((app) => {
        console.log(`ID: ${app.id} | Email: ${app.partner_email}`)
        console.log(`   Status: ${app.status}`)
        console.log(`   Preview: ${app.preview}`)
        console.log()
      })
    }

    console.log("=".repeat(70))
    console.log("ERRORS (Cannot Parse):")
    console.log("=".repeat(70))
    if (errors.length === 0) {
      console.log("None")
    } else {
      errors.forEach((app) => {
        console.log(`ID: ${app.id} | Email: ${app.partner_email} | Status: ${app.status}`)
      })
    }

    console.log("\n" + "=".repeat(70))
    console.log("SUMMARY:")
    console.log("=".repeat(70))
    console.log(`Total: ${applications.length}`)
    console.log(`Correct Format: ${correctFormat.length}`)
    console.log(`Needs Fixing: ${needsFix.length}`)
    console.log(`Errors: ${errors.length}`)
    console.log("=".repeat(70))
  } catch (error) {
    console.error("Fatal error:", error)
  }
}

// Run the script
checkScheduleAStatus()
