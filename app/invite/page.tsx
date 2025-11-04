import { currentUser } from "@clerk/nextjs/server"
import InviteManager from "@/components/invite/invite-manager"

export default async function InvitePage() {
  const user = await currentUser()

  const email =
    user?.email ?? user?.emailAddresses?.[0]?.emailAddress ?? user?.primaryEmailAddressId ?? ""

  const agentName = email.split("@")[0]

  return (
    <div className="py-8 md:py-12">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Partner Invite Manager</h1>
          {/*<p className="text-sm text-gray-600">Agent: {agentName?.toUpperCase()}</p>*/}
        </div>
        <InviteManager agentName={agentName} />
      </div>
    </div>
  )
}
