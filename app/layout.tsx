import type React from "react"
import { Inter } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import { currentUser } from "@clerk/nextjs/server"
import "./globals.css"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/toaster"
import AdminHeader from "@/components/admin/admin-header"
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Lumino Partner Application",
  description: "Apply to become a Lumino Partner and join our ecosystem.",
  openGraph: {
    title: "Lumino Partner Application",
    description: "Apply to become a Lumino Partner and join our ecosystem.",
    url: "https://partner.lumino.io",
    siteName: "Lumino",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lumino Partner Application",
    description: "Apply to become a Lumino Partner and join our ecosystem.",
  },
  icons: {
    icon: "/favicon.ico",
  },
    generator: 'v0.app'
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const user = await currentUser()
  const email =
    user?.email ?? user?.emailAddresses?.[0]?.emailAddress ?? user?.primaryEmailAddressId ?? user?.email ?? ""

  const isAuthorized = email.endsWith("@golumino.com")

  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="icon" href="/favicon.ico" sizes="any" />
        </head>
        <body className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}>
          {isAuthorized && <AdminHeader />}
          <main>{children}</main>
          <Toaster />
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  )
}
