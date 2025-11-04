import type { ReactNode } from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import AdminHeader from "@/components/admin/admin-header"
import { cn } from "@/lib/utils"
import { ClerkProvider } from "@clerk/nextjs"

export default async function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  const user = await currentUser()

  const email = user?.email ??
    user?.emailAddresses?.[0]?.emailAddress ??
    user?.primaryEmailAddressId ??
    user?.email ??
    ""

  const authorizedEmails = [
    "andrew@golumino.com",
    "zachry@golumino.com",
    "wesley@golumino.com",
    "giorgio@golumino.com",
    "stephanie@golumino.com",
    "priscilla@golumino.com",
  ]

  const isAuthorized = authorizedEmails.includes(email)

  if (!isAuthorized) {
    redirect("/")
    return null // Just in case
  }

  return (<>{children}</>)
}
