import LuminoPartnerApplication from "@/components/lumino-partner-application"
import Link from "next/link"

export default function Home({ searchParams }: { searchParams: { [key: string]: string } }) {
  const inviteId = searchParams.id

  if (inviteId) {
    return (
      <div className="bg-gray-50 min-h-screen py-8 md:py-12">
        <div className="container mx-auto">
          <LuminoPartnerApplication />
        </div>
      </div>
    )
  }

  // Fallback when no `id` in URL
  const mailToLink = `mailto:apps@golumino.com?subject=Partner%20Application%20-%20Invitation%20Link%20Request`

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center px-6 text-center">
      <div className="max-w-lg bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Welcome, Lumino Partners!</h1>
        <p className="text-gray-700 mb-6">
          To access the Lumino Partner Application, you must obtain a validated link with an application ID. Please use the invitation link you received or request one from our team here if you do not have one yet.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href={mailToLink}
            className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-md hover:bg-blue-700 transition"
          >
            Request Invite
          </Link>
          <Link
            href="/sign-in"
            className="inline-block bg-slate-100 text-slate-500 font-medium px-6 py-3 rounded-md hover:bg-slate-50 hover:text-slate-700 transition"
          >
            Partner Sign-In
          </Link>
        </div>
      </div>
    </div>
  )
}
