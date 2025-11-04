"use client"

import { UserButton } from "@clerk/nextjs"
import Link from "next/link"
import { usePathname } from "next/navigation"
import clsx from "clsx"

export default function AdminHeader() {
  const pathname = usePathname()

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/admin" className="text-xl font-bold text-gray-800">
          Lumino Admin
        </Link>
        <nav className="flex gap-6 text-sm font-medium text-gray-600">
          <Link
            href="/admin"
            className={clsx(
              "hover:text-black transition-colors",
              pathname === "/admin" && "text-black font-semibold"
            )}
          >
            Applications
          </Link>
          <Link
            href="/invite"
            className={clsx(
              "hover:text-black transition-colors",
              pathname === "/invite" && "text-black font-semibold"
            )}
          >
            Invitation Manager
          </Link>
        </nav>
        <UserButton afterSignOutUrl="/" />
      </div>
    </header>
  )
}
