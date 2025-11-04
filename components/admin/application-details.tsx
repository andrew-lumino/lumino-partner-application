"use client"

import React from "react"
import { autoTitleCase } from "../utils"

interface ApplicationDetailsProps {
  selectedApplication: Record<string, any>
}

export default function ApplicationDetails({ selectedApplication }: ApplicationDetailsProps) {
  if (!selectedApplication) return null

  const renderField = (label: string, value: any) => (
    <div className="flex flex-col">
      <span className="text-xs text-gray-500 font-medium uppercase">{label}</span>
      <span className="text-base text-gray-900 break-words">{value || "-"}</span>
    </div>
  )

  const getFileExtension = (url: string) => {
    const match = url.match(/\.\w+$/)
    return match ? match[0] : ""
  }

  const sanitize = (str: string) => str.replace(/[/\\?%*:|"<>]/g, "-")

  const downloadFile = (url: string, filename: string) => {
    const a = document.createElement("a")
    a.href = `/api/download?url=${encodeURIComponent(url)}&filename=${filename}`
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <div className="space-y-8">
      {/* Partner Info */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Partner Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {renderField("Full Name", selectedApplication.partner_full_name)}
          {renderField("Email", selectedApplication.partner_email)}
          {renderField("Phone", selectedApplication.partner_phone)}
          {renderField("Address", selectedApplication.partner_address)}
          {renderField("City", selectedApplication.partner_city)}
          {renderField("State", selectedApplication.partner_state)}
          {renderField("Zip", selectedApplication.partner_zip)}
        </div>
      </section>

      {/* Business Info */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Business Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {renderField("Business Name", selectedApplication.business_name)}
          {renderField("Principal Name", selectedApplication.principal_name)}
          {renderField("Federal Tax ID", selectedApplication.federal_tax_id)}
          {renderField("Business Type", selectedApplication.business_type)}
          {renderField("Website URL", selectedApplication.website_url)}
          {renderField("Business Address", selectedApplication.business_address)}
          {renderField("City", selectedApplication.business_city)}
          {renderField("State", selectedApplication.business_state)}
          {renderField("Zip", selectedApplication.business_zip)}
        </div>
      </section>

      {/* W-9 Info */}
      <section>
        <h3 className="text-lg font-semibold mb-4">W-9 Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {renderField("Name", selectedApplication.w9_name)}
          {renderField("Business Name", selectedApplication.w9_business_name)}
          {renderField("Tax Classification", autoTitleCase(selectedApplication.w9_tax_classification))}
          {renderField("Address", selectedApplication.w9_address)}
          {renderField("City, State, ZIP", selectedApplication.w9_city_state_zip)}
          {renderField("TIN Type", selectedApplication.w9_tin_type?.toUpperCase())}
          {renderField("TIN", selectedApplication.w9_tin)}
        </div>
      </section>

      {/* Signature */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Signature</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {renderField("Signature", selectedApplication.signature_full_name)}
          {renderField("Date", selectedApplication.signature_date)}
        </div>
      </section>
    </div>
  )
}
