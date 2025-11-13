import type { ReactNode } from "react"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default async function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  const user = await currentUser()

  const email =
    user?.email ?? user?.emailAddresses?.[0]?.emailAddress ?? user?.primaryEmailAddressId ?? user?.email ?? ""

  const authorizedEmails = [
    "andrew@golumino.com",
    "zachry@golumino.com",
    "wesley@golumino.com",
    "giorgio@golumino.com",
    "clay@golumino.com",
    "priscilla@golumino.com",
    "dev@golumino.com",
    "garrett@golumino.com",
    "stephanie@golumino.com", // Added stephanie to authorized users
  ]

  const isAuthorized = authorizedEmails.includes(email)

  if (!isAuthorized) {
    redirect("/")
    return null // Just in case
  }

  return <>{children}</>
}
