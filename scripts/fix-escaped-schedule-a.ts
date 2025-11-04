import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function fixEscapedScheduleA() {
  console.log("Starting to fix escaped custom_schedule_a data...\n")

  try {
    // Fetch all applications with custom_schedule_a
    const { data: applications, error } = await supabase
      .from("applications")
      .select("id, custom_schedule_a")
      .not("custom_schedule_a", "is", null)

    if (error) {
      console.error("Error fetching applications:", error)
      return
    }

    if (!applications || applications.length === 0) {
      console.log("No applications with custom_schedule_a found.")
      return
    }

    console.log(`Found ${applications.length} applications with custom_schedule_a data.`)
    console.log("Analyzing and fixing...\n")

    let fixedCount = 0
    let alreadyCorrectCount = 0
    let errorCount = 0

    for (const app of applications) {
      const { id, custom_schedule_a } = app

      // Check if it's already a proper object
      if (typeof custom_schedule_a === "object" && custom_schedule_a !== null) {
        console.log(`✓ Application ${id}: Already in correct format (object)`)
        alreadyCorrectCount++
        continue
      }

      // If it's a string, we need to parse it
      if (typeof custom_schedule_a === "string") {
        try {
          let parsed = custom_schedule_a

          // Keep parsing until we get an object
          let parseCount = 0
          while (typeof parsed === "string" && parseCount < 5) {
            parsed = JSON.parse(parsed)
            parseCount++
          }

          // If we ended up with an object, update the database
          if (typeof parsed === "object" && parsed !== null) {
            const { error: updateError } = await supabase
              .from("applications")
              .update({ custom_schedule_a: parsed })
              .eq("id", id)

            if (updateError) {
              console.error(`✗ Application ${id}: Error updating -`, updateError.message)
              errorCount++
            } else {
              console.log(`✓ Application ${id}: Fixed (parsed ${parseCount} time(s))`)
              fixedCount++
            }
          } else {
            console.log(`⚠ Application ${id}: Could not parse to object after ${parseCount} attempts`)
            errorCount++
          }
        } catch (parseError) {
          console.error(`✗ Application ${id}: Error parsing JSON -`, parseError)
          errorCount++
        }
      }
    }

    console.log("\n" + "=".repeat(50))
    console.log("Summary:")
    console.log("=".repeat(50))
    console.log(`Total applications checked: ${applications.length}`)
    console.log(`Already correct: ${alreadyCorrectCount}`)
    console.log(`Fixed: ${fixedCount}`)
    console.log(`Errors: ${errorCount}`)
    console.log("=".repeat(50))
  } catch (error) {
    console.error("Fatal error:", error)
  }
}

// Run the script
fixEscapedScheduleA()
