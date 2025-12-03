import { createClient } from "@/lib/supabase/server"
import ApplicationsTable from "@/components/admin/applications-table"

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: applications, error } = await supabase
    .from("partner_applications")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching applications:", error)
    return (
      <div className="container mx-auto py-8 text-center text-red-600">
        <p>Error loading applications.</p>
        <p className="text-sm text-gray-500 mt-2">{error.message}</p>
      </div>
    )
  }

  return (
    <div className="py-8 md:py-12">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Partner Applications</h1>
        </div>
        <ApplicationsTable applications={applications || []} />
      </div>
    </div>
  )
}
